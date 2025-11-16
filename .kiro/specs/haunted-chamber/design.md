# Design Document

## Overview

The The Spectral Haven is a client-side single-page application (SPA) built with vanilla JavaScript, HTML5, and CSS3. The architecture uses a component-based approach with a persistent background layer and a routing system for page transitions. All data is stored in localStorage, and the Whisper Well feature explicitly avoids any data persistence.

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────┐
│         Application Shell               │
│  ┌───────────────────────────────────┐  │
│  │   Background World (Persistent)   │  │
│  │   - Animated scene elements       │  │
│  │   - Audio manager                 │  │
│  │   - Cursor trail system           │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   Navigation Bar (Icon-based)     │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   Page Container (Routed)         │  │
│  │   - Home / Tasks / Focus /        │  │
│  │     Whisper Well / Settings       │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   Transition Layer (Skeleton)     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Technology Stack

- **HTML5**: Semantic markup, canvas for particle effects
- **CSS3**: Animations, transforms, custom properties for theming
- **Vanilla JavaScript**: ES6+ modules, no framework dependencies
- **Web APIs**: localStorage, requestAnimationFrame, Audio API
- **Build**: Optional bundler (Vite/Parcel) or direct file serving

## Components and Interfaces

### 1. Background World Component

**Responsibility**: Render and animate persistent scene elements

**Elements**:
- Scarecrow (static SVG/image)
- Pumpkins (SVG with CSS animation for flicker)
- Trees (SVG with CSS keyframe sway)
- Clouds (multiple layers, CSS parallax)
- Bats (sprite animation or CSS path)
- Hanging skeleton (CSS transform animation)
- Fog overlay (CSS gradient with opacity animation)

**Implementation**:
```javascript
class BackgroundWorld {
  constructor(container) {
    this.container = container;
    this.elements = {};
  }
  
  init() {
    this.createSceneLayers();
    this.startAnimations();
  }
  
  createSceneLayers() {
    // Layer 1: Far clouds
    // Layer 2: Trees, scarecrow
    // Layer 3: Pumpkins, skeleton
    // Layer 4: Bats
    // Layer 5: Fog overlay
  }
  
  startAnimations() {
    // CSS-driven animations for most elements
    // RAF loop only for bats if needed
  }
}
```

### 2. Audio Manager

**Responsibility**: Handle ambient sound and SFX with mute control

**Interface**:
```javascript
class AudioManager {
  constructor() {
    this.ambient = null;
    this.sfx = {};
    this.muted = false;
  }
  
  init() {
    this.loadAmbient('ambient-loop.mp3');
    this.loadSFX('task-complete.mp3', 'skeleton-enter.mp3', 'release.mp3');
    this.restoreMuteState();
  }
  
  toggleMute() {
    this.muted = !this.muted;
    this.updateAudioState();
    localStorage.setItem('muted', this.muted);
  }
  
  playSFX(name) {
    if (!this.muted) this.sfx[name].play();
  }
}
```

### 3. Cursor Trail System

**Responsibility**: Render performant ghost trail following cursor

**Implementation Strategy**:
- Use CSS custom properties for trail positions
- Maintain small array (5-8 particles) of trail segments
- Update positions via RAF, apply CSS transforms
- Theme-aware styling (day vs night)

```javascript
class CursorTrail {
  constructor() {
    this.particles = [];
    this.maxParticles = 6;
    this.mouseX = 0;
    this.mouseY = 0;
  }
  
  init() {
    this.createParticles();
    document.addEventListener('mousemove', this.updateMouse.bind(this));
    this.animate();
  }
  
  animate() {
    // Update particle positions with easing
    // Apply CSS transforms
    requestAnimationFrame(this.animate.bind(this));
  }
}
```

### 4. Router

**Responsibility**: Handle page navigation with transitions

**Routes**:
- `/` - Home
- `/tasks` - Haunted To-Do
- `/focus` - Focus Chamber
- `/whisper` - Whisper Well
- `/mood` - Mood Tracker
- `/candle` - Nightfall Candle Timer
- `/settings` - Settings

**Interface**:
```javascript
class Router {
  constructor() {
    this.routes = {};
    this.currentPage = null;
    this.transitionManager = new TransitionManager();
  }
  
  register(path, pageComponent) {
    this.routes[path] = pageComponent;
  }
  
  navigate(path) {
    this.transitionManager.start(() => {
      this.currentPage?.destroy();
      this.currentPage = new this.routes[path]();
      this.currentPage.render();
    });
  }
}
```

### 5. Transition Manager

**Responsibility**: Portal ripple effect and skeleton animation

**Sequence**:
1. Trigger portal ripple (CSS radial animation)
2. Slide in skeleton from right
3. Sway/tilt skeleton with caption
4. Swap page content
5. Slide out skeleton
6. Complete ripple fade

```javascript
class TransitionManager {
  constructor() {
    this.skeletonEnabled = true;
    this.duration = 750; // ms
  }
  
  start(callback) {
    this.showRipple();
    if (this.skeletonEnabled) {
      this.showSkeleton(() => {
        callback();
        this.hideSkeleton();
      });
    } else {
      setTimeout(callback, this.duration / 2);
    }
  }
}
```

### 6. Home Page Component

**Responsibility**: Display overview with mini-widgets

**Page Title**: "Ghostly Grove"
**Subtitle**: "Welcome, traveler. The Grove awakens with every step you take."

**Layout**:
- Full background scene visible
- Five mini-widgets positioned in scene
- Click handlers navigate to full pages

```javascript
class HomePage {
  render() {
    // Page title and subtitle
    // Mini task cluster (3-4 small ghosts)
    // Mini stopwatch (small timer display)
    // Mini portal (swirling effect)
    // Mini mood ghost (today's mood if recorded)
    // Mini candle (small burning candle, Night Mode only)
  }
}
```

### 7. Haunted To-Do Component

**Responsibility**: Task management with ghost animations

**Page Title**: "Haunted To-Do List"
**Subtitle**: "Every task here becomes a wandering spirit. Free them one by one."

**Task States**:
- `new`: Ghost appears with fade-in
- `active`: Normal floating animation
- `overdue`: Jittery CSS animation
- `completed`: Bow → float up → fade out

**Data Structure**:
```javascript
{
  id: 'uuid',
  text: 'Task description',
  state: 'active', // new | active | overdue | completed
  createdAt: timestamp,
  dueAt: timestamp | null,
  completedAt: timestamp | null
}
```

**Fog Density Calculation**:
```javascript
fogOpacity = Math.min(0.8, incompleteTasks * 0.1);
```

**Interface**:
```javascript
class HauntedToDo {
  constructor() {
    this.tasks = [];
    this.plainListMode = false;
  }
  
  addTask(text) {
    const task = { id: uuid(), text, state: 'new', createdAt: Date.now() };
    this.tasks.push(task);
    this.renderGhost(task);
    this.updateFog();
    this.saveTasks();
  }
  
  completeTask(id) {
    const task = this.tasks.find(t => t.id === id);
    task.state = 'completed';
    task.completedAt = Date.now();
    this.animateCompletion(task);
    this.updateFog();
    this.saveTasks();
    audioManager.playSFX('task-complete');
  }
  
  updateFog() {
    const incomplete = this.tasks.filter(t => t.state !== 'completed').length;
    const opacity = Math.min(0.8, incomplete * 0.1);
    document.querySelector('.fog-overlay').style.opacity = opacity;
  }
}
```

### 8. Focus Chamber Component

**Responsibility**: Stopwatch with visual feedback

**Page Title**: "Focus Chamber"
**Subtitle**: "Within this chamber, time glows, drifts, and obeys your will."

**Features**:
- Start/stop/reset controls
- Particle emission during active session
- Optional candle burn animation
- Duration-based message on stop
- Task association

**Interface**:
```javascript
class FocusChamber {
  constructor() {
    this.startTime = null;
    this.elapsed = 0;
    this.running = false;
    this.particles = [];
    this.linkedTaskId = null;
  }
  
  start() {
    this.running = true;
    this.startTime = Date.now() - this.elapsed;
    this.emitParticles();
    this.updateDisplay();
  }
  
  stop() {
    this.running = false;
    this.elapsed = Date.now() - this.startTime;
    this.showMessage(this.getMessageForDuration(this.elapsed));
  }
  
  getMessageForDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    if (minutes < 5) return "A brief haunting... but every moment counts.";
    if (minutes < 15) return "The spirits approve of your focus.";
    if (minutes < 30) return "Impressive dedication. The chamber glows brighter.";
    return "Legendary focus! The ghosts bow in respect.";
  }
}
```

### 9. Whisper Well Component

**Responsibility**: Symbolic text release with no persistence

**Page Title**: "The Whisper Well"
**Subtitle**: "Speak a small secret and watch it vanish into the mist."

**Critical Privacy Implementation**:
- Input value never assigned to variables that persist
- No localStorage, no network calls
- Text read directly from DOM for animation only
- Input cleared immediately after animation starts

**Interface**:
```javascript
class WhisperWell {
  constructor() {
    this.replies = [
      "It is gone. Sleep easier tonight.",
      "Mmm — closure tastes like warm ember.",
      "I swallowed that one whole. Lightness achieved.",
      "Your whisper is weightless now.",
      "Freed. The fog approves."
    ];
  }
  
  render() {
    // Display privacy notice
    // Input field + Release button
    // Ghost reply area
  }
  
  release() {
    const input = document.querySelector('.whisper-input');
    const text = input.value; // Only used for animation
    
    if (!text.trim()) return;
    
    // Immediately clear input
    input.value = '';
    
    // Animate text dissolving (create temporary DOM elements)
    this.animateDissolve(text);
    
    // Show random reply
    const reply = this.replies[Math.floor(Math.random() * this.replies.length)];
    this.showReply(reply);
    
    audioManager.playSFX('release');
    
    // text variable goes out of scope, no persistence
  }
  
  animateDissolve(text) {
    // Create temporary span elements for each character
    // Animate opacity and transform
    // Remove elements after animation
  }
}
```

### 10. Mood Tracker Component

**Responsibility**: Record and visualize daily mood entries with privacy guarantees

**Page Title**: "Mood Grove"
**Subtitle**: "The spirits shift with your mood — choose the ghost that reflects your day."

**Mood Types and Scores**:
- Scared: 1
- Depressed: 2
- Sad: 3
- Happy: 4
- Excited: 5

**Views**:
1. **Daily Entry View**: Large ghost buttons for quick mood selection
2. **Weekly View**: Line chart showing 7-day mood score trend
3. **Monthly View**: Calendar heatmap with hover details

**Data Structure**:
```javascript
{
  id: 'uuid',
  date: 'YYYY-MM-DD',
  mood: 'happy', // scared | depressed | sad | happy | excited
  score: 4,
  note: 'Optional text note',
  timestamp: number
}
```

**Interface**:
```javascript
class MoodTracker {
  constructor() {
    this.entries = [];
    this.currentView = 'daily'; // daily | weekly | monthly
    this.db = null;
  }
  
  async init() {
    await this.initStorage();
    await this.loadEntries();
    this.render();
  }
  
  async initStorage() {
    // Prefer IndexedDB, fallback to localStorage
    if ('indexedDB' in window) {
      this.db = await this.openIndexedDB();
    } else {
      this.db = new LocalStorageAdapter();
    }
  }
  
  async recordMood(mood, note = '') {
    const today = this.getTodayDate();
    const existing = this.entries.find(e => e.date === today);
    
    const entry = {
      id: existing?.id || uuid(),
      date: today,
      mood,
      score: this.getMoodScore(mood),
      note,
      timestamp: Date.now()
    };
    
    if (existing) {
      await this.updateEntry(entry);
    } else {
      await this.addEntry(entry);
    }
    
    this.renderCurrentView();
  }
  
  getMoodScore(mood) {
    const scores = {
      scared: 1,
      depressed: 2,
      sad: 3,
      happy: 4,
      excited: 5
    };
    return scores[mood];
  }
  
  renderDailyView() {
    // Five large ghost buttons
    // Optional note textarea
    // Privacy notice text
    // Submit button
  }
  
  renderWeeklyView() {
    // Get last 7 days of entries
    // Create sparkline/line chart
    // Show mood score trend
  }
  
  renderMonthlyView() {
    // Generate calendar grid for current month
    // Apply heatmap colors based on mood score
    // Add hover tooltips with mood + note
    // Display ghost icon on recorded days
  }
  
  async exportCSV() {
    const csv = this.generateCSV(this.entries);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-tracker-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  async clearData() {
    const confirmed = confirm('Are you sure you want to delete all mood data? This cannot be undone.');
    if (confirmed) {
      await this.db.clear();
      this.entries = [];
      this.renderCurrentView();
    }
  }
  
  generateCSV(entries) {
    const headers = 'Date,Mood,Score,Note\n';
    const rows = entries.map(e => 
      `${e.date},${e.mood},${e.score},"${e.note.replace(/"/g, '""')}"`
    ).join('\n');
    return headers + rows;
  }
}
```

**IndexedDB Schema**:
```javascript
// Database: HauntedChamberDB
// Store: moodEntries
// Key: date (YYYY-MM-DD)
// Indexes: timestamp, mood, score
```

**Heatmap Color Mapping**:
```javascript
// Map mood scores to theme-appropriate colors
const heatmapColors = {
  day: {
    1: '#d4a5a5', // Scared - light red
    2: '#b8a5d4', // Depressed - light purple
    3: '#a5c5d4', // Sad - light blue
    4: '#ffd699', // Happy - light orange
    5: '#ffb366'  // Excited - bright orange
  },
  night: {
    1: '#8b4545', // Scared - dark red
    2: '#6b4d8b', // Depressed - dark purple
    3: '#4d6b8b', // Sad - dark blue
    4: '#ff9933', // Happy - orange
    5: '#ff6600'  // Excited - bright orange
  }
};
```

**Accessibility Features**:
- Keyboard navigation with arrow keys
- Enter/Space to select mood
- ARIA labels for each ghost button
- Text labels visible on hover/focus
- Screen reader announcements for mood selection

### 11. Nightfall Candle Timer Component

**Responsibility**: Visual countdown timer with melting candle animation, Night Mode exclusive

**Page Title**: "Nightfall Candle Timer"
**Subtitle**: "As the flame melts, so does the weight of each passing moment."

**Timer Durations**:
- 5 minutes
- 10 minutes
- 15 minutes
- 30 minutes

**Candle Animation States**:
1. **Idle**: Full candle, gentle flame flicker
2. **Burning**: Wax level decreases, flame flickers, wax drips animate
3. **Complete**: Flame extinguishes with smoke, ghost message appears

**Interface**:
```javascript
class NightfallCandleTimer {
  constructor() {
    this.duration = 0; // milliseconds
    this.startTime = null;
    this.elapsed = 0;
    this.running = false;
    this.animationFrame = null;
  }
  
  render() {
    const settings = this.getSettings();
    
    if (settings.theme === 'day') {
      this.renderDayMessage();
      return;
    }
    
    this.renderCandle();
    this.renderControls();
  }
  
  renderDayMessage() {
    // Display: "The Nightfall Candle only burns after dusk"
    // Styled message with theme-appropriate colors
  }
  
  renderCandle() {
    // SVG or Canvas candle with layers:
    // - Wick (top)
    // - Flame (animated flicker)
    // - Wax body (height decreases over time)
    // - Wax drips (periodic animation)
    // - Base/holder
  }
  
  renderControls() {
    // Duration selection buttons (5/10/15/30 min)
    // Start/Pause/Reset buttons
    // Time remaining display
  }
  
  start(durationMinutes) {
    this.duration = durationMinutes * 60 * 1000;
    this.startTime = Date.now() - this.elapsed;
    this.running = true;
    this.animate();
  }
  
  pause() {
    this.running = false;
    this.elapsed = Date.now() - this.startTime;
    cancelAnimationFrame(this.animationFrame);
  }
  
  reset() {
    this.running = false;
    this.elapsed = 0;
    this.startTime = null;
    cancelAnimationFrame(this.animationFrame);
    this.updateCandleVisual(1.0); // Full candle
  }
  
  animate() {
    if (!this.running) return;
    
    this.elapsed = Date.now() - this.startTime;
    const progress = Math.min(1, this.elapsed / this.duration);
    
    this.updateCandleVisual(1 - progress);
    
    if (progress >= 1) {
      this.complete();
    } else {
      this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }
  }
  
  updateCandleVisual(remainingPercent) {
    // Update wax height: scale or clip-path
    // Adjust flame position to top of wax
    // Trigger wax drip animation periodically
    const candleBody = document.querySelector('.candle-wax');
    candleBody.style.transform = `scaleY(${remainingPercent})`;
    
    const flame = document.querySelector('.candle-flame');
    const flameY = (1 - remainingPercent) * 100; // Move up as candle melts
    flame.style.transform = `translateY(-${flameY}%)`;
  }
  
  complete() {
    this.running = false;
    this.animateFlameOut();
    this.showCompletionMessage();
  }
  
  animateFlameOut() {
    // Fade flame opacity to 0
    // Show smoke puff animation (SVG or CSS)
    const flame = document.querySelector('.candle-flame');
    flame.classList.add('extinguishing');
    
    setTimeout(() => {
      this.showSmoke();
    }, 300);
  }
  
  showSmoke() {
    // Create smoke element
    // Animate upward with fade
    const smoke = document.createElement('div');
    smoke.className = 'candle-smoke';
    document.querySelector('.candle-container').appendChild(smoke);
    
    setTimeout(() => smoke.remove(), 2000);
  }
  
  showCompletionMessage() {
    const messages = [
      "The flame has faded…",
      "Darkness reclaims the light.",
      "The candle's watch has ended.",
      "Time melted away with the wax."
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const messageEl = document.querySelector('.completion-message');
    messageEl.textContent = message;
    messageEl.classList.add('visible');
  }
}
```

**Candle Visual Implementation**:

Option 1 - SVG:
```html
<svg class="candle" viewBox="0 0 100 200">
  <!-- Flame -->
  <g class="candle-flame">
    <ellipse cx="50" cy="20" rx="15" ry="25" fill="url(#flameGradient)">
      <animate attributeName="ry" values="25;28;25" dur="0.5s" repeatCount="indefinite"/>
    </ellipse>
  </g>
  
  <!-- Wick -->
  <line x1="50" y1="20" x2="50" y2="50" stroke="#333" stroke-width="2"/>
  
  <!-- Wax body (height controlled by transform) -->
  <rect class="candle-wax" x="30" y="50" width="40" height="130" 
        fill="url(#waxGradient)" transform-origin="50% 100%"/>
  
  <!-- Wax drips -->
  <g class="wax-drips">
    <!-- Animated drip paths -->
  </g>
  
  <!-- Base -->
  <rect x="25" y="180" width="50" height="15" fill="#8b4513"/>
</svg>
```

Option 2 - Canvas:
- More performant for complex animations
- Draw candle layers each frame
- Apply particle effects for drips

**Wax Drip Animation**:
```javascript
class WaxDrip {
  constructor(x, startY) {
    this.x = x;
    this.y = startY;
    this.speed = 0.5 + Math.random() * 0.5;
    this.active = true;
  }
  
  update() {
    this.y += this.speed;
    if (this.y > 180) this.active = false; // Reached base
  }
  
  draw(ctx) {
    ctx.fillStyle = 'rgba(255, 200, 100, 0.8)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
```

**Flame Flicker Animation**:
```css
@keyframes flameFlicker {
  0%, 100% { 
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  25% { 
    transform: scale(1.05, 0.95) translateY(-2px);
    opacity: 0.95;
  }
  50% { 
    transform: scale(0.98, 1.02) translateY(1px);
    opacity: 0.9;
  }
  75% { 
    transform: scale(1.02, 0.98) translateY(-1px);
    opacity: 0.95;
  }
}

.candle-flame {
  animation: flameFlicker 1.5s ease-in-out infinite;
}
```

### 12. Settings Component

**Responsibility**: User preferences and toggles

**Page Title**: "Spellbook Settings"
**Subtitle**: "Tune the Grove's magic — sound, fog, shadows, and secrets."

**Settings**:
- Day/Night mode toggle
- Animation toggle
- Skeleton transition toggle
- Plain list mode toggle
- Mute toggle (also in nav bar)

**Storage**:
```javascript
{
  theme: 'night', // 'day' | 'night'
  animationsEnabled: true,
  skeletonEnabled: true,
  plainListMode: false,
  muted: false
}
```

## Data Models

### Task Model
```javascript
{
  id: string,
  text: string,
  state: 'new' | 'active' | 'overdue' | 'completed',
  createdAt: number,
  dueAt: number | null,
  completedAt: number | null
}
```

### Focus Session Model
```javascript
{
  id: string,
  startTime: number,
  endTime: number,
  duration: number,
  linkedTaskId: string | null
}
```

### Mood Entry Model
```javascript
{
  id: string,
  date: string, // YYYY-MM-DD format
  mood: 'scared' | 'depressed' | 'sad' | 'happy' | 'excited',
  score: number, // 1-5
  note: string,
  timestamp: number
}
```

### Candle Timer Session Model
```javascript
{
  id: string,
  duration: number, // milliseconds
  startTime: number,
  endTime: number | null,
  completed: boolean
}
```

### Settings Model
```javascript
{
  theme: 'day' | 'night',
  animationsEnabled: boolean,
  skeletonEnabled: boolean,
  plainListMode: boolean,
  muted: boolean
}
```

## Error Handling

### Audio Loading Failures
- Gracefully degrade if audio files fail to load
- Show visual-only feedback as fallback
- Log errors to console but don't block functionality

### localStorage Unavailable
- Detect localStorage availability on init
- Fall back to in-memory storage
- Warn user that data won't persist across sessions

### Animation Performance Issues
- Monitor frame rate if possible
- Automatically reduce particle count if performance degrades
- Respect `prefers-reduced-motion` media query

### Invalid Task Data
- Validate task structure on load from localStorage
- Discard malformed tasks
- Initialize with empty array if data is corrupted

### IndexedDB Unavailable
- Detect IndexedDB support on init
- Fall back to localStorage if IndexedDB not available
- Warn user about storage limitations with localStorage

### Mood Data Integrity
- Validate date format on mood entry load
- Ensure mood values match allowed types
- Handle missing or corrupted entries gracefully

## Testing Strategy

### Unit Tests
- Task state transitions
- Fog density calculation
- Duration message selection
- Settings persistence
- Mood score mapping
- CSV generation format
- Date formatting for mood entries
- Candle timer progress calculation
- Candle visual update based on remaining time

### Integration Tests
- Page navigation flow
- Task CRUD operations with UI updates
- Audio mute state across components
- Theme switching updates all elements
- Mood entry recording and retrieval
- IndexedDB to localStorage fallback
- Mood data export functionality

### Manual Testing Checklist
- Cursor trail performance on various devices
- Audio playback and mute functionality
- All page transitions with skeleton animation
- Task ghost animations (all states)
- Whisper Well privacy (verify no network calls)
- Mood Tracker privacy (verify no network calls)
- Accessibility with animations disabled
- Keyboard navigation (shortcuts 1-7)
- Mobile responsiveness
- Mood calendar heatmap rendering
- Mood data export and clear functionality
- Multiple mood entries on same day (update behavior)
- Candle timer accuracy across different durations
- Candle melting animation smoothness
- Candle timer Day Mode restriction
- Flame extinguish and smoke animation

### Performance Testing
- Measure FPS with all animations active
- Test on low-end mobile devices
- Verify cursor trail doesn't cause jank
- Check memory usage over extended session

### Accessibility Testing
- Screen reader compatibility
- Keyboard-only navigation
- High contrast mode compatibility
- Reduced motion preference respected
- Plain list mode functionality

## File Structure

```
haunted-chamber/
├── index.html
├── styles/
│   ├── main.css
│   ├── background.css
│   ├── components.css
│   ├── animations.css
│   └── themes.css
├── scripts/
│   ├── main.js
│   ├── router.js
│   ├── audio-manager.js
│   ├── cursor-trail.js
│   ├── transition-manager.js
│   ├── components/
│   │   ├── background-world.js
│   │   ├── home-page.js
│   │   ├── haunted-todo.js
│   │   ├── focus-chamber.js
│   │   ├── whisper-well.js
│   │   ├── mood-tracker.js
│   │   ├── candle-timer.js
│   │   └── settings.js
│   └── utils/
│       ├── storage.js
│       └── helpers.js
├── assets/
│   ├── audio/
│   │   ├── ambient-loop.mp3
│   │   ├── task-complete.mp3
│   │   ├── skeleton-enter.mp3
│   │   └── release.mp3
│   └── images/
│       ├── scarecrow.svg
│       ├── pumpkin.svg
│       ├── tree.svg
│       ├── skeleton.svg
│       └── bat.svg
├── README.md
└── demo.gif
```

## Design Decisions and Rationales

### Why Vanilla JavaScript?
- Beginner-friendly without framework complexity
- Smaller bundle size for better performance
- Direct DOM manipulation is sufficient for this scope
- Educational value in understanding core web APIs

### Why Client-Side Only?
- No backend needed reduces complexity
- Whisper Well privacy guarantee is simpler to implement
- localStorage sufficient for task persistence
- Faster development and deployment

### Why CSS Animations Over Canvas?
- Better performance for most effects
- Hardware accelerated transforms
- Easier to maintain and debug
- Accessible to CSS-focused developers

### Why Limited Particle Count?
- Mobile device performance constraints
- Battery life considerations
- Visual effect still achieved with 6-8 particles
- Prevents memory leaks from particle accumulation

### Why Skeleton Transition is Optional?
- Accessibility consideration
- Some users may find it distracting
- Respects user preference for reduced motion
- Maintains core functionality without it

### Why IndexedDB Over localStorage for Mood Data?
- Better performance for larger datasets
- Structured querying capabilities (date ranges, mood filters)
- Asynchronous API prevents UI blocking
- Larger storage capacity (typically 50MB+ vs 5-10MB)
- Graceful fallback to localStorage maintains compatibility

### Why Numeric Mood Scores?
- Enables quantitative trend analysis
- Simplifies visualization (line charts, averages)
- Allows for statistical insights over time
- Maps naturally to heatmap intensity
- Maintains qualitative ghost representation for user-facing UI

### Why Night Mode Exclusive for Candle Timer?
- Thematic consistency (candles are nighttime/darkness symbols)
- Creates feature differentiation between modes
- Encourages mode exploration
- Flame visual effects look better against dark backgrounds
- Reinforces the "nightfall" branding of the feature

### Why SVG Over Canvas for Candle?
- Easier to style with CSS
- Better accessibility (can add ARIA labels to elements)
- Simpler animation with CSS keyframes
- Scales perfectly at any resolution
- Easier to maintain and debug
- Canvas reserved for particle-heavy effects only
