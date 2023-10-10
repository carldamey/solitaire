	/*----- constants -----*/


	/*----- state variables -----*/


	/*----- cached elements  -----*/


	/*----- event listeners -----*/


	/*----- functions -----*/
    /*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// Build an 'original' deck of 'card' objects used to create shuffled decks
const originalDeck = buildOriginalDeck();
renderDeckInContainer(originalDeck, document.getElementById('original-deck-container'));

/*----- app's state (variables) -----*/
let shuffledDeck;

/*----- cached element references -----*/
const shuffledContainer = document.getElementById('shuffled-deck-container');

/*----- event listeners -----*/
document.querySelector('button').addEventListener('click', renderNewShuffledDeck);

/*----- functions -----*/
function getNewShuffledDeck() {
  // Create a copy of the originalDeck (leave originalDeck untouched!)
  const tempDeck = [...originalDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    // Get a random index for a card still in the tempDeck
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}

function renderNewShuffledDeck() {
  // Create a copy of the originalDeck (leave originalDeck untouched!)
  shuffledDeck = getNewShuffledDeck();
  renderDeckInContainer(shuffledDeck, shuffledContainer);
}

function renderDeckInContainer(deck, container) {
  container.innerHTML = '';
  // Let's build the cards as a string of HTML
  let cardsHtml = '';
  deck.forEach(function(card) {
    cardsHtml += `<div class="card ${card.face}"></div>`;
  });
  // Or, use reduce to 'reduce' the array into a single thing - in this case a string of HTML markup 
  // const cardsHtml = deck.reduce(function(html, card) {
  //   return html + `<div class="card ${card.face}"></div>`;
  // }, '');
  container.innerHTML = cardsHtml;
}

function buildOriginalDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
        // Setting the 'value' property for game of blackjack, not war
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}

renderNewShuffledDeck();

/*

Initialize deck and shuffle it

    I think it would be easier to represent A, J, Q, and K as 1, 11, 12, and 13 respectively, then translate them to CSS cards in the render function, rather than translate the letters in the control

Deal cards to tableaus 1-7

Set aside remaining deck into the stockpile

        How do I want to implement hiding cards?



When the stockpile is clicked, the top 3 cards are placed onto the waste pile, if there are fewer than 3 cards in the stockpile, add the last card to the stockpile
If the empty stockpile is clicked, move all cards from the waste pile to the stockpile in reverse order
Only a max of the top 3 wastepile cards are visible at any time




If a card is clicked, it is highlighted and stored in a selectedCard variable
If it is clicked again, the highlight is removed and the card is deselected

When a second card is clicked, it is checked for legality

If the second card clicked is not hidden and:
  •The value of the selected card +1 AND an opposite suit color, the selected card and all cards below it are moved below that card
  •An empty tableau column AND the selected card is a king, it is moved to that column
  •An ace pile and the selected card is the ace pile's suit and value + 1, it is moved to the ace pile
  •

If the top card of a tableau is hidden, reveal it
Deal all cards as hidden, then reveal the last index of each, keeping track of which cards are hidden by some other measure
Maybe set aside a separate array of remaining cards, replacing the top "?"s in the array with a card from it, 
something like, if the top index of this array is a ?, replace it with a card from the hiddenCards array.




Icebox features:
•Double click to move card to ace pile if legal
•Sound
•Option to view entire wastepile
•Move counter
•Timer
•Rule Modifications
•Windows 98/xp style visuals
*/