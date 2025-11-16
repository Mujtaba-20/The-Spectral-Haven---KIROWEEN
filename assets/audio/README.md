# Audio Assets

This directory contains audio files for The Spectral Haven application.

## Required Files

Place the following audio files in this directory to enable sound:

### Ambient Tracks (Looping Background Audio)
- `Trees.mp3` - Main ambient track (30% volume)
- `creep.mp3` - Secondary ambient track for added atmosphere (15% volume - half of main)
- `ambient-loop.mp3` - Alternative looping ambient sound with wind, chimes, and crow sounds

### Sound Effects
- `task-complete.mp3` - Sound effect played when a task is completed
- `skeleton-enter.mp3` - Sound effect played when skeleton transition appears
- `release.mp3` - Sound effect played when releasing text in Whisper Well
- `Tabs.mp3` - Page transition sound effect
- `Clock.mp3` - Stopwatch ticking sound (looping)
- `timer.mp3` - Candle timer sound (looping)
- `wind.mp3` - Wind sound for cursor trail movement

## Audio Specifications

- **Main Ambient (Trees.mp3)**: Seamless loop, 30% volume
- **Secondary Ambient (creep.mp3)**: Seamless loop, 15% volume (50% of main)
- **SFX**: Short sound effects, 40-60% volume
- **Format**: MP3 or WAV format supported

## Where to Find Audio

You can find free Halloween-themed audio from these sources:

1. **Freesound.org** - Search for "halloween ambient", "wind", "spooky"
2. **Zapsplat.com** - Free sound effects library
3. **OpenGameArt.org** - Creative Commons game audio
4. **YouTube Audio Library** - Royalty-free music and sound effects

## Recommended Search Terms

- "halloween ambient loop"
- "spooky wind sounds"
- "ghost whisper"
- "creepy atmosphere"
- "haunted house ambience"

## Notes

The AudioManager will gracefully handle missing audio files by logging a message to the console and continuing without audio. This allows the application to function even when audio assets are not yet available.

**To enable audio**: Simply download appropriate audio files and place them in this directory with the exact filenames listed above, then refresh the page.
