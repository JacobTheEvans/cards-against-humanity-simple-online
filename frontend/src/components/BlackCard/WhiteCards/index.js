import React from 'react'
import styled from 'styled-components'
import WhiteCard from './WhiteCard'
import { withSocketIo } from '../../../SocketIo'

const Container = styled.div`
  margin-top: 50px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`

function shouldBeHidden (playerState, gameState) {
  return (
    (playerState === 2 && gameState === 1) ||
    (playerState === 1 && gameState === 1) ||
    (playerState === 0 && gameState === 1)
  )
}

function WhiteCards ({ playerData }) {
  if (!playerData) return false
  if (!playerData._cardPot) return false
  if (!playerData._cardPot.whiteCards) return false
  const cards = []
  for (const username in playerData._cardPot.whiteCards) {
    if (!playerData._cardPot.whiteCards[username][0]) continue
    cards.push(
      <WhiteCard
        key={username}
        card={playerData._cardPot.whiteCards[username][0]}
        hidden={shouldBeHidden(playerData._state, playerData._gameState)}
        playerIsJudge={playerData._judge}
      />
    )
  }
  return (
    <Container>
      {cards}
    </Container>
  )
}

export default withSocketIo(WhiteCards)
