// Home Page Component

import { getSettings, getTodayDate, formatDuration } from '../utils/helpers.js';

export class HomePage {
    constructor() {
        this.container = null;
        this.settings = getSettings();
    }

    async render() {
        this.container = document.getElementById('page-container');
        
        // Load data for widgets
        const taskData = await this.getTaskData();
        const focusData = this.getFocusData();
        const moodData = await this.getMoodData();
        
        this.container.innerHTML = `
            <div class="home-page">
                <h1 class="spectral-title">The Spectral Haven</h1>
                <p class="subtitle">Welcome, traveler. The Grove awakens with every step you take.</p>
                
                <div class="mini-widgets grid grid-3">
                    ${this.renderTaskWidget(taskData)}
                    ${this.renderFocusWidget(focusData)}
                    ${this.renderPortalWidget()}
                    ${this.renderMoodWidget(moodData)}
                    ${this.renderCandleWidget()}
                    ${this.renderTicTacToeWidget()}
                    ${this.renderTitleGeneratorWidget()}
                    ${this.renderRadiantSphereWidget()}
                    ${this.renderSettingsWidget()}
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.startFocusTimer();
        
        // Show welcome modal on first visit
        this.showWelcomeModal();
        
        // Play intro music when homepage loads
        this.playIntro();
    }

showWelcomeModal() {
    // Detect a full page load (NOT SPA navigation)
    const isFullReload =
        performance.getEntriesByType("navigation")[0]?.type === "reload" ||
        performance.getEntriesByType("navigation")[0]?.type === "navigate";

    // If not a full reload, do nothing
    if (!isFullReload) return;

    const modal = document.createElement('div');
    modal.className = 'welcome-modal';
    modal.innerHTML = `
        <div class="welcome-content">
            <div class="welcome-sparkles">
                <div class="sparkle-dot"></div>
                <div class="sparkle-dot"></div>
                <div class="sparkle-dot"></div>
                <div class="sparkle-dot"></div>
                <div class="sparkle-dot"></div>
            </div>
            <h1 class="welcome-title">The Spectral Haven</h1>
            <p class="welcome-subtitle">
                Welcome, traveler. The Grove awakens with every step you take. 
                The Spectral Haven is a cozy little creation — stitched from strange tools, 
                whispering components, and reanimated ideas powered by Kiro’s enchanting code. 
                It’s a haunted workshop filled with glowing orbs, Whisper Well, and playful effects crafted for you. 
                Enjoy this Haunted Journey!!!
            </p>
            <button class="welcome-close" id="welcome-close">
                ✨ Enter The Haven ✨
            </button>
        </div>
    `;

    // Safety: remove old modal
    const existing = document.querySelector('.welcome-modal');
    if (existing) existing.remove();

    document.body.appendChild(modal);

    const closeBtn = document.getElementById('welcome-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'modalFadeIn 0.3s ease-out reverse';
            setTimeout(() => modal.remove(), 300);
        });
    }

    if (window.audioManager?.playSFX) {
        setTimeout(() => window.audioManager.playSFX('shimmer'), 200);
    }
}

    // Play shimmer sound (AudioManager)
    if (window.audioManager && typeof window.audioManager.playSFX === 'function') {
        setTimeout(() => {
            window.audioManager.playSFX('shimmer');
        }, 200);
    }
}

    playIntro() {
        // Play intro when homepage loads (after audio context is enabled)
        if (window.audioManager && window.audioManager.audioContextEnabled) {
            setTimeout(() => {
                window.audioManager.playSFX('homepage-intro');
            }, 100);
        }
    }

    async getTaskData() {
        try {
            const tasksJson = localStorage.getItem('tasks');
            if (tasksJson) {
                const tasks = JSON.parse(tasksJson);
                const incompleteTasks = tasks.filter(t => t.state !== 'completed');
                return {
                    count: incompleteTasks.length,
                    hasAny: tasks.length > 0
                };
            }
        } catch (e) {
            console.error('Error loading task data:', e);
        }
        return { count: 0, hasAny: false };
    }

    getFocusData() {
        try {
            const focusState = localStorage.getItem('focusState');
            if (focusState) {
                const state = JSON.parse(focusState);
                if (state.running) {
                    return {
                        running: true,
                        startTime: state.startTime,
                        elapsed: state.elapsed || 0
                    };
                }
            }
        } catch (e) {
            console.error('Error loading focus data:', e);
        }
        return { running: false, elapsed: 0 };
    }

    async getMoodData() {
        try {
            const today = getTodayDate();
            
            // Try localStorage first
            const moodEntriesJson = localStorage.getItem('moodEntries');
            if (moodEntriesJson) {
                const entries = JSON.parse(moodEntriesJson);
                const todayEntry = entries.find(e => e.date === today);
                if (todayEntry) {
                    return {
                        hasMood: true,
                        mood: todayEntry.mood
                    };
                }
            }
        } catch (e) {
            console.error('Error loading mood data:', e);
        }
        return { hasMood: false, mood: null };
    }

    renderTaskWidget(taskData) {
        const display = '<div class="widget-icon">📝</div>';
        
        return `
            <div class="card mini-widget mini-task-widget" data-route="/tasks">
                <h3>Haunted<br>Tasks</h3>
                <p class="widget-tagline">Free the waiting spirits.</p>
                <div class="widget-preview task-preview">
                    ${display}
                </div>
            </div>
        `;
    }

    renderFocusWidget(focusData) {
        let displayTime = '00:00';
        if (focusData.running) {
            const elapsed = Date.now() - focusData.startTime + focusData.elapsed;
            displayTime = formatDuration(elapsed);
        }
        
        const statusClass = focusData.running ? 'running' : 'idle';
        
        return `
            <div class="card mini-widget mini-focus-widget" data-route="/focus">
                <h3>Focus<br>Chamber</h3>
                <p class="widget-tagline">Shape time with your will.</p>
                <div class="widget-preview focus-preview ${statusClass}">
                    <div class="stopwatch-display">${displayTime}</div>
                    ${focusData.running ? '<div class="focus-indicator">●</div>' : ''}
                </div>
            </div>
        `;
    }

    renderPortalWidget() {
        return `
            <div class="card mini-widget mini-portal-widget" data-route="/whisper">
                <h3>Whisper<br>Well</h3>
                <p class="widget-tagline">Release a secret into the mist.</p>
                <div class="widget-preview portal-preview">
                    <div class="widget-icon">🌀</div>
                </div>
            </div>
        `;
    }

    renderMoodWidget(moodData) {
        const moodEmojis = {
            scared: '😨',
            depressed: '😔',
            sad: '😢',
            happy: '😊',
            excited: '🤩'
        };
        
        const moodLabels = {
            scared: 'Scared',
            depressed: 'Depressed',
            sad: 'Sad',
            happy: 'Happy',
            excited: 'Excited'
        };
        
        const display = moodData.hasMood 
            ? `<div class="mood-ghost">${moodEmojis[moodData.mood] || '👻'}</div>`
            : '';
        
        const moodLabel = moodData.hasMood 
            ? `<div class="mood-label">Today: ${moodLabels[moodData.mood]}</div>`
            : '';
        
        const moodDisplay = moodData.hasMood 
            ? `<div class="widget-icon">😊</div><div class="mood-ghost">${moodEmojis[moodData.mood] || '👻'}</div>`
            : '<div class="widget-icon">😊</div>';
        
        return `
            <div class="card mini-widget mini-mood-widget" data-route="/mood" data-mood-widget>
                <h3>Mood<br>Grove</h3>
                <p class="widget-tagline">Choose the ghost that feels like you.</p>
                <div class="widget-preview mood-preview">
                    ${moodDisplay}
                </div>
                ${moodLabel}
            </div>
        `;
    }

    renderCandleWidget() {
        // Only show candle in Night Mode (Requirement 5.8)
        if (this.settings.theme !== 'night') {
            return `
                <div class="card mini-widget mini-candle-widget disabled" data-route="/candle">
                    <h3>Nightfall<br>Candle</h3>
                    <p class="widget-tagline">Let the flame measure your moment.</p>
                    <div class="widget-preview candle-preview">
                        <span class="empty-state">After dusk only</span>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="card mini-widget mini-candle-widget" data-route="/candle">
                <h3>Nightfall<br>Candle</h3>
                <p class="widget-tagline">Let the flame measure your moment.</p>
                <div class="widget-preview candle-preview">
                    <div class="mini-candle">
                        <div class="mini-flame widget-icon-large">🕯️</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderSettingsWidget() {
        return `
            <div class="card mini-widget mini-settings-widget" data-route="/settings">
                <h3>Settings</h3>
                <p class="widget-tagline">Tweak the magic of the Grove.</p>
                <div class="widget-preview settings-preview">
                    <div class="settings-icon widget-icon-large">⚙️</div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const widgets = this.container.querySelectorAll('.mini-widget');
        widgets.forEach(widget => {
            widget.addEventListener('click', () => {
                const route = widget.getAttribute('data-route');
                if (route && window.router) {
                    window.router.navigate(route);
                }
            });
        });
        
        // Listen for storage changes to update mood widget
        this.storageListener = (e) => {
            if (e.key === 'moodEntries' || e.storageArea === localStorage) {
                this.refreshMoodWidget();
            }
        };
        window.addEventListener('storage', this.storageListener);
        
        // Also check for updates periodically (for same-tab updates)
        this.moodCheckInterval = setInterval(() => {
            this.refreshMoodWidget();
        }, 2000);
    }

    startFocusTimer() {
        // Update focus timer display if running
        const focusWidget = this.container.querySelector('.mini-focus-widget');
        if (focusWidget && focusWidget.querySelector('.running')) {
            this.focusTimerInterval = setInterval(() => {
                const focusData = this.getFocusData();
                if (focusData.running) {
                    const elapsed = Date.now() - focusData.startTime + focusData.elapsed;
                    const displayTime = formatDuration(elapsed);
                    const display = focusWidget.querySelector('.stopwatch-display');
                    if (display) {
                        display.textContent = displayTime;
                    }
                } else {
                    clearInterval(this.focusTimerInterval);
                }
            }, 1000);
        }
    }

    async refreshMoodWidget() {
        // Refresh mood widget when returning from mood page
        const moodWidget = this.container.querySelector('[data-mood-widget]');
        if (moodWidget) {
            const moodData = await this.getMoodData();
            const moodEmojis = {
                scared: '😨',
                depressed: '😔',
                sad: '😢',
                happy: '😊',
                excited: '🤩'
            };
            
            const moodLabels = {
                scared: 'Scared',
                depressed: 'Depressed',
                sad: 'Sad',
                happy: 'Happy',
                excited: 'Excited'
            };
            
            const preview = moodWidget.querySelector('.mood-preview');
            if (preview) {
                if (moodData.hasMood) {
                    preview.innerHTML = `<div class="widget-icon">😊</div><div class="mood-ghost">${moodEmojis[moodData.mood] || '👻'}</div>`;
                    
                    // Update or add mood label
                    let moodLabel = moodWidget.querySelector('.mood-label');
                    if (!moodLabel) {
                        moodLabel = document.createElement('div');
                        moodLabel.className = 'mood-label';
                        moodWidget.appendChild(moodLabel);
                    }
                    moodLabel.textContent = `Today: ${moodLabels[moodData.mood]}`;
                } else {
                    preview.innerHTML = '<div class="widget-icon">😊</div>';
                    const moodLabel = moodWidget.querySelector('.mood-label');
                    if (moodLabel) {
                        moodLabel.remove();
                    }
                }
            }
        }
    }

    destroy() {
        if (this.focusTimerInterval) {
            clearInterval(this.focusTimerInterval);
        }
        if (this.moodCheckInterval) {
            clearInterval(this.moodCheckInterval);
        }
        if (this.storageListener) {
            window.removeEventListener('storage', this.storageListener);
        }
    }

    renderTicTacToeWidget() {
        return `
            <div class="card mini-widget mini-game-widget" data-route="/tictactoe">
                <div class="widget-icon">🎃</div>
                <h3>Spooky Tic-Tac-Toe</h3>
                <p class="card-subtitle">Ghost vs Pumpkin battle.</p>
            </div>
        `;
    }

    renderTitleGeneratorWidget() {
        return `
            <div class="card mini-widget mini-title-widget" data-route="/title-generator">
                <div class="widget-icon">📸</div>
                <h3>Title Generator</h3>
                <p class="card-subtitle">Get spooky titles from images.</p>
            </div>
        `;
    }

    renderRadiantSphereWidget() {
        return `
            <div class="card mini-widget mini-sphere-widget" data-route="/radiant-sphere">
                <div class="widget-icon">🔮</div>
                <h3>Radiant Sphere</h3>
                <p class="card-subtitle">Receive mystical affirmations.</p>
            </div>
        `;
    }
}
