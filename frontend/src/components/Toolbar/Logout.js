import React from 'react'
import styled from 'styled-components'

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

function logout () {
  window.localStorage.removeItem('username')
  window.location.reload()
}

function Logout () {
  return (
    <Button onClick={logout}>
      Logout
    </Button>
  )
}

export default Logout
