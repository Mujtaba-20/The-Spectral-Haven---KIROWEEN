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

    // Added: create a modal appended to document.body to avoid stacking issues
    ensureAffirmationModal() {
        if (this._affModal) return this._affModal;

        const overlay = document.createElement('div');
        overlay.id = 'radiant-affirmation-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,10,12,0.55);z-index:9999999;opacity:0;pointer-events:none;transition:opacity .18s;';

        const modal = document.createElement('div');
        modal.id = 'radiant-affirmation-modal';
        modal.style.cssText = 'position:relative;background:linear-gradient(180deg,#ffffff,#f6f6ff);padding:18px;border-radius:12px;max-width:540px;width:88%;box-shadow:0 12px 30px rgba(0,0,0,.45);transform:translateY(8px);';

        const close = document.createElement('button');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close affirmation');
        close.innerText = '✕';
        close.style.cssText = 'position:absolute;right:12px;top:8px;border:0;background:transparent;font-size:18px;cursor:pointer';
        close.addEventListener('click', () => this.hideAffirmation());

        const text = document.createElement('div');
        text.id = 'radiant-affirmation-text';
        text.style.cssText = 'font-size:18px;line-height:1.4;color:#111;text-align:center;padding:6px 4px;';

        modal.appendChild(close);
        modal.appendChild(text);
        overlay.appendChild(modal);

        // close on overlay click (but not when clicking the modal)
        overlay.addEventListener('click', (e) => { if (e.target === overlay) this.hideAffirmation(); });

        // close on Escape
        const onKey = (e) => { if (e.key === 'Escape') this.hideAffirmation(); };
        overlay._onKey = onKey;

        this._affModal = overlay;
        return overlay;
    }

    showAffirmation(message) {
        const overlay = this.ensureAffirmationModal();
        const text = overlay.querySelector('#radiant-affirmation-text');
        if (text) text.textContent = message;

        // Append to body to avoid being hidden behind transformed parents
        if (!document.body.contains(overlay)) document.body.appendChild(overlay);

        // force reflow then show
        requestAnimationFrame(() => {
            overlay.style.pointerEvents = 'auto';
            overlay.style.opacity = '1';
            document.addEventListener('keydown', overlay._onKey);
        });
    }

    hideAffirmation() {
        const overlay = this._affModal;
        if (!overlay) return;
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        document.removeEventListener('keydown', overlay._onKey);
        overlay.addEventListener('transitionend', () => {
            if (overlay.parentElement) overlay.parentElement.removeChild(overlay);
        }, { once: true });
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
