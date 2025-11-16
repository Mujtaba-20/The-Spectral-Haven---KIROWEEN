// Audio Manager - Handle ambient sound and SFX

export class AudioManager {
    constructor() {
        this.ambient = null;
        this.ambientCreep = null; // Secondary ambient track
        this.sfx = {};
        this.muted = false;
        this.volume = 0.3; // Default volume (30%)
        this.audioContextEnabled = false;
    }

    init() {
        // Restore settings from localStorage
        this.restoreSettings();
        
        // Load ambient sound - Trees.mp3 as main background
        this.loadAmbient('assets/audio/Trees.mp3');
        
        // Load secondary ambient - creep.mp3 at lower volume
        this.loadAmbientCreep('assets/audio/creep.mp3');
        
        // Load SFX files
        this.loadSFX('task-complete.mp3', 'skeleton-enter.mp3', 'release.mp3');
        
        // Load page transition sound
        this.loadTransitionSound();
        
        // Update UI to reflect initial mute state
        this.updateMuteToggleUI();
        
        // Load voices for speech synthesis
        if ('speechSynthesis' in window) {
            // Load voices (some browsers need this)
            window.speechSynthesis.getVoices();
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }
        
        console.log('🔊 Audio Manager initialized');
    }

    restoreSettings() {
        const savedSettings = localStorage.getItem('hauntedChamberSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            // Only restore muted state if explicitly set to true
            this.muted = settings.muted === true;
            this.volume = (settings.volume !== undefined) ? settings.volume / 100 : 0.3;
        } else {
            // Default to unmuted on first load
            this.muted = false;
        }
    }

    mute() {
        this.muted = true;
        this.updateAudioState();
        this.saveMuteState();
    }

    unmute() {
        this.muted = false;
        this.updateAudioState();
        this.saveMuteState();
    }

    toggleMute() {
        this.muted = !this.muted;
        this.updateAudioState();
        this.saveMuteState();
    }

    updateAudioState() {
        if (this.ambient) {
            if (this.muted) {
                this.ambient.pause();
            } else {
                this.ambient.play().catch(err => {
                    console.log('Audio playback prevented:', err);
                });
            }
        }
        
        if (this.ambientCreep) {
            if (this.muted) {
                this.ambientCreep.pause();
            } else {
                this.ambientCreep.play().catch(err => {
                    console.log('Creep audio playback prevented:', err);
                });
            }
        }
        
        // Update UI state
        this.updateMuteToggleUI();
    }
    
    updateMuteToggleUI() {
        const muteToggle = document.getElementById('mute-toggle');
        if (muteToggle) {
            if (this.muted) {
                muteToggle.classList.add('muted');
                muteToggle.setAttribute('aria-label', 'Unmute audio');
            } else {
                muteToggle.classList.remove('muted');
                muteToggle.setAttribute('aria-label', 'Mute audio');
            }
        }
    }

    saveMuteState() {
        const savedSettings = localStorage.getItem('hauntedChamberSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : {};
        settings.muted = this.muted;
        localStorage.setItem('hauntedChamberSettings', JSON.stringify(settings));
    }

    play() {
        if (this.ambient && !this.muted) {
            this.ambient.play().catch(err => {
                console.log('Audio playback prevented:', err);
            });
        }
        if (this.ambientCreep && !this.muted) {
            this.ambientCreep.play().catch(err => {
                console.log('Creep audio playback prevented:', err);
            });
        }
    }

    pause() {
        if (this.ambient) {
            this.ambient.pause();
        }
        if (this.ambientCreep) {
            this.ambientCreep.pause();
        }
    }

    stop() {
        if (this.ambient) {
            this.ambient.pause();
            this.ambient.currentTime = 0;
        }
        if (this.ambientCreep) {
            this.ambientCreep.pause();
            this.ambientCreep.currentTime = 0;
        }
    }

    enableAudioContext() {
        this.audioContextEnabled = true;
        // Try to play ambient if not muted
        if (!this.muted && this.ambient) {
            this.ambient.play().catch(err => {
                console.log('Ambient playback prevented:', err);
            });
        }
        if (!this.muted && this.ambientCreep) {
            this.ambientCreep.play().catch(err => {
                console.log('Creep ambient playback prevented:', err);
            });
        }
    }

    playSFX(name) {
        if (this.muted) return;
        
        const sound = this.sfx[name];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(err => {
                console.log('SFX playback prevented:', err);
            });
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
        if (this.ambient) {
            this.ambient.volume = this.volume;
        }
        if (this.ambientCreep) {
            // Keep creep at 50% of main volume
            this.ambientCreep.volume = this.volume * 0.5;
        }
    }

    loadAmbient(src) {
        this.ambient = new Audio(src);
        this.ambient.loop = true;
        this.ambient.volume = this.volume;
        
        // Handle loading errors gracefully
        this.ambient.addEventListener('error', (e) => {
            console.error('❌ Ambient audio file not found or failed to load:', src, e);
        });
        
        this.ambient.addEventListener('canplaythrough', () => {
            console.log('✅ Audio file loaded successfully:', src);
        });
        
        if (!this.muted) {
            this.ambient.play().catch(err => {
                console.warn('⚠️ Ambient audio playback prevented (user interaction required):', err.message);
                console.log('💡 Click anywhere on the page to start audio');
            });
        } else {
            console.log('🔇 Audio is muted');
        }
    }
    
    loadAmbientCreep(src) {
        this.ambientCreep = new Audio(src);
        this.ambientCreep.loop = true;
        // Set creep.mp3 to 50% of the main ambient volume (lower volume)
        this.ambientCreep.volume = this.volume * 0.5;
        
        // Handle loading errors gracefully
        this.ambientCreep.addEventListener('error', (e) => {
            console.error('❌ Creep ambient audio file not found or failed to load:', src, e);
        });
        
        this.ambientCreep.addEventListener('canplaythrough', () => {
            console.log('✅ Creep audio file loaded successfully:', src);
        });
        
        if (!this.muted) {
            this.ambientCreep.play().catch(err => {
                console.warn('⚠️ Creep ambient audio playback prevented (user interaction required):', err.message);
            });
        } else {
            console.log('🔇 Creep audio is muted');
        }
    }

    loadSFX(...files) {
        files.forEach(file => {
            const name = file.replace('.mp3', '').replace('.wav', '');
            const audio = new Audio(`assets/audio/${file}`);
            audio.volume = 0.5;
            
            // Handle loading errors gracefully
            audio.addEventListener('error', () => {
                console.log(`SFX file not found or failed to load: ${file}`);
            });
            
            this.sfx[name] = audio;
        });
    }
    
    loadTransitionSound() {
        // Load Tabs.mp3 from assets folder
        const transitionAudio = new Audio('assets/audio/Tabs.mp3');
        transitionAudio.volume = 0.6;
        
        transitionAudio.addEventListener('canplaythrough', () => {
            console.log('✅ Transition audio (Tabs.mp3) loaded successfully');
        });
        
        transitionAudio.addEventListener('error', (e) => {
            console.error('❌ Failed to load Tabs.mp3 from assets/audio/', e);
        });
        
        this.sfx['page-transition'] = transitionAudio;
        
        // Text-to-speech intro for homepage
        this.sfx['homepage-intro'] = {
            play: () => this.speakIntro(),
            pause: () => {},
            currentTime: 0
        };
        
        // Load Clock.mp3 for stopwatch timer
        const clockAudio = new Audio('assets/audio/Clock.mp3');
        clockAudio.loop = true;
        clockAudio.volume = 0.4;
        
        clockAudio.addEventListener('canplaythrough', () => {
            console.log('✅ Clock audio (Clock.mp3) loaded successfully');
        });
        
        clockAudio.addEventListener('error', (e) => {
            console.error('❌ Failed to load Clock.mp3 from assets/audio/', e);
        });
        
        this.sfx['stopwatch-ticking'] = clockAudio;
        
        // Load timer.mp3 for candle timer
        const timerAudio = new Audio('assets/audio/timer.mp3');
        timerAudio.loop = true;
        timerAudio.volume = 0.4;
        
        timerAudio.addEventListener('canplaythrough', () => {
            console.log('✅ Timer audio (timer.mp3) loaded successfully');
        });
        
        timerAudio.addEventListener('error', (e) => {
            console.error('❌ Failed to load timer.mp3 from assets/audio/', e);
        });
        
        this.sfx['candle-timer'] = timerAudio;
    }
    
    playLoopingSFX(name) {
        if (this.muted) return;
        
        const sound = this.sfx[name];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(err => {
                console.log('Looping SFX playback prevented:', err);
            });
        }
    }
    
    stopLoopingSFX(name) {
        const sound = this.sfx[name];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    speakIntro() {
        if (this.muted) return;
        
        // Check if browser supports speech synthesis
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            // Create speech utterance
            const utterance = new SpeechSynthesisUtterance('Welcome... to The Spectral Haven');
            
            // Configure voice settings for a creepy, haunting effect
            utterance.rate = 0.6; // Much slower for dramatic, creepy effect
            utterance.pitch = 0.5; // Very low pitch for deep, ominous voice
            utterance.volume = 1.0; // Maximum volume
            
            // Try to use a specific voice if available
            const voices = window.speechSynthesis.getVoices();
            
            // Prefer deep male voices for maximum creepiness
            const preferredVoice = voices.find(voice => 
                voice.name.includes('Google UK English Male') || 
                voice.name.includes('Microsoft David') ||
                voice.name.includes('Daniel') ||
                voice.name.includes('Male') ||
                voice.lang.includes('en')
            );
            
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            // Add event listeners for debugging
            utterance.onstart = () => {
                console.log('🗣️ Speaking creepy intro message...');
            };
            
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
            };
            
            // Speak the text
            window.speechSynthesis.speak(utterance);
        } else {
            console.log('⚠️ Speech synthesis not supported in this browser');
        }
    }
}
