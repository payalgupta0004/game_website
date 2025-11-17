// Main JavaScript for homepage and shared functionality

// Image API Configuration
const IMAGE_API = {
    unsplash: {
        accessKey: 'YOUR_UNSPLASH_ACCESS_KEY', // Users should replace with their own
        baseUrl: 'https://api.unsplash.com/photos/random',
        fallbackUrl: 'https://picsum.photos/'
    },
    pexels: {
        baseUrl: 'https://api.pexels.com/v1/search',
        apiKey: 'YOUR_PEXELS_API_KEY' // Users should replace with their own
    }
};

// Utility function to fetch random image
async function fetchRandomImage(query = 'nature', width = 800, height = 600) {
    try {
        // Try Unsplash first (requires API key)
        // For demo purposes, using Picsum as fallback (no API key needed)
        const imageUrl = `${IMAGE_API.unsplash.fallbackUrl}${width}/${height}?random=${Date.now()}`;
        
        // Alternative: Use Unsplash Source (no API key required for basic usage)
        // const imageUrl = `https://source.unsplash.com/${width}x${height}/?${query}&sig=${Date.now()}`;
        
        return imageUrl;
    } catch (error) {
        console.error('Error fetching image:', error);
        // Fallback to placeholder
        return `https://via.placeholder.com/${width}x${height}?text=Image+Not+Available`;
    }
}

// Utility function to fetch multiple images
async function fetchMultipleImages(count = 6, query = 'nature', width = 400, height = 400) {
    const images = [];
    for (let i = 0; i < count; i++) {
        const imageUrl = await fetchRandomImage(query, width, height);
        images.push(imageUrl);
    }
    return images;
}

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');

    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'block';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Placeholder login - just show success message
            alert('Login successful! (This is a placeholder - no actual authentication)');
            loginModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover sound effects to game cards
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            playSound('hover');
        });
    });
});

// Sound effects using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    try {
        let frequency;
        let duration;

        switch(type) {
            case 'hover':
                frequency = 800;
                duration = 0.1;
                break;
            case 'click':
                frequency = 600;
                duration = 0.1;
                break;
            case 'success':
                frequency = 880;
                duration = 0.2;
                break;
            case 'error':
                frequency = 200;
                duration = 0.3;
                break;
            default:
                frequency = 440;
                duration = 0.1;
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
        console.log('Audio not available:', error);
    }
}

// Local Storage utilities for scoreboard
function saveScore(gameName, score, time) {
    const scores = JSON.parse(localStorage.getItem('gameScores') || '[]');
    scores.push({
        game: gameName,
        score: score,
        time: time,
        date: new Date().toISOString()
    });
    // Keep only last 100 scores
    if (scores.length > 100) {
        scores.shift();
    }
    localStorage.setItem('gameScores', JSON.stringify(scores));
}

function getScores(gameName = null) {
    const scores = JSON.parse(localStorage.getItem('gameScores') || '[]');
    if (gameName) {
        return scores.filter(s => s.game === gameName);
    }
    return scores;
}

// Export functions for use in game pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fetchRandomImage, fetchMultipleImages, playSound, saveScore, getScores };
}

