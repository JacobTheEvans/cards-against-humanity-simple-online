import React from 'react'
import styled from 'styled-components'
import { withSocketIo } from '../../SocketIo'

const Button = styled.button`
  border-radius: 20px;
  margin: 10px 20px;
  display:inline-block;
  padding: 14px 21px;
  border: 0.16em solid black;
  box-sizing: border-box;
  text-decoration:none;
  text-transform:uppercase;
  font-family:'Roboto',sans-serif;
  font-weight:400;
  color: #fff;
  text-align:center;
  transition: all 0.15s;
  background-color: black;
  height: 325px;
  width: 225px;

  &:hover {
    color: #fff;
    border-color: black;
  }

  &:active {
    color: #fff;
    border-color: black;
  }

  @media all and (max-width:30em) {
    & {
      display:block;
      margin:0.4em auto;
    }
  }
`

function BlackCard ({ blackCard }) {
  return (
    <Button disabled>
      {blackCard._text}
    </Button>
  )
}

export default withSocketIo(BlackCard)
