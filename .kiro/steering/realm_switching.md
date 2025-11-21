# Steering: realm_switching

Regulates how and when the Haven transitions between Day Realm and Night Realm.

## Intent
Provide smooth visual and auditory shifts while preserving user preference.

## Rules
- Always prioritize user-selected realm (store in localStorage).
- If user enters haven for the first time, default to Night Realm for ambience.
- Use soft transitions instead of hard switches (fade sky, adjust lighting colors).
- Adjust background ambiance:
  - Day: lighter wind, brighter particles, softer grass sway.
  - Night: deeper wind, brighter trails, higher shadow contrast.
- User can change the realm using the navigation bar or from the settings tile.

## Notes
Steering ensures realm switching feels intentional and atmospheric.
