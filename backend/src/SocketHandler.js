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
    this._currentClients.set(socket.id, 'NO_USERNAME_SET')
  }

  _ensureGame () {
    if (!this._currentGame) {
      this._log.info('No game is currently operating generating...')
      this._currentGame = new Game(`${__dirname}/engine/fixtures/base-set.json`)
      this._currentGameInterval = setInterval(this._currentGame.update, 1000)
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

  _handleEndGame (socket) {
    const { username } = this._currentClients.get(socket.id)
    this._log.info(
      `User ${username} is ending game: ${username}`,
      socket.id
    )
    this._currentGame = null
    clearInterval(this._currentGameInterval)
    this._currentGameInterval = null
    socket.emit('refresh_client')
  }

  _handleClientLeave (socket) {
    const { username, playerId } = this._currentClients.get(socket.id)
    this._log.info(
      `Client disconnected: ${username}`,
      socket.id
    )
    this._currentClients.delete(socket.id)
    if (this._currentGame) {
      this._currentGame.leaveGame(playerId)
    }
  }
}

module.exports = SocketHandler
