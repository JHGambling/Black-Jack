// Game variables
let deck = [];
let playerCards = [];
let dealerCards = [];
let playerScore = 0;
let dealerScore = 0;

// Initialize game
function initializeGame() {
  deck = createDeck();
  console.log(deck);
  shuffleDeck(deck);
  playerCards = [];
  dealerCards = [];
  playerScore = 0;
  dealerScore = 0;
  document.getElementById('player-cards').innerHTML = '';
  document.getElementById('dealer-cards').innerHTML = '';
  document.getElementById('player-score').textContent = 'Score: 0';
  document.getElementById('dealer-score').textContent = 'Score: 0';
  document.getElementById('result').textContent = '';
  dealInitialCards();
}

// Create deck
function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

// Shuffle deck
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Deal initial cards
function dealInitialCards() {
  playerCards.push(drawCard());
  playerCards.push(drawCard());
  dealerCards.push(drawCard());
  updateUI();
}

// Draw a card
function drawCard() {
  return deck.pop();
}

// Calculate score
function calculateScore(cards) {
  let score = 0;
  let aceCount = 0;
  for (let card of cards) {
    if (['J', 'Q', 'K'].includes(card.value)) {
      score += 10;
    } else if (card.value === 'A') {
      score += 11;
      aceCount++;
    } else {
      score += parseInt(card.value);
    }
  }
  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }
  return score;
}

// Update UI
function updateUI() {
  document.getElementById('player-cards').innerHTML = playerCards.map(card => `<div>${card.value}${card.suit}</div>`).join('');
  document.getElementById('dealer-cards').innerHTML = dealerCards.map(card => `<div>${card.value}${card.suit}</div>`).join('');
  playerScore = calculateScore(playerCards);
  dealerScore = calculateScore(dealerCards);
  document.getElementById('player-score').textContent = `Score: ${playerScore}`;
  document.getElementById('dealer-score').textContent = `Score: ${dealerScore}`;
}

// Player actions
document.getElementById('hit').addEventListener('click', () => {
  playerCards.push(drawCard());
  updateUI();
  if (playerScore > 21) {
    document.getElementById('result').textContent = 'Player Busts! Dealer Wins!';
  }
});

document.getElementById('stand').addEventListener('click', () => {
  while (dealerScore < 17) {
    dealerCards.push(drawCard());
    updateUI();
  }
  if (dealerScore > 21) {
    document.getElementById('result').textContent = 'Dealer Busts! Player Wins!';
  } else if (playerScore > dealerScore) {
    document.getElementById('result').textContent = 'Player Wins!';
  } else if (playerScore < dealerScore) {
    document.getElementById('result').textContent = 'Dealer Wins!';
  } else {
    document.getElementById('result').textContent = 'It\'s a Tie!';
  }
});

document.getElementById('restart').addEventListener('click', initializeGame);

// Start game
initializeGame();