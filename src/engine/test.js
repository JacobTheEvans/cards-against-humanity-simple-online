const Game = require('./Game')

const currentGame = new Game('../fixtures/base-set.json')

let player1State = currentGame.joinGame('playerDude')
const player2State = currentGame.joinGame('playerDudette')
const player3State = currentGame.joinGame('hellYeah123')

console.log(player1State)
console.log(player2State)
console.log(player3State)

player1State = currentGame.playCards(player1State.id, [player1State.hand.keys().next().value])
player1State = currentGame.playCards(player1State.id, [player1State.hand.keys().next().value])
player1State = currentGame.playCards(player1State.id, [player1State.hand.keys().next().value])
player1State = currentGame.playCards(player1State.id, [player1State.hand.keys().next().value])
player1State = currentGame.playCards(player1State.id, [player1State.hand.keys().next().value])
const thePot = currentGame.getCardPot()

console.log(player1State)
console.log(thePot)

player1State = currentGame.drawWhiteCards(player1State.id)

console.log(player1State)

player1State = currentGame.discardCards(player1State.id, [player1State.hand.keys().next().value])
player1State = currentGame.discardCards(player1State.id, [player1State.hand.keys().next().value])
player1State = currentGame.discardCards(player1State.id, [player1State.hand.keys().next().value])
player1State = currentGame.discardCards(player1State.id, [player1State.hand.keys().next().value])
player1State = currentGame.discardCards(player1State.id, [player1State.hand.keys().next().value])

console.log(player1State)

player1State = currentGame.drawWhiteCards(player1State.id)

console.log(player1State)
