// Image Guessing Game Logic

let currentScore = 0;
let currentRound = 1;
let timeLeft = 30;
let timerInterval = null;
let currentImageUrl = '';
let currentAnswer = '';
let gameActive = false;

// Categories for image guessing
const categories = [
    { query: 'animal', answers: ['animal', 'dog', 'cat', 'bird', 'horse', 'elephant', 'lion', 'tiger', 'bear', 'deer'] },
    { query: 'nature', answers: ['nature', 'landscape', 'mountain', 'forest', 'tree', 'lake', 'river', 'ocean', 'beach', 'sunset'] },
    { query: 'food', answers: ['food', 'pizza', 'burger', 'cake', 'fruit', 'vegetable', 'bread', 'pasta', 'sushi', 'salad'] },
    { query: 'building', answers: ['building', 'house', 'architecture', 'skyscraper', 'tower', 'bridge', 'church', 'castle', 'monument'] },
    { query: 'vehicle', answers: ['vehicle', 'car', 'truck', 'bike', 'motorcycle', 'bus', 'train', 'airplane', 'boat', 'ship'] }
];

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    loadNewImage();
    
    document.getElementById('submitGuess').addEventListener('click', checkGuess);
    document.getElementById('guessInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkGuess();
        }
    });
    document.getElementById('nextImage').addEventListener('click', loadNewImage);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    document.getElementById('hintBtn').addEventListener('click', showHint);
});

async function loadNewImage() {
    const loadingEl = document.getElementById('loading');
    const gameContentEl = document.getElementById('gameContent');
    const errorEl = document.getElementById('error');
    const imageEl = document.getElementById('gameImage');
    const guessInput = document.getElementById('guessInput');
    const feedbackEl = document.getElementById('feedback');
    const hintText = document.getElementById('hintText');

    // Reset UI
    loadingEl.style.display = 'block';
    gameContentEl.style.display = 'none';
    errorEl.style.display = 'none';
    feedbackEl.style.display = 'none';
    hintText.style.display = 'none';
    guessInput.value = '';
    guessInput.disabled = false;
    gameActive = false;

    // Select random category
    const category = categories[Math.floor(Math.random() * categories.length)];
    currentAnswer = category.answers[0]; // Use the main category as answer
    
    try {
        // Fetch random image
        currentImageUrl = await fetchRandomImage(category.query, 800, 600);
        
        // Preload image
        const img = new Image();
        img.onload = function() {
            imageEl.src = currentImageUrl;
            imageEl.alt = `Image related to ${category.query}`;
            loadingEl.style.display = 'none';
            gameContentEl.style.display = 'block';
            gameActive = true;
            startTimer();
        };
        img.onerror = function() {
            throw new Error('Failed to load image');
        };
        img.src = currentImageUrl;
    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.textContent = 'Failed to load image. Please try again.';
        errorEl.style.display = 'block';
        console.error('Error loading image:', error);
    }
}

function checkGuess() {
    if (!gameActive) return;

    const guessInput = document.getElementById('guessInput');
    const feedbackEl = document.getElementById('feedback');
    const userGuess = guessInput.value.toLowerCase().trim();

    if (!userGuess) {
        return;
    }

    // Get current category answers
    const category = categories.find(cat => 
        cat.answers.some(ans => currentAnswer.toLowerCase().includes(ans) || ans.includes(currentAnswer.toLowerCase()))
    ) || categories[0];
    
    const isCorrect = category.answers.some(answer => 
        userGuess.includes(answer.toLowerCase()) || answer.toLowerCase().includes(userGuess)
    );

    feedbackEl.style.display = 'block';
    guessInput.disabled = true;
    gameActive = false;
    stopTimer();

    if (isCorrect) {
        feedbackEl.className = 'feedback correct';
        feedbackEl.textContent = '🎉 Correct! Well done!';
        playSound('success');
        currentScore += 10;
        currentRound++;
        updateStats();
        
        // Auto-advance after 2 seconds
        setTimeout(() => {
            loadNewImage();
        }, 2000);
    } else {
        feedbackEl.className = 'feedback incorrect';
        feedbackEl.textContent = `❌ Not quite! The answer was related to "${currentAnswer}". Try again!`;
        playSound('error');
        
        // Allow retry
        setTimeout(() => {
            guessInput.disabled = false;
            gameActive = true;
            startTimer();
        }, 2000);
    }
}

function showHint() {
    const hintText = document.getElementById('hintText');
    const category = categories.find(cat => 
        cat.answers.some(ans => currentAnswer.toLowerCase().includes(ans) || ans.includes(currentAnswer.toLowerCase()))
    ) || categories[0];
    
    hintText.textContent = `💡 Hint: The image is related to "${category.query}"`;
    hintText.style.display = 'block';
    playSound('click');
}

function startTimer() {
    timeLeft = 30;
    updateTimer();
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            stopTimer();
            timeUp();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimer() {
    document.getElementById('timer').textContent = timeLeft;
}

function timeUp() {
    if (!gameActive) return;
    
    gameActive = false;
    const feedbackEl = document.getElementById('feedback');
    const guessInput = document.getElementById('guessInput');
    
    feedbackEl.style.display = 'block';
    feedbackEl.className = 'feedback incorrect';
    feedbackEl.textContent = `⏰ Time's up! The answer was related to "${currentAnswer}".`;
    guessInput.disabled = true;
    playSound('error');
    
    setTimeout(() => {
        loadNewImage();
    }, 2000);
}

function updateStats() {
    document.getElementById('score').textContent = currentScore;
    document.getElementById('round').textContent = currentRound;
}

function restartGame() {
    stopTimer();
    currentScore = 0;
    currentRound = 1;
    timeLeft = 30;
    updateStats();
    updateTimer();
    loadNewImage();
    playSound('click');
}

// Save score when leaving
window.addEventListener('beforeunload', function() {
    if (currentScore > 0) {
        saveScore('Image Guessing', currentScore, 30 - timeLeft);
    }
});

