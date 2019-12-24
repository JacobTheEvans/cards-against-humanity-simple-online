const pino = require('pino')
const Game = require('./engine/Game')

class SocketHandler {
  constructor (socketServer) {
    this._log = pino()
    this._currentClients = new Map()
    this._currentGame = null
    this._currentGameInterval = null
    this._socketServer = socketServer
    this._setupHandlers()
  }

  _setupHandlers () {
    this._socketServer.on('connection', socket => {
      this._handleClientJoin(socket)
      this._ensureGame()
      socket.on('set_username', username => {
        this._handleSetUsername(socket, username)
      })
      socket.on('start_game', () => {
        this._handleStartGame(socket)
      })
      socket.on('play_white_cards', cardIds => {
        this._handlePlayWhiteCards(socket, cardIds)
      })
      socket.on('pick_winner', cardId => {
        this._handlePickWinner(socket, cardId)
      })
      socket.on('end_game', () => {
        this._handleEndGame(socket)
      })
      socket.on('disconnect', () => {
        this._handleClientLeave(socket)
      })
    })
  }

  _handleClientJoin (socket) {
    this._log.info('New client connected', socket.id)
  }

  _ensureGame () {
    if (!this._currentGame) {
      this._log.info('No game is currently operating generating...')
      this._currentGame = new Game(`${__dirname}/engine/fixtures/base-set.json`)
      this._currentGameInterval = setInterval(this._updateGame.bind(this), 1000)
    }
  }

  _updateGame () {
    const newGameState = this._currentGame.update()
    for (const username in newGameState) {
      const updateData = JSON.parse(JSON.stringify(newGameState[username]))
      updateData._hand = Object.fromEntries(newGameState[username]._hand)
      const currentPot = this._currentGame.getCardPot()
      updateData._cardPot = JSON.parse(JSON.stringify(currentPot))
      updateData._cardPot.whiteCards = Object.fromEntries(currentPot.whiteCards)
      updateData._gameState = this._currentGame.getGameState()
      this._socketServer.emit(
        `update_${username}`,
        updateData
      )
    }
  }

  _handleSetUsername (socket, username) {
    this._log.info(`Client setting username: ${username}`, socket.id)
    const { id } = this._currentGame.joinGame(username)
    this._currentClients.set(socket.id, {
      username,
      playerId: id
    })
  }

  _handleStartGame (socket) {
    const { username } = this._currentClients.get(socket.id)
    this._log.info(
      `User ${username} is starting game`,
      socket.id
    )
    this._currentGame.startGame()
  }

  _handlePlayWhiteCards (socket, cardIds) {
    const { playerId, username } = this._currentClients.get(socket.id)
    this._log.info(
      `User ${username} is playing white cards`,
      socket.id
    )
    this._currentGame.playCards(playerId, cardIds)
  }

  _handlePickWinner (socket, cardId) {
    const { playerId, username } = this._currentClients.get(socket.id)
    this._log.info(
      `User ${username} has picked the winner`,
      socket.id
    )
    this._currentGame.chooseWinner(playerId, cardId)
  }

  _handleEndGame (socket) {
    const { username } = this._currentClients.get(socket.id)
    this._log.info(
      `User ${username} is ending game`,
      socket.id
    )
    this._currentGame = null
    clearInterval(this._currentGameInterval)
    this._currentGameInterval = null
    socket.emit('refresh_client')
  }

  _handleClientLeave (socket) {
    const { username, playerId } = this._currentClients.get(socket.id) || {}
    this._log.info(
      `Client disconnected: ${username}`,
      socket.id
    )
    this._currentClients.delete(socket.id)
    if (this._currentGame) {
      try {
        this._currentGame.leaveGame(playerId)
        if (this._currentClients.size <= 0) {
          this._currentGame = null
          clearInterval(this._currentGameInterval)
          this._currentGameInterval = null
          socket.emit('refresh_client')
        }
      } catch (err) {
        this._log.warn(err)
        this._currentGame = null
        if (this._currentGameInterval) clearInterval(this._currentGameInterval)
        this._currentGameInterval = null
        this._currentClients = new Map()
        socket.emit('refresh_client')
      }
    }
  }
}

module.exports = SocketHandler
