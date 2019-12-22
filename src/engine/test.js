const Game = require('./Game')

const currentGame = new Game('../fixtures/base-set.json')

// A simulated game round
let player1State = currentGame.joinGame('playerDude')
let player2State = currentGame.joinGame('playerDudette')
let player3State = currentGame.joinGame('hellYeah123')

// start new round
currentGame._startRound()
let thePot = currentGame.getCardPot()

console.log('############Starting hands##########')
console.log(player1State)
console.log(player2State)
console.log(player3State)
console.log('##########current pot should be empty and contain only a black card')
console.log(thePot)

console.log('###########playing cards')
let cards = playCards(player1State)
player1State = currentGame.playCards(player1State.id, cards)

console.log('##########current pot should contain only a black card and player1 cards according to black card')
console.log(thePot)

console.log('##############player1 should have got new cards')
console.log(player1State)

console.log('###############should not be possible to end this round')
currentGame._updateRound()

cards = playCards(player2State)
player2State = currentGame.playCards(player2State.id, cards)

cards = playCards(player3State)
player3State = currentGame.playCards(player3State.id, cards)

console.log('##########current pot should contain a black card and all player cards according to black card')
console.log(thePot)

console.log('##############player2 and 3 should have got new cards')
console.log(player2State)
console.log(player3State)

console.log('###############should be possible to end this round')
currentGame._updateRound()

console.log('##########current pot should be empty')
console.log(thePot)

console.log('###############check card piles')
console.log(currentGame.getCardPiles())

// start new round
currentGame._startRound()
console.log(thePot)

function playCards (playerState) {
  const numPicks = thePot.blackCard.getPicks()
  const pickedFromHand = []
  for (let i = 0; i < numPicks; i++) {
    const cardId = Array.from(playerState.hand.keys())[i]
    pickedFromHand.push(cardId)
  }
  return pickedFromHand
}
