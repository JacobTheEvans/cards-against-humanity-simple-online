import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'

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
      socket.on(`update_${username}`, playerData => {
        this.setState({
          playerData
        }, () => {
          console.log(this.state.playerData)
        })
      })
    })
  }

  render () {
    const { children } = this.props
    return (
      <SocketIo.Provider value={this.state}>
        {children}
      </SocketIo.Provider>
    )
  }
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
