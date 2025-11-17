# 🎮 GameZone - Image-Powered Gaming Website

A modern, responsive gaming website featuring interactive games powered by images from the internet.

## 🎯 Features

### Games
1. **Image Guessing Game** - Test your knowledge by guessing what's in random images
2. **Memory Matching Game** - Match pairs of images in this classic memory challenge
3. **Spot the Difference** - Find differences between two similar images

### Features
- ✨ Modern gaming-themed UI with neon accents and glowing effects
- 📱 Fully responsive design (mobile-friendly)
- 🎵 Sound effects using Web Audio API
- 📊 Scoreboard tracking with local storage
- ⏱️ Timer functionality for competitive gameplay
- 🎨 Smooth animations and transitions
- 🔄 Error handling and loading states
- 🖼️ Dynamic image loading from online sources

## 🚀 Getting Started

### Quick Start
1. Simply open `index.html` in your web browser
2. No build process or installation required!

### Using Your Own Image APIs (Optional)

The website uses Picsum Photos by default (no API key required). To use other APIs:

#### Unsplash API
1. Get a free API key from [Unsplash Developers](https://unsplash.com/developers)
2. Update `script.js`:
   ```javascript
   const IMAGE_API = {
       unsplash: {
           accessKey: 'YOUR_UNSPLASH_ACCESS_KEY',
           baseUrl: 'https://api.unsplash.com/photos/random',
       }
   };
   ```

#### Pexels API
1. Get a free API key from [Pexels API](https://www.pexels.com/api/)
2. Update the `fetchRandomImage` function in `script.js` to use Pexels endpoints

## 📁 Project Structure

```
website/
├── index.html              # Homepage
├── scoreboard.html         # Scoreboard page
├── styles.css              # Main stylesheet
├── script.js               # Shared JavaScript utilities
├── README.md              # This file
└── games/
    ├── guessing.html      # Image Guessing Game
    ├── guessing.js        # Guessing game logic
    ├── memory.html        # Memory Matching Game
    ├── memory.js          # Memory game logic
    ├── difference.html    # Spot the Difference Game
    └── difference.js      # Difference game logic
```

## 🎮 How to Play

### Image Guessing Game
- A random image is displayed
- Type your guess in the input field
- Get hints if needed
- Score points for correct answers
- Race against the timer!

### Memory Matching Game
- Choose difficulty (Easy: 4 pairs, Medium: 6 pairs, Hard: 8 pairs)
- Click cards to flip them
- Match pairs of images
- Complete with the fewest moves and fastest time

### Spot the Difference
- Two similar images are displayed
- Click on the differences you find
- Find all 5 differences to win
- Score bonus points for speed!

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #00ff88;
    --secondary-color: #ff00ff;
    --accent-color: #00d4ff;
    /* ... */
}
```

### Game Settings
- Adjust difficulty levels in `games/memory.js`
- Modify timer durations in `games/guessing.js`
- Change number of differences in `games/difference.js`

## 📊 Scoreboard

Scores are stored locally in your browser using localStorage. The scoreboard shows:
- Game name
- Score achieved
- Time taken
- Date and time

## 🔧 Technical Details

### Technologies Used
- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- Web Audio API (for sound effects)
- Local Storage API (for score tracking)

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

### Image Sources
- Default: Picsum Photos (https://picsum.photos)
- Alternative: Unsplash Source (no API key needed for basic usage)
- Supports any image API that returns image URLs

## 🐛 Troubleshooting

### Images Not Loading
- Check your internet connection
- Some image APIs may have rate limits
- Try refreshing the page

### Sounds Not Playing
- Some browsers require user interaction before playing audio
- Check browser audio settings
- The game will work without sounds

### Scores Not Saving
- Ensure localStorage is enabled in your browser
- Check browser console for errors
- Clear browser cache if issues persist

## 📝 License

This project is open source and available for educational purposes.

## 🎉 Enjoy Playing!

Have fun with the games and challenge yourself to beat your high scores!

