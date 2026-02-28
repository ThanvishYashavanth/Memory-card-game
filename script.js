const matchIcons = ['🍎', '🍌', '🍇', '🍓', '🍍', '🥝', '🍒', '🍉'];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let timer = 0;
let timerInterval = null;
let bestScore = null; // <-- SESSION ONLY, RESETS ON REFRESH

const grid = document.getElementById('gameGrid');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const overlay = document.getElementById('winOverlay');
const newGameBtn = document.getElementById('newGameBtn');
const finalScoreEl = document.getElementById('finalScore');
const bestScoreEl = document.getElementById('bestScore');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timeEl.textContent = timer;
  timerInterval = setInterval(() => {
    timer++;
    timeEl.textContent = timer;
  }, 1000);
}

function createCard(icon) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.icon = icon;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        <img src="Card-Back.jpeg" alt="Card-Back">
      </div>
      <div class="card-back">${icon}</div>
    </div>
  `;

  card.addEventListener('click', () => handleCardClick(card));
  return card;
}

function handleCardClick(card) {
  if (lockBoard || card === firstCard || card.classList.contains('matched')) return;

  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesEl.textContent = moves;

  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

  if (isMatch) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    resetSelection();

    if (matchedPairs === matchIcons.length) {
      clearInterval(timerInterval);
      showWinScreen();
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetSelection();
    }, 800);
  }
}

function resetSelection() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function calculateScore() {
  return moves * 10 + timer;
}

function showWinScreen() {
  const currentScore = calculateScore();
  finalScoreEl.textContent = currentScore;

  if (bestScore === null || currentScore < bestScore) {
    bestScore = currentScore;
  }

  bestScoreEl.textContent = bestScore;
  overlay.classList.remove('hidden');
}

function startGame() {
  grid.innerHTML = '';
  overlay.classList.add('hidden');
  moves = 0;
  matchedPairs = 0;
  movesEl.textContent = 0;

  const cards = [...matchIcons, ...matchIcons];
  shuffle(cards);

  cards.forEach(icon => grid.appendChild(createCard(icon)));
  startTimer();
}

newGameBtn.addEventListener('click', startGame);
startGame();






