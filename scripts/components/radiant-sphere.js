// Radiant Sphere - Mystical positive affirmations

export class RadiantSphere {
    constructor() {
        this.container = null;
        this.currentAffirmation = null;
        this.lastAffirmationIndex = -1;
        
        this.affirmations = [
            "The winds whisper softly in your favor today.",
            "A quiet brightness follows your steps.",
            "Your spark is stirring something beautiful.",
            "The veil parts gently for your presence.",
            "Even the shadows admire your glow.",
            "A small blessing is already moving toward you.",
            "Your energy hums with quiet strength.",
            "Something good is gathering just out of sight.",
            "The universe remembers your light.",
            "There is warmth coiling in your future."
        ];

        // Added: guarded SFX and modal cache
        this.sfx = null;
        try {
            this.sfx = new Audio('/assets/shimmer.mp3'); // optional; 404 won't break UI
            this.sfx.preload = 'auto';
        } catch (e) {
            this.sfx = null;
            console.debug('RadiantSphere: sfx init failed', e);
        }
        this._affModal = null; // cached overlay element
    }

    render() {
        this.container = document.getElementById('page-container');
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="radiant-sphere-page">
                <h1>🔮 The Radiant Sphere</h1>
                <p class="subtitle">Touch the orb to receive a mystical affirmation...</p>

                <div class="sphere-container">
                    <div class="orb-wrapper" id="orb-wrapper">
                        <svg class="radiant-orb" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <!-- Radial gradient for glow -->
                                <radialGradient id="orbGradient">
                                    <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
                                    <stop offset="40%" style="stop-color:#9D7BD8;stop-opacity:0.9" />
                                    <stop offset="70%" style="stop-color:#5DD9C1;stop-opacity:0.6" />
                                    <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:0.2" />
                                </radialGradient>
                                
                                <!-- Glow filter -->
                                <filter id="orbGlow">
                                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                                
                                <!-- Sparkle filter -->
                                <filter id="sparkle">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            <!-- Outer glow ring -->
                            <circle cx="100" cy="100" r="90" fill="url(#orbGradient)" opacity="0.3" 
                                    filter="url(#orbGlow)" class="orb-outer-glow"/>
                            
                            <!-- Main orb -->
                            <circle cx="100" cy="100" r="70" fill="url(#orbGradient)" 
                                    filter="url(#orbGlow)" class="orb-main"/>
                            
                            <!-- Inner highlight -->
                            <circle cx="85" cy="85" r="25" fill="rgba(255,255,255,0.4)" 
                                    class="orb-highlight"/>
                            
                            <!-- Sparkles -->
                            <circle cx="100" cy="60" r="3" fill="white" opacity="0.8" 
                                    filter="url(#sparkle)" class="sparkle sparkle-1"/>
                            <circle cx="130" cy="90" r="2" fill="white" opacity="0.7" 
                                    filter="url(#sparkle)" class="sparkle sparkle-2"/>
                            <circle cx="70" cy="110" r="2.5" fill="white" opacity="0.6" 
                                    filter="url(#sparkle)" class="sparkle sparkle-3"/>
                            <circle cx="120" cy="130" r="2" fill="white" opacity="0.7" 
                                    filter="url(#sparkle)" class="sparkle sparkle-4"/>
                            <circle cx="80" cy="140" r="1.5" fill="white" opacity="0.5" 
                                    filter="url(#sparkle)" class="sparkle sparkle-5"/>
                        </svg>
                        
                        <div class="orb-prompt">Touch the orb</div>
                    </div>
                </div>

                <div class="affirmation-cloud" id="affirmation-cloud" style="display: none;">
                    <div class="cloud-content">
                        <div class="affirmation-text" id="affirmation-text"></div>
                    </div>
                    <div class="cloud-tail"></div>
                </div>
                
                <div class="reveal-container" id="reveal-container" style="display: none;">
                    <button class="btn btn-secondary reveal-another" id="reveal-another">
                        ✨ Reveal Another
                    </button>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const orbWrapper = document.getElementById('orb-wrapper');
        const revealBtn = document.getElementById('reveal-another');

        if (orbWrapper) {
            orbWrapper.addEventListener('click', () => this.activateOrb());
        }

        if (revealBtn) {
            revealBtn.addEventListener('click', () => this.activateOrb());
        }
    }

    // Replaced: create a dialog anchored to the orb's top-right (appended to body)
    ensureAffirmationModal() {
        if (this._affModal) return this._affModal;

        // full-screen container (pointer-events:none so clicks pass through except dialog)
        const container = document.createElement('div');
        container.id = 'radiant-affirmation-overlay';
        container.style.cssText = `
            position:fixed;
            inset:0;
            pointer-events:none;
            z-index:9999999;
        `;

        // dialog box (positioned dynamically)
        const dialog = document.createElement('div');
        dialog.id = 'radiant-affirmation-dialog';
        dialog.style.cssText = `
            position:fixed;
            pointer-events:auto;
            transform-origin: top left;
            opacity:0;
            transform: translateY(-6px) scale(0.98);
            transition: opacity 180ms ease, transform 180ms ease;

            /* ✨ Glow styling */
            background: rgba(120, 255, 235, 0.72);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);

            border-radius: 14px;
            padding: 14px 18px;

            /* Outer glow */
            box-shadow:
                0 0 12px rgba(120, 255, 235, 0.55),
                0 0 28px rgba(120, 255, 235, 0.35),
                0 8px 22px rgba(0, 0, 0, 0.35);

            color: #0a0d12;
            max-width: 320px;
            font-size: 16px;
            line-height: 1.45;

            border: 1px solid rgba(255,255,255,0.35);
        `;

        // small tail pointing to the orb
        const tail = document.createElement('div');
        tail.style.cssText = `
            position:absolute;
            width:12px;
            height:12px;
            background:inherit;
            left:8px; top:100%;
            transform: translateY(-50%) rotate(45deg);
            box-shadow: 0 6px 12px rgba(2,6,23,0.08);
        `;

        const text = document.createElement('div');
        text.id = 'radiant-affirmation-text-dialog';
        text.style.cssText = 'padding-right:6px; padding-left:6px;';

        const close = document.createElement('button');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close affirmation');
        close.innerText = '✕';
        close.style.cssText = `
            position:absolute; right:8px; top:6px; border:0; background:transparent; cursor:pointer;
            font-size:13px; line-height:1;
        `;
        close.addEventListener('click', () => this.hideAffirmation());

        dialog.appendChild(close);
        dialog.appendChild(text);
        dialog.appendChild(tail);
        container.appendChild(dialog);

        // handlers stored for cleanup
        const onKey = (e) => { if (e.key === 'Escape') this.hideAffirmation(); };
        container._onKey = onKey;
        container._dialog = dialog;
        container._text = text;
        container._tail = tail;
        container._onDocClick = null;

        this._affModal = container;
        return container;
    }

    showAffirmation(message) {
        const overlay = this.ensureAffirmationModal();
        const dialog = overlay._dialog;
        const textEl = overlay._text;
        const tail = overlay._tail;
        if (!dialog || !textEl) return;

        textEl.textContent = message;

        // append overlay to body if not present
        if (!document.body.contains(overlay)) document.body.appendChild(overlay);

        // compute orb position and desired dialog location (top-right of orb)
        const orbEl = document.getElementById('orb-wrapper') || document.querySelector('.orb-wrapper') || document.querySelector('#orb');
        const rect = orbEl ? orbEl.getBoundingClientRect() : null;

        // default position (center-top fallback)
        let left = Math.round(window.innerWidth / 2 - 160);
        let top = 80 + window.scrollY;
        let tailLeft = 12;
        let dialogWidth = 280;

        if (rect) {
            const margin = 12;
            // responsive dialog width
            dialogWidth = Math.min(320, Math.max(180, Math.floor(window.innerWidth * 0.28)));

            // initial candidate: to the right of orb, then nudge left so the dialog sits near orb (not glued)
            // nudgeFactor moves the dialog left by a percentage of dialogWidth
            const nudgeFactor = 0.38;
            let candidateRight = Math.round(rect.left + window.scrollX + rect.width + margin);
            left = Math.round(candidateRight - Math.floor(dialogWidth * nudgeFactor));

            top  = Math.round(rect.top + window.scrollY + (rect.height * 0.08));

            // if the dialog would overflow right edge, flip to left of orb and nudge similarly
            if ((left + dialogWidth + 8) > (window.scrollX + window.innerWidth)) {
                // position left of orb
                left = Math.round(rect.left + window.scrollX - dialogWidth - margin);
                // nudge slightly toward orb (shift right)
                left = left + Math.floor(dialogWidth * 0.12);
                tailLeft = Math.max(12, dialogWidth - 26);
                dialog.style.transformOrigin = 'top right';
            } else {
                tailLeft = 10;
                dialog.style.transformOrigin = 'top left';
            }

            // keep dialog within vertical bounds
            const minTop = 8 + window.scrollY;
            const maxTop = window.scrollY + window.innerHeight - 140;
            if (top < minTop) top = minTop;
            if (top > maxTop) top = maxTop;

            dialog.style.width = `${dialogWidth}px`;
        } else {
            dialog.style.width = `${dialogWidth}px`;
        }

        // apply position
        dialog.style.left = `${Math.round(left)}px`;
        dialog.style.top = `${Math.round(top)}px`;
        tail.style.left = `${Math.round(tailLeft)}px`;

        // entrance animation
        requestAnimationFrame(() => {
            dialog.style.opacity = '1';
            dialog.style.transform = 'translateY(0) scale(1)';
        });

        // outside click handler — attach after current click finishes to avoid immediate self-close
        if (overlay._onDocClick) {
            // remove any previous listener first
            try { document.removeEventListener('click', overlay._onDocClick, { capture: true }); } catch(e){/* ignore */ }
            overlay._onDocClick = null;
        }

        const onDocClick = (ev) => {
            if (!dialog.contains(ev.target)) {
                // defer hide slightly to allow dialog internal clicks to process
                setTimeout(() => this.hideAffirmation(), 0);
            }
        };
        overlay._onDocClick = onDocClick;

        // attach listeners on next tick so the click that opened the dialog isn't seen by this handler
        setTimeout(() => {
            document.addEventListener('click', onDocClick, { capture: true });
            document.addEventListener('keydown', overlay._onKey);
        }, 0);
    }

    hideAffirmation() {
        const overlay = this._affModal;
        if (!overlay) return;
        const dialog = overlay._dialog;
        if (dialog) {
            dialog.style.opacity = '0';
            dialog.style.transform = 'translateY(-6px) scale(0.98)';
        }

        // remove global listeners (capture flag must match)
        if (overlay._onDocClick) {
            try { document.removeEventListener('click', overlay._onDocClick, { capture: true }); } catch(e){/* ignore */ }
            overlay._onDocClick = null;
        }
        if (overlay._onKey) {
            try { document.removeEventListener('keydown', overlay._onKey); } catch(e){/* ignore */ }
        }

        overlay.style.pointerEvents = 'none';

        // remove from DOM after dialog transition ends (not overlay)
        if (dialog) {
            const remover = () => {
                if (overlay.parentElement) overlay.parentElement.removeChild(overlay);
                dialog.removeEventListener('transitionend', remover);
            };
            dialog.addEventListener('transitionend', remover);
        } else {
            if (overlay.parentElement) overlay.parentElement.removeChild(overlay);
        }
    }

    activateOrb() {
        const orbWrapper = document.getElementById('orb-wrapper');
        const affirmationCloud = document.getElementById('affirmation-cloud');
        const affirmationText = document.getElementById('affirmation-text');
        const revealContainer = document.getElementById('reveal-container');

        if (!orbWrapper) return;

        // Add pulse animation
        orbWrapper.classList.add('orb-pulse');
        
        // Add sparkle burst
        orbWrapper.classList.add('sparkle-burst');

        // Remove animations after they complete
        setTimeout(() => {
            orbWrapper.classList.remove('orb-pulse');
            orbWrapper.classList.remove('sparkle-burst');
        }, 800);

        // Show affirmation cloud after animation
        setTimeout(() => {
            const affirmation = this.getRandomAffirmation();

            // Keep the in-page cloud for graceful degrade (if styles work)
            if (affirmationText) {
                affirmationText.textContent = affirmation;
                affirmationText.classList.add('affirmation-fade-in');
                
                setTimeout(() => {
                    affirmationText.classList.remove('affirmation-fade-in');
                }, 600);
            }
            
            if (affirmationCloud) {
                affirmationCloud.style.display = 'block';
                affirmationCloud.classList.add('cloud-appear');
                
                setTimeout(() => {
                    affirmationCloud.classList.remove('cloud-appear');
                }, 600);
            }
            
            if (revealContainer) {
                revealContainer.style.display = 'block';
            }

            // Show the robust modal appended to body (fixes stacking / z-index problems)
            this.showAffirmation(affirmation);
        }, 400);

        // Play shimmer audio when orb is clicked
        try {
            if (this.sfx) {
                this.sfx.currentTime = 0;
                this.sfx.play().catch(() => {});
            } else if (window.audioManager) {
                window.audioManager.playSFX && window.audioManager.playSFX('shimmer');
            }
        } catch (e) {
            console.debug('RadiantSphere: audio playback failed', e);
        }
    }

    getRandomAffirmation() {
        // Get a random affirmation that's different from the last one
        let index;
        do {
            index = Math.floor(Math.random() * this.affirmations.length);
        } while (index === this.lastAffirmationIndex && this.affirmations.length > 1);
        
        this.lastAffirmationIndex = index;
        return this.affirmations[index];
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }

        // cleanup modal if present
        if (this._affModal && this._affModal.parentElement) {
            this._affModal.parentElement.removeChild(this._affModal);
            this._affModal = null;
        }
    }
}
