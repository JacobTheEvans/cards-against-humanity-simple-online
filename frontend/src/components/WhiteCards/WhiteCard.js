import React from 'react'
import styled from 'styled-components'
import { withSocketIo } from '../../SocketIo'

const Button = styled.button`
  border-radius: 20px;
  margin: 10px 20px;
  display:inline-block;
  padding: 14px 21px;
  border: 0.16em solid #FFFFFF;
  box-sizing: border-box;
  text-decoration:none;
  text-transform:uppercase;
  font-family:'Roboto',sans-serif;
  font-weight:400;
  color: #000;
  text-align:center;
  transition: all 0.15s;
  background-color: white;
  height: 325px;
  width: 225px;

  &:hover {
    color: #000;
    border-color: ${({ disabled }) => disabled ? 'white' : 'black'};
  }

  &:active {
    color: #BBBBBB;
    border-color: ${({ disabled }) => disabled ? 'white' : 'black'};
  }

  @media all and (max-width:30em) {
    & {
      display:block;
      margin:0.4em auto;
    }
  }
`

function pickCard (socket, cardId, disabled) {
  if (disabled) return
  socket.emit('play_white_cards', [cardId])
}

function WhiteCard ({ card, disabled, socket }) {
  return (
    <Button
      disabled={disabled}
      onClick={() => pickCard(socket, card._cardId, disabled)}
    >
      {card._text}
    </Button>
  )
}

export default withSocketIo(WhiteCard)
