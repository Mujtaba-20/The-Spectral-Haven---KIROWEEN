# Implementation Plan

- [x] 1. Set up project structure and core application shell





  - Create HTML structure with semantic elements for app container, background layer, navigation, page container, and transition layer
  - Set up CSS architecture with separate files for main styles, background, components, animations, and themes
  - Create JavaScript module structure with main entry point and component directories
  - Set up asset directories for audio and images
  - _Requirements: 1.1, 1.2, 4.1_

- [x] 2. Implement Background World component with animated scene elements






  - [x] 2.1 Create layered background structure with scarecrow, pumpkins, trees, clouds, bats, skeleton, and fog

    - Build SVG or image elements for each scene component
    - Position elements in appropriate z-index layers
    - _Requirements: 1.1, 1.8_
  

  - [x] 2.2 Implement CSS animations for scene elements

    - Add flickering animation for pumpkin inner glow
    - Create swaying keyframes for trees
    - Implement parallax scrolling for cloud layers
    - Add looping flight path for bats
    - Create gentle movement animation for hanging skeleton
    - Implement drifting fog overlay animation
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

- [x] 3. Create Audio Manager with ambient sound and mute control





  - [x] 3.1 Implement AudioManager class with ambient loop and SFX loading


    - Load ambient sound file (wind, chimes, crow)
    - Load SFX files (task-complete, skeleton-enter, release)
    - Implement play/pause/stop methods
    - _Requirements: 2.1_
  
  - [x] 3.2 Add mute toggle UI and state persistence


    - Create visible mute button in navigation or header
    - Implement toggle functionality to silence all audio
    - Save mute state to localStorage
    - Restore mute state on app load
    - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [x] 4. Implement Cursor Trail system with theme-aware styling





  - [x] 4.1 Create CursorTrail class with particle management


    - Initialize particle array (6-8 particles max)
    - Track mouse position with mousemove listener
    - Update particle positions using requestAnimationFrame
    - Apply CSS transforms for smooth animation
    - _Requirements: 3.1, 3.2, 3.5, 3.6_
  
  - [x] 4.2 Add theme-specific trail styling


    - Style trail as light and translucent for Day Mode
    - Style trail with glow effect for Night Mode
    - Update trail appearance when theme changes
    - _Requirements: 3.3, 3.4_

- [x] 5. Build Router with page navigation and transitions






  - [x] 5.1 Implement Router class with route registration and navigation

    - Create route mapping for all pages (home, tasks, focus, whisper, mood, candle, settings)
    - Implement navigate method with URL hash or history API
    - Handle browser back/forward navigation
    - _Requirements: 4.1, 4.2_
  

  - [x] 5.2 Add keyboard shortcuts for page navigation

    - Listen for number keys 1-7
    - Map keys to corresponding pages
    - Navigate to page when key pressed
    - _Requirements: 4.3_

- [x] 6. Create Transition Manager with portal ripple and skeleton animation





  - [x] 6.1 Implement portal ripple transition effect


    - Create CSS radial animation for portal effect
    - Trigger animation on page navigation
    - Apply camera/zoom effect to background
    - _Requirements: 4.4, 4.5_
  
  - [x] 6.2 Implement skeleton slide-in animation


    - Create skeleton SVG or image element
    - Animate skeleton sliding in from right
    - Add sway/tilt animation with caption
    - Animate skeleton sliding out after 600-900ms
    - Play skeleton-enter SFX
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  
  - [x] 6.3 Add skeleton animation toggle in settings


    - Create toggle control in Settings page
    - Skip skeleton animation when disabled
    - Persist toggle state to localStorage
    - _Requirements: 12.7_

- [x] 7. Build Home Page with mini-widgets





  - Create HomePage component with title "Ghostly Grove" and subtitle
  - Render mini task cluster widget (3-4 small ghosts)
  - Render mini stopwatch widget showing timer state
  - Render mini portal widget with swirling effect
  - Render mini mood widget showing today's mood ghost if recorded
  - Render mini candle widget (Night Mode only) with small burning candle
  - Add click handlers to navigate to full pages
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [x] 8. Implement Haunted To-Do page with task management




  - [x] 8.1 Create HauntedToDo component with task CRUD operations


    - Build UI with title "Haunted To-Do List" and subtitle
    - Create input field for adding new tasks
    - Implement addTask method to create task with "new" state
    - Implement editTask method to update task text
    - Implement completeTask method to mark task as completed
    - Load tasks from localStorage on init
    - Save tasks to localStorage after each change
    - _Requirements: 6.1, 6.2, 6.6_
  
  - [x] 8.2 Implement ghost animations for task states


    - Create ghost SVG or image for each task
    - Animate ghost fade-in for "new" state
    - Apply floating animation for "active" state
    - Apply jittery CSS animation for "overdue" state
    - Animate ghost bowing, floating up, and fading out for "completed" state
    - Play task-complete SFX when task completed
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.7_
  
  - [x] 8.3 Implement fog density based on incomplete task count


    - Calculate fog opacity based on number of incomplete tasks
    - Update fog overlay opacity when tasks added/completed
    - Use formula: opacity = min(0.8, incompleteTasks * 0.1)
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 8.4 Add hover tooltips with whisper phrases


    - Display tooltip on ghost hover
    - Show random whisper phrase for each task
    - _Requirements: 8.1, 8.2_
  
  - [x] 8.5 Create plain list fallback view


    - Build accessible list view of tasks
    - Add toggle to switch between ghost and list views
    - Maintain all task management functionality in list view
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 9. Build Focus Chamber with stopwatch and visual feedback





  - [x] 9.1 Create FocusChamber component with timer controls


    - Build UI with title "Focus Chamber" and subtitle
    - Create floating mystical stopwatch display
    - Implement start/stop/reset controls
    - Track elapsed time using Date.now()
    - Update display every frame or second
    - _Requirements: 10.1, 10.2_
  
  - [x] 9.2 Add particle emission and candle animation during active session


    - Emit soft glowing particles while stopwatch running
    - Display optional candle burning animation
    - Animate candle flame and wax level based on elapsed time
    - _Requirements: 10.3, 10.4_
  
  - [x] 9.3 Implement duration-based completion messages

    - Show playful spooky message when stopwatch stopped
    - Select message based on elapsed duration
    - Display messages like "A brief haunting..." for short sessions
    - _Requirements: 10.5_
  
  - [x] 9.4 Add task association feature

    - Provide option to link stopwatch to a selected task
    - Display linked task name during focus session
    - _Requirements: 10.6_

- [x] 10. Create Whisper Well with symbolic text release




  - [x] 10.1 Build WhisperWell component with privacy-focused input


    - Create UI with title "The Whisper Well" and subtitle
    - Display privacy notice: "This is symbolic. Nothing you type is saved, sent, or viewable. Do not enter personal or sensitive data."
    - Create text input field and Release button
    - Create ghost reply display area
    - _Requirements: 11.1, 11.2_
  
  - [x] 10.2 Implement text dissolve animation and ghost reply


    - Read input value directly from DOM on Release click
    - Immediately clear input field
    - Create temporary DOM elements for each character
    - Animate characters dissolving into mist (opacity and transform)
    - Remove temporary elements after animation
    - Select random ghost reply from predefined list
    - Display ghost reply with fade-in animation
    - Play release SFX
    - Ensure no text persistence or network transmission
    - _Requirements: 11.3, 11.4, 11.5, 11.6, 11.7_

- [x] 11. Implement Mood Tracker with daily entry and visualizations





  - [x] 11.1 Create MoodTracker component with IndexedDB storage


    - Build UI with title "Mood Grove" and subtitle
    - Initialize IndexedDB with moodEntries store
    - Implement fallback to localStorage if IndexedDB unavailable
    - Create mood entry data structure with date, mood, score, note, timestamp
    - _Requirements: 17.4, 17.5_
  
  - [x] 11.2 Build daily entry view with ghost mood selection


    - Display five large ghost buttons for moods: Scared, Happy, Sad, Depressed, Excited
    - Add optional note textarea
    - Display privacy text: "Mood data is stored on this device only"
    - Implement recordMood method to save entry
    - Map mood types to scores (Scared=1, Depressed=2, Sad=3, Happy=4, Excited=5)
    - Update existing entry if recording for same day
    - _Requirements: 17.1, 17.2, 17.3, 17.6, 17.7, 18.1_
  
  - [x] 11.3 Create weekly view with mood score trend line


    - Fetch last 7 days of mood entries
    - Generate sparkline or line chart showing mood score trend
    - Display dates and scores on chart
    - _Requirements: 18.2_
  
  - [x] 11.4 Build monthly calendar heatmap view


    - Generate calendar grid for current month
    - Apply heatmap colors based on mood scores
    - Display chosen ghost icon on recorded days
    - Add hover tooltips showing mood and note
    - Use theme-appropriate colors for Day/Night modes
    - _Requirements: 18.3, 18.4, 18.5, 18.6, 18.7, 18.8_
  
  - [x] 11.5 Implement export and clear data functionality


    - Create "Export CSV" button
    - Generate CSV with headers: Date, Mood, Score, Note
    - Trigger download of CSV file
    - Create "Clear local data" button with confirmation dialog
    - Delete all mood entries from storage when confirmed
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_
  
  - [x] 11.6 Add keyboard navigation and accessibility features


    - Enable arrow key navigation between mood ghost buttons
    - Allow Enter/Space key to select mood
    - Add text labels for each mood ghost
    - Provide ARIA labels for screen reader compatibility
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

- [x] 12. Build Nightfall Candle Timer with melting animation






  - [x] 12.1 Create NightfallCandleTimer component with theme restriction


    - Build UI with title "Nightfall Candle Timer" and subtitle
    - Check current theme on render
    - Display message "The Nightfall Candle only burns after dusk" in Day Mode
    - Render functional candle timer only in Night Mode
    - _Requirements: 21.8, 21.9, 21.10_
  
  - [x] 12.2 Implement candle SVG with animated flame

    - Create SVG candle with flame, wick, wax body, drips, and base
    - Add CSS keyframe animation for flame flicker
    - Position flame at top of wax body
    - _Requirements: 21.1, 21.4_
  
  - [x] 12.3 Build timer controls with duration selection

    - Create duration buttons for 5, 10, 15, 30 minutes
    - Add Start/Pause/Reset buttons
    - Display time remaining
    - _Requirements: 21.2_
  
  - [x] 12.4 Implement candle melting animation based on timer progress

    - Calculate progress percentage from elapsed time
    - Update wax body height using CSS transform scaleY
    - Move flame position upward as candle melts
    - Trigger periodic wax drip animations
    - Use requestAnimationFrame for smooth updates
    - _Requirements: 21.3, 21.5_
  
  - [x] 12.5 Add flame extinguish and completion sequence

    - Fade flame opacity to 0 when timer reaches zero
    - Display smoke puff animation rising from wick
    - Show random ghost completion message
    - Messages include: "The flame has faded…", "Darkness reclaims the light.", etc.
    - _Requirements: 21.6, 21.7_
  
  - [x] 12.6 Apply skeleton transition to candle timer page navigation

    - Ensure skeleton animation plays when navigating to/from candle timer page
    - _Requirements: 21.11_

- [x] 13. Create Settings page with user preferences





  - [x] 13.1 Build Settings component with all toggle controls



    - Create UI with title "Spellbook Settings" and subtitle
    - Add Day/Night mode toggle
    - Add Animation toggle
    - Add Skeleton transition toggle
    - Add Plain list mode toggle
    - Add Mute toggle (duplicate of global mute control)
    - _Requirements: 13.1, 13.2, 13.3, 15.1_
  
  - [x] 13.2 Implement theme switching functionality

    - Update CSS custom properties or class on root element
    - Apply Day Mode colors (light, translucent)
    - Apply Night Mode colors (dark, glowing)
    - Update all page elements to match theme
    - Persist theme preference to localStorage
    - _Requirements: 13.1, 13.2, 13.4, 13.5_
  
  - [x] 13.3 Implement animation toggle functionality

    - Disable all decorative animations when toggled off
    - Maintain functional interactions
    - Persist animation preference to localStorage
    - _Requirements: 15.2, 15.3, 15.4_

- [x] 14. Apply design system with color palette and typography





  - Define CSS custom properties for deep dark background
  - Define accent colors: pumpkin orange, soft purple, ghostly teal
  - Set decorative fonts for headings
  - Set sans-serif fonts for body text
  - Apply smooth micro-interactions to buttons and interactive elements
  - Add subtle glow and shadow effects
  - Ensure no gore or frightening imagery
  - Maintain legible UI across all themes
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8_

- [x] 15. Optimize for performance and accessibility






  - [x] 15.1 Implement performance optimizations

    - Limit cursor trail particles to 6-8
    - Use CSS transforms for animations
    - Optimize requestAnimationFrame loops
    - Test on typical laptops and mobile phones
    - Ensure smooth frame rates
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  
  - [x] 15.2 Add accessibility features


    - Respect prefers-reduced-motion media query
    - Ensure keyboard navigation works for all interactive elements
    - Add ARIA labels where needed
    - Test with screen readers
    - Ensure sufficient color contrast
    - _Requirements: 16.5_

- [-] 16. Create documentation and demo materials


  - [x] 16.1 Write README with privacy and accessibility information



    - Document Whisper Well privacy guarantee (no data saved/sent)
    - Document Mood Tracker local storage (device-only)
    - Explain how to disable animations in Settings
    - Explain how to disable sound with mute toggle
    - Include setup and usage instructions
    - _Requirements: 17.1, 17.2, 17.3_
  
  - [ ]* 16.2 Create demo video showing key features
    - Record 30-60 second demo
    - Show cursor trail effect
    - Demonstrate day to night toggle
    - Show adding and completing a task with ghost animation
    - Demonstrate stopwatch start and stop
    - Show Whisper Well Release action
    - Show Skeleton Transition between pages
    - Demonstrate mood entry and calendar visualization
    - Show Nightfall Candle Timer with melting animation
    - _Requirements: 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 17.10, 17.11, 17.12_
