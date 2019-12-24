import React from 'react'
import styled from 'styled-components'
import { withSocketIo } from '../../SocketIo'

const Button = styled.button`
  margin-left: auto;
  display:inline-block;
  padding: 14px 21px;
  border: 0.16em solid #FFFFFF;
  margin: 0 0.3em 0.3em 0;
  box-sizing: border-box;
  text-decoration:none;
  text-transform:uppercase;
  font-family:'Roboto',sans-serif;
  font-weight:400;
  color: #000;
  text-align:center;
  transition: all 0.15s;
  background-color: white;

  &:hover {
    color: #000;
    border-color: #000;
  }

  &:active {
    color: #BBBBBB;
    border-color: #000;
  }

  @media all and (max-width:30em) {
    & {
      display:block;
      margin:0.4em auto;
    }
  }
`

function restartServer (socket) {
  socket.emit('restart_server')
}

function RestartServer ({ socket }) {
  return (
    <Button
      onClick={() => restartServer(socket)}
    >
      Restart Server
    </Button>
  )
}

export default withSocketIo(RestartServer)
