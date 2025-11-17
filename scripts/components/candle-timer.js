// Nightfall Candle Timer Component - Robust version with reliable blow-away animation

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

        // caches
        this._candleOriginals = null;
        this._smoothState = { flameDy: 0 };
    }

    getSettings() {
        const savedSettings = localStorage.getItem('hauntedChamberSettings');
        if (savedSettings) {
            try { return JSON.parse(savedSettings); } catch(e){ return { theme: 'night' }; }
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
            // small delay so DOM is stable, then attach listeners + cache originals
            setTimeout(() => {
                try {
                    this.attachEventListeners();
                    this._cacheCandleOriginals(); // populate cache early
                    this.updateCandleVisual(1.0); // ensure visuals match initial state
                } catch (e) {
                    console.error('CandleTimer.render init error', e);
                }
            }, 40);
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
        // NOTE: This version keeps dynamic drips but removes static long wax strips.
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
                            
                            <radialGradient id="candleGlow" cx="50%" cy="30%">
                                <stop offset="0%" style="stop-color:#ffeb99;stop-opacity:0.8" />
                                <stop offset="30%" style="stop-color:#ffcc66;stop-opacity:0.5" />
                                <stop offset="60%" style="stop-color:#ff9933;stop-opacity:0.2" />
                                <stop offset="100%" style="stop-color:#ff6600;stop-opacity:0" />
                            </radialGradient>
                            <radialGradient id="waxPoolGradient" cx="50%" cy="50%">
                                <stop offset="0%" style="stop-color:#f5f5f5;stop-opacity:0.9" />
                                <stop offset="50%" style="stop-color:#e8e8e8;stop-opacity:0.8" />
                                <stop offset="100%" style="stop-color:#d4d4d4;stop-opacity:0.7" />
                            </radialGradient>
                        </defs>
                        
                        <ellipse class="candle-glow" cx="50" cy="50" rx="45" ry="60" fill="url(#candleGlow)" opacity="0.6"/>
                        
                        <g class="candle-smoke" style="opacity: 0;">
                            <ellipse cx="50" cy="45" rx="8" ry="4" fill="#888" opacity="0.3">
                                <animate attributeName="cy" from="45" to="20" dur="2s" fill="freeze"/>
                                <animate attributeName="opacity" from="0.3" to="0" dur="2s" fill="freeze"/>
                            </ellipse>
                        </g>
                        
                        <g class="candle-flame">
                            <ellipse cx="50" cy="45" rx="12" ry="20" fill="url(#flameGradient)"/>
                            <ellipse cx="50" cy="48" rx="8" ry="12" fill="#fff5e6" opacity="0.8"/>
                        </g>
                        
                        <line class="candle-wick" x1="50" y1="45" x2="50" y2="65" stroke="#333" stroke-width="2"/>
                        
                        <g class="candle-wax-container">
                            <rect class="candle-wax" x="30" y="65" width="40" height="115" fill="url(#waxGradient)" rx="2"/>
                            
                            <!-- Wax drips container (dynamic drops only) -->
                            <g class="wax-drips"></g>
                        </g>
                        
                        <rect x="25" y="180" width="50" height="15" fill="#8b4513" rx="2"/>
                        <ellipse cx="50" cy="180" rx="25" ry="3" fill="#6b3410"/>
                    </svg>
                    
                    <div class="completion-message"></div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        try {
            const durationBtns = document.querySelectorAll('.duration-btn');
            durationBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const minutes = parseFloat(e.target.getAttribute('data-duration'));
                    this.setDuration(minutes);
                    durationBtns.forEach(b => b.classList.remove('selected'));
                    e.target.classList.add('selected');
                });
            });

            const startBtn = document.getElementById('start-btn');
            const pauseBtn = document.getElementById('pause-btn');
            const resetBtn = document.getElementById('reset-btn');

            if (startBtn) startBtn.addEventListener('click', () => this.start());
            if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
            if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
        } catch (e) {
            console.error('CandleTimer.attachEventListeners error', e);
        }
    }

    setDuration(minutes) {
        if (this.running) return;
        this.duration = minutes * 60 * 1000;
        this.elapsed = 0;
        this.updateDisplay();
        const startBtn = document.getElementById('start-btn');
        if (startBtn) startBtn.disabled = false;
    }

    start() {
        if (this.duration === 0 || this.running) return;
        this.running = true;
        this.startTime = Date.now() - this.elapsed;

        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        if (startBtn) startBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = false;

        if (window.audioManager) window.audioManager.playLoopingSFX('candle-timer');

        this.startDripAnimation();
        this.animate();
    }

    pause() {
        if (!this.running) return;
        this.running = false;
        this.elapsed = Date.now() - this.startTime;

        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;

        if (window.audioManager) window.audioManager.stopLoopingSFX('candle-timer');

        this.stopDripAnimation();
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
    }

    reset() {
        this.running = false;
        this.elapsed = 0;
        this.startTime = null;

        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        if (startBtn) startBtn.disabled = this.duration === 0;
        if (pauseBtn) pauseBtn.disabled = true;

        if (window.audioManager) window.audioManager.stopLoopingSFX('candle-timer');

        this.stopDripAnimation();
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;

        // reset caches so visuals return to original state
        try {
            this._candleOriginals = null;
            this._smoothState = { flameDy: 0 };
            this._cacheCandleOriginals();
            this.updateCandleVisual(1.0);
            const msg = document.querySelector('.completion-message');
            if (msg) msg.classList.remove('visible');
            const flame = document.querySelector('.candle-flame');
            if (flame) flame.style.opacity = '1';
            const smoke = document.querySelector('.candle-smoke');
            if (smoke) smoke.style.opacity = '0';
        } catch (e) {
            console.error('CandleTimer.reset error', e);
        }
    }

    animate() {
        if (!this.running) return;
        this.elapsed = Date.now() - this.startTime;
        const progress = Math.min(1, this.elapsed / this.duration);

        try {
            this.updateCandleVisual(1 - progress);
            this.updateDisplay();

            if (progress >= 1) {
                this.complete();
            } else {
                this.animationFrame = requestAnimationFrame(() => this.animate());
            }
        } catch (e) {
            console.error('CandleTimer.animate error', e);
            // stop gracefully
            this.running = false;
            if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    // --- complete() with robust blow-away handling ---
    complete() {
        // stop running state
        this.running = false;

        // update UI buttons
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        if (startBtn) startBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = true;

        // stop audio & drips
        try {
            if (window.audioManager) {
                window.audioManager.stopLoopingSFX && window.audioManager.stopLoopingSFX('candle-timer');
            }
        } catch (e) { /* ignore */ }
        this.stopDripAnimation();

        // Animate flame (lift + fade), then show smoke & completion text
        try {
            this.animateFlameOut();
        } catch (e) {
            console.error('CandleTimer.complete: animateFlameOut failed', e);
            // fallback: ensure smoke and message still appear
            this.showSmoke();
            this.showCompletionMessage();
        }
    }

    // --- animateFlameOut() that reliably lifts + fades flame and wick ---
    animateFlameOut() {
        const flame = document.querySelector('.candle-flame');
        const wick = document.querySelector('.candle-wick');

        if (!flame && !wick) {
            // nothing to animate — directly show smoke & message
            this.showSmoke();
            this.showCompletionMessage();
            return;
        }

        // Ensure we have a transition style applied
        const applyTransition = (el) => {
            if (!el) return;
            el.style.transition = 'transform 900ms cubic-bezier(.2,.9,.2,1), opacity 900ms ease-out';
            el.style.willChange = 'transform, opacity';
        };

        applyTransition(flame);
        applyTransition(wick);

        // Force layout so transition will animate
        void (flame && flame.getBoundingClientRect());
        void (wick && wick.getBoundingClientRect());

        // Setup a safe transitionend handler with timeout fallback
        let done = false;
        const finish = () => {
            if (done) return;
            done = true;

            // remove or hide flame/wick so they don't block interactions
            try {
                if (flame && flame.parentElement) flame.parentElement.removeChild(flame);
            } catch (e) { /* ignore */ }
            try {
                if (wick && wick.parentElement) wick.parentElement.removeChild(wick);
            } catch (e) { /* ignore */ }

            // show smoke and completion
            this.showSmoke();
            this.showCompletionMessage();
        };

        const onTransitionEnd = (ev) => {
            // ensure we listen for either opacity or transform end
            if (ev.target === flame || ev.target === wick) {
                finish();
            }
        };

        if (flame) flame.addEventListener('transitionend', onTransitionEnd, { once: true });
        if (wick) wick.addEventListener('transitionend', onTransitionEnd, { once: true });

        // Fallback timeout in case transitionend doesn't fire (e.g., removed by browser)
        const fallbackTimeout = setTimeout(() => {
            finish();
        }, 1100);

        // Trigger the visual "blow away" — lift up, shrink, fade
        try {
            if (flame) {
                flame.style.transformOrigin = '50% 60%';
                flame.style.transform = 'translateY(-28px) scale(0.6)';
                flame.style.opacity = '0';
            }
            if (wick) {
                // wick lifts and shortens visually by scaling Y smaller
                wick.style.transformOrigin = '50% 0%';
                wick.style.transform = 'translateY(-28px) scaleY(0.6)';
                wick.style.opacity = '0';
            }
        } catch (e) {
            console.warn('CandleTimer.animateFlameOut: failed to apply transforms', e);
            // fallback immediately
            clearTimeout(fallbackTimeout);
            finish();
        }
    }

    updateCandleVisual(remainingPercent) {
        // defensive: cache originals if needed
        if (!this._candleOriginals) this._cacheCandleOriginals();
        const o = this._candleOriginals;
        if (!o) {
            console.warn('CandleTimer: missing cached SVG originals, aborting visual update');
            return;
        }

        const rect = document.querySelector('.candle-wax');
        const flameEllipses = o.flameEllipses || [];
        const wick = document.querySelector('.candle-wick');
        const glow = document.querySelector('.candle-glow');

        if (!rect || !wick || !glow) {
            console.warn('CandleTimer: essential SVG parts missing', { rect, wick, glow });
            return;
        }

        // shrink wax rect
        const minHeight = 6;
        const newHeight = Math.max(minHeight, Math.round(o.waxHeight * remainingPercent));
        const newY = o.waxY + (o.waxHeight - newHeight);
        try {
            rect.setAttribute('y', newY);
            rect.setAttribute('height', newHeight);
        } catch (e) {
            console.error('CandleTimer: failed to set wax rect attributes', e);
        }

        // flame desired position (above wax)
        const flameOffsetAboveWax = 10; // tuned default
        const desiredFlameBaseCy = newY - flameOffsetAboveWax;
        let targetDy = desiredFlameBaseCy - o.flameEllipseCy1;

        // clamp targetDy to sensible range
        const maxDy = Math.max(0, o.waxHeight - minHeight + 12);
        targetDy = Math.min(Math.max(targetDy, 0), maxDy);

        // smooth the movement (lerp)
        const alpha = 0.18;
        this._smoothState.flameDy = this._smoothState.flameDy + (targetDy - this._smoothState.flameDy) * alpha;
        const dy = this._smoothState.flameDy;

        // apply to flame ellipses (absolute cy)
        try {
            if (flameEllipses[0]) flameEllipses[0].setAttribute('cy', o.flameEllipseCy1 + dy);
            if (flameEllipses[1]) flameEllipses[1].setAttribute('cy', o.flameEllipseCy2 + dy);
        } catch (e) {
            console.error('CandleTimer: failed updating flame ellipses', e);
        }

        // wick moves with flame
        try {
            wick.setAttribute('y1', o.wickY1 + dy);
            wick.setAttribute('y2', o.wickY2 + dy);
        } catch (e) {
            console.error('CandleTimer: failed updating wick', e);
        }

        // glow follows + fades
        try {
            glow.setAttribute('cy', o.glowCy + dy);
            glow.style.opacity = Math.max(0, 0.6 * remainingPercent);
        } catch (e) {
            // ignore
        }
    }

    _cacheCandleOriginals() {
        try {
            const rect = document.querySelector('.candle-wax');
            const flameGroup = document.querySelector('.candle-flame');
            const wick = document.querySelector('.candle-wick');
            const glow = document.querySelector('.candle-glow');

            if (!rect || !flameGroup || !wick || !glow) {
                console.warn('CandleTimer._cacheCandleOriginals: missing some SVG elements', { rect, flameGroup, wick, glow });
                this._candleOriginals = null;
                return;
            }

            const waxY = parseFloat(rect.getAttribute('y'));
            const waxHeight = parseFloat(rect.getAttribute('height'));

            const flameEllipses = Array.from(flameGroup.querySelectorAll('ellipse'));
            const flameEllipseCy1 = flameEllipses[0] ? parseFloat(flameEllipses[0].getAttribute('cy')) : 45;
            const flameEllipseCy2 = flameEllipses[1] ? parseFloat(flameEllipses[1].getAttribute('cy')) : (flameEllipseCy1 + 3);

            const wickY1 = parseFloat(wick.getAttribute('y1'));
            const wickY2 = parseFloat(wick.getAttribute('y2'));
            const glowCy = parseFloat(glow.getAttribute('cy'));

            this._candleOriginals = {
                waxY,
                waxHeight,
                flameEllipseCy1,
                flameEllipseCy2,
                wickY1,
                wickY2,
                glowCy,
                flameEllipses
            };

            // reset smoothing to exact starting position
            this._smoothState = { flameDy: 0 };
        } catch (e) {
            console.error('CandleTimer._cacheCandleOriginals error', e);
            this._candleOriginals = null;
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
        this.dripInterval = setInterval(() => {
            try { this.createDrip(); } catch(e){ console.error('createDrip error', e); }
        }, 400 + Math.random() * 600);
    }

    stopDripAnimation() {
        if (this.dripInterval) {
            clearInterval(this.dripInterval);
            this.dripInterval = null;
        }
        const dripsContainer = document.querySelector('.wax-drips');
        if (dripsContainer) dripsContainer.innerHTML = '';
        this.drips = [];
    }

    createDrip() {
        const dripsContainer = document.querySelector('.wax-drips');
        const rect = document.querySelector('.candle-wax');
        if (!dripsContainer || !rect) return;

        const startY = parseFloat(rect.getAttribute('y')) + 2;
        const x = 30 + Math.random() * 40;
        const size = 1.5 + Math.random() * 1.5;

        // temporary wax trail (small line) — these are short and will fall with animation
        const trailLength = 20 + Math.random() * 30;
        const trail = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        trail.setAttribute('x1', x); trail.setAttribute('y1', startY);
        trail.setAttribute('x2', x + (Math.random() - 0.5) * 5);
        trail.setAttribute('y2', startY + trailLength);
        trail.setAttribute('stroke', '#d4a574'); trail.setAttribute('stroke-width', '1.0');
        trail.setAttribute('opacity', '0.5'); trail.classList.add('wax-trail');
        dripsContainer.appendChild(trail);

        const drip = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        drip.setAttribute('cx', x); drip.setAttribute('cy', startY);
        drip.setAttribute('rx', size * 0.8); drip.setAttribute('ry', size * 1.5);
        drip.setAttribute('fill', '#cc8844'); drip.setAttribute('opacity', '0.95'); drip.classList.add('wax-drip');
        dripsContainer.appendChild(drip);

        let currentY = startY;
        const endY = 180;
        let speed = 0.4;
        const acceleration = 0.08;
        let opacity = 0.95;

        const animateDrip = () => {
            speed += acceleration;
            currentY += speed;
            opacity -= 0.004;
            drip.setAttribute('cy', currentY);
            drip.setAttribute('opacity', Math.max(0.35, opacity));
            const stretch = 1 + (speed * 0.15);
            drip.setAttribute('ry', size * 1.5 * stretch);
            if (currentY >= endY) {
                this.createSplash(x, endY);
                try { drip.remove(); } catch(e){}
                try { trail.remove(); } catch(e){} // remove temporary trail when drip finishes
            } else {
                requestAnimationFrame(animateDrip);
            }
        };
        animateDrip();
    }

    createSplash(x, y) {
        const dripsContainer = document.querySelector('.wax-drips');
        if (!dripsContainer) return;
        const buildup = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        buildup.setAttribute('cx', x); buildup.setAttribute('cy', y);
        buildup.setAttribute('rx', 3 + Math.random() * 3); buildup.setAttribute('ry', 1.5 + Math.random() * 1.5);
        buildup.setAttribute('fill', '#d4a574'); buildup.setAttribute('opacity', '0.8'); buildup.classList.add('wax-buildup');
        dripsContainer.appendChild(buildup);

        for (let i=0;i<5;i++){
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const angle = (Math.random() - 0.5) * Math.PI;
            const distance = 3 + Math.random() * 4;
            particle.setAttribute('cx', x); particle.setAttribute('cy', y); particle.setAttribute('r','1');
            particle.setAttribute('fill','#cc8844'); particle.setAttribute('opacity','0.7');
            dripsContainer.appendChild(particle);

            let time = 0;
            const animateSplash = () => {
                time += 0.1;
                const newX = x + Math.cos(angle) * distance * time;
                const newY = y + Math.sin(angle) * distance * time * 0.5;
                const opacity = Math.max(0, 0.7 - time * 0.3);
                particle.setAttribute('cx', newX);
                particle.setAttribute('cy', newY);
                particle.setAttribute('opacity', opacity);
                if (opacity <= 0) particle.remove();
                else requestAnimationFrame(animateSplash);
            };
            animateSplash();
        }
    }

    showSmoke() {
        const smoke = document.querySelector('.candle-smoke');
        if (smoke) {
            smoke.style.opacity = '1';
            const ellipse = smoke.querySelector('ellipse');
            if (ellipse) {
                const animations = ellipse.querySelectorAll('animate');
                animations.forEach(anim => { try { anim.beginElement(); } catch(e){} });
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
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.stopDripAnimation();
        this._candleOriginals = null;
        this._smoothState = { flameDy: 0 };
    }
}
