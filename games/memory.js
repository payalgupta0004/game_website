// Memory Matching Game Logic

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameTimer = 0;
let timerInterval = null;
let currentDifficulty = 'easy';
let gameActive = false;

const difficultySettings = {
    easy: { pairs: 4, gridCols: 4 },
    medium: { pairs: 6, gridCols: 4 },
    hard: { pairs: 8, gridCols: 4 }
};

document.addEventListener('DOMContentLoaded', function() {
    // Difficulty selector
    document.querySelectorAll('[data-difficulty]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-difficulty]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentDifficulty = this.dataset.difficulty;
            startNewGame();
        });
    });

    document.getElementById('restartBtn').addEventListener('click', startNewGame);
    startNewGame();
});

async function startNewGame() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const gridEl = document.getElementById('memoryGrid');
    const completeEl = document.getElementById('gameComplete');

    // Reset game state
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameTimer = 0;
    gameActive = false;
    stopTimer();

    // Reset UI
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    gridEl.style.display = 'none';
    completeEl.style.display = 'none';
    gridEl.innerHTML = '';
    updateStats();

    const settings = difficultySettings[currentDifficulty];
    const numPairs = settings.pairs;

    try {
        // Fetch images
        const images = await fetchMultipleImages(numPairs, 'nature', 400, 400);
        
        // Create card pairs
        const cardData = [];
        images.forEach((img, index) => {
            cardData.push({ id: index * 2, image: img, pairId: index });
            cardData.push({ id: index * 2 + 1, image: img, pairId: index });
        });

        // Shuffle cards
        cards = shuffleArray(cardData);

        // Create grid
        gridEl.style.gridTemplateColumns = `repeat(${settings.gridCols}, 1fr)`;
        
        cards.forEach(card => {
            const cardEl = createCardElement(card);
            gridEl.appendChild(cardEl);
        });

        loadingEl.style.display = 'none';
        gridEl.style.display = 'grid';
        gameActive = true;
        startTimer();
        playSound('click');
    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.textContent = 'Failed to load images. Please try again.';
        errorEl.style.display = 'block';
        console.error('Error loading images:', error);
    }
}

function createCardElement(card) {
    const cardEl = document.createElement('div');
    cardEl.className = 'memory-card';
    cardEl.dataset.cardId = card.id;
    cardEl.dataset.pairId = card.pairId;

    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.textContent = '?';

    const cardFront = document.createElement('img');
    cardFront.src = card.image;
    cardFront.style.display = 'none';

    cardEl.appendChild(cardBack);
    cardEl.appendChild(cardFront);

    cardEl.addEventListener('click', () => flipCard(cardEl));

    return cardEl;
}

function flipCard(cardEl) {
    if (!gameActive) return;
    
    // Don't flip if already flipped or matched
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) {
        return;
    }

    // Don't flip if two cards are already flipped
    if (flippedCards.length >= 2) {
        return;
    }

    // Flip the card
    cardEl.classList.add('flipped');
    const cardBack = cardEl.querySelector('.card-back');
    const cardFront = cardEl.querySelector('img');
    cardBack.style.display = 'none';
    cardFront.style.display = 'block';
    
    flippedCards.push(cardEl);
    playSound('click');

    // Check for match when two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        updateStats();
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const pairId1 = card1.dataset.pairId;
    const pairId2 = card2.dataset.pairId;

    if (pairId1 === pairId2) {
        // Match found!
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            flippedCards = [];
            matchedPairs++;
            playSound('success');
            updateStats();

            // Check if game is complete
            const settings = difficultySettings[currentDifficulty];
            if (matchedPairs === settings.pairs) {
                gameComplete();
            }
        }, 500);
    } else {
        // No match - flip back
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            const cardBack1 = card1.querySelector('.card-back');
            const cardFront1 = card1.querySelector('img');
            const cardBack2 = card2.querySelector('.card-back');
            const cardFront2 = card2.querySelector('img');
            
            cardBack1.style.display = 'flex';
            cardFront1.style.display = 'none';
            cardBack2.style.display = 'flex';
            cardFront2.style.display = 'none';
            
            flippedCards = [];
            playSound('error');
        }, 1000);
    }
}

function gameComplete() {
    gameActive = false;
    stopTimer();
    
    const gridEl = document.getElementById('memoryGrid');
    const completeEl = document.getElementById('gameComplete');
    const finalStats = document.getElementById('finalStats');
    
    const settings = difficultySettings[currentDifficulty];
    const score = Math.max(0, 1000 - (moves * 10) - (gameTimer * 2));
    
    finalStats.innerHTML = `
        <p><strong>Moves:</strong> ${moves}</p>
        <p><strong>Time:</strong> ${gameTimer} seconds</p>
        <p><strong>Score:</strong> ${score} points</p>
    `;
    
    gridEl.style.display = 'none';
    completeEl.style.display = 'block';
    
    // Save score
    saveScore('Memory Matching', score, gameTimer);
    
    playSound('success');
}

function startTimer() {
    gameTimer = 0;
    updateTimer();
    
    timerInterval = setInterval(() => {
        gameTimer++;
        updateTimer();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimer() {
    document.getElementById('timer').textContent = gameTimer;
}

function updateStats() {
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').textContent = matchedPairs;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

