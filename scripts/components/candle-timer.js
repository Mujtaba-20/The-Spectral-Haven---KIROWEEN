// Nightfall Candle Timer Component - fixed: reset now restores full candle, flame-out works, no wax strips

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

        // NEW: Prevents recaching melted candle values
        this._hasCachedOriginals = false;

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
            setTimeout(() => {
                try {
                    this.attachEventListeners();
                    requestAnimationFrame(() => {
                        this._cacheCandleOriginals();
                        this.updateCandleVisual(1.0);
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
                btn.addEventListener('click', () => {
                    const minutes = parseFloat(btn.dataset.duration);
                    this.setDuration(minutes);
                    durationBtns.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                });
            });

            document.getElementById('start-btn')?.addEventListener('click', () => this.start());
            document.getElementById('pause-btn')?.addEventListener('click', () => this.pause());
            document.getElementById('reset-btn')?.addEventListener('click', () => this.reset());
        } catch (e) {
            console.error('CandleTimer.attachEventListeners error', e);
        }
    }

    setDuration(minutes) {
        if (this.running) return;
        if (isNaN(minutes) || minutes <= 0) {
            this.duration = 0;
        } else {
            this.duration = minutes * 60 * 1000;
        }
        this.elapsed = 0;
        this.updateDisplay();

        const msg = document.querySelector('.completion-message');
        if (msg) { msg.classList.remove('visible'); msg.textContent = ''; }

        const startBtn = document.getElementById('start-btn');
        if (startBtn) startBtn.disabled = this.duration === 0;
    }

    start() {
        if (this.duration === 0 || this.running) return;
        this.running = true;
        this.startTime = Date.now() - this.elapsed;

        document.getElementById('start-btn').disabled = true;
        document.getElementById('pause-btn').disabled = false;

        if (window.audioManager) window.audioManager.playLoopingSFX('candle-timer');

        this.startDripAnimation();
        if (!this.animationFrame) this.animationFrame = requestAnimationFrame(this.animate);
    }

    pause() {
        if (!this.running) return;
        this.running = false;
        this.elapsed = Date.now() - this.startTime;

        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;

        if (window.audioManager) window.audioManager.stopLoopingSFX('candle-timer');

        this.stopDripAnimation();
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
    }

    reset() {
        this.running = false;
        this.elapsed = 0;
        this.startTime = null;

        document.getElementById('start-btn').disabled = this.duration === 0;
        document.getElementById('pause-btn').disabled = true;

        if (window.audioManager) window.audioManager.stopLoopingSFX('candle-timer');

        this.stopDripAnimation();
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;

        requestAnimationFrame(() => {
            const dripsContainer = document.querySelector('.wax-drips');
            if (dripsContainer) dripsContainer.innerHTML = '';

            // USE ORIGINAL VALUES (we never overwrite them)
            this._smoothState = { flameDy: 0 };
            this.updateCandleVisual(1.0);  // restores original wax height

            const flame = document.querySelector('.candle-flame');
            if (flame) { flame.style.transition = ''; flame.style.opacity = '1'; flame.setAttribute('transform',''); }

            const smoke = document.querySelector('.candle-smoke');
            if (smoke) smoke.style.opacity = '0';

            const msg = document.querySelector('.completion-message');
            if (msg) msg.classList.remove('visible');

            this.updateDisplay();
        });
    }

    animate() {
        if (!this.running) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
            return;
        }

        this.elapsed = Date.now() - this.startTime;
        const progress = Math.min(1, this.elapsed / this.duration);

        if (progress < 1) {
            this.updateCandleVisual(1 - progress);
            this.updateDisplay();
            this.animationFrame = requestAnimationFrame(this.animate);
        } else {
            this.running = false;
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;

            this.updateCandleVisual(0);
            this.updateDisplay();
            this.complete();
        }
    }

    updateCandleVisual(remainingPercent) {
        if (!this._candleOriginals) return;
        const o = this._candleOriginals;

        const rect = document.querySelector('.candle-wax');
        const flameGroup = document.querySelector('.candle-flame');
        const flameEllipses = o.flameEllipses || [];
        const wick = document.querySelector('.candle-wick');
        const glow = document.querySelector('.candle-glow');

        if (!rect || !wick || !glow || !flameGroup) return;

        const minHeight = 6;
        const newHeight = Math.max(minHeight, Math.round(o.waxHeight * remainingPercent));
        const newY = o.waxY + (o.waxHeight - newHeight);

        rect.setAttribute('y', newY);
        rect.setAttribute('height', newHeight);

        // flame up movement
        const flameOffsetAboveWax = 10;
        const desiredFlameBaseCy = newY - flameOffsetAboveWax;
        const targetDy = Math.min(Math.max(desiredFlameBaseCy - o.flameEllipseCy1, 0), o.waxHeight - minHeight + 12);

        const alpha = 0.18;
        this._smoothState.flameDy += (targetDy - this._smoothState.flameDy) * alpha;
        const dy = this._smoothState.flameDy;

        // update flame ellipses
        if (flameEllipses[0]) flameEllipses[0].setAttribute('cy', o.flameEllipseCy1 + dy);
        if (flameEllipses[1]) flameEllipses[1].setAttribute('cy', o.flameEllipseCy2 + dy);

        wick.setAttribute('y1', o.wickY1 + dy);
        wick.setAttribute('y2', o.wickY2 + dy);

        glow.setAttribute('cy', o.glowCy + dy);
        glow.style.opacity = Math.max(0, 0.6 * remainingPercent);

        flameGroup.setAttribute('transform', `translate(0,${dy.toFixed(2)})`);
        flameGroup.style.opacity = `${Math.max(0, Math.min(1, remainingPercent * 1.1))}`;
    }

    // NEW — caches original values ONLY ONCE
    _cacheCandleOriginals() {
        if (this._hasCachedOriginals) return; // ← prevents recaching melted values

        const rect = document.querySelector('.candle-wax');
        const flameGroup = document.querySelector('.candle-flame');
        const wick = document.querySelector('.candle-wick');
        const glow = document.querySelector('.candle-glow');

        if (!rect || !flameGroup || !wick || !glow) return;

        const flameEllipses = Array.from(flameGroup.querySelectorAll('ellipse'));

        this._candleOriginals = {
            waxY: parseFloat(rect.getAttribute('y')),
            waxHeight: parseFloat(rect.getAttribute('height')),
            flameEllipseCy1: parseFloat(flameEllipses[0].getAttribute('cy')),
            flameEllipseCy2: parseFloat(flameEllipses[1].getAttribute('cy')),
            wickY1: parseFloat(wick.getAttribute('y1')),
            wickY2: parseFloat(wick.getAttribute('y2')),
            glowCy: parseFloat(glow.getAttribute('cy')),
            flameEllipses
        };

        this._hasCachedOriginals = true; // 🔥 prevents overwriting originals
    }

    updateDisplay() {
        const remaining = Math.max(0, this.duration - this.elapsed);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const display = document.querySelector('.time-remaining');
        if (display) {
            display.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
        }
    }

    startDripAnimation() {
        this.stopDripAnimation();
        this.dripInterval = setInterval(() => {
            if (this.running) this.createDrip();
        }, 400 + Math.random() * 600);
    }

    stopDripAnimation() {
        if (this.dripInterval) clearInterval(this.dripInterval);
        this.dripInterval = null;
        const dripsContainer = document.querySelector('.wax-drips');
        if (dripsContainer) dripsContainer.innerHTML = '';
    }

    createDrip() {
        const dripsContainer = document.querySelector('.wax-drips');
        const rect = document.querySelector('.candle-wax');
        if (!dripsContainer || !rect) return;

        const startY = parseFloat(rect.getAttribute('y')) + 2;
        const x = 30 + Math.random() * 40;
        const size = 1.5 + Math.random() * 1.5;

        const drip = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        drip.setAttribute('cx', x);
        drip.setAttribute('cy', startY);
        drip.setAttribute('rx', size * 0.8);
        drip.setAttribute('ry', size * 1.5);
        drip.setAttribute('fill', '#cc8844');
        drip.setAttribute('opacity', '0.95');
        dripsContainer.appendChild(drip);

        let currentY = startY;
        const endY = 180;
        let speed = 0.4 + Math.random() * 0.3;
        let opacity = 0.95;

        const animateDrip = () => {
            speed += 0.06;
            currentY += speed;
            opacity -= 0.004;

            drip.setAttribute('cy', currentY);
            drip.setAttribute('opacity', Math.max(0.35, opacity));
            drip.setAttribute('ry', size * 1.5 * (1 + speed * 0.15));

            if (currentY >= endY) {
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

        const buildup = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        buildup.setAttribute('cx', x);
        buildup.setAttribute('cy', y);
        buildup.setAttribute('rx', 3 + Math.random() * 3);
        buildup.setAttribute('ry', 1.5 + Math.random() * 1.5);
        buildup.setAttribute('fill', '#d4a574');
        buildup.setAttribute('opacity', '0.8');
        dripsContainer.appendChild(buildup);

        for (let i=0;i<5;i++){
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const angle = (Math.random() - 0.5) * Math.PI;
            const distance = 3 + Math.random() * 4;

            particle.setAttribute('cx', x);
            particle.setAttribute('cy', y);
            particle.setAttribute('r', '1');
            particle.setAttribute('fill', '#cc8844');
            particle.setAttribute('opacity', '0.7');
            dripsContainer.appendChild(particle);

            let t = 0;
            const animateSplash = () => {
                t += 0.1;
                particle.setAttribute('cx', x + Math.cos(angle) * distance * t);
                particle.setAttribute('cy', y + Math.sin(angle) * distance * t * 0.5);
                const newOpacity = Math.max(0, 0.7 - t * 0.3);
                particle.setAttribute('opacity', newOpacity);

                if (newOpacity <= 0) particle.remove();
                else requestAnimationFrame(animateSplash);
            };
            animateSplash();
        }
    }

    complete() {
        if (window.audioManager) window.audioManager.stopLoopingSFX('candle-timer');
        this.stopDripAnimation();
        this.animateFlameOut();
        setTimeout(() => this.showCompletionMessage(), 700);
    }

    animateFlameOut() {
        const flame = document.querySelector('.candle-flame');
        if (flame) {
            flame.style.transition = 'opacity 900ms ease-out, transform 900ms ease-out';
            flame.style.opacity = '0';
            flame.setAttribute('transform', 'translate(0,0) scale(0.95)');
        }
        setTimeout(() => this.showSmoke(), 500);
    }

    showSmoke() {
        const smoke = document.querySelector('.candle-smoke');
        if (smoke) {
            smoke.style.opacity = '1';
            smoke.querySelectorAll('animate').forEach(a => { try { a.beginElement(); } catch(e){} });
        }
    }

    showCompletionMessage() {
        const messages = [
            "The flame has faded…",
            "Darkness reclaims the light.",
            "The candle's watch has ended.",
            "Time melted away with the wax."
        ];
        const messageEl = document.querySelector('.completion-message');
        if (messageEl) {
            messageEl.textContent = messages[Math.floor(Math.random() * messages.length)];
            messageEl.classList.add('visible');
        }
    }

    destroy() {
        cancelAnimationFrame(this.animationFrame);
        this.stopDripAnimation();
        this._candleOriginals = null;
        this._smoothState = { flameDy: 0 };
        this._hasCachedOriginals = false;
    }
}
