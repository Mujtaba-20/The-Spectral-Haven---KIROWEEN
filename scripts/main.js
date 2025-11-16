// Main Entry Point - Initialize application

import { Router } from './router.js';
import { AudioManager } from './audio-manager.js';
import { CursorTrail } from './cursor-trail.js';
import { TransitionManager } from './transition-manager.js';
import { BackgroundWorld } from './components/background-world.js';
import { HomePage } from './components/home-page.js';
import { HauntedToDo } from './components/haunted-todo.js';
import { FocusChamber } from './components/focus-chamber.js';
import { WhisperWell } from './components/whisper-well.js';
import { MoodTracker } from './components/mood-tracker.js';
import { CandleTimer } from './components/candle-timer.js';
import { SpookyTicTacToe } from './components/spooky-tictactoe.js';
import { SpookyTitleGenerator } from './components/spooky-title-generator.js';
import { RadiantSphere } from './components/radiant-sphere.js';
import { Settings } from './components/settings.js';

class HauntedChamberApp {
    constructor() {
        this.router = null;
        this.audioManager = null;
        this.cursorTrail = null;
        this.transitionManager = null;
        this.backgroundWorld = null;
    }

    async init() {
        console.log('🎃 Initializing The Spectral Haven...');

        // Initialize core systems
        this.initSettings();
        this.initBackgroundWorld();
        this.initAudioManager();
        this.initCursorTrail();
        this.initTransitionManager();
        this.initRouter();
        this.initNavigation();
        this.initKeyboardShortcuts();

        console.log('✨ The Spectral Haven initialized successfully');
    }

    initSettings() {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('hauntedChamberSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Apply theme
            if (settings.theme) {
                document.body.className = `theme-${settings.theme}`;
            }
            
            // Apply animations preference
            if (settings.animationsEnabled === false) {
                document.body.classList.add('animations-disabled');
            }
            
            // Mute state is handled by AudioManager
        }
        
        // Respect prefers-reduced-motion media query (Requirement 16.5)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.body.classList.add('animations-disabled');
        }
        
        // Listen for changes to prefers-reduced-motion
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('animations-disabled');
            } else {
                // Only remove if user hasn't explicitly disabled animations
                const savedSettings = localStorage.getItem('hauntedChamberSettings');
                if (savedSettings) {
                    const settings = JSON.parse(savedSettings);
                    if (settings.animationsEnabled !== false) {
                        document.body.classList.remove('animations-disabled');
                    }
                } else {
                    document.body.classList.remove('animations-disabled');
                }
            }
        });
    }

    initBackgroundWorld() {
        const container = document.getElementById('background-world');
        this.backgroundWorld = new BackgroundWorld(container);
        this.backgroundWorld.init();
    }

    initAudioManager() {
        this.audioManager = new AudioManager();
        this.audioManager.init();
        
        // Connect mute toggle
        const muteToggle = document.getElementById('mute-toggle');
        if (muteToggle) {
            muteToggle.addEventListener('click', () => {
                this.audioManager.toggleMute();
            });
        }
        
        // Enable audio on first user interaction (required by browsers)
        let audioEnabled = false;
        const enableAudio = () => {
            if (!audioEnabled) {
                audioEnabled = true;
                this.audioManager.enableAudioContext();
                console.log('🔊 Audio context enabled after user interaction');
                
                // Play intro if on homepage
                if (window.location.pathname === '/' || window.location.hash === '' || window.location.hash === '#/') {
                    setTimeout(() => {
                        this.audioManager.playSFX('homepage-intro');
                    }, 100);
                }
            }
        };
        
        // Listen for any user interaction
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
        
        // Make audio manager globally accessible
        window.audioManager = this.audioManager;
    }

    initCursorTrail() {
        this.cursorTrail = new CursorTrail();
        this.cursorTrail.init();
    }

    initTransitionManager() {
        this.transitionManager = new TransitionManager();
        this.transitionManager.init();
        
        // Make transition manager globally accessible
        window.transitionManager = this.transitionManager;
    }

    initRouter() {
        this.router = new Router();
        
        // Register routes
        this.router.register('/', HomePage);
        this.router.register('/tasks', HauntedToDo);
        this.router.register('/focus', FocusChamber);
        this.router.register('/whisper', WhisperWell);
        this.router.register('/mood', MoodTracker);
        this.router.register('/candle', CandleTimer);
        this.router.register('/tictactoe', SpookyTicTacToe);
        this.router.register('/title-generator', SpookyTitleGenerator);
        this.router.register('/radiant-sphere', RadiantSphere);
        this.router.register('/settings', Settings);
        
        // Start router
        this.router.init();
        
        // Make router globally accessible
        window.router = this.router;
    }

    initNavigation() {
        const navIcons = document.querySelectorAll('.nav-icon');
        navIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const route = icon.getAttribute('data-route');
                if (route) {
                    this.router.navigate(route);
                }
            });
        });
        
        // Initialize realm toggle
        this.initRealmToggle();
    }
    
    initRealmToggle() {
        const realmToggle = document.getElementById('realm-toggle');
        
        if (!realmToggle) return;
        
        // Load saved theme
        const savedSettings = localStorage.getItem('hauntedChamberSettings');
        let currentTheme = 'night';
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            currentTheme = settings.theme || 'night';
        }
        
        // Handle toggle click
        realmToggle.addEventListener('click', () => {
            // Toggle theme
            currentTheme = currentTheme === 'night' ? 'day' : 'night';
            
            // Update body class
            document.body.className = document.body.className.replace(/theme-\w+/, `theme-${currentTheme}`);
            
            // Save to localStorage
            const settings = savedSettings ? JSON.parse(savedSettings) : {};
            settings.theme = currentTheme;
            localStorage.setItem('hauntedChamberSettings', JSON.stringify(settings));
            
            console.log(`🌓 Switched to ${currentTheme} realm`);
        });
    }

    initKeyboardShortcuts() {
        const shortcuts = {
            '1': '/',
            '2': '/tasks',
            '3': '/focus',
            '4': '/whisper',
            '5': '/mood',
            '6': '/candle',
            '7': '/tictactoe',
            '8': '/title-generator',
            '9': '/radiant-sphere',
            '0': '/settings'
        };

        document.addEventListener('keydown', (e) => {
            // Only trigger if not typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            const route = shortcuts[e.key];
            if (route) {
                e.preventDefault();
                this.router.navigate(route);
            }
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new HauntedChamberApp();
        app.init();
    });
} else {
    const app = new HauntedChamberApp();
    app.init();
}
import { RadiantSphere } from "./components/radiant-sphere.js";

window.addEventListener("DOMContentLoaded", () => {
    const sphere = new RadiantSphere();
    sphere.render();
});
