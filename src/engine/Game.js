const Deck = require('./Deck')
const Player = require('./Player')

class Game {
  constructor (cardLibraryPath) {
    this._handSize = 10
    this._players = new Map()
    this._deck = new Deck(cardLibraryPath)
    this._gameStates = {
      wait: 0,
      play: 1,
      over: 2
    }
    this._currentGameState = this._gameStates.wait
    this._playerStates = {
      idle: 0,
      active: 1
    }
    this._judge = 0
    this._pot = {
      blackCard: null,
      whiteCards: new Map()
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
    this._pot.whiteCards.set(playerId, [])
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

  // remove list of cards from hand and add them to the pot, assigned to the
  // playerId as key, returns updated player details
  playCards (playerId, cardIdList) {
    const playerObject = this._players.get(playerId)
    // only accept played cards if pot for player is empty and played card
    // amount is the same the black card requires
    if (this._pot.whiteCards.get(playerId).length === 0 &&
      cardIdList.length === this._pot.blackCard.getPicks()) {
      for (const cardId of cardIdList) {
        const card = playerObject.removeCard(cardId)
        if (card) {
          const playerCards = this._pot.whiteCards.get(playerId)
          playerCards.push(card)
        }
      }
      this._drawWhiteCards(playerId)
    }
    return playerObject.getDetails()
  }

  getCardPot () {
    return this._pot
  }

  getCardPiles () {
    return this._deck.getCardPiles()
  }

  // the servers privates

  _startRound () {
    this._checkWinConditions()
    this._selectJudge()
    this._drawBlackCard()
  }

  _updateRound () {
    if (this._checkPlayersReady()) {
      this._endRound()
    } else {
      console.log('not ready yet')
    }
  }

  _endRound () {
    this._pot.blackCard = null
    for (const playerPot of this._pot.whiteCards) {
      const playerId = playerPot[0]
      const playerCards = playerPot[1]
      const playerObject = this._players.get(playerId)
      playerObject.setDetails({ judge: false })
      for (const card of playerCards) {
        this._deck.discard(card)
      }
    }
    this._pot.whiteCards.clear()
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

  _checkPlayersReady () {
    for (const whiteCards of this._pot.whiteCards.values()) {
      if (whiteCards.length === 0) return false
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
      this._currentGameState = this._gameStates.over
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
    playerObject.setDetails({ judge: true })
    const { name } = playerObject.getDetails()
    console.log(`New judge: ${name}`)
  }

  _drawBlackCard () {
    this._pot.blackCard = this._deck.drawBlack()
  }
}

module.exports = Game
