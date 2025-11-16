# 🔮 The Radiant Sphere

A minimal mystical affirmation component for The Spectral Haven.

## Overview

The Radiant Sphere is a glowing orb that provides positive mystical affirmations when touched. Built in pure vanilla JavaScript ES6 with CSS animations.

## Features

### Visual Elements
- **Glowing SVG Orb** with radial gradient
- **Idle Animations**:
  - Gentle breathing glow (4s cycle)
  - Outer glow pulse (3s cycle)
  - Highlight shimmer (5s cycle)
  - Floating sparkles (3s cycle, staggered)

### Interactions
- **Click/Touch**: Activates the orb
- **Pulse Animation**: Scale up + glow intensifies
- **Sparkle Burst**: All sparkles burst outward
- **Affirmation Display**: Shows mystical message after animation
- **Reveal Another**: Button to get a new affirmation

### Affirmations (10 total)
1. "The winds whisper softly in your favor today."
2. "A quiet brightness follows your steps."
3. "Your spark is stirring something beautiful."
4. "The veil parts gently for your presence."
5. "Even the shadows admire your glow."
6. "A small blessing is already moving toward you."
7. "Your energy hums with quiet strength."
8. "Something good is gathering just out of sight."
9. "The universe remembers your light."
10. "There is warmth coiling in your future."

## File Structure

```
the-spectral-haven/
├── scripts/
│   └── components/
│       └── radiant-sphere.js       # Main component (ES6 class)
├── styles/
│   └── components.css              # Animations & styling
├── scripts/
│   ├── main.js                     # Route registration
│   └── components/
│       └── home-page.js            # Mini-widget
└── index.html                      # Navigation button
```

## Usage

### Access Methods

1. **Direct URL**: `http://localhost:8000/#/radiant-sphere`
2. **Keyboard Shortcut**: Press `9`
3. **Navigation Bar**: Click the 🔮 icon
4. **Home Page**: Click the "Radiant Sphere" mini-widget

### How to Use

1. Navigate to The Radiant Sphere page
2. Click/touch the glowing orb
3. Watch the pulse animation and sparkle burst
4. Read your mystical affirmation
5. Click "Reveal Another" for a new message

## Technical Details

### Component Class

```javascript
export class RadiantSphere {
    constructor() {
        this.affirmations = [...]; // 10 affirmations
        this.lastAffirmationIndex = -1; // Prevents repeats
    }
    
    render() {
        // Mounts to #page-container
        // Creates SVG orb with animations
    }
    
    activateOrb() {
        // Triggers pulse + sparkle burst
        // Shows random affirmation
    }
    
    getRandomAffirmation() {
        // Returns non-repeating affirmation
    }
}
```

### Animations

**CSS Keyframes:**
- `orbBreathe` - Main orb breathing (4s)
- `orbGlowPulse` - Outer glow pulse (3s)
- `orbHighlightShimmer` - Highlight shimmer (5s)
- `sparkleFloat` - Sparkle floating (3s, staggered)
- `orbClickPulse` - Click pulse animation (0.8s)
- `sparkleBurst` - Sparkle burst on click (0.8s)
- `affirmationFadeIn` - Text fade in (0.6s)

**SVG Filters:**
- `orbGlow` - Gaussian blur for glow effect
- `sparkle` - Soft blur for sparkles

### Performance

- **Zero network calls** - All client-side
- **Lightweight SVG** - ~2KB
- **CSS animations** - GPU accelerated
- **No dependencies** - Pure vanilla JS
- **Respects `prefers-reduced-motion`**

## Customization

### Add More Affirmations

Edit `scripts/components/radiant-sphere.js`:

```javascript
this.affirmations = [
    "Your custom affirmation here.",
    "Another mystical message.",
    // Add more...
];
```

### Change Colors

Edit the SVG gradient in `radiant-sphere.js`:

```javascript
<radialGradient id="orbGradient">
    <stop offset="0%" style="stop-color:#YOUR_COLOR;stop-opacity:1" />
    <stop offset="40%" style="stop-color:#YOUR_COLOR;stop-opacity:0.9" />
    // ...
</radialGradient>
```

### Adjust Animation Speed

Edit `styles/components.css`:

```css
.orb-main {
    animation: orbBreathe 4s ease-in-out infinite; /* Change 4s */
}
```

## Accessibility

- ✅ Keyboard accessible (click with Enter/Space)
- ✅ ARIA labels on navigation
- ✅ Respects `prefers-reduced-motion`
- ✅ High contrast text
- ✅ Focus indicators
- ✅ Screen reader friendly

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires SVG and CSS animation support

## Integration

The component is fully integrated into The Spectral Haven:

1. **Router**: Registered at `/radiant-sphere`
2. **Navigation**: 🔮 icon in nav bar
3. **Home Page**: Mini-widget card
4. **Keyboard**: Press `9` shortcut
5. **Styling**: Matches dark glowing aesthetic

## Credits & Cost

- **Zero API calls** - Completely free
- **No external dependencies**
- **Client-side only**
- **No data storage**

## Future Enhancements

Potential additions (not implemented):

- [ ] Save favorite affirmations
- [ ] Share affirmations
- [ ] Custom affirmation input
- [ ] Multiple orb themes
- [ ] Sound effects on activation
- [ ] Daily affirmation notification

## Troubleshooting

**Issue**: Orb doesn't animate
- **Solution**: Check if animations are disabled in Settings
- **Solution**: Verify browser supports CSS animations

**Issue**: Same affirmation repeats
- **Solution**: This is prevented by design, but with only 10 affirmations, you may see repeats after cycling through all

**Issue**: Click doesn't work
- **Solution**: Ensure JavaScript is enabled
- **Solution**: Check browser console for errors

## License

Part of The Spectral Haven project. Same license applies.
