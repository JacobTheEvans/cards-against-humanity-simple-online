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
    return playerObject.getPlayerDetails()
  }

  // discard all hand cards and delete player from map
  leaveGame (playerId) {
    const { hand } = this._players.get(playerId).getPlayerDetails()
    for (const card of hand) {
      this._deck.discard(card)
    }
    this._players.delete(playerId)
  }

  // draw X cards for player with playerId and return updated player details
  drawWhiteCards (playerId) {
    const playerObject = this._players.get(playerId)
    const { hand } = playerObject.getPlayerDetails()
    const count = this._handSize - hand.size
    for (let i = 0; i < count; i++) {
      const card = this._deck.drawWhite()
      playerObject.receiveCard(card)
    }
    return playerObject.getPlayerDetails()
  }

  // discard card with cardId from player hand. return updated player details
  discardCards (playerId, cardIdList) {
    const playerObject = this._players.get(playerId)
    for (const cardId of cardIdList) {
      const card = playerObject.removeCard(cardId)
      if (card) this._deck.discard(card)
    }
    return playerObject.getPlayerDetails()
  }

  // remove list of cards from hand and add them to the pot, assigned to the
  // playerId as key, returns updated player details
  playCards (playerId, cardIdList) {
    const playerObject = this._players.get(playerId)
    for (const cardId of cardIdList) {
      const card = playerObject.removeCard(cardId)
      if (card) {
        const playerCards = this._pot.whiteCards.get(playerId)
        playerCards.push(card)
      }
    }
    return playerObject.getPlayerDetails()
  }

  getCardPot () {
    return this._pot
  }

  // the servers privates

  async _waitForPlayers () {
    while (!this._players.length >= 3) {
      console.log('Waiting for players..')
      await this._delay(1000)
    }
  }

  _update () {
    this._checkWinConditions()

    if (this._currentGameState === this._gameStates.play) {
      this._selectJudge()
      this._drawBlackCard()
      this._waitForPlayers()
      this._judgementPhase()
      this._update()
    }
  }

  _checkWinConditions () {
    const { blackStack } = this._deck.getCardCount()
    if (blackStack === 0) {
      const winner = Object.keys(this._players)
        .sort((a, b) => {
          return this._players[a].getScore() - this._players[b].getScore()
        })
      const { name, score } = winner.getPlayerDetails()
      this._currentGameState = this._gameStates.over
      console.log(`Winner: ${name} with ${score} rounds won.`)
    }
  }

  _selectJudge () {
    this._judge < this._players.length - 1
      ? this._judge += 1
      : this._judge = 0
  }

  _drawBlackCard () {
    this._pot.blackCard = this._deck.drawBlack()
  }

  _clearPot () {
    this._pot.blackCard = null
    for (const playerCards of this._pot.whiteCards) {

    }
  }

  async _delay (t) {
    return new Promise(function (resolve) {
      setTimeout(resolve, t)
    })
  }
}

module.exports = Game
