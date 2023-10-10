	/*----- constants -----*/

  const SUITS = ["c", "d", "h", "s"]
  const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

	/*----- state variables -----*/
  let deck, tableau, stockPile, wastePile, acePiles
	/*----- cached elements  -----*/


	/*----- event listeners -----*/


	/*----- functions -----*/

function init() {
  deck = [];tableau = [[], [], [], [], [], [], []]; stockPile = []; wastePile = []; acePiles = {c: 0, d: 0, h: 0, s: 0}

  //Fill the deck array with card objects
  for (let suit in SUITS) {
    for (let i = 0; i <=12; i++) {
      SUITS[suit] === "c" || SUITS[suit] === "s" ? color = "black" : color = "red"
      deck.push({suit: SUITS[suit], rank: RANKS[i], color})
    }
  }

  //Shuffle the deck
  deck.sort(() => Math.random() - .5)

  // Fill the tableau with hidden cards
  for (let i = 0; i <= 6; i++) {
    while (tableau[i].length < i + 1) tableau[i].push("?")
  }
}


init()
console.log(deck)
/*

Initialize deck and shuffle it

    I think it would be easier to represent A, J, Q, and K as 1, 11, 12, and 13 respectively, then translate them to CSS cards in the render function, rather than translate the letters in the control

Deal 28 cards to the hiddenCards array
Deal the remaining 24 cards to the stockpile
Initialize the tableau arrays as completely filled with "?" to symbolize hidden cards
  If I wanna get fancy, I could set up a for iterator loop, filling each tableau with i "?"s

Set aside remaining deck into the stockpile

        How do I want to implement hiding cards?



When the stockpile is clicked, the top 3 cards are placed onto the waste pile, if there are fewer than 3 cards in the stockpile, add the last card to the stockpile
If the empty stockpile is clicked, move all cards from the waste pile to the stockpile in reverse order
Only a max of the top 3 wastepile cards are visible at any time




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

If the top card of a tableau is hidden, reveal it
Deal all cards as hidden, then reveal the last index of each, keeping track of which cards are hidden by some other measure
Maybe set aside a separate array of remaining cards, replacing the top "?"s in the array with a card from it, 
something like, if the top index of this array is a ?, replace it with a card from the hiddenCards array.


At the end of every move function, increment the move counter by 1 and check for a winner,
if all ace piles have 13 as the top card, the player wins and is prompted to play again.

When rendering:
  If the top card of any tableau is a "?", then move a card from hiddenCards to that slot
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

