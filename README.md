# 🎃 The Spectral Haven

A Halloween-themed productivity web application featuring task management, focus timer, mood tracking, and atmospheric interactions.

## Features

- **Haunted To-Do List**: Manage tasks with animated ghost representations
- **Focus Chamber**: Track focus sessions with a mystical stopwatch
- **Whisper Well**: Symbolic text release ritual (privacy-focused, no data saved)
- **Mood Grove Tracker**: Track daily moods with ghost icons and visualizations
- **Nightfall Candle Timer**: Visual countdown timer with melting candle animation
- **Spooky Tic-Tac-Toe**: A ghost-vs-pumpkin showdown where you battle in a haunted grid
- **Spooky Title Generator**: Upload an image and let the system conjure a chilling, theme-matched spooky title
- **Radiant Spehere**: Mystical orb giving uplifting affirmations infused with supernatural ambience SFX
- **Persistent Background World**: Animated Halloween scene across all pages
- **Ghost Cursor Trail**: Magical trailing effect following your cursor
- **Day/Night Themes**: Switch between light and dark atmospheric modes

## Privacy & Accessibility

### Privacy Guarantees

#### Whisper Well - Complete Privacy
The Whisper Well is a **symbolic ritual only**. Your privacy is guaranteed:
- ✅ **Nothing is saved** - Text is never stored to localStorage, IndexedDB, or any storage mechanism
- ✅ **Nothing is sent** - No network requests are made. Text never leaves your device.
- ✅ **Nothing is viewable** - Text is read directly from the input field for animation only, then immediately cleared
- ✅ **No logging** - Text is not logged to console or any debugging tools
- ⚠️ **Do not enter personal or sensitive data** - While technically private, this is a symbolic feature for cathartic release

**How it works**: When you click "Release", the text is read from the DOM, used to create temporary animation elements, and the input is immediately cleared. The text variable goes out of scope after the animation, ensuring no persistence.

#### Mood Tracker - Local Storage Only
Your mood data is **stored on this device only**:
- 📱 **Device-only storage** - Uses IndexedDB (with localStorage fallback) in your browser
- 🔒 **No cloud sync** - Data never leaves your device
- 🚫 **No analytics** - We don't track, analyze, or transmit your mood data
- 💾 **Export control** - You can export your data as CSV at any time
- 🗑️ **Delete control** - Clear all mood data with one click in the Mood Tracker page

#### Tasks & Focus Sessions
All task and focus session data is stored locally in your browser using localStorage. No data is transmitted to any server.

### Accessibility Features

#### How to Disable Animations
If animations cause discomfort or distraction:
1. Navigate to **Settings** (press `7` or click the settings icon)
2. Toggle **"Animations"** to OFF
3. All decorative animations will be disabled while maintaining functionality
4. Your preference is saved and persists across sessions

The app also automatically respects your system's `prefers-reduced-motion` setting.

#### How to Disable Sound
To silence all audio in the application:
1. Click the **mute toggle** button in the navigation bar (available on all pages)
2. Or navigate to **Settings** and toggle **"Sound"** to OFF
3. This silences both ambient background audio and sound effects
4. Your mute preference is saved and persists across sessions

#### Additional Accessibility Features
- **Keyboard Navigation**: Navigate pages using number keys 1-7
- **Plain List Mode**: Toggle in Settings for a simple, accessible task list view
- **Screen Reader Support**: ARIA labels and semantic HTML throughout
- **Keyboard Controls**: All interactive elements accessible via keyboard
- **High Contrast**: Works with system high contrast modes
- **Focus Indicators**: Clear visual focus states for keyboard navigation

## Getting Started

### Installation

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build process or server required!

### Optional: Local Development Server

For a better development experience, you can use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Usage

### First Time Setup

1. Open `index.html` in your browser
2. The app loads in **Night Mode** by default with animations and sound enabled
3. Explore the home page "The Spectral Haven" to see mini-widgets for each feature
4. Click any mini-widget or use keyboard shortcuts to navigate

### Navigation

**Three ways to navigate:**
1. **Click navigation icons** at the top of the page
2. **Use keyboard shortcuts**: Press number keys 1-7
3. **Click mini-widgets** on the home page

### Keyboard Shortcuts

- `1` - Home (The Spectral Haven)
- `2` - Haunted To-Do List
- `3` - Focus Chamber
- `4` - Whisper Well
- `5` - Mood Grove
- `6` - Nightfall Candle
- `7` - Spooky Tic-Tac-Toe
- `8` - Title Generator
- `9` - Radiant Sphere
- `0` - Settings

### Using Each Feature

#### 🎃 Haunted To-Do List
1. Type a task in the input field and press Enter
2. Each task becomes an animated ghost
3. Click a ghost to mark it complete (watch it float away!)
4. Fog density increases with incomplete tasks
5. Toggle "Plain List Mode" in Settings for a simpler view

#### ⏱️ Focus Chamber
1. Click "Start" to begin tracking focus time
2. Watch particles emit and an optional candle burn
3. Click "Stop" to end the session and see a duration-based message
4. Optionally link a task to your focus session

#### 🌊 Whisper Well
1. Type anything you want to symbolically release
2. Click "Release" to watch text dissolve into mist
3. Receive a random ghost reply
4. Remember: Nothing is saved or sent (see Privacy section above)

#### 😊 Mood Tracker
1. Select a ghost representing your mood (Scared, Depressed, Sad, Happy, Excited)
2. Optionally add a note
3. View weekly trends or monthly calendar heatmap
4. Export data as CSV or clear all data anytime

#### 🕯️ Nightfall Candle Timer
1. **Only available in Night Mode** (switch in Settings if needed)
2. Select a duration (5, 10, 15, or 30 minutes)
3. Click "Start" to watch the candle melt
4. When time expires, the flame extinguishes with a smoke effect

### 👻 Spooky Tic-Tac-Toe
1. Choose your side: Ghost or Pumpkin
2. Tap any tile on the haunted grid to place your mark
3. Watch the board react with spooky animations
4. First to align three wins the spectral showdown with a dramatic SFX
5. Restart anytime for another ghost–pumpkin battle
6. You can also reset the scores

### 📸 Spooky Title Generator
1. Upload an image from your device
2. Wait a moment as the system analyzes the vibe
3. A thematic, spooky title is generated automatically
4. Try different images to summon different eerie titles

### Settings & Customization

Access the **Settings** page (press `7`) to customize your experience:

- **Theme**: Switch between Day Mode (light, translucent) and Night Mode (dark, glowing)
- **Animations**: Enable or disable all decorative animations
- **Skeleton Transition**: Toggle the skeleton animation that appears during page navigation
- **Plain List Mode**: Use simple list view for tasks instead of animated ghosts
- **Sound**: Mute or unmute ambient sound and sound effects

All settings are saved automatically and persist across sessions.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires a modern browser with ES6 module support.

## Project Structure

```
the-spectral-haven/
├── .kiro/                     # Kiroween specs, hooks, and steering
│   ├── spec/                  # Project specification files
│   ├── hooks/                 # Hook behaviors and triggers
│   └── steering/              # High-level steering logic
│
├── index.html                 # Main HTML file
├── styles/                    # CSS files
│   ├── main.css               # Core styles
│   ├── themes.css             # Day/Night themes
│   ├── background.css         # Background world
│   ├── components.css         # Reusable components
│   └── animations.css         # Keyframe animations
│
├── scripts/                   # JavaScript modules
│   ├── main.js                # Entry point
│   ├── router.js              # Page routing
│   ├── audio-manager.js       # Audio handling
│   ├── cursor-trail.js        # Cursor effect
│   ├── transition-manager.js  # Page transitions
│   ├── components/            # Page components
│   └── utils/                 # Utility functions
│
└── assets/                    # Media files
    ├── audio/                 # Sound effects
    └── images/                # SVG/image assets

```

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Animations, transforms, custom properties
- **Vanilla JavaScript**: ES6+ modules, no framework dependencies
- **Web APIs**: localStorage, IndexedDB, requestAnimationFrame, Audio API

## Development

This project uses vanilla JavaScript with ES6 modules. No build process is required.

### Adding New Features

1. Create a new component in `scripts/components/`
2. Register the route in `scripts/main.js`
3. Add navigation icon in `index.html`
4. Style the component in `styles/components.css`

## License

This project is open source and available for educational purposes.

## Credits

Created as a Halloween-themed productivity application combining atmospheric design with practical functionality.
