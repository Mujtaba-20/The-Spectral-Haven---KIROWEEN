// Nightfall Candle Timer Component - Option B (fixed + improved)

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
        this._flickerSeed = Math.random() * 10000;
        this._lastAnimateTime = 0;

        // bind for rAF so we can cancel reliably
        this.animate = this.animate.bind(this);
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
                    // cache after DOM paints
                    requestAnimationFrame(() => {
                        this._cacheCandleOriginals();
                        this.updateCandleVisual(1.0); // ensure visuals match initial state
                        this.updateDisplay();
                    });
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
        // kept your simplified SVG layout but the code expects those classes/structure
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
                    const minutes = parseFloat(e.currentTarget.getAttribute('data-duration'));
                    if (isNaN(minutes)) return;
                    this.setDuration(minutes);
                    durationBtns.forEach(b => b.classList.remove('selected'));
                    e.currentTarget.classList.add('selected');
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
        if (!minutes || isNaN(minutes) || minutes <= 0) {
            this.duration = 0;
        } else {
            // data-duration is in minutes; 0.5 => 30 seconds
            this.duration = Math.round(minutes * 60 * 1000);
        }
        this.elapsed = 0;
        this.updateDisplay();
        const startBtn = document.getElementById('start-btn');
        if (startBtn) startBtn.disabled = this.duration === 0;
        // clear any completion message
        const msg = document.querySelector('.completion-message');
        if (msg) msg.classList.remove('visible');
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
        // start RAF loop
        if (!this.animationFrame) {
            this._lastAnimateTime = Date.now();
            this.animationFrame = requestAnimationFrame(this.animate);
        }
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
        // fully stop
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

        // restore visuals after the next paint so DOM changes (if any) are applied
        requestAnimationFrame(() => {
            try {
                // remove any dynamic drips / buildups
                const dripsContainer = document.querySelector('.wax-drips');
                if (dripsContainer) dripsContainer.innerHTML = '';

                // reset caches so visuals return to original state
                this._candleOriginals = null;
                this._smoothState = { flameDy: 0 };
                this._cacheCandleOriginals();
                this.updateCandleVisual(1.0);

                const msg = document.querySelector('.completion-message');
                if (msg) {
                    msg.classList.remove('visible');
                    msg.textContent = '';
                }
                const flame = document.querySelector('.candle-flame');
                if (flame) {
                    flame.style.transition = '';
                    flame.style.opacity = '1';
                    flame.setAttribute('transform', ''); // remove any transform
                }
                const smoke = document.querySelector('.candle-smoke');
                if (smoke) smoke.style.opacity = '0';
            } catch (e) {
                console.error('CandleTimer.reset error', e);
            }
        });
    }

    animate() {
        // RAF-driven animation loop; respects this.running
        if (!this.running) {
            // ensure nothing left running
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
            return;
        }

        this.elapsed = Date.now() - this.startTime;
        const progress = Math.min(1, this.elapsed / Math.max(1, this.duration));

        try {
            if (progress < 1) {
                // update visuals for remaining percent
                this.updateCandleVisual(1 - progress);
                this.updateDisplay();

                // loop
                this.animationFrame = requestAnimationFrame(this.animate);
            } else {
                // reached end — stop rAF and finalize
                this.running = false;
                if (this.animationFrame) {
                    cancelAnimationFrame(this.animationFrame);
                    this.animationFrame = null;
                }

                // ensure wax fully melted & display shows 00:00
                this.updateCandleVisual(0);
                this.updateDisplay();

                // call complete to trigger flame out + message + audio stop
                this.complete();
            }
        } catch (e) {
            console.error('CandleTimer.animate error', e);
            this.running = false;
            if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    updateCandleVisual(remainingPercent) {
        // defensive: cache originals if needed
        if (!this._candleOriginals) this._cacheCandleOriginals();
        const o = this._candleOriginals;
        if (!o) {
            // can't update visuals without originals
            return;
        }

        const rect = document.querySelector('.candle-wax');
        const flameGroup = document.querySelector('.candle-flame');
        const flameEllipses = o.flameEllipses || [];
        const wick = document.querySelector('.candle-wick');
        const glow = document.querySelector('.candle-glow');

        if (!rect || !wick || !glow || !flameGroup) return;

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
        const maxDy = Math.max(0, o.waxHeight - minHeight + 18);
        targetDy = Math.min(Math.max(targetDy, 0), maxDy);

        // smooth the movement (lerp)
        const alpha = 0.18;
        this._smoothState.flameDy = this._smoothState.flameDy + (targetDy - this._smoothState.flameDy) * alpha;
        const dy = this._smoothState.flameDy;

        // slight flicker factor (time-based)
        const t = Date.now() + this._flickerSeed;
        const flicker = 1 + 0.03 * Math.sin(t / 120) + 0.015 * Math.sin(t / 40);

        // apply to flame ellipses (absolute cy) — we keep individual ellipse cy for nicer shape
        try {
            if (flameEllipses[0]) flameEllipses[0].setAttribute('cy', o.flameEllipseCy1 + dy);
            if (flameEllipses[1]) flameEllipses[1].setAttribute('cy', o.flameEllipseCy2 + dy);
            // scale rx/ry slightly for flicker
            if (flameEllipses[0]) {
                const baseRx = o.flameEllipseRx1 || parseFloat(flameEllipses[0].getAttribute('rx') || 12);
                const baseRy = o.flameEllipseRy1 || parseFloat(flameEllipses[0].getAttribute('ry') || 20);
                flameEllipses[0].setAttribute('rx', Math.max(6, baseRx * flicker));
                flameEllipses[0].setAttribute('ry', Math.max(8, baseRy * flicker));
            }
            if (flameEllipses[1]) {
                const baseRx2 = o.flameEllipseRx2 || parseFloat(flameEllipses[1].getAttribute('rx') || 8);
                const baseRy2 = o.flameEllipseRy2 || parseFloat(flameEllipses[1].getAttribute('ry') || 12);
                flameEllipses[1].setAttribute('rx', Math.max(4, baseRx2 * (0.98 + (flicker - 1) * 0.8)));
                flameEllipses[1].setAttribute('ry', Math.max(6, baseRy2 * (0.98 + (flicker - 1) * 0.8)));
            }
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

        // glow follows + fades with remainingPercent
        try {
            glow.setAttribute('cy', o.glowCy + dy);
            glow.style.opacity = String(Math.max(0, 0.6 * remainingPercent));
        } catch (e) {
            // ignore minor glow errors
        }

        // apply group transform for subtle vertical offset + random small horizontal jitter
        try {
            const jitterX = Math.sin(t / 150) * 0.6;
            flameGroup.setAttribute('transform', `translate(${jitterX.toFixed(2)},${dy.toFixed(2)}) scale(${(1).toFixed(3)})`);
            // fade the flame down soft when remainingPercent is low
            flameGroup.style.opacity = String(Math.max(0, Math.min(1, remainingPercent * 1.2)));
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
            // store original cx/cy/rx/ry to enable flicker/resets
            const flameEllipseCy1 = flameEllipses[0] ? parseFloat(flameEllipses[0].getAttribute('cy')) : 45;
            const flameEllipseCy2 = flameEllipses[1] ? parseFloat(flameEllipses[1].getAttribute('cy')) : (flameEllipseCy1 + 3);
            const flameEllipseRx1 = flameEllipses[0] ? parseFloat(flameEllipses[0].getAttribute('rx')) : 12;
            const flameEllipseRy1 = flameEllipses[0] ? parseFloat(flameEllipses[0].getAttribute('ry')) : 20;
            const flameEllipseRx2 = flameEllipses[1] ? parseFloat(flameEllipses[1].getAttribute('rx')) : 8;
            const flameEllipseRy2 = flameEllipses[1] ? parseFloat(flameEllipses[1].getAttribute('ry')) : 12;

            const wickY1 = parseFloat(wick.getAttribute('y1'));
            const wickY2 = parseFloat(wick.getAttribute('y2'));
            const glowCy = parseFloat(glow.getAttribute('cy'));

            this._candleOriginals = {
                waxY,
                waxHeight,
                flameEllipseCy1,
                flameEllipseCy2,
                flameEllipseRx1,
                flameEllipseRy1,
                flameEllipseRx2,
                flameEllipseRy2,
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
        // ensure only one interval
        this.stopDripAnimation();
        // create some initial delay so drips don't flood immediately
        this.dripInterval = setInterval(() => {
            try {
                // only create drips if running and flame visible
                if (this.running) this.createDrip();
            } catch(e){
                console.error('createDrip error', e);
            }
        }, 400 + Math.random() * 600);
    }

    stopDripAnimation() {
        if (this.dripInterval) {
            clearInterval(this.dripInterval);
            this.dripInterval = null;
        }
        // remove all dynamic drips/buildups
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

        // temporary wax trail (small line)
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
        let speed = 0.4 + Math.random() * 0.3;
        const acceleration = 0.06 + Math.random() * 0.04;
        let opacity = 0.95;

        const animateDrip = () => {
            speed += acceleration;
            currentY += speed;
            opacity -= 0.004 + Math.random() * 0.002;
            drip.setAttribute('cy', currentY);
            drip.setAttribute('opacity', Math.max(0.35, opacity));
            const stretch = 1 + (speed * 0.15);
            drip.setAttribute('ry', size * 1.5 * stretch);
            if (currentY >= endY) {
                this.createSplash(x, endY);
                try { drip.remove(); } catch(e){}
                try { trail.remove(); } catch(e){}
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

    complete() {
        // ensure audio & drips stopped
        if (window.audioManager) window.audioManager.stopLoopingSFX('candle-timer');
        this.stopDripAnimation();

        // animate flame out
        this.animateFlameOut();

        // show message after a short delay so flame fade feels natural
        setTimeout(() => this.showCompletionMessage(), 700);
    }

    animateFlameOut() {
        const flame = document.querySelector('.candle-flame');
        if (flame) {
            // directly set CSS transition so our RAF won't keep overwriting
            flame.style.transition = 'opacity 900ms ease-out, transform 900ms ease-out';
            flame.style.opacity = '0';
            // slight shrink transform for effect
            flame.setAttribute('transform', 'translate(0,0) scale(0.8)');
        }
        // then show smoke (SVG animate elements triggered)
        setTimeout(() => this.showSmoke(), 500);
    }

    showSmoke() {
        const smoke = document.querySelector('.candle-smoke');
        if (smoke) {
            // make smoke visible and trigger SVG <animate> inside
            smoke.style.opacity = '1';
            const ellipse = smoke.querySelector('ellipse');
            if (ellipse) {
                const animations = ellipse.querySelectorAll('animate');
                animations.forEach(anim => {
                    try { anim.beginElement && anim.beginElement(); } catch(e){}
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
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.stopDripAnimation();
        this._candleOriginals = null;
        this._smoothState = { flameDy: 0 };
    }
}
