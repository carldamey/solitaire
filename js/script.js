	/*----- constants -----*/
  const SUITS = ["c", "d", "h", "s"]
  const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

	/*----- state variables -----*/
  let deck, tableau, stockPile, wastePile, acePiles, selectedLocation, selectedCard, targetCard, winState

	/*----- cached elements  -----*/
  const cardsDiv = document.getElementById("cards")
  const tableauDiv = document.getElementById("tableau")
  const gameDiv = document.getElementById("game")
  const columnDivArr = [document.getElementById("col0"), document.getElementById("col1"), document.getElementById("col2"), document.getElementById("col3"), document.getElementById("col4"), document.getElementById("col5"), document.getElementById("col6"),]
  const aceDivArr = [document.getElementById("ace0"), document.getElementById("ace1"), document.getElementById("ace2"), document.getElementById("ace3"),]
  const stockPileDiv = document.getElementById("stock-pile")
  const wastePileDiv = document.getElementById("waste-pile")
  const resetButton = document.getElementById("reset-button")

	/*----- event listeners -----*/
gameDiv.addEventListener("click", event => selectCard(event))
stockPileDiv.addEventListener("click", draw)
resetButton.addEventListener("click", init)

	/*----- functions -----*/
init()

function init() {
  winstate = false
  deck = []; tableau = [[], [], [], [], [], [], []]; stockPile = []; wastePile = []; acePiles = [[], [], [], [],]
  // Fill the deck array with card objects
  for (let suit in SUITS) {
    for (let i = 0; i <=12; i++) {
      SUITS[suit] === "c" || SUITS[suit] === "s" ? color = "black" : color = "red"
      deck.push({suit: SUITS[suit], rank: RANKS[i], color,})
      // Add card element to the DOM
      const cardEl = document.createElement("div")
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
    if (column.length > 0 && column[column.length - 1].suit === "x") {
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
  render()
}

function move(selectedCard, targetCard) {
  if (selectedCard !== targetCard) {
    console.log("not same card")
    if (selectedCard.location === tableau) {
      // Stack from Tableau to Tableau
      console.log(selectedCard.color, targetCard.color)
      if (selectedCard.rank > 1 && selectedCard.color !== targetCard.color && selectedCard.rank === targetCard.rank -1) {
        tableau[targetCard.arrIdx].push(...tableau[selectedCard.arrIdx].splice(selectedCard.cardIdx))
      }
      // King from Tableau to Empty Column
      else if (selectedCard.rank === 13 && tableau[targetCard.arrIdx].length === 0) {
        console.log("tab king move")
        tableau[targetCard.arrIdx].push(...tableau[selectedCard.arrIdx].splice(selectedCard.cardIdx))
      }
      // Card from Tableau to Ace Pile
      else if (targetCard.location === acePiles && (acePiles[targetCard.arrIdx].length === 0 && selectedCard.rank === 1) || (targetCard.rank === selectedCard.rank - 1 && targetCard.suit === selectedCard.suit)){
        acePiles[targetCard.arrIdx].push(tableau[selectedCard.arrIdx][selectedCard.cardIdx])
        tableau[selectedCard.arrIdx].pop()

      }
    } else if (selectedCard.location === acePiles) {
      // Ace from Ace Pile to Blank Ace Pile
      if (selectedCard.rank === 1 && acePiles[targetCard.arrIdx].length === 0) {
        acePiles[targetCard.arrIdx].push(acePiles[selectedCard.arrIdx][0])
        acePiles[selectedCard.arrIdx].pop()
      }
       // Non-Ace from Ace Pile to Tableau
      else if (selectedCard.rank > 1 && targetCard.location === tableau && selectedCard.color !== targetCard.color && selectedCard.rank === targetCard.rank - 1) {
        tableau[targetCard.arrIdx].push(acePiles[selectedCard.arrIdx][acePiles[selectedCard.arrIdx].length - 1])
        acePiles[selectedCard.arrIdx].pop()
      }
    } else if (selectedCard.location === wastePile) {
      // Non-Ace Card from Waste to Tableau
      if (wastePile[0].rank > 1 && targetCard.location === tableau && targetCard.rank === wastePile[0].rank + 1 && targetCard.color !== wastePile[0].color) {
        tableau[targetCard.arrIdx].push(wastePile[0])
        wastePile.shift()
      }
      // Card from Waste Pile to Ace Pile
      else if (targetCard.location === acePiles && (wastePile[0].rank === 1 && acePiles[targetCard.arrIdx].length === 0) || (targetCard.rank === wastePile[0].rank - 1 && targetCard.suit === wastePile[0].suit)) {
        acePiles[targetCard.arrIdx].push(wastePile[0])
        wastePile.shift()
      }
      // King from Waste Pile to Blank Column
      else if (wastePile[0].rank === 13 && tableau[targetCard.arrIdx].length === 0) {
        tableau[targetCard.arrIdx].push(wastePile[0])
        wastePile.shift()
    }
  }
  revealCards()
  render()
  checkWin()
  }
}

function selectCard(event) {
  // Identify which arrays cards are being interacted with from
  if (event.target.parentNode.parentNode.id === "tableau") {
    selectedLocation = tableau
    arrIdx = event.target.parentNode.id[3]
  }
  if (event.target.parentNode.parentNode.id === "ace-piles") {
    selectedLocation = acePiles
    arrIdx = event.target.parentNode.id[3]
  }
  else if (event.target.id === "waste-pile") {
    arrIdx = 0
    selectedLocation = wastePile
  }

  if (!selectedCard && event.target.classList.contains("card") && !event.target.classList.contains("xx") && !event.target.classList.contains("outline") && event.target.id !== "stock-pile") {
    selectedCard = {
      location: selectedLocation,
      arrIdx: event.target.parentNode.id[3],
      cardIdx: Array.from(event.target.parentNode.children).indexOf(event.target),
      suit: event.target.id[0],
      rank: parseInt(event.target.id[1]),
    }
    if (selectedCard.suit === "c" || selectedCard.suit === "s") selectedCard.color = "black"
    else selectedCard.color = "red"
    if (event.target.id.length === 3) selectedCard.rank = parseInt(event.target.id[1] + event.target.id[2])
  } else if (selectedCard && !targetCard && event.target.classList.contains("card") && !event.target.classList.contains("xx") && !event.target.parentNode.classList.contains("draw-piles")) {
    targetCard = {
      location: selectedLocation,
      arrIdx: event.target.parentNode.id[3],
      cardIdx: Array.from(event.target.parentNode.children).indexOf(event.target),
      suit: event.target.id[0],
      rank: parseInt(event.target.id[1]),
    }
    if (targetCard.suit === "c" || targetCard.suit === "s") targetCard.color = "black"
    else targetCard.color = "red"
    if (event.target.id.length === 3) targetCard.rank = parseInt(event.target.id[1] + event.target.id[2])
  }
  if (selectedCard && targetCard) {
    move(selectedCard, targetCard)
    selectedCard = null
    targetCard = null
  }
  }
  // console.log(`selected: ${selectedCard.suit + selectedCard.rank}, target: ${targetCard.suit + targetCard.rank}`)
// }

function render() {
  // Render Ace Piles
  aceDivArr.forEach(aceDiv => aceDiv.innerHTML = "")
  acePiles.forEach(acePile => {
    const newCardEl = document.createElement("div")
    if (acePile.length === 0) newCardEl.classList.add("card", "large", "outline")
    else if (acePile.length > 0) {
    newCardEl.classList.add("card", "large", `${acePile[acePile.length - 1].suit}${acePile[acePile.length - 1].rank}`)
    newCardEl.id = `${acePile[acePile.length - 1].suit}${acePile[acePile.length - 1].rank}`
}
    console.log(acePile)
    aceDivArr[acePiles.indexOf(acePile)].appendChild(newCardEl)
  })
  // Render tableau
  columnDivArr.forEach(columnDiv => columnDiv.innerHTML = "")
  tableau.forEach(column => {
    if (column.length === 0) {
      const newCardEl = document.createElement("div")
      newCardEl.classList.add("card", "large", "outline")
      columnDivArr[tableau.indexOf(column)].appendChild(newCardEl)
    } else column.forEach(card => {
      const newCardEl = document.createElement("div")
      newCardEl.classList.add("card", "large", `${card.suit}${card.rank}`)
      newCardEl.id = `${card.suit}${card.rank}`
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

function checkWin() {
  if (acePiles.every(acePile => acePile.length === 13)) winState = true
}



// TODO check that project meets tech specs
// TODO change comparison for selected and target card in move function, they're reference types
// TODO win message
// TODO highlight selection

// TODO clean formatting and remove vestigial comments
// TODO delete console logs when finished
// TODO remove cards div if unused
// TODO update README.md (keep original pitch)
// TODO check indentation & formatting
/* TODO script.js:105 Uncaught TypeError: Cannot read properties of undefined (reading 'length')
    at move (script.js:105:66)
    at selectCard (script.js:176:5)
    at HTMLDivElement.<anonymous> (script.js:19:44) */

// TODO ace pile css border discrepancy
// TODO add rules page link to top bar
// TODO add ability to see top 3 waste pile cards
// TODO change anon. function from card selection to named function
// TODO implement move counter
// TODO implement timer
// TODO fonts + fallback
// TODO gradients everywhere (including moz and fallback color)
// TODO consider moving card reveal to its own function instead of being expressed in move function
// TODO change card size according to screen size
// TODO add sound
// TODO add score, the amount of moves multiplied by something like 30 minutes minus the games time, capping out at 0, input high scores with mongoDB later on
// TODO make hover only gray and select glow yellow
// TODO make selections flash red if invalid

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

