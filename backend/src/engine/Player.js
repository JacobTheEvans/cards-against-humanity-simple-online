class Player {
  constructor (id, name) {
    this._id = id
    this._name = name
    this._hand = new Map()
    this._state = 0
    this._judge = false
    this._score = 0
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

  setState (state) {
    this._state = state
  }

  setDetails (details) {
    if (details.state) {
      console.log('got new state')
      this._state = details.state
    }
    if (details.hand) this._hand = details.hand
    if (details.judge) this._judge = details.judge
  }

  getDetails () {
    return {
      id: this._id,
      name: this._name,
      state: this._state,
      hand: this._hand,
      judge: this._judge
    }
  }
}

module.exports = Player
