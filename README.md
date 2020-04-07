# Cards Against Humanity Simple Online

## How to run

### Prerequisites
1. Clone the repositiory
2. Install docker and docker-compose according to the official documentation:
[https://docs.docker.com/get-docker/](Docker)
[https://docs.docker.com/compose/install/](Docker-Compose)

### Run
1. Change into the cards-against-humanity-simple-online folder.
2. run ```docker-compose up```
3. Access http://localhost once the docker containers were started successfully.

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
