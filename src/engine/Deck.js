const { readFileSync } = require('fs')
const {
  BlackCard,
  WhiteCard
} = require('./Card')

class Deck {
  constructor (cardLibraryPath) {
    const rawLibrary = readFileSync(cardLibraryPath)
    const cardList = JSON.parse(rawLibrary)

    this._blackCards = this._createBlackCards(cardList.blackCards)
    this._whiteCards = this._createWhiteCards(cardList.whiteCards)
    this._shuffle(this._blackCards)
    this._shuffle(this._whiteCards)
    this._discardPile = []
  }

  drawBlack () {
    if (this._blackCards.length > 0) {
      return this._blackCards.pop()
    }
  }

  drawWhite () {
    if (this._whiteCards.length === 0) {
      this._shuffleDiscardPile()
    }
    return this._whiteCards.pop()
  }

  discard (card) {
    card.setPlayerId(-1)
    this._discardPile.push(card)
  }

  getCardCount () {
    return {
      blackStack: this._blackCards.length,
      whiteStack: this._whiteCards.length,
      discardStack: this._discardPile.length
    }
  }

  _createBlackCards (cardList) {
    const formatedList = []
    for (const card of cardList) {
      formatedList.push(new BlackCard(formatedList.length, card.text, card.pick))
    }
    return formatedList
  }

  _createWhiteCards (cardList) {
    const formatedList = []
    for (const text of cardList) {
      // initialize undrawn cards with negative playerId
      formatedList.push(new WhiteCard(formatedList.length, text, -1))
    }
    return formatedList
  }

  _shuffleDiscardPile () {
    if (this._discardPile.length > 0) {
      this._shuffle(this._discardPile)
      this._whiteCards = this._discardPile
      this._discardPile = []
    }
  }

  _shuffle (cardPile) {
    for (let i = cardPile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = cardPile[i]
      cardPile[i] = cardPile[j]
      cardPile[j] = temp
    }
  }

  _drawCard (cardPile) {
    return cardPile.pop()
  }
}

module.exports = Deck
