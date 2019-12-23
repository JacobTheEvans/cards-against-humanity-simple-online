const pino = require('pino')
const config = require('config')
const io = require('socket.io')
const http = require('http')
const SocketHandler = require('./SocketHandler')

class Server {
  constructor () {
    this._log = pino()
    this._server = http.createServer(this._httpHandler)
    this._socketServer = io(this._server)
    this._setupSocketServer()
  }

  _httpHandler (req, res) {
    res.writeHead(200)
    res.end()
  }

  _setupSocketServer () {
    this._socketHandler = new SocketHandler(this._socketServer)
  }

  init () {
    this._setupHttpServer()
    this._setupSocketServer()
  }

  async start () {
    await new Promise(resolve => {
      this._server.listen(config.get('http-server.port'), () => {
        this._log.info(
         `Server started on port ${config.get('http-server.port')}`
        )
        resolve()
      })
    })
  }
}

module.exports = Server
