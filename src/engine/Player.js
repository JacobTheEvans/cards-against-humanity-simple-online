class Player {
  constructor (id, name) {
    this._id = id
    this._name = name
    this._hand = new Map()
    this._score = 0
    this._state = 0
    this._judge = false
  }

  receiveCard (card) {
    card.setPlayerId(this._id)
    this._hand.set(card.getId(), card)
  }

  removeCard (cardId) {
    const card = this._hand.get(cardId)
    if (card) {
      this._hand.delete(cardId)
      return card
    }
  }

  setDetails (details) {
    const {
      score,
      state,
      hand,
      judge
    } = details
    if (score) this._score = score
    if (state) this._state = state
    if (hand) this._hand = hand
    if (judge) this._judge = judge
  }

  getDetails () {
    return {
      id: this._id,
      name: this._name,
      score: this._score,
      state: this._state,
      hand: this._hand,
      judge: this._judge
    }
  }
}

module.exports = Player
