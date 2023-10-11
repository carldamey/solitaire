	/*----- constants -----*/

  const SUITS = ["c", "d", "h", "s"]
  const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

	/*----- state variables -----*/
  let deck, tableau, stockPile, wastePile, acePiles
	/*----- cached elements  -----*/
  cardsDiv = document.getElementById("cards")

	/*----- event listeners -----*/


	/*----- functions -----*/
init()

function init() {
  deck = [];tableau = [[], [], [], [], [], [], []]; stockPile = []; wastePile = []; acePiles = {c: 0, d: 0, h: 0, s: 0}

  // Fill the deck array with card objects
  for (let suit in SUITS) {
    for (let i = 0; i <=12; i++) {
      SUITS[suit] === "c" || SUITS[suit] === "s" ? color = "black" : color = "red"
      deck.push({suit: SUITS[suit], rank: RANKS[i], color,})
      // Add card element to the DOM
      const cardEl = document.createElement("div")
      cardEl.classList.add("card", "xlarge", `${SUITS[suit]}${RANKS[i]}`)
      cardsDiv.appendChild(cardEl)
    }
  }

  // Shuffle the deck
  deck.sort(() => Math.random() - .5)

  // Fill the tableau with hidden cards
  for (let i = 0; i <= 6; i++) {
    while (tableau[i].length < i + 1) tableau[i].push("?")
  }

  // Move 24 cards to the stockpile, leaving the remaining 28 to pull from when revealing cards
  for (let i = 0; i < 24; i++) {
    const stockCard = deck[0]
    deck.shift()
    stockPile.push(stockCard)
  }
}

function move() {
  tableau.forEach(column => {
    if (column[column.length - 1] === "?") {
      const revealedCard = deck[0]
      deck.shift()
      column[column.length - 1] = revealedCard
    }

  })
}

function draw() {
  if (stockPile.length >= 3) {
    for (let i = 1; i <= 3; i++) {
      const drawingCard =  stockPile[0]
      stockPile.shift()
      wastePile.unshift(drawingCard)
    } 
  } else if (stockPile.length > 0) {
    stockPile.forEach(card => {
      stockPile.shift()
      wastePile.unshift(card)
    })
  } else if (stockPile.length === 0) {
    stockPile = [...wastePile].reverse()
    wastePile = []
  }

}


// TODO fix bug with stock and waste pile lengths 
// TODO clean formatting and remove vestigial comments
// TODO consider moving card reveal to its own function instead of being expressed in move function
// TODO delete console logs when finished

/*






If a card is clicked, it is highlighted and stored in a selectedCard variable
If it is clicked again, the highlight is removed and the card is deselected

When a second card is clicked, it is checked for legality

LEGAL MOVES: 
  • A non-ace card from the tableau to another tableau column, of which the top card is an opposite suit +1 
  • A king from the tableau or wastepile to an empty tableau column
  • A card from the bottom of a column to its respective ace pile -1
  • A non-ace card at the top of an ace pile to a tableau column, of which the top card is an opposite suit +1
  • A non-ace top card of the waste pile
  • An ace from the top of the waste pile to its respective empty ace pile
  • An ace from the tableau to its respective empty ace pile



At the end of every move function, increment the move counter by 1 and check for a winner,
if all ace piles have 13 as the top card, the player wins and is prompted to play again.

When rendering:
  If a card is "?", then represent it with a face down card


Icebox features:
•Double click to move card to ace pile if legal
•Sound
•Option to view entire wastepile
•Move counter
•Timer
•Rule Modifications
•Windows 98/xp style visuals
*/








//     /*----- constants -----*/
// const suits = ['s', 'c', 'd', 'h'];
// const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// // Build an 'original' deck of 'card' objects used to create shuffled decks
// const originalDeck = buildOriginalDeck();
// renderDeckInContainer(originalDeck, document.getElementById('original-deck-container'));

// /*----- app's state (variables) -----*/
// let shuffledDeck;

// /*----- cached element references -----*/
// const shuffledContainer = document.getElementById('shuffled-deck-container');

// /*----- event listeners -----*/
// document.querySelector('button').addEventListener('click', renderNewShuffledDeck);

// /*----- functions -----*/
// function getNewShuffledDeck() {
//   // Create a copy of the originalDeck (leave originalDeck untouched!)
//   const tempDeck = [...originalDeck];
//   const newShuffledDeck = [];
//   while (tempDeck.length) {
//     // Get a random index for a card still in the tempDeck
//     const rndIdx = Math.floor(Math.random() * tempDeck.length);
//     // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
//     newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
//   }
//   return newShuffledDeck;
// }

// function renderNewShuffledDeck() {
//   // Create a copy of the originalDeck (leave originalDeck untouched!)
//   shuffledDeck = getNewShuffledDeck();
//   renderDeckInContainer(shuffledDeck, shuffledContainer);
// }

// function renderDeckInContainer(deck, container) {
//   container.innerHTML = '';
//   // Let's build the cards as a string of HTML
//   let cardsHtml = '';
//   deck.forEach(function(card) {
//     cardsHtml += `<div class="card ${card.face}"></div>`;
//   });
//   // Or, use reduce to 'reduce' the array into a single thing - in this case a string of HTML markup 
//   // const cardsHtml = deck.reduce(function(html, card) {
//   //   return html + `<div class="card ${card.face}"></div>`;
//   // }, '');
//   container.innerHTML = cardsHtml;
// }

// function buildOriginalDeck() {
//   const deck = [];
//   // Use nested forEach to generate card objects
//   suits.forEach(function(suit) {
//     ranks.forEach(function(rank) {
//       deck.push({
//         // The 'face' property maps to the library's CSS classes for cards
//         face: `${suit}${rank}`,
//         // Setting the 'value' property for game of blackjack, not war
//         value: Number(rank) || (rank === 'A' ? 11 : 10)
//       });
//     });
//   });
//   return deck;
// }

// renderNewShuffledDeck();

