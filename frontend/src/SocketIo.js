import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import styled from 'styled-components'

const SocketIo = React.createContext()

export function createSocketIoProvider ({
  endpoint = `http://${window.location.hostname}:8080`
} = {}) {
  return function SocketIoProvider ({ children, username }) {
    return (
      <SocketIoConnection
        endpoint={endpoint}
        username={username}
      >
        {children}
      </SocketIoConnection>
    )
  }
}

class SocketIoConnection extends Component {
  state = {
    playerData: null,
    message: null
  }

  componentDidMount () {
    const { endpoint } = this.props
    this.setState({
      socket: socketIOClient(endpoint)
    }, () => {
      const { socket } = this.state
      const { username } = this.props
      socket.emit('set_username', username)
      socket.on('refresh_client', () => {
        window.location.reload()
      })
      socket.on('new_winner', message => {
        this.setState({
          message: message
        })
      })
      socket.on(`update_${username}`, playerData => {
        this.setState({
          playerData
        })
      })
    })
  }

  render () {
    const { children } = this.props
    const { message } = this.state
    return (
      <SocketIo.Provider value={this.state}>
        {children}
        <Message message={message} />
      </SocketIo.Provider>
    )
  }
}

const MessageText = styled.p`
  position: fixed;
  left: 10px
  bottom: 0px
  font-size: 20px;
`

function Message ({ message }) {
  if (!message) return false
  return (
    <MessageText>
      {message} has won!
    </MessageText>
  )
}

export function withSocketIo (PassedComponent) {
  return class ComponentWithSocketIo extends Component {
    render () {
      return (
        <SocketIo.Consumer>
          {socketIoInfo => (
            <PassedComponent {...this.props} {...socketIoInfo} />
          )}
        </SocketIo.Consumer>
      )
    }
  }
}
