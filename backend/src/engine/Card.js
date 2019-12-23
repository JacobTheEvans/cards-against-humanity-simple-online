class Card {
  constructor (cardId, text) {
    this._cardId = cardId
    this._text = text
  }

  getText () {
    return this._text
  }

  getId () {
    return this._cardId
  }
}

class BlackCard extends Card {
  constructor (cardId, text, picks) {
    super(cardId, text)
    this._picks = picks
  }

  getPicks () {
    return this._picks
  }
}

class WhiteCard extends Card {
  constructor (cardId, text, playerId) {
    super(cardId, text)
    this._playerId = playerId
  }

  getPlayerId () {
    return this._playerId
  }

  setPlayerId (playerId) {
    this._playerId = playerId
  }
}

module.exports = {
  BlackCard,
  WhiteCard
}
