# Cards Against Humanity Simple Online

## gamelogic draft

- every card is an object with properties for text and id
- black cards get a property of "pick" with the number of answer cards
- the black card is drawn from the deck and assigned to a player
- every player can own a set of cards
- every player can select the "pick" number of cards given from the one black card
- all player selected card go into some sort of pot that only one player (the one with the black card) can modify
- the "pot" is a member of the base game object
- this player gets the same "choose one" routine that the other players have on the cards that are in the pot
- the cards that are in the pot should have a property of "player ownership" so we can process who won the round
