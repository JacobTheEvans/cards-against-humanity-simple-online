import React from 'react'
import styled from 'styled-components'
import WhiteCard from './WhiteCard'
import { withSocketIo } from '../../SocketIo'

const Container = styled.div`
  margin-top: 50px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`

function WhiteCards ({ playerData }) {
  if (!playerData) return false
  if (!playerData._hand) return false
  if (playerData._judge) return false

  const cards = []
  for (const cardId in playerData._hand) {
    cards.push(
      <WhiteCard
        key={cardId}
        card={playerData._hand[cardId]}
        disabled={playerData._state === 2}
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
