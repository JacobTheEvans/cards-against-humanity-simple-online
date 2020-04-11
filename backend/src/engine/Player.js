class Player {
  constructor (id, name) {
    this._id = id
    this._name = name
    this._hand = new Map()
    this._state = 0
    this._judge = false
    this._score = 0
    this._chosenCards = []
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

  chooseCard (cardId, cardLimit) {
    if (!this._chosenCards.includes(cardId)) {
      if (this._chosenCards.length < cardLimit) {
        this._chosenCards.push(cardId)
      }
    } else {
      const newChosenCards = this._chosenCards.filter(value => { return value !== cardId })
      console.log(newChosenCards)
      this._chosenCards = newChosenCards
    }
  }

  clearChosenCards () {
    this._chosenCards = []
  }

  setState (state) {
    this._state = state
  }

  setScore (score) {
    this._score = score
  }

  setJudge (bool) {
    this._judge = bool
  }

  getDetails () {
    return {
      id: this._id,
      name: this._name,
      state: this._state,
      hand: this._hand,
      judge: this._judge,
      chosenCards: this._chosenCards
    }
  }
}

module.exports = Player
