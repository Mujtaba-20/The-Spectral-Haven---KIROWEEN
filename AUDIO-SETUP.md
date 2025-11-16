# Audio Setup Guide

## Overview

The Haunted Chambers app includes an audio system with:
- **Ambient loop** that plays continuously in the background
- **Sound effects** that play on specific actions
- **Mute toggle** to control all audio

## ✅ Audio System Status

The audio system is **fully implemented** and ready to use!

### What's Already Done

✅ `assets/audio/` folder created  
✅ Audio Manager implemented (`scripts/audio-manager.js`)  
✅ Mute toggle in navigation bar  
✅ Ambient loop configured to play endlessly  
✅ Sound effects integrated into components  
✅ Mute state persists in localStorage  

## 🎵 How It Works

### Ambient Loop
- **File**: `assets/audio/ambient-loop.mp3`
- **Behavior**: 
  - Starts automatically on page load
  - Loops endlessly (`loop = true`)
  - Volume set to 30%
  - Pauses when muted
  - Resumes when unmuted

### Sound Effects
- **task-complete.mp3** - Plays when you complete a task
- **skeleton-enter.mp3** - Plays during page transitions
- **release.mp3** - Plays when releasing a whisper
- Volume set to 50%
- Only play when actions occur
- Respect mute toggle

### Mute Toggle
- Located in the top navigation bar
- 🔊 = Audio playing
- 🔇 = Audio muted
- State saved to localStorage
- Persists across browser sessions

## 📁 Adding Audio Files

### Step 1: Get Audio Files

Download or create audio files with these exact names:
- `ambient-loop.mp3`
- `task-complete.mp3`
- `skeleton-enter.mp3`
- `release.mp3`

### Step 2: Place Files

Put all audio files in the `assets/audio/` folder:

```
haunted-chambers/
├── assets/
│   └── audio/
│       ├── ambient-loop.mp3      ← Add here
│       ├── task-complete.mp3     ← Add here
│       ├── skeleton-enter.mp3    ← Add here
│       └── release.mp3           ← Add here
```

### Step 3: Refresh

Refresh the page - audio will load automatically!

## 🎼 Where to Find Audio

### Free Audio Sources

1. **Freesound.org**
   - Search: "halloween ambient", "spooky wind", "ghost"
   - License: Creative Commons

2. **Zapsplat.com**
   - Free sound effects library
   - Search: "halloween", "spooky", "ambient"

3. **OpenGameArt.org**
   - Game audio assets
   - Search: "horror", "ambient"

4. **YouTube Audio Library**
   - Royalty-free music and effects
   - Filter by "Scary" mood

### Recommended Search Terms
- "halloween ambient loop"
- "spooky wind sounds"
- "ghost whisper"
- "creepy atmosphere"
- "haunted house ambience"
- "skeleton rattle"
- "whoosh sound effect"

## 🔧 Technical Details

### Audio Manager (`scripts/audio-manager.js`)

```javascript
// Ambient loop configuration
this.ambient.loop = true;        // Loops endlessly
this.ambient.volume = 0.3;       // 30% volume

// Automatically plays on load (if not muted)
if (!this.muted) {
    this.ambient.play();
}
```

### Mute Toggle Behavior

```javascript
toggleMute() {
    this.muted = !this.muted;
    
    if (this.muted) {
        this.ambient.pause();    // Stops ambient
    } else {
        this.ambient.play();     // Resumes ambient
    }
    
    // Save state to localStorage
    this.saveMuteState();
}
```

### Sound Effect Usage

```javascript
// In any component:
if (window.audioManager) {
    window.audioManager.playSFX('task-complete');
}
```

## 🎯 Current Integration Points

Audio is already integrated in these locations:

1. **Main App** (`scripts/main.js`)
   - Initializes AudioManager on page load
   - Sets up mute toggle button

2. **Haunted Tasks** (`scripts/components/haunted-todo.js`)
   - Plays `task-complete` when marking task as done

3. **Transition Manager** (`scripts/transition-manager.js`)
   - Plays `skeleton-enter` during page transitions

4. **Whisper Well** (`scripts/components/whisper-well.js`)
   - Plays `release` when releasing a whisper

## ⚠️ Graceful Degradation

The app works perfectly **without** audio files:
- Missing files are logged to console
- App continues to function normally
- No errors or crashes
- Audio features simply remain silent

## 🧪 Testing

### Test Ambient Loop
1. Open the app
2. Check if ambient sound plays automatically
3. Click mute toggle - sound should stop
4. Click again - sound should resume
5. Refresh page - mute state should persist

### Test Sound Effects
1. Complete a task - hear `task-complete.mp3`
2. Navigate between pages - hear `skeleton-enter.mp3`
3. Release a whisper - hear `release.mp3`
4. Mute audio - effects should not play

## 📝 Summary

✅ Audio folder exists: `assets/audio/`  
✅ Audio system fully implemented  
✅ Ambient loop plays endlessly until muted  
✅ Mute toggle controls all audio  
✅ Sound effects play on actions  
✅ State persists across sessions  

**To enable audio**: Just add the 4 audio files to `assets/audio/` and refresh!
