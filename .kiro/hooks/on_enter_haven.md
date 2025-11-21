# Hook: on_enter_haven

Triggered when the user clicks “Welcome” and enters the main Spectral Haven.

## Purpose
Smoothly transition from welcome screen to the main interactive environment.

## Behavior
- Fade out welcome UI and fade in the haven greeting.
- Start looping ambient audio (wind/whispers).
- Activate grass movement synced to audio amplitude.
- Enable cursor wind sound effect and multicolored trail.
- Load tile animations and hover effects.
- Initialize daytime/night realm logic without visually switching yet.

## Notes
This hook controls the transition between scenes and sets up interactive elements.
