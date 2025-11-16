# Audio Assets

This directory contains audio files for the Haunted Chamber application.

## Required Files

Place the following audio files in this directory to enable sound:

- `ambient-loop.mp3` - Looping ambient sound with wind, chimes, and crow sounds
- `task-complete.mp3` - Sound effect played when a task is completed
- `skeleton-enter.mp3` - Sound effect played when skeleton transition appears
- `release.mp3` - Sound effect played when releasing text in Whisper Well

## Audio Specifications

- **Ambient Loop**: Should be a seamless loop, low volume (30% default)
- **SFX**: Short sound effects, medium volume (50% default)
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
