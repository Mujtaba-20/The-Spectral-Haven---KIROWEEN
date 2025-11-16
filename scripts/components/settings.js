// Settings Component - User preferences

export class Settings {
    constructor() {
        this.container = null;
        this.settings = this.loadSettings();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('hauntedChamberSettings');
        if (savedSettings) {
            return JSON.parse(savedSettings);
        }
        
        // Default settings
        return {
            theme: 'night',
            animationsEnabled: true,
            skeletonEnabled: true,
            plainListMode: false,
            muted: false,
            volume: 30
        };
    }

    saveSettings() {
        localStorage.setItem('hauntedChamberSettings', JSON.stringify(this.settings));
    }

    render() {
        this.container = document.getElementById('page-container');
        
        this.container.innerHTML = `
            <div class="settings-page">
                <h1>Spellbook Settings</h1>
                <p class="subtitle">Tune the Grove's magic — sound, fog, shadows, and secrets.</p>
                
                <div class="card">
                    <div class="settings-list">
                        
                        <!-- Theme Toggle -->
                        <div class="setting-item">
                            <div class="setting-info">
                                <h3>Theme</h3>
                                <p>Switch between Day and Night modes</p>
                            </div>
                            <label class="toggle">
                                <input type="checkbox" id="theme-toggle" ${this.settings.theme === 'night' ? 'checked' : ''} aria-label="Toggle theme between Day and Night mode">
                                <span class="toggle-slider"></span>
                            </label>
                            <span class="setting-label" aria-live="polite">${this.settings.theme === 'night' ? 'Night' : 'Day'}</span>
                        </div>
                        
                        <!-- Animations Toggle -->
                        <div class="setting-item">
                            <div class="setting-info">
                                <h3>Animations</h3>
                                <p>Enable or disable decorative animations</p>
                            </div>
                            <label class="toggle">
                                <input type="checkbox" id="animations-toggle" ${this.settings.animationsEnabled ? 'checked' : ''} aria-label="Toggle decorative animations on or off">
                                <span class="toggle-slider"></span>
                            </label>
                            <span class="setting-label" aria-live="polite">${this.settings.animationsEnabled ? 'On' : 'Off'}</span>
                        </div>
                        
                        <!-- Plain List Mode Toggle -->
                        <div class="setting-item">
                            <div class="setting-info">
                                <h3>Plain List Mode</h3>
                                <p>Use simple list view for tasks instead of ghost animations</p>
                            </div>
                            <label class="toggle">
                                <input type="checkbox" id="plain-list-toggle" ${this.settings.plainListMode ? 'checked' : ''} aria-label="Toggle plain list mode for tasks">
                                <span class="toggle-slider"></span>
                            </label>
                            <span class="setting-label" aria-live="polite">${this.settings.plainListMode ? 'On' : 'Off'}</span>
                        </div>
                        
                        <!-- Mute Toggle -->
                        <div class="setting-item">
                            <div class="setting-info">
                                <h3>Audio</h3>
                                <p>Mute all sounds and ambient audio</p>
                            </div>
                            <label class="toggle">
                                <input type="checkbox" id="mute-toggle-setting" ${this.settings.muted ? 'checked' : ''} aria-label="Toggle audio mute">
                                <span class="toggle-slider"></span>
                            </label>
                            <span class="setting-label" aria-live="polite">${this.settings.muted ? 'Muted' : 'Unmuted'}</span>
                        </div>
                        
                        <!-- Volume Slider -->
                        <div class="setting-item setting-item-slider">
                            <div class="setting-info">
                                <h3>Volume</h3>
                                <p>Adjust ambient audio volume level</p>
                            </div>
                            <div class="slider-container">
                                <input type="range" id="volume-slider" min="0" max="100" value="${this.settings.volume}" aria-label="Adjust volume level">
                                <span class="setting-label" aria-live="polite">${this.settings.volume}%</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
        
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => {
                this.settings.theme = e.target.checked ? 'night' : 'day';
                this.saveSettings();
                this.applyTheme();
                this.updateLabel('theme-toggle', this.settings.theme === 'night' ? 'Night' : 'Day');
            });
        }
        
        // Animations toggle
        const animationsToggle = document.getElementById('animations-toggle');
        if (animationsToggle) {
            animationsToggle.addEventListener('change', (e) => {
                this.settings.animationsEnabled = e.target.checked;
                this.saveSettings();
                this.applyAnimations();
                this.updateLabel('animations-toggle', this.settings.animationsEnabled ? 'On' : 'Off');
            });
        }

        
        // Plain list mode toggle
        const plainListToggle = document.getElementById('plain-list-toggle');
        if (plainListToggle) {
            plainListToggle.addEventListener('change', (e) => {
                this.settings.plainListMode = e.target.checked;
                this.saveSettings();
                this.updateLabel('plain-list-toggle', this.settings.plainListMode ? 'On' : 'Off');
            });
        }
        
        // Mute toggle
        const muteToggle = document.getElementById('mute-toggle-setting');
        if (muteToggle) {
            muteToggle.addEventListener('change', (e) => {
                this.settings.muted = e.target.checked;
                this.saveSettings();
                this.applyMute();
                this.updateLabel('mute-toggle-setting', this.settings.muted ? 'Muted' : 'Unmuted');
            });
        }
        
        // Volume slider
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.settings.volume = parseInt(e.target.value);
                this.applyVolume();
                this.updateVolumeLabel(this.settings.volume);
            });
            
            volumeSlider.addEventListener('change', (e) => {
                this.settings.volume = parseInt(e.target.value);
                this.saveSettings();
            });
        }
    }
    
    updateVolumeLabel(volume) {
        const slider = document.getElementById('volume-slider');
        if (slider) {
            const label = slider.closest('.slider-container').querySelector('.setting-label');
            if (label) {
                label.textContent = `${volume}%`;
            }
        }
    }
    
    applyVolume() {
        if (window.audioManager) {
            window.audioManager.setVolume(this.settings.volume / 100);
        }
    }

    updateLabel(toggleId, text) {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            const label = toggle.closest('.setting-item').querySelector('.setting-label');
            if (label) {
                label.textContent = text;
            }
        }
    }

    applyTheme() {
        const body = document.body;
        body.className = body.className.replace(/theme-\w+/, '');
        body.classList.add(`theme-${this.settings.theme}`);
    }

    applyAnimations() {
        const app = document.getElementById('app');
        if (this.settings.animationsEnabled) {
            app.classList.remove('animations-disabled');
        } else {
            app.classList.add('animations-disabled');
        }
    }

    applySkeletonSetting() {
        if (window.transitionManager) {
            window.transitionManager.setSkeletonEnabled(this.settings.skeletonEnabled);
        }
    }

    applyMute() {
        if (window.audioManager) {
            if (this.settings.muted) {
                window.audioManager.mute();
            } else {
                window.audioManager.unmute();
            }
        }
    }

    destroy() {
        // Cleanup if needed
    }
}
