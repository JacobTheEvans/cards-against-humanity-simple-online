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
    this.shuffle(this._blackCards)
    this.shuffle(this._whiteCards)
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
    this._discardPile.push(card)
  }

  getCardPiles () {
    return {
      blackStack: this._blackCards.length,
      whiteStack: this._whiteCards.length,
      discardStack: this._discardPile.length
    }
  }

  shuffle (cardPile) {
    for (let i = 1000; i > 0; i--) {
      const pos1 = Math.floor((Math.random() * cardPile.length))
      const pos2 = Math.floor((Math.random() * cardPile.length))
      const temp = cardPile[pos1]

      cardPile[pos1] = cardPile[pos2]
      cardPile[pos2] = temp
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
      this.shuffle(this._discardPile)
      this._whiteCards = this._discardPile
      this._discardPile = []
    }
  }

  _drawCard (cardPile) {
    return cardPile.pop()
  }
}

module.exports = Deck
