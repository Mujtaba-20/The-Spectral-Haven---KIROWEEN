# Hook: on_welcome_load

Triggered the moment the site loads and the welcome screen appears.

## Purpose
Initialize the immersive atmosphere for The Spectral Haven's first impression.

## Behavior
- Play shimmer welcome sound.
- Display the animated greeting message.
- Preload ambient audio for the main haven.
- Pre-initialize grass sway animations to avoid delays after entering.
- Start cursor trail particle system in the background but keep it inactive until user enters.

## Notes
This hook prepares the environment before the user clicks “Welcome”.
