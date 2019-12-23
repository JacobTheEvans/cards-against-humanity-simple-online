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
        hidden={playerData._state === 1}
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
