const {
  WhiteCard
} = require('Card')

class Player {
  constructor(id, name) {
    this._id = id
    this._name = name
    this._hand = new Map()
    this._score = 0
  }

  addCardToHand(card) {
    this._hand.set(card.getId(), card)
  }

  getCardFromHand(cardId) {
    const card = this._hand.get(cardId)
    this._hand.delete(cardId)
    return card
  }

  setScore(score) {
    this._score = score
  }

  getHand() {
    return this._hand
  }

  getScore() {
    return this._score
  }

  getId() {
    return this._id
  }

  getName() {
    return this._name
  }
}

module.exports = Player
