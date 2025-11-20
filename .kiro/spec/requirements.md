# Requirements Document

## Introduction

The Spectral Haven is a Halloween-themed web application that provides a cohesive, atmospheric experience across multiple pages. The application features a persistent animated background world, interactive task management with ghost animations, a focus timer, and a symbolic confession ritual. The design prioritizes accessibility, performance, and a whimsical (not scary) aesthetic suitable for beginners while maintaining visual polish.

## Glossary

- **The Spectral Haven**: The complete web application system
- **Background World**: The persistent layered visual scene visible across all pages
- **Ghost Trail**: The cursor effect that follows mouse movement with a fading trail
- **Haunted To-Do**: The task management page featuring animated ghost representations
- **Focus Chamber**: The stopwatch/timer page for tracking focus sessions
- **Whisper Well**: The symbolic confession ritual page with client-only input
- **Skeleton Transition**: The animated character that appears during page navigation
- **Day Mode**: Light theme variant with lighter colors and translucent effects
- **Night Mode**: Dark theme variant with glowing effects
- **Fog Density**: Visual fog effect that increases based on incomplete task count
- **Icon Bar Nav**: The navigation menu displaying icons for each page
- **Mood Tracker**: The mood tracking page featuring ghost-based mood input
- **Mood Entry**: A single recorded mood with optional note for a specific day
- **Mood Score**: Numeric value assigned to each mood type for trend visualization
- **Nightfall Candle Timer**: The visual countdown timer page featuring a melting candle animation
- **Candle Timer**: The countdown timer represented by a melting candle visual
- **Ambient Sound**: Background audio loop of wind, chimes, and crow sounds
- **SFX**: Short sound effects triggered by user interactions
- **Animation Toggle**: Settings control to disable animations for accessibility
- **Mute Toggle**: Control to silence all audio in the application

## Requirements

### Requirement 1

**User Story:** As a user, I want to see a consistent Halloween-themed world across all pages, so that the application feels cohesive and immersive

#### Acceptance Criteria

1. THE Spectral Haven SHALL render a Background World containing a scarecrow, carved pumpkins, wavy trees, layered clouds, bats, a hanging skeleton, and fog overlay
2. WHEN the user navigates between pages, THE Spectral Haven SHALL maintain visibility of the Background World
3. THE Spectral Haven SHALL animate pumpkins with a flickering inner glow effect
4. THE Spectral Haven SHALL animate trees with a subtle swaying motion
5. THE Spectral Haven SHALL animate clouds with parallax scrolling movement
6. THE Spectral Haven SHALL animate bats with a looping flight pattern
7. THE Spectral Haven SHALL animate the hanging skeleton with gentle movement
8. THE Spectral Haven SHALL display a soft drifting fog overlay across the scene

### Requirement 2

**User Story:** As a user, I want ambient sound and a way to control it, so that I can enjoy atmospheric audio or work in silence

#### Acceptance Criteria

1. THE Spectral Haven SHALL play a looping Ambient Sound containing wind, faint chimes, and occasional crow sounds at low volume
2. THE Spectral Haven SHALL display a visible Mute Toggle control
3. WHEN the user activates the Mute Toggle, THE Spectral Haven SHALL silence all Ambient Sound and SFX
4. WHEN the user deactivates the Mute Toggle, THE Spectral Haven SHALL resume playing Ambient Sound and SFX
5. THE Spectral Haven SHALL persist the mute state across page navigation

### Requirement 3

**User Story:** As a user, I want my cursor to have a themed trailing effect, so that interactions feel magical and on-theme

#### Acceptance Criteria

1. THE Spectral Haven SHALL render a Ghost Trail effect that follows the cursor position
2. THE Spectral Haven SHALL fade the Ghost Trail smoothly over time
3. WHILE Day Mode is active, THE Spectral Haven SHALL render the Ghost Trail as light and translucent
4. WHILE Night Mode is active, THE Spectral Haven SHALL render the Ghost Trail with a slight glow effect
5. THE Spectral Haven SHALL implement the Ghost Trail using a low particle count to maintain performance
6. THE Spectral Haven SHALL use CSS transforms or requestAnimationFrame for Ghost Trail rendering

### Requirement 4

**User Story:** As a user, I want to navigate between different pages using icons and keyboard shortcuts, so that I can access features quickly

#### Acceptance Criteria

1. THE Spectral Haven SHALL display an Icon Bar Nav containing icons for Home, Tasks, Focus, Whisper Well, Mood Tracker, Nightfall Candle Timer, and Settings pages
2. WHEN the user clicks a navigation icon, THE Spectral Haven SHALL transition to the corresponding page
3. WHERE keyboard shortcuts are enabled, THE Spectral Haven SHALL navigate to pages when the user presses keys 1 through 7
4. WHEN transitioning between pages, THE Spectral Haven SHALL display a portal ripple animation
5. WHEN transitioning between pages, THE Spectral Haven SHALL apply a camera or zoom effect while keeping the Background World visible

### Requirement 5

**User Story:** As a user, I want a home page that provides an overview of all features, so that I can quickly access any section

#### Acceptance Criteria

1. THE Spectral Haven SHALL display a Home page showing the full Background World scene
2. THE Spectral Haven SHALL render mini-widgets on the Home page for tasks, stopwatch, Whisper Well, mood tracker, and candle timer
3. WHEN the user clicks a mini-widget, THE Spectral Haven SHALL transition to the corresponding full page
4. THE Spectral Haven SHALL display the mini tasks widget showing a cluster of task ghosts
5. THE Spectral Haven SHALL display the mini stopwatch widget showing the timer state
6. THE Spectral Haven SHALL display the mini portal widget representing the Whisper Well
7. THE Spectral Haven SHALL display the mini mood widget showing the current day's mood ghost if recorded
8. WHILE Night Mode is active, THE Spectral Haven SHALL display the mini candle widget showing a small burning candle

### Requirement 6

**User Story:** As a task manager user, I want to add, edit, and complete tasks with visual feedback, so that managing my to-do list is engaging

#### Acceptance Criteria

1. THE Spectral Haven SHALL display a Haunted To-Do page for task management
2. WHEN the user adds a task, THE Spectral Haven SHALL create an animated ghost representation with a "new" state
3. WHEN a task becomes active, THE Spectral Haven SHALL update the ghost to an "active" state
4. WHEN a task becomes overdue, THE Spectral Haven SHALL update the ghost to a jittery "overdue" state
5. WHEN the user completes a task, THE Spectral Haven SHALL animate the ghost bowing, floating upward, and fading out
6. THE Spectral Haven SHALL allow the user to edit existing task text
7. THE Spectral Haven SHALL play a short SFX when a task is completed

### Requirement 7

**User Story:** As a user, I want visual feedback based on my task load, so that I can see the impact of incomplete work

#### Acceptance Criteria

1. WHEN the number of incomplete tasks increases, THE Spectral Haven SHALL increase the Fog Density on the Haunted To-Do page
2. WHEN the number of incomplete tasks decreases, THE Spectral Haven SHALL decrease the Fog Density on the Haunted To-Do page
3. THE Spectral Haven SHALL calculate Fog Density proportionally to the incomplete task count

### Requirement 8

**User Story:** As a user hovering over tasks, I want to see playful whisper messages, so that the interface feels more interactive

#### Acceptance Criteria

1. WHEN the user hovers over a task ghost, THE Spectral Haven SHALL display a tooltip with a small whisper phrase
2. THE Spectral Haven SHALL vary the whisper phrases across different tasks

### Requirement 9

**User Story:** As a user who needs accessibility, I want a plain list view of tasks, so that I can use the app without animations

#### Acceptance Criteria

1. THE Spectral Haven SHALL provide a toggleable plain list fallback view for the Haunted To-Do page
2. WHEN the plain list view is enabled, THE Spectral Haven SHALL display tasks as a simple accessible list
3. THE Spectral Haven SHALL maintain all task management functionality in plain list view

### Requirement 10

**User Story:** As a user tracking focus time, I want a mystical stopwatch that provides visual feedback, so that I can monitor my concentration sessions

#### Acceptance Criteria

1. THE Spectral Haven SHALL display a Focus Chamber page with a floating mystical stopwatch
2. WHEN the user starts the stopwatch, THE Spectral Haven SHALL begin tracking elapsed time
3. WHILE the stopwatch is running, THE Spectral Haven SHALL emit soft glowing particles
4. WHILE the stopwatch is running, THE Spectral Haven SHALL display an optional candle burning animation representing elapsed time
5. WHEN the user stops the stopwatch, THE Spectral Haven SHALL display a playful spooky message based on the duration
6. WHERE a task is selected, THE Spectral Haven SHALL associate the stopwatch session with that task

### Requirement 11

**User Story:** As a user seeking symbolic release, I want to enter text that is never saved or transmitted, so that I can experience catharsis safely

#### Acceptance Criteria

1. THE Spectral Haven SHALL display a Whisper Well page with a text input and Release button
2. THE Spectral Haven SHALL display pre-text stating "This is symbolic. Nothing you type is saved, sent, or viewable. Do not enter personal or sensitive data."
3. WHEN the user clicks the Release button, THE Spectral Haven SHALL animate the input text dissolving into mist
4. WHEN the text dissolves, THE Spectral Haven SHALL display a random playful ghost reply from a predefined list
5. THE Spectral Haven SHALL NOT store, log, or transmit any text entered in the Whisper Well
6. THE Spectral Haven SHALL play a short SFX when the Release action occurs
7. THE Spectral Haven SHALL clear the input field after the Release animation completes

### Requirement 12

**User Story:** As a user navigating between pages, I want to see a skeleton animation, so that transitions feel more entertaining

#### Acceptance Criteria

1. WHEN the user navigates to a different page, THE Spectral Haven SHALL display a Skeleton Transition animation
2. THE Spectral Haven SHALL animate the skeleton sliding in from the right side
3. THE Spectral Haven SHALL animate the skeleton swaying and tilting
4. THE Spectral Haven SHALL display a short caption with the skeleton
5. THE Spectral Haven SHALL animate the skeleton sliding out after 600 to 900 milliseconds
6. THE Spectral Haven SHALL play a short SFX when the skeleton enters
7. THE Spectral Haven SHALL provide a toggle in Settings to disable the Skeleton Transition

### Requirement 13

**User Story:** As a user, I want to switch between day and night modes, so that I can adjust the visual theme to my preference

#### Acceptance Criteria

1. THE Spectral Haven SHALL provide a Day Mode with light colors and translucent effects
2. THE Spectral Haven SHALL provide a Night Mode with dark colors and glowing effects
3. THE Spectral Haven SHALL display a toggle control for switching between Day Mode and Night Mode
4. WHEN the user switches modes, THE Spectral Haven SHALL update all visual elements to match the selected theme
5. THE Spectral Haven SHALL persist the selected mode across page navigation

### Requirement 14

**User Story:** As a user, I want the app to use an appropriate color palette and typography, so that it looks polished and readable

#### Acceptance Criteria

1. THE Spectral Haven SHALL use a deep dark background color as the base
2. THE Spectral Haven SHALL use pumpkin orange, soft purple, and ghostly teal as accent colors
3. THE Spectral Haven SHALL use decorative fonts for headings
4. THE Spectral Haven SHALL use sans-serif fonts for body text to ensure readability
5. THE Spectral Haven SHALL apply smooth micro-interactions to interactive elements
6. THE Spectral Haven SHALL apply subtle glow and shadow effects to enhance depth
7. THE Spectral Haven SHALL avoid gore or frightening imagery
8. THE Spectral Haven SHALL maintain legible UI elements across all themes

### Requirement 15

**User Story:** As a user with accessibility needs, I want to disable animations, so that I can use the app comfortably

#### Acceptance Criteria

1. THE Spectral Haven SHALL provide an Animation Toggle control in the Settings page
2. WHEN the Animation Toggle is disabled, THE Spectral Haven SHALL disable all decorative animations
3. WHEN the Animation Toggle is disabled, THE Spectral Haven SHALL maintain all functional interactions
4. THE Spectral Haven SHALL persist the animation preference across sessions

### Requirement 16

**User Story:** As a user on various devices, I want the app to perform well, so that I can use it smoothly on laptops and phones

#### Acceptance Criteria

1. THE Spectral Haven SHALL maintain smooth performance on typical laptop computers
2. THE Spectral Haven SHALL maintain smooth performance on typical mobile phones
3. THE Spectral Haven SHALL limit the Ghost Trail particle count to ensure performance
4. THE Spectral Haven SHALL optimize all animations for performance
5. THE Spectral Haven SHALL NOT auto-play audio at loud volumes

### Requirement 17

**User Story:** As a user tracking my emotional state, I want to record my daily mood using ghost icons, so that I can monitor my emotional patterns over time

#### Acceptance Criteria

1. THE Spectral Haven SHALL display a Mood Tracker page with five ghost icons representing Scared, Happy, Sad, Depressed, and Excited moods
2. WHEN the user taps a ghost icon, THE Spectral Haven SHALL record a Mood Entry for the current day
3. THE Spectral Haven SHALL provide an optional short note field for each Mood Entry
4. THE Spectral Haven SHALL store Mood Entry data in browser storage using IndexedDB or localStorage
5. THE Spectral Haven SHALL display text stating "Mood data is stored on this device only"
6. THE Spectral Haven SHALL NOT transmit mood data to remote servers
7. THE Spectral Haven SHALL assign a Mood Score to each mood type for visualization purposes

### Requirement 18

**User Story:** As a user reviewing my mood history, I want to see weekly and monthly visualizations, so that I can identify emotional patterns

#### Acceptance Criteria

1. THE Spectral Haven SHALL display a daily quick-entry view with large ghost buttons
2. THE Spectral Haven SHALL display a weekly view showing a 7-day trend line or sparkline of Mood Score values
3. THE Spectral Haven SHALL display a monthly view with a calendar heatmap showing mood intensity per day
4. WHEN the user hovers over a calendar day, THE Spectral Haven SHALL display the recorded mood ghost and note
5. THE Spectral Haven SHALL display the chosen ghost icon on recorded days in the calendar
6. THE Spectral Haven SHALL apply soft glows and theme-consistent colors to mood visualizations
7. WHEN Day Mode is active, THE Spectral Haven SHALL style mood ghosts with light theme colors
8. WHEN Night Mode is active, THE Spectral Haven SHALL style mood ghosts with dark theme colors

### Requirement 19

**User Story:** As a user managing my mood data, I want to export or clear my records, so that I have control over my personal information

#### Acceptance Criteria

1. THE Spectral Haven SHALL provide an "Export CSV" button on the Mood Tracker page
2. WHEN the user clicks "Export CSV", THE Spectral Haven SHALL generate a CSV file containing all Mood Entry records
3. THE Spectral Haven SHALL provide a "Clear local data" action for mood records
4. WHEN the user initiates "Clear local data", THE Spectral Haven SHALL display a confirmation dialog
5. WHEN the user confirms data clearing, THE Spectral Haven SHALL delete all stored Mood Entry records

### Requirement 20

**User Story:** As a user with accessibility needs, I want keyboard input and text alternatives for mood selection, so that I can track my mood without a mouse

#### Acceptance Criteria

1. THE Spectral Haven SHALL allow keyboard navigation between mood ghost icons
2. THE Spectral Haven SHALL allow mood selection using the Enter or Space key
3. THE Spectral Haven SHALL provide text labels for each mood ghost icon
4. THE Spectral Haven SHALL provide ARIA labels for screen reader compatibility

### Requirement 21

**User Story:** As a user wanting a visual countdown timer, I want to see a melting candle that represents time passing, so that I can track time in an atmospheric way

#### Acceptance Criteria

1. THE Spectral Haven SHALL display a Nightfall Candle Timer page with a large spooky candle visual
2. THE Spectral Haven SHALL provide countdown time options of 5, 10, 15, and 30 minutes
3. WHEN the user starts the Candle Timer, THE Spectral Haven SHALL animate the candle melting down proportionally to elapsed time
4. WHILE the Candle Timer is running, THE Spectral Haven SHALL animate the candle flame flickering
5. WHILE the Candle Timer is running, THE Spectral Haven SHALL animate small wax drips
6. WHEN the Candle Timer reaches zero, THE Spectral Haven SHALL animate the flame going out with a soft smoke effect
7. WHEN the Candle Timer completes, THE Spectral Haven SHALL display a ghost message such as "The flame has faded…"
8. WHILE Day Mode is active, THE Spectral Haven SHALL display a message stating "The Nightfall Candle only burns after dusk" instead of the candle
9. WHILE Night Mode is active, THE Spectral Haven SHALL display the functional Candle Timer
10. THE Spectral Haven SHALL apply the Background World to the Nightfall Candle Timer page
11. THE Spectral Haven SHALL apply the Skeleton Transition when navigating to or from the Nightfall Candle Timer page

### Requirement 22

**User Story:** As a new user, I want documentation explaining privacy and accessibility features, so that I understand how to use the app safely

#### Acceptance Criteria

1. THE Spectral Haven SHALL include a README file documenting the Whisper Well privacy guarantee
2. THE Spectral Haven SHALL document how to disable animations in the README
3. THE Spectral Haven SHALL document how to disable sound in the README
4. THE Spectral Haven SHALL provide a 30 to 60 second demo video showing key features
5. THE Spectral Haven SHALL demonstrate the cursor trail in the demo video
6. THE Spectral Haven SHALL demonstrate the day to night toggle in the demo video
7. THE Spectral Haven SHALL demonstrate adding and completing a task in the demo video
8. THE Spectral Haven SHALL demonstrate the stopwatch start and stop in the demo video
9. THE Spectral Haven SHALL demonstrate the Whisper Well Release action in the demo video
10. THE Spectral Haven SHALL demonstrate the Skeleton Transition in the demo video
11. THE Spectral Haven SHALL demonstrate mood entry and calendar visualization in the demo video
12. THE Spectral Haven SHALL demonstrate the Nightfall Candle Timer with melting animation in the demo video
