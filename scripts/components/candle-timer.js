// Nightfall Candle Timer Component - Visual countdown with melting candle

export class CandleTimer {
    constructor() {
        this.container = null;
        this.duration = 0; // milliseconds
        this.startTime = null;
        this.elapsed = 0;
        this.running = false;
        this.animationFrame = null;
        this.drips = [];
        this.dripInterval = null;
    }

    getSettings() {
        const savedSettings = localStorage.getItem('hauntedChamberSettings');
        if (savedSettings) {
            return JSON.parse(savedSettings);
        }
        return { theme: 'night' };
    }

    render() {
        this.container = document.getElementById('page-container');
        const settings = this.getSettings();
        
        this.container.innerHTML = `
            <div class="candle-timer-page">
                <h1>Nightfall Candle Timer</h1>
                <p class="subtitle">As the flame melts, so does the weight of each passing moment.</p>
                
                ${settings.theme === 'day' ? this.renderDayMessage() : this.renderCandleTimer()}
            </div>
        `;

        if (settings.theme === 'night') {
            this.attachEventListeners();
        }
    }

    renderDayMessage() {
        return `
            <div class="card day-mode-message">
                <div class="candle-day-restriction">
                    <svg class="moon-icon" viewBox="0 0 24 24" width="48" height="48">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
                    </svg>
                    <p>The Nightfall Candle only burns after dusk</p>
                    <p class="hint">Switch to Night Mode in Settings to light the candle</p>
                </div>
            </div>
        `;
    }

    renderCandleTimer() {
        return `
            <div class="card candle-timer-container">
                <div class="candle-controls">
                    <div class="duration-buttons">
                        <button class="duration-btn" data-duration="0.5">30 sec</button>
                        <button class="duration-btn" data-duration="1">1 min</button>
                        <button class="duration-btn" data-duration="5">5 min</button>
                        <button class="duration-btn" data-duration="10">10 min</button>
                        <button class="duration-btn" data-duration="15">15 min</button>
                        <button class="duration-btn" data-duration="30">30 min</button>
                    </div>
                    
                    <div class="timer-display">
                        <span class="time-remaining">00:00</span>
                    </div>
                    
                    <div class="timer-buttons">
                        <button class="timer-btn start-btn" id="start-btn">Start</button>
                        <button class="timer-btn pause-btn" id="pause-btn" disabled>Pause</button>
                        <button class="timer-btn reset-btn" id="reset-btn">Reset</button>
                    </div>
                </div>
                
                <div class="candle-visual">
                    <svg class="candle-svg" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#fff5e6;stop-opacity:1" />
                                <stop offset="50%" style="stop-color:#ffcc66;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#ff9933;stop-opacity:1" />
                            </linearGradient>
                            <linearGradient id="waxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#ffd699;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#cc8844;stop-opacity:1" />
                            </linearGradient>
                            
                            <!-- Radial gradient for candlelight glow -->
                            <radialGradient id="candleGlow" cx="50%" cy="30%">
                                <stop offset="0%" style="stop-color:#ffeb99;stop-opacity:0.8" />
                                <stop offset="30%" style="stop-color:#ffcc66;stop-opacity:0.5" />
                                <stop offset="60%" style="stop-color:#ff9933;stop-opacity:0.2" />
                                <stop offset="100%" style="stop-color:#ff6600;stop-opacity:0" />
                            </radialGradient>
                            
                            <!-- Wax pool gradient -->
                            <radialGradient id="waxPoolGradient" cx="50%" cy="50%">
                                <stop offset="0%" style="stop-color:#f5f5f5;stop-opacity:0.9" />
                                <stop offset="50%" style="stop-color:#e8e8e8;stop-opacity:0.8" />
                                <stop offset="100%" style="stop-color:#d4d4d4;stop-opacity:0.7" />
                            </radialGradient>
                        </defs>
                        
                        <!-- Candlelight glow effect -->
                        <ellipse class="candle-glow" cx="50" cy="50" rx="45" ry="60" fill="url(#candleGlow)" opacity="0.6"/>
                        
                        <!-- Smoke (hidden initially) -->
                        <g class="candle-smoke" style="opacity: 0;">
                            <ellipse cx="50" cy="45" rx="8" ry="4" fill="#888" opacity="0.3">
                                <animate attributeName="cy" from="45" to="20" dur="2s" fill="freeze"/>
                                <animate attributeName="opacity" from="0.3" to="0" dur="2s" fill="freeze"/>
                            </ellipse>
                        </g>
                        
                        <!-- Flame -->
                        <g class="candle-flame">
                            <ellipse cx="50" cy="45" rx="12" ry="20" fill="url(#flameGradient)"/>
                            <ellipse cx="50" cy="48" rx="8" ry="12" fill="#fff5e6" opacity="0.8"/>
                        </g>
                        
                        <!-- Wick -->
                        <line class="candle-wick" x1="50" y1="45" x2="50" y2="65" stroke="#333" stroke-width="2"/>
                        
                        <!-- Wax body container -->
                        <g class="candle-wax-container" transform-origin="50 180">
                            <rect class="candle-wax" x="30" y="65" width="40" height="115" 
                                  fill="url(#waxGradient)" rx="2"/>
                            
                            <!-- Pre-existing wax buildup and trails -->
                            <g class="wax-buildup-permanent">
                                <!-- Wax trails down the sides -->
                                <path d="M 32 70 Q 31 90 30 110 Q 29 130 28 150 Q 27 165 26 178" 
                                      stroke="#d4a574" stroke-width="1.5" fill="none" opacity="0.6"/>
                                <path d="M 38 75 Q 37 95 36 115 Q 35 135 34 155 Q 33 170 32 178" 
                                      stroke="#d4a574" stroke-width="1.2" fill="none" opacity="0.5"/>
                                <path d="M 45 68 Q 44 88 43 108 Q 42 128 41 148 Q 40 168 39 178" 
                                      stroke="#d4a574" stroke-width="1" fill="none" opacity="0.5"/>
                                <path d="M 55 68 Q 56 88 57 108 Q 58 128 59 148 Q 60 168 61 178" 
                                      stroke="#d4a574" stroke-width="1" fill="none" opacity="0.5"/>
                                <path d="M 62 75 Q 63 95 64 115 Q 65 135 66 155 Q 67 170 68 178" 
                                      stroke="#d4a574" stroke-width="1.2" fill="none" opacity="0.5"/>
                                <path d="M 68 70 Q 69 90 70 110 Q 71 130 72 150 Q 73 165 74 178" 
                                      stroke="#d4a574" stroke-width="1.5" fill="none" opacity="0.6"/>
                                
                                <!-- Small wax pools at the base -->
                                <ellipse cx="28" cy="178" rx="4" ry="2" fill="#d4a574" opacity="0.7"/>
                                <ellipse cx="35" cy="179" rx="5" ry="2.5" fill="#d4a574" opacity="0.7"/>
                                <ellipse cx="42" cy="178" rx="3.5" ry="2" fill="#d4a574" opacity="0.6"/>
                                <ellipse cx="50" cy="179" rx="4.5" ry="2.5" fill="#d4a574" opacity="0.7"/>
                                <ellipse cx="58" cy="178" rx="3.5" ry="2" fill="#d4a574" opacity="0.6"/>
                                <ellipse cx="65" cy="179" rx="5" ry="2.5" fill="#d4a574" opacity="0.7"/>
                                <ellipse cx="72" cy="178" rx="4" ry="2" fill="#d4a574" opacity="0.7"/>
                                
                                <!-- Additional smaller drips -->
                                <ellipse cx="33" cy="175" rx="2.5" ry="1.5" fill="#d4a574" opacity="0.5"/>
                                <ellipse cx="47" cy="176" rx="2" ry="1" fill="#d4a574" opacity="0.5"/>
                                <ellipse cx="53" cy="175" rx="2.5" ry="1.5" fill="#d4a574" opacity="0.5"/>
                                <ellipse cx="67" cy="176" rx="2" ry="1" fill="#d4a574" opacity="0.5"/>
                            </g>
                            
                            <!-- Wax drips container (for animated drips) -->
                            <g class="wax-drips"></g>
                        </g>
                        
                        <!-- Base -->
                        <rect x="25" y="180" width="50" height="15" fill="#8b4513" rx="2"/>
                        <ellipse cx="50" cy="180" rx="25" ry="3" fill="#6b3410"/>
                    </svg>
                    
                    <div class="completion-message"></div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Duration buttons
        const durationBtns = document.querySelectorAll('.duration-btn');
        durationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseFloat(e.target.getAttribute('data-duration'));
                this.setDuration(minutes);
                
                // Visual feedback
                durationBtns.forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });

        // Timer control buttons
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.start());
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pause());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }

    setDuration(minutes) {
        if (this.running) return;
        
        this.duration = minutes * 60 * 1000;
        this.elapsed = 0;
        this.updateDisplay();
        
        // Enable start button
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.disabled = false;
        }
    }

    start() {
        if (this.duration === 0) return;
        if (this.running) return;

        this.running = true;
        this.startTime = Date.now() - this.elapsed;
        
        // Update button states
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        if (startBtn) startBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = false;

        // Start timer ticking sound
        if (window.audioManager) {
            window.audioManager.playLoopingSFX('candle-timer');
        }

        // Start drip animation
        this.startDripAnimation();

        this.animate();
    }

    pause() {
        if (!this.running) return;

        this.running = false;
        this.elapsed = Date.now() - this.startTime;
        
        // Update button states
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;

        // Stop timer ticking sound
        if (window.audioManager) {
            window.audioManager.stopLoopingSFX('candle-timer');
        }

        // Stop drip animation
        this.stopDripAnimation();

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    reset() {
        this.running = false;
        this.elapsed = 0;
        this.startTime = null;
        
        // Update button states
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        if (startBtn) startBtn.disabled = this.duration === 0;
        if (pauseBtn) pauseBtn.disabled = true;

        // Stop timer ticking sound
        if (window.audioManager) {
            window.audioManager.stopLoopingSFX('candle-timer');
        }

        // Stop drip animation
        this.stopDripAnimation();

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        // Reset visual
        this.updateCandleVisual(1.0);
        this.updateDisplay();
        
        // Hide completion message
        const messageEl = document.querySelector('.completion-message');
        if (messageEl) {
            messageEl.classList.remove('visible');
        }

        // Reset flame
        const flame = document.querySelector('.candle-flame');
        if (flame) {
            flame.style.opacity = '1';
        }

        // Hide smoke
        const smoke = document.querySelector('.candle-smoke');
        if (smoke) {
            smoke.style.opacity = '0';
        }
    }

    animate() {
        if (!this.running) return;

        this.elapsed = Date.now() - this.startTime;
        const progress = Math.min(1, this.elapsed / this.duration);

        this.updateCandleVisual(1 - progress);
        this.updateDisplay();

        if (progress >= 1) {
            this.complete();
        } else {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }

    updateCandleVisual(remainingPercent) {
        const waxContainer = document.querySelector('.candle-wax-container');
        const flame = document.querySelector('.candle-flame');
        const wick = document.querySelector('.candle-wick');
        const glow = document.querySelector('.candle-glow');
        
        if (waxContainer) {
            waxContainer.style.transform = `scaleY(${remainingPercent})`;
        }

        if (flame) {
            const flameY = (1 - remainingPercent) * 115; // 115 is wax height
            flame.style.transform = `translateY(${flameY}px)`;
        }

        if (wick) {
            const wickY = (1 - remainingPercent) * 115;
            wick.style.transform = `translateY(${wickY}px)`;
        }

        if (glow) {
            const glowY = (1 - remainingPercent) * 115;
            // Dim the glow as candle burns down (opacity decreases)
            const glowOpacity = 0.6 * remainingPercent; // From 0.6 to 0
            glow.style.transform = `translateY(${glowY}px)`;
            glow.style.opacity = glowOpacity;
        }
    }

    updateDisplay() {
        const remaining = Math.max(0, this.duration - this.elapsed);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        const display = document.querySelector('.time-remaining');
        if (display) {
            display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    startDripAnimation() {
        this.stopDripAnimation();
        
        // Much more frequent drips - between 400ms to 1 second
        this.dripInterval = setInterval(() => {
            this.createDrip();
        }, 400 + Math.random() * 600);
    }

    stopDripAnimation() {
        if (this.dripInterval) {
            clearInterval(this.dripInterval);
            this.dripInterval = null;
        }
        
        // Clear existing drips
        const dripsContainer = document.querySelector('.wax-drips');
        if (dripsContainer) {
            dripsContainer.innerHTML = '';
        }
        this.drips = [];
    }

    createDrip() {
        const dripsContainer = document.querySelector('.wax-drips');
        if (!dripsContainer) return;

        const x = 30 + Math.random() * 40; // Random x position on candle
        const startY = 65; // Top of wax body
        const size = 1.5 + Math.random() * 1.5; // Larger varying drip sizes

        // Create longer wax trail down the side (permanent)
        const trailLength = 40 + Math.random() * 60;
        const trail = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        trail.setAttribute('x1', x);
        trail.setAttribute('y1', startY);
        trail.setAttribute('x2', x + (Math.random() - 0.5) * 5);
        trail.setAttribute('y2', startY + trailLength);
        trail.setAttribute('stroke', '#d4a574');
        trail.setAttribute('stroke-width', '1.2');
        trail.setAttribute('opacity', '0.6');
        trail.classList.add('wax-trail');
        dripsContainer.appendChild(trail);

        // Create drip as an ellipse for more realistic teardrop shape
        const drip = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        drip.setAttribute('cx', x);
        drip.setAttribute('cy', startY);
        drip.setAttribute('rx', size * 0.8);
        drip.setAttribute('ry', size * 1.5);
        drip.setAttribute('fill', '#cc8844');
        drip.setAttribute('opacity', '0.95');
        drip.classList.add('wax-drip');

        dripsContainer.appendChild(drip);

        // Animate drip falling with acceleration
        let currentY = startY;
        const endY = 180;
        let speed = 0.4;
        const acceleration = 0.08;
        let opacity = 0.95;

        const animateDrip = () => {
            speed += acceleration; // Gravity effect
            currentY += speed;
            opacity -= 0.004; // Fade slower as it falls
            
            drip.setAttribute('cy', currentY);
            drip.setAttribute('opacity', Math.max(0.4, opacity));
            
            // Stretch drip more as it falls
            const stretch = 1 + (speed * 0.15);
            drip.setAttribute('ry', size * 1.5 * stretch);

            if (currentY >= endY) {
                // Create small splash effect
                this.createSplash(x, endY);
                drip.remove();
            } else {
                requestAnimationFrame(animateDrip);
            }
        };

        animateDrip();
    }

    createSplash(x, y) {
        const dripsContainer = document.querySelector('.wax-drips');
        if (!dripsContainer) return;

        // Create larger wax buildup at the bottom (permanent)
        const buildup = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        buildup.setAttribute('cx', x);
        buildup.setAttribute('cy', y);
        buildup.setAttribute('rx', 3 + Math.random() * 3);
        buildup.setAttribute('ry', 1.5 + Math.random() * 1.5);
        buildup.setAttribute('fill', '#d4a574');
        buildup.setAttribute('opacity', '0.8');
        buildup.classList.add('wax-buildup');
        dripsContainer.appendChild(buildup);

        // Create more splash particles
        for (let i = 0; i < 5; i++) {
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const angle = (Math.random() - 0.5) * Math.PI;
            const distance = 3 + Math.random() * 4;
            
            particle.setAttribute('cx', x);
            particle.setAttribute('cy', y);
            particle.setAttribute('r', '1');
            particle.setAttribute('fill', '#cc8844');
            particle.setAttribute('opacity', '0.7');
            
            dripsContainer.appendChild(particle);
            
            // Animate splash particles
            let time = 0;
            const animateSplash = () => {
                time += 0.1;
                const newX = x + Math.cos(angle) * distance * time;
                const newY = y + Math.sin(angle) * distance * time * 0.5;
                const opacity = Math.max(0, 0.7 - time * 0.3);
                
                particle.setAttribute('cx', newX);
                particle.setAttribute('cy', newY);
                particle.setAttribute('opacity', opacity);
                
                if (opacity <= 0) {
                    particle.remove();
                } else {
                    requestAnimationFrame(animateSplash);
                }
            };
            
            animateSplash();
        }
    }

    complete() {
        this.running = false;
        
        // Update button states
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        if (startBtn) startBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = true;

        // Stop timer ticking sound
        if (window.audioManager) {
            window.audioManager.stopLoopingSFX('candle-timer');
        }

        // Stop drip animation
        this.stopDripAnimation();

        this.animateFlameOut();
        this.showCompletionMessage();
    }

    animateFlameOut() {
        const flame = document.querySelector('.candle-flame');
        if (flame) {
            flame.style.transition = 'opacity 1s ease-out';
            flame.style.opacity = '0';
        }

        setTimeout(() => {
            this.showSmoke();
        }, 500);
    }

    showSmoke() {
        const smoke = document.querySelector('.candle-smoke');
        if (smoke) {
            smoke.style.opacity = '1';
            
            // Reset animation
            const ellipse = smoke.querySelector('ellipse');
            if (ellipse) {
                const animations = ellipse.querySelectorAll('animate');
                animations.forEach(anim => {
                    anim.beginElement();
                });
            }
        }
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
        
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.classList.add('visible');
        }
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.stopDripAnimation();
    }
}
