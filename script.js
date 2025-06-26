document.addEventListener('DOMContentLoaded', () => {
  // Game variables
  let deck = [];
  let playerCards = [];
  let dealerCards = [];
  let playerScore = 0;
  let dealerScore = 0;
  let balance = 100;
  let currentBet = 0;
  let gameOver = false; // Flag to track if the game is over

  // Sound effects
  const buttonClickSound = new Audio('sounds/button-click.mp3');
  const winSound = new Audio('sounds/win.mp3');
  const loseSound = new Audio('sounds/lose.mp3');

  // Initialize game
  function initializeGame() {
    deck = createDeck();
    shuffleDeck(deck);
    playerCards = [];
    dealerCards = [];
    playerScore = 0;
    dealerScore = 0;
    gameOver = false; // Reset gameOver flag
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-score').textContent = 'Score: 0';
    document.getElementById('dealer-score').textContent = 'Score: 0';
    document.getElementById('result').textContent = '';
    currentBet = 0;
    updateBalanceUI();
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

  // Update balance UI
  function updateBalanceUI() {
    document.getElementById('balance').textContent = `Balance: $${balance}`;
  }

  // Update result and handle bets
  function updateResult(message, playerWins) {
    document.getElementById('result').textContent = message;
    gameOver = true; // Set gameOver flag to true
    if (playerWins) {
      balance += currentBet * 2;
      winSound.play(); // Play win sound
    } else {
      loseSound.play(); // Play lose sound
    }
    currentBet = 0;
    updateBalanceUI();
  }

  // Place bet
  document.getElementById('place-bet').addEventListener('click', () => {
    if (gameOver) {
      document.getElementById('result').textContent = 'Game over! Please restart.';
      return;
    }
    buttonClickSound.play(); // Play button click sound
    const betInput = document.getElementById('bet-amount');
    const betValue = parseInt(betInput.value);
    if (betValue > 0 && betValue <= balance) {
      currentBet = betValue;
      balance -= currentBet;
      updateBalanceUI();
      betInput.value = '';
      document.getElementById('result').textContent = `Bet placed: $${currentBet}`;
    } else {
      document.getElementById('result').textContent = 'Invalid bet amount!';
    }
  });

  // Player actions
  document.getElementById('hit').addEventListener('click', () => {
    if (gameOver) {
      document.getElementById('result').textContent = 'Game over! Please restart.';
      return;
    }
    buttonClickSound.play(); // Play button click sound
    if (currentBet === 0) {
      document.getElementById('result').textContent = 'You must place a bet first!';
      return;
    }
    playerCards.push(drawCard());
    updateUI();
    if (playerScore > 21) {
      updateResult('Player Busts! Dealer Wins!', false);
    }
  });

  document.getElementById('stand').addEventListener('click', () => {
    if (gameOver) {
      document.getElementById('result').textContent = 'Game over! Please restart.';
      return;
    }
    buttonClickSound.play(); // Play button click sound
    if (currentBet === 0) {
      document.getElementById('result').textContent = 'You must place a bet first!';
      return;
    }
    while (dealerScore < 17) {
      dealerCards.push(drawCard());
      updateUI();
    }
    if (dealerScore > 21) {
      updateResult('Dealer Busts! Player Wins!', true);
    } else if (playerScore > dealerScore) {
      updateResult('Player Wins!', true);
    } else if (playerScore < dealerScore) {
      updateResult('Dealer Wins!', false);
    } else {
      updateResult('It\'s a Tie!', false);
    }
  });

  document.getElementById('restart').addEventListener('click', () => {
    buttonClickSound.play(); // Play button click sound
    initializeGame();
  });

  // Start game
  initializeGame();
});