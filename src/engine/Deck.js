const {
  BlackCard,
  WhiteCard
} = require('Card')

class Deck {
  constructor(cardLibraryPath) {
    const cardFile = readFileSync(cardLibraryPath)
    const cardPile = JSON.parse(cardFile)

    this._blackCards = this._createBlackCards(cardPile.blackCards)
    this._whiteCards = this._createWhiteCards(cardPile.whiteCards)
    this._shuffle(this._blackCards)
    this._shuffle(this._whiteCards)
    this._discardPile = []
  }

  drawBlack() {
    if (this._blackDeck.length > 0) {
      return this._blackDeck.pop()
    }
  }

  drawWhite() {
    if (this._whiteCards.length === 0) {
      this._shuffleDiscardPile()
    }
    return this._whiteDeck.pop()
  }

  discard(card) {
    card.setPlayerId(-1)
    this._discardPile.push(card)
  }

  _createBlackCards(cardPile) {
    const formatedPile = []
    for (const card in cardPile) {
      formatedPile.push(new BlackCard(formatedPile.length, card.text, card.pick))
    }
    return formatedPile
  }

  _createWhiteCards(cardPile) {
    const formatedPile = []
    for (const card in cardPile) {
      // initialize undrawn cards with negative playerId
      formatedPile.push(new WhiteCard(formatedPile.length, card.text, -1))
    }
    return formatedPile
  }

  _shuffleDiscardPile() {
    if (this._discardPile.length > 0) {
      this._shuffle(this._discardPile)
      this._whiteCards = this._discardPile
      this._discardPile = []
    }
  }

  _shuffle(cardPile) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      [cardPile[i], cardPile[j]] = [cardPile[j], cardPile[i]]
    }
  }

  _drawCard(cardPile) {
    return cardPile.pop()
  }
}

module.exports = Deck
