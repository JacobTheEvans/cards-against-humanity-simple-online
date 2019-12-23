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

  &:hover {
    color: #000;
    border-color: #DDDDDD;
  }

  &:active {
    color: #BBBBBB;
    border-color: #BBBBBB;
  }

  @media all and (max-width:30em) {
    & {
      display:block;
      margin:0.4em auto;
    }
  }
`

function newGame (socket) {
  socket.emit('end_game')
}

function NewGame ({ socket }) {
  return (
    <Button
      onClick={() => newGame(socket)}
    >
      New Game
    </Button>
  )
}

export default withSocketIo(NewGame)
