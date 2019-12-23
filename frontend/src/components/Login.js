import React, { Component } from 'react'
import styled from 'styled-components'

const Form = styled.form`
  width: 350px;
  max-width: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
`

const Input = styled.input`
  flex: 2;
  padding: 14px 20px;
  margin: 7px 5px;
  box-sizing: border-box;
  border-color: white;
  border-style:solid;
`

const Button = styled.button`
  flex: 1;
  display:inline-block;
  padding: 13px 21px;
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
    border-color: black;
  }

  &:active {
    color: #BBBBBB;
    border-color: black;
  }

  @media all and (max-width:30em) {
    & {
      display:block;
      margin:0.4em auto;
    }
  }
`

class Login extends Component {
  state = {
    username: ''
  }

  handleSubmit = e => {
    e.preventDefault()
    const { username } = this.state
    window.localStorage.setItem('username', username)
    window.location.reload()
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render () {
    const { username } = this.state
    return (
      <Form onSubmit={this.handleSubmit}>
        <Input
          value={username}
          name='username'
          onChange={this.handleChange}
        />
        <Button type='submit'>
          Login
        </Button>
      </Form>
    )
  }
}

export default Login
