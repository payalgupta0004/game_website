// Spot the Difference Game Logic

let differences = [];
let foundDifferences = [];
let gameTimer = 0;
let timerInterval = null;
let gameActive = false;
let baseImage = null;
let modifiedImage = null;
let totalDifferences = 5;
let score = 0;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('restartBtn').addEventListener('click', startNewGame);
    startNewGame();
});

async function startNewGame() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const gameContentEl = document.getElementById('gameContent');
    const completeEl = document.getElementById('gameComplete');
    const image1El = document.getElementById('image1');
    const image2El = document.getElementById('image2');
    const image1Wrapper = document.getElementById('image1Wrapper');
    const image2Wrapper = document.getElementById('image2Wrapper');

    // Reset game state
    differences = [];
    foundDifferences = [];
    gameTimer = 0;
    gameActive = false;
    score = 0;
    stopTimer();

    // Clear existing markers
    document.querySelectorAll('.difference-marker').forEach(marker => marker.remove());

    // Reset UI
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    gameContentEl.style.display = 'none';
    completeEl.style.display = 'none';
    updateStats();

    try {
        // Fetch base image
        const imageUrl = await fetchRandomImage('nature', 800, 600);
        
        // Preload image
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Allow canvas manipulation
        img.onload = async function() {
            baseImage = imageUrl;
            image1El.src = baseImage;
            
            // Create modified image with differences
            try {
                const modifiedImageUrl = await generateDifferences(img);
                image2El.src = modifiedImageUrl;
                
                loadingEl.style.display = 'none';
                gameContentEl.style.display = 'grid';
                gameActive = true;
                startTimer();
                
                // Add click listeners
                image1Wrapper.addEventListener('click', handleImageClick);
                image2Wrapper.addEventListener('click', handleImageClick);
            } catch (error) {
                console.error('Error generating differences:', error);
                loadingEl.style.display = 'none';
                errorEl.textContent = 'Failed to process image. Please try again.';
                errorEl.style.display = 'block';
            }
        };
        img.onerror = function() {
            throw new Error('Failed to load image');
        };
        img.src = imageUrl;
    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.textContent = 'Failed to load image. Please try again.';
        errorEl.style.display = 'block';
        console.error('Error loading image:', error);
    }
}

async function generateDifferences(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth || 800;
    canvas.height = img.naturalHeight || 600;
    
    // Draw the original image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Generate 5 random differences
    const imageWidth = canvas.width;
    const imageHeight = canvas.height;
    
    for (let i = 0; i < totalDifferences; i++) {
        const x = Math.random() * (imageWidth - 50) + 25;
        const y = Math.random() * (imageHeight - 50) + 25;
        const size = 20 + Math.random() * 30;
        
        // Create a visual difference (colored circle)
        ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a border for better visibility
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Store difference location (normalized to 0-1 for responsive positioning)
        differences.push({
            x: x / imageWidth,
            y: y / imageHeight,
            size: size,
            id: i
        });
    }
    
    // Return the modified image as data URL
    return canvas.toDataURL();
}

function handleImageClick(e) {
    if (!gameActive) return;
    
    const wrapper = e.currentTarget;
    const image = wrapper.querySelector('img');
    const rect = image.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Check if click is near any difference
    const threshold = 0.05; // 5% of image size
    
    for (const diff of differences) {
        if (foundDifferences.includes(diff.id)) continue;
        
        const distance = Math.sqrt(
            Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2)
        );
        
        if (distance < threshold) {
            // Found a difference!
            markDifference(wrapper, diff);
            foundDifferences.push(diff.id);
            score += 100;
            playSound('success');
            updateStats();
            
            // Check if all differences found
            if (foundDifferences.length === totalDifferences) {
                gameComplete();
            }
            return;
        }
    }
    
    // Wrong click
    playSound('error');
}

function markDifference(wrapper, diff) {
    const marker = document.createElement('div');
    marker.className = 'difference-marker found';
    marker.style.left = `${diff.x * 100}%`;
    marker.style.top = `${diff.y * 100}%`;
    wrapper.appendChild(marker);
    
    // Also mark on the other image
    const otherWrapper = wrapper.id === 'image1Wrapper' 
        ? document.getElementById('image2Wrapper')
        : document.getElementById('image1Wrapper');
    const otherMarker = marker.cloneNode(true);
    otherWrapper.appendChild(otherMarker);
}

function gameComplete() {
    gameActive = false;
    stopTimer();
    
    const gameContentEl = document.getElementById('gameContent');
    const completeEl = document.getElementById('gameComplete');
    const finalStats = document.getElementById('finalStats');
    
    // Calculate final score (bonus for speed)
    const timeBonus = Math.max(0, 500 - gameTimer * 5);
    const finalScore = score + timeBonus;
    
    finalStats.innerHTML = `
        <p><strong>Time:</strong> ${gameTimer} seconds</p>
        <p><strong>Time Bonus:</strong> ${timeBonus} points</p>
        <p><strong>Final Score:</strong> ${finalScore} points</p>
    `;
    
    gameContentEl.style.display = 'none';
    completeEl.style.display = 'block';
    
    // Save score
    saveScore('Spot the Difference', finalScore, gameTimer);
    
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
    document.getElementById('found').textContent = `${foundDifferences.length} / ${totalDifferences}`;
    document.getElementById('score').textContent = score;
}

