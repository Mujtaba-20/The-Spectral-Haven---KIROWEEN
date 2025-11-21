# Hook: before_enter

Runs before a visitor lands on the site or enters a particular scene.

## Purpose
Create atmosphere immediately and prepare UI state.

## Behavior (implementation ideas)
- Fade in the landing view and footer text.
- Warm-up audio context and preload ambient loop (wind/whispers).
- Set a `visited` flag in session storage to vary first-time experience.
- Preload main scene assets (images, sprite sheets) to avoid hitches.

## Notes
Works well as an init hook called on page load or when switching to the main the-spectral-haven scene.
