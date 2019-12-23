import React from 'react'
import styled from 'styled-components'
import BlackCard from './BlackCard'
import WhiteCards from './WhiteCards'
import { withSocketIo } from '../../SocketIo'

const Container = styled.div`
  margin-top: 50px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 50px;
`

function BlackCardContainer ({ playerData }) {
  if (!playerData) return false
  if (!playerData._cardPot) return false
  if (!playerData._cardPot.blackCard) return false
  return (
    <Container>
      <BlackCard blackCard={playerData._cardPot.blackCard} />
      <WhiteCards />
    </Container>
  )
}

export default withSocketIo(BlackCardContainer)
