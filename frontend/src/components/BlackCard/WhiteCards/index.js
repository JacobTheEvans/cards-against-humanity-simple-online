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
  const cardsToDraw = []
  for (const { username, cards } of playerData._cardPot.whiteCards) {
    if (!cards) continue
    for (const card of cards) {
      cardsToDraw.push(
        <WhiteCard
          key={username}
          card={card}
          hidden={shouldBeHidden(playerData._state, playerData._gameState)}
          playerIsJudge={playerData._judge}
        />
      )
    }
  }
  return (
    <Container>
      {cardsToDraw}
    </Container>
  )
}

export default withSocketIo(WhiteCards)
