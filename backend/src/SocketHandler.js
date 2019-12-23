const pino = require('pino')

class SocketHandler {
  constructor (socketServer) {
    this._log = pino()
    this._socketServer = socketServer
    this._setupHandlers()
  }

  _setupHandlers () {
    this._socketServer.on('connection', socket => {
      this._log.info('New client connected')
      setTimeout(() => {
        socket.emit('test', `new client joined ${Date.now()}`)
      }, 500)
      socket.on('disconnect', () => {
        this._log.info('Client disconnected')
      })
    })
  }
}

module.exports = SocketHandler
