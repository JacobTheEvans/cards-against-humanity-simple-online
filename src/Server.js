const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const config = require('config')
const socket = require('socket.io')

const app = express()
const server = app.listen(config.get('http-server.port'))
const io = socket(server)


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/auth', auth)
app.use('/api', api)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

// Socket.io chat section
io.use(function (socket, next) {
  var handshakeData = socket.request
  if (!handshakeData.headers.cookie) {
    console.log('[-] Error handshakeData not set do not procces')
  } else {
    index = handshakeData.headers.cookie.indexOf('user_token=')
    length = handshakeData.headers.cookie.length
    token = handshakeData.headers.cookie.slice(index + 11, length)
    verify = true
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        verify = false
      } else {
        if (verify) {
          next()
        }
      }
    })
  }
})

io.on('connection', function (socket) {
  io.emit('message', { user: 'server', message: 'update', update: true })
  socket.on('message', function (data) {
    var date = new Date()
    today = date.getTime()
    if (!data.token) {
      io.sockets.connected[socket.id].emit('message', { user: 'Server', message: 'Must be logged to use service', update: false, time: today })
    } else {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          io.sockets.connected[socket.id].emit('message', { user: 'Server', message: 'Invalid token. Please revalidated token', update: false, time: today })
        } else {
          User.findOne({ token: token }, function (err, user) {
            if (err) {
              console.log(err)
            } else {
              if (user) {
                if (data.message != '') {
                  io.emit('message', { user: user.username, message: data.message, update: false, time: today })
                } else {
                  io.sockets.connected[socket.id].emit('message', { user: 'Server', message: 'Your message must contain text', update: false, time: today })
                }
              } else {
                io.sockets.connected[socket.id].emit('message', { user: 'Server', message: 'Invalid token. Please revalidated token', update: false, time: today })
              }
            }
          })
        }
      })
    }
  })
  socket.on('kick', function (data) {
    var date = new Date()
    today = date.getTime()
    if (!data.token) {
      io.sockets.connected[socket.id].emit('message', { user: 'Server', message: 'Must be logged to use service', update: false, time: today })
    } else if (!data.selected_user) {
      io.sockets.connected[socket.id].emit('message', { user: 'Server', message: 'Must supply a username to vote to kick', update: false, time: today })
    } else {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          io.sockets.connected[socket.id].emit('message', { user: 'Server', message: 'Invalid token. Please revalidated token', update: false, time: today })
        } else {
          User.findOne({ token: token }, function (err, user) {
            if (err) {
              console.log(err)
            } else {
              if (user) {
                User.findOne({ username: data.selected_user }, function (err, selectedUser) {
                  if (selectedUser) {
                    var selected_userName = selectedUser.username
                    if (selectedUser.users_kick.indexOf(user.username) == -1) {
                      selectedUser.users_kick.push(user.username)
                      selectedUser.save()
                      io.emit('message', { user: 'Server', message: user.username + ' has voted to kick ' + selected_userName, update: false, time: today })
                      User.find({}, function (err, users) {
                        var online = users.length
                        var amount = -1
                        if (online <= 3) {
                          amount = -1
                        } else if (online <= 10) {
                          amount = Math.round(online * 0.75)
                        } else if (online <= 20) {
                          amount = Math.round(online * 0.50)
                        } else if (online <= 50) {
                          amount = Math.round(online * 0.30)
                        } else if (online <= 100) {
                          amount = Math.round(online * 0.10)
                        } else {
                          amount = Math.round(online * 0.07)
                        }
                        if (selectedUser.users_kick.length >= amount && amount != -1) {
                          username = selectedUser.username
                          selectedUser.remove()
                          selectedUser.save()
                          var client_ip_address = socket.request.connection.remoteAddress
                          io.emit('message', { user: 'Server', message: 'User ' + username + ' has been kicked and blocked. IP: ' + client_ip_address.toString(), update: false, time: today })
                          var data = {
                            ip: client_ip_address
                          }
                          var newIp = new Ip(data)
                          newIp.save()
                        } else {
                          if (amount == -1) {
                            io.sockets.connected[socket.id].emit('message', { user: 'Server', message: 'Not enough users online to start kick', update: false, time: today })
                          }
                        }
                      })
                    } else {
                      io.sockets.connected[socket.id].emit('message', { user: 'Server', message: 'You have already voted to kick that user', update: false, time: today })
                    }
                  } else {
                    io.sockets.connected[socket.id].emit('message', { user: 'Server', message: 'That user does not exist', update: false, time: today })
                  }
                })
              } else {
                io.sockets.connected[socket.id].emit('message', { user: 'Server', message: 'Invalid token. Please revalidated token', update: false, time: today })
              }
            }
          })
        }
      })
    }
  })
})


const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const config = require('config')
const socket = require('socket.io')


class Server {
  _httpServer = express()
  _baseSocketHttpServer = http.createServer()
  _socketServer = socket(this._baseSocketHttpServer, {
    path: config.get('socket-server.base-path'),
    serveClient: false,
  })

  _setupHttpServer () {
    this._setupHttpMiddleware()
    this._setupStaticFiles()

  }

  _setupHttpMiddleware () {
    this._httpServer.use(bodyParser.urlencoded({ extended: false }))
    this._httpServer.use(bodyParser.json())
    this._httpServer.use(cors())
  }

  _setupStaticFiles () {
    this._httpServer.use(express.static(path.resolve(__dirname, '..', 'build')))
    this._httpServer.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
    })
  }

  _setupSocketServer () {

  }

  init () {
    this._setupHttpServer()
    this._setupSocketServer()
  }

  async start () {
    await new Promise(resolve => {
     this._httpServer.listen(config.get('http-server.port'), resolve)
    })
    return new Promise(reject => {
      this._socketServer.listen(config.get('socket-server.port'), resolve)
    })
  }
}
