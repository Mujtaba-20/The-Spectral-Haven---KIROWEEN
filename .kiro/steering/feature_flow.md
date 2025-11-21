# Steering: feature_flow

Manages how users move between different tools and features inside the Haven.

## Flow Strategy
- From the Haven homepage, encourage discovery by letting tiles animate subtly.
- After the user completes one feature (e.g., finishing a mood log or candle timer), suggest a related tile visually (e.g., glow or pulse).
- Store recently used tools and float them to visual priority on return visits.
- For high-load features (like Tic Tac Toe or Spooky Title Generator), preload assets when the user hovers the tile for more than 1 second.

## Adaptive Logic
- If user seems overwhelmed (rapid switching), reduce animation intensity.
- If user lingers or enjoys a tool, allow deeper effects (e.g., more complex particle interactions).

## Notes
Focuses on smooth, intuitive flow through the Haven’s multi-feature environment.
