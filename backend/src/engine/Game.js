const Deck = require('./Deck')
const Player = require('./Player')

class Game {
  constructor (cardLibraryPath) {
    this._handSize = 10
    this._players = new Map()
    this._score = []
    this._deck = new Deck(cardLibraryPath)
    this._gameStarted = false
    this._gameStates = {
      idle: 0,
      play: 1,
      judge: 2,
      gameover: 3
    }
    this._currentGameState = this._gameStates.idle
    this._playerStates = {
      idle: 0,
      play: 1,
      judge: 2
    }
    this._judge = 0
    this._pot = {
      blackCard: null,
      whiteCards: new Map(),
      winner: null
    }
  }

  // functions that can be called by the socket.io client requests

  // Create a new player object, draw 10 white cards and return the player
  // details to the client
  joinGame (name) {
    const playerId = Math.random().toString(36).substr(2, 16)
    const playerObject = new Player(playerId, name)
    for (let i = 0; i < this._handSize; i++) {
      const card = this._deck.drawWhite()
      playerObject.receiveCard(card)
    }
    this._players.set(playerId, playerObject)
    this._pot.whiteCards.set(name, [])
    return playerObject.getDetails()
  }

  // discard all hand cards and delete player from map
  leaveGame (playerId) {
    const { hand } = this._players.get(playerId).getDetails()
    for (const card of hand) {
      this._deck.discard(card)
    }
    this._players.delete(playerId)
  }

  startGame () {
    this._gameStarted = true
  }

  // discard card with cardId from player hand. return updated player details
  discardCards (playerId, cardIdList) {
    const playerObject = this._players.get(playerId)
    for (const cardId of cardIdList) {
      const card = playerObject.removeCard(cardId)
      if (card) this._deck.discard(card)
    }
    this._drawWhiteCards(playerId)
    return playerObject.getDetails()
  }

  _getPlayers () {
    const playersStatus = {}
    for (const player of this._players.values()) {
      playersStatus[player._name] = player
    }
    return playersStatus
  }

  // remove list of cards from hand and add them to the pot, assigned to the
  // playerId as key, returns updated player details
  playCards (playerId, cardIdList) {
    const playerObject = this._players.get(playerId)
    const { state, name } = playerObject.getDetails()
    // only accept played cards if pot for player is empty and played card
    // amount is the same the black card requires
    if (state === this._playerStates.play &&
      cardIdList.length === this._pot.blackCard.getPicks()) {
      for (const cardId of cardIdList) {
        const card = playerObject.removeCard(cardId)
        if (card) {
          const playerCards = this._pot.whiteCards.get(name)
          playerCards.push(card)
        }
      }
      playerObject.setState(this._playerStates.idle)
      this._drawWhiteCards(playerId)
    }
    return playerObject.getDetails()
  }

  chooseWinner (playerId, cardId) {
    const { judge } = this._players.get(playerId).getDetails()
    if (judge && this._currentGameState === this._gameStates.judge) {
      for (const name in this._pot.whiteCards) {
        const cards = this._pot.whiteCards.get(name)
        const winningCard = cards.filter(card => {
          return card._cardId === cardId
        })
        if (winningCard) {
          // const { score } = this._players.get(id).getDetails()
          // this._players.get(id).setScore(score + 1)
          this._players.get(playerId).setState(this._playerStates.idle)
          break
        }
      }
    }
  }

  getCardPot () {
    return this._pot
  }

  getCardPiles () {
    return this._deck.getCardPiles()
  }

  getGameState () {
    return this._currentGameState
  }

  // the servers privates

  update () {
    if (this._gameStarted) {
      switch (this._currentGameState) {
        case this._gameStates.idle:
          this._startRound()
          break
        case this._gameStates.play:
          this._playingPhase()
          break
        case this._gameStates.judge:
          this._judgingPhase()
          break
        case this._gameStates.gameover:
          break
      }
    }
    return this._getPlayers()
  }

  _startRound () {
    this._selectJudge()
    this._drawBlackCard()
    this._currentGameState = this._gameStates.play
    for (const id of this._players.keys()) {
      const { judge } = this._players.get(id).getDetails()
      if (judge) {
        this._players.get(id).setState(this._playerStates.judge)
      } else {
        this._players.get(id).setState(this._playerStates.play)
      }
    }
  }

  _playingPhase () {
    if (this._checkAllCardsPlayed()) {
      console.log('all cards played')
      this._currentGameState = this._gameStates.judge
    } else {
      console.log('not all palyers ready yet')
    }
  }

  _judgingPhase () {
    if (this._checkJudgingDone()) {
      console.log('judging done')
      this._checkWinConditions()
      this._endRound()
      this._currentGameState = this._gameStates.idle
    } else {
      console.log('not done judging yet')
    }
  }

  _endRound () {
    this._pot.blackCard = null
    for (const playerPot of this._pot.whiteCards) {
      const playerCards = playerPot[1]
      for (const player of this._players) {
        this._players.get(player).setJudge(false)
      }
      for (const card of playerCards) {
        this._deck.discard(card)
      }
    }
    this._pot.whiteCards.clear()
  }

  _drawBlackCard () {
    let drawingBlackCards = true
    while (drawingBlackCards) {
      const blackCard = this._deck.drawBlack()
      if (blackCard.getPicks() === 1) {
        this._pot.blackCard = blackCard
        drawingBlackCards = false
      }
    }
  }

  // draw X cards for player with playerId and return updated player details
  _drawWhiteCards (playerId) {
    const playerObject = this._players.get(playerId)
    const { hand } = playerObject.getDetails()
    const count = this._handSize - hand.size
    for (let i = 0; i < count; i++) {
      const card = this._deck.drawWhite()
      playerObject.receiveCard(card)
    }
  }

  _checkAllCardsPlayed () {
    for (const player of this._players.values()) {
      const { state } = player.getDetails()
      console.log(state)
      if (state === this._playerStates.play) return false
    }
    return true
  }

  _checkJudgingDone () {
    for (const player of this._players.values()) {
      const { state } = player.getDetails()
      if (state === this._playerStates.judge) return false
    }
    return true
  }

  _checkWinConditions () {
    const { blackStack } = this._deck.getCardPiles()
    if (blackStack === 0) {
      const sortedMap = new Map([...this._players.entries()].sort((a, b) => {
        return b[1].score - a[1].score
      }))
      const { name, score } = sortedMap.values().next().value
      this._currentGameState = this._gameStates.gameover
      console.log(`Winner: ${name} with ${score} rounds won.`)
    } else {
      console.log('No one won yet.')
    }
  }

  _selectJudge () {
    this._judge < this._players.size - 1
      ? this._judge += 1
      : this._judge = 0
    const judgeId = Array.from(this._players.keys())[this._judge]
    const playerObject = this._players.get(judgeId)
    playerObject.setJudge(true)
    const { name } = playerObject.getDetails()
    console.log(`New judge: ${name}`)
  }
}

module.exports = Game
