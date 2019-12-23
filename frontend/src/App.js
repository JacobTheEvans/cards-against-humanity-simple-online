import React from 'react'
import { createSocketIoProvider } from './SocketIo'
import Login from './components/Login'
import Toolbar from './components/Toolbar'
import WhiteCards from './components/WhiteCards'
import BlackCard from './components/BlackCard'

const SocketIoProvider = createSocketIoProvider()

function App () {
  if (!window.localStorage.getItem('username')) {
    return <Login />
  }
  return (
    <SocketIoProvider
      username={window.localStorage.getItem('username')}
    >
      <Toolbar />
      <BlackCard />
      <WhiteCards />
    </SocketIoProvider>
  )
}

export default App
