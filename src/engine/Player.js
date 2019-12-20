class Player {
  constructor (id, name) {
    this._id = id
    this._name = name
    this._hand = new Map()
    this._score = 0
    this._state = 0
  }

  receiveCard (card) {
    this._hand.set(card.getId(), card)
  }

  removeCard (cardId) {
    const card = this._hand.get(cardId)
    if (card) {
      this._hand.delete(cardId)
      return card
    }
  }

  setPlayerDetails (details) {
    const {
      score,
      state,
      hand
    } = details
    if (score) this._score = score
    if (state) this._state = state
    if (hand) this._hand = hand
  }

  getPlayerDetails () {
    return {
      id: this._id,
      name: this._name,
      score: this._score,
      state: this._state,
      hand: this._hand
    }
  }
}

module.exports = Player
