# Hook: on_tile_select

Triggered whenever the user clicks any feature tile (To-Do List, Stopwatch, Whisper Well, etc).

## Purpose
Provide responsive, atmospheric transitions between main sections.

## Behavior
- Play tile-click sound effect.
- Trigger transition animation (portal-effect).
- Preload assets for the selected feature to minimize load delays.
- Store the last opened tool/feature in session history.
- Optionally dim background ambience to focus user attention.

## Notes
Handles transitions to To-Do List, Stopwatch, Whisper Well, Mood Tracker, Candle Timer, Tic Tac Toe, Title Generator, Radiant Sphere, Settings.
