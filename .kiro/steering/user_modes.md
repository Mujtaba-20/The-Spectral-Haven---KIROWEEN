# Steering: user_modes

Determines how different modes (Ghost Mode, Plain List Mode, Animations Off, Safe Mode) alter the user experience.

## Modes & Effects
### Ghost Mode (To-Do List)
- Use spectral aesthetic for tasks.
- Enable ghostly hover and completion effects.

### Plain List Mode
- Disable all extra animations in the to-do list feature.
- Prioritize clean, accessible UI.

### Animations Off (Global)
- Disable cursor trails, grass sway, scene transitions, and particle systems.

### Sound Off / Volume Adjust
- Hook sound engine globally.
- If muted: force ambient, interaction, and transition sounds to 0.
- If adjusted: scale all effects relative to global volume.

### Day Realm / Night Realm
- User can switch between day and night mode(via navigation bar or Settings tile).

## Notes
Steering ensures consistent behavior of modes across all features.
