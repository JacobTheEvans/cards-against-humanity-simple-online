const Deck = require('Deck')
const Player = require('Player')



class Game {
  constructor(cardLibraryPath) {
    this._players = new Map()
    this._deck = new Deck(cardLibraryPath)
    this._state = {

    }
  }

  init() {
    this._waitForPlayers()
    this._update()
  }

  joinGame(name) {
    const playerId = this._players.length
    this._players.set(playerId, new Player(playerId, name))
  }

  _waitForPlayers() {
    while (!this._players.length >= 3) {
      console.log('Waiting for players..')
      await this._delay(1000)
    }
  }

  _update() {
    this._checkWinConditions()
    this._selectJudge()
    this._drawBlackCard()
    this._waitForPlayers()
    this._judgementPhase()
    this._update()
  }

  async _delay (t) {
    return new Promise(function (resolve) {
      setTimeout(resolve, t)
    })
  }
}
