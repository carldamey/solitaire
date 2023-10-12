	/*----- constants -----*/
  const SUITS = ["c", "d", "h", "s"]
  const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

	/*----- state variables -----*/
  let deck, tableau, stockPile, wastePile, acePiles, selectedCard, targetCard, selectedLocation, selectedColIdx

	/*----- cached elements  -----*/
  const cardsDiv = document.getElementById("cards")
  const tableauDiv = document.getElementById("tableau")
  const gameDiv = document.getElementById("game")
  const columnDivArr = [document.getElementById("col0"), document.getElementById("col1"), document.getElementById("col2"), document.getElementById("col3"), document.getElementById("col4"), document.getElementById("col5"), document.getElementById("col6"),]
  const aceDivArr = [document.getElementById("ace0"), document.getElementById("ace1"), document.getElementById("ace2"), document.getElementById("ace3"),]
  const stockPileDiv = document.getElementById("stock-pile")
  const wastePileDiv = document.getElementById("waste-pile")

	/*----- event listeners -----*/
gameDiv.addEventListener("click", event => selectCard(event))
stockPileDiv.addEventListener("click", draw)

	/*----- functions -----*/
init()

function init() {
  deck = []; tableau = [[], [], [], [], [], [], []]; stockPile = []; wastePile = []; acePiles = [[], [], [], [],]

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
    while (tableau[i].length < i + 1) tableau[i].push({suit: "x", rank: "x"})
  }

  // Move 24 cards to the stockpile, leaving the remaining 28 to pull from when revealing cards
  for (let i = 0; i < 24; i++) {
    const stockCard = deck[0]
    deck.shift()
    stockPile.push(stockCard)
  }
  revealCards()
  render()
}
function revealCards() {
  tableau.forEach(column => {
    if (column[column.length - 1].suit === "x") {
      const revealedCard = deck[0]
      deck.shift()
      column[column.length - 1] = revealedCard
    }
  })
}

function move() {
  if (selectedCard === targetCard) return
  else if (selectedLocation === tableau) {
    if (selectedCard.rank > 1 && selectedCard.color !== targetCard.color && targetCard.rank === selectedCard.rank + 1) {
      tableau[selectedColIdx].push(selectedCard)
    }
  }
  
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
  render()
}

function selectCard(event) {
  // Identify which arrays cards are being interacted with from
  if (event.target.parentNode.parentNode.id === "tableau") {
    selectedLocation = tableau
    selectedColIdx = event.target.parentNode.id[event.target.parentNode.id.length -1]
    console.log(selectedColIdx)
  }
  if (selectedLocationId === "ace-piles") selectedLocation = acePiles
  else if (event.target.id === "waste-pile") selectedLocation = wastePile
  console.log(selectedLocation)




  // Check if the card is valid for selection
  if (!selectedCard && event.target.classList.contains("card") && !event.target.classList.contains("xx") && !event.target.classList.contains("outline")) {
    const colIdx = event.target.parentNode.id[3]
    const cardIdx = Array.from(event.target.parentNode.children).indexOf(event.target)
    selectedCard = selectedLocation[colIdx][cardIdx]



  } else if (selectedCard && event.target.classList.contains("card") && !event.target.classList.contains("xx")) {
    const colIdx = event.target.parentNode.id[3]
    const cardIdx = Array.from(event.target.parentNode.children).indexOf(event.target)
    targetCard = selectedLocation[colIdx][cardIdx]
    //check the locations of both target and selected, tableau, waste pile, ace pile, etc, maybe store in a variable for simplicity
  }
  console.log(`selected: ${selectedCard.suit + selectedCard.rank}, target: ${targetCard.suit + targetCard.rank}`)
}

function render() {
  // Render Ace Piles
  aceDivArr.forEach(aceDiv => aceDiv.innerHTML = "")
  acePiles.forEach(acePile => {
    const newCardEl = document.createElement("div")
    if (acePile.length === 0) newCardEl.classList.add("card", "large", "outline")
    else if (acePile.length > 0) newCardEl.classList.add("card", "large", `${acePile[acePile.length - 1].suit}${acePile[acePile.length - 1].rank}`)
    aceDivArr[acePiles.indexOf(acePile)].appendChild(newCardEl)
  })
  // Render tableau
  columnDivArr.forEach(columnDiv => columnDiv.innerHTML = "")
  tableau.forEach(column => {
    column.forEach(card => {
      const newCardEl = document.createElement("div")
      newCardEl.classList.add("card", "large", `${card.suit}${card.rank}`)
      columnDivArr[tableau.indexOf(column)].appendChild(newCardEl)
    })
  })
  // Render Stock Pile
  stockPileDiv.classList.remove("outline", "xx")
  if (stockPile.length === 0) stockPileDiv.classList.add("outline")
  else if (stockPile.length > 0) stockPileDiv.classList.add("xx")

  // Render Waste Pile
  wastePileDiv.className = "card xlarge"
  if (wastePile.length === 0) wastePileDiv.classList.add("outline")
  else if (wastePile.length > 0) wastePileDiv.classList.add(`${wastePile[0].suit}${wastePile[0].rank}`)
}



// TODO king transfer
// TODO card transfer 
// TODO recursive card transfer
// TODO ace pile functionality
// TODO ace swap locations
// TODO win condition
// TODO remove cards div if unused
// TODO fix bug with stock and waste pile lengths
// TODO clean formatting and remove vestigial comments
// TODO delete console logs when finished
// TODO update README.md (keep original pitch)
// TODO check that project meets tech specs
// TODO clean css outlines
// TODO implement reset button

// TODO add rules page link to top bar
// TODO give outline to empty tableau columns
// TODO add ability to see top 3 waste pile cards
// TODO change anon. function from card selection to named function
// TODO implement move counter
// TODO implement timer
// TODO fonts + fallback
// TODO gradients everywhere (including moz and fallback color)
// TODO consider moving card reveal to its own function instead of being expressed in move function
// TODO change card size according to screen size
// TODO add rules
// TODO add sound
// TODO add score, the amount of moves multiplied by something like 30 minutes minus the games time, capping out at 0, input high scores with mongoDB later on


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

