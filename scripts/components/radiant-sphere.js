// Radiant Sphere - Mystical positive affirmations

export class RadiantSphere {
    constructor() {
        this.container = null;
        this.currentAffirmation = null;
        this.lastAffirmationIndex = -1;
        
        this.affirmations = [
            "I move through this world wrapped in a silent, ancient strength—an unseen force that clears paths for me long before my footsteps arrive.",
            "Clarity rises within me like the first light spilling over a hidden horizon, revealing truths that were waiting patiently to be found.",
            "With every breath, I open doors inside myself—secret chambers where wisdom, calm, and quiet revelation gather.",
            "I am guided by a subtle inner compass, tuned not to noise but to the deep, shimmering pull of destiny.",
            "Old burdens dissolve like mist at dawn, and what remains is a spirit sharpened, lighter, and ready for the next unfolding.",
            "A gentle light moves through me, ancient and knowing; I don’t need to understand its workings to trust its direction.",
            "Even when the road curves into mystery, purpose follows me like a loyal star, keeping me aligned with the path meant for me.",
            "Peace approaches softly when I stand still—like a blessing that recognizes my name before I speak it.",
            "Each step sends a quiet ripple into the unseen, shaping possibilities, bending outcomes, and calling good things nearer.",
            "My heart listens beyond the surface, my mind opens to hidden guidance, and my soul remains steady—held by something vast and luminous." 
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

    // create a dialog anchored above the orb (appended to body)
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
            transition: opacity 200ms ease, transform 200ms ease;

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

        // small tail pointing to the orb (will be positioned horizontally)
        const tail = document.createElement('div');
        tail.style.cssText = `
            position:absolute;
            width:12px;
            height:12px;
            background:inherit;
            left:8px; bottom:-6px; /* tail sits slightly below dialog so it points downwards */
            transform: rotate(45deg);
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
        container._removeTimeout = null;

        this._affModal = container;
        return container;
    }

// Replace existing playSfx() in RadiantSphere with this
playSfx() {
  // Prefer app-wide AudioManager if present and shimmer is loaded
  try {
    if (window.audioManager && typeof window.audioManager.playSFX === 'function') {
      // If audio manager is muted, it will no-op internally
      // This is the preferred path because it uses the same assets and settings
      window.audioManager.playSFX('shimmer');
      return;
    }
  } catch (e) {
    console.debug('RadiantSphere: audioManager playSFX call failed, falling back', e);
  }

  // --- Fallback: local WebAudio/oscillator approach (guarantees a sound) ---
  if (!this._audioCtx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this._audioCtx = new AC();
      this._sfxBuffer = null;
      this._sfxLoading = false;
    } catch (e) {
      this._audioCtx = null;
    }
  }

  const playOscillator = () => {
    try {
      if (!this._audioCtx) {
        // final fallback to plain Audio element (non-blocking)
        new Audio('assets/audio/shimmer.mp3').play().catch(()=>{});
        return;
      }
      if (this._audioCtx.state === 'suspended') this._audioCtx.resume().catch(()=>{});
      const o = this._audioCtx.createOscillator();
      const g = this._audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      const now = this._audioCtx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.6, now + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      o.connect(g);
      g.connect(this._audioCtx.destination);
      o.start(now);
      o.stop(now + 0.25);
      o.onended = () => { try { o.disconnect(); g.disconnect(); } catch(e) {} };
    } catch (e) {
      try { new Audio('assets/audio/shimmer.mp3').play().catch(()=>{}); } catch(e) {}
    }
  };

  const playBuffer = (buffer) => {
    try {
      const src = this._audioCtx.createBufferSource();
      src.buffer = buffer;
      const gain = this._audioCtx.createGain();
      gain.gain.value = 0.9;
      src.connect(gain);
      gain.connect(this._audioCtx.destination);
      src.start(0);
      src.onended = () => { try { src.disconnect(); gain.disconnect(); } catch(e) {} };
    } catch (e) {
      playOscillator();
    }
  };

  // If we already decoded a buffer, use it
  if (this._sfxBuffer) {
    if (this._audioCtx && this._audioCtx.state === 'suspended') {
      this._audioCtx.resume().then(()=>playBuffer(this._sfxBuffer)).catch(()=>playBuffer(this._sfxBuffer));
    } else {
      playBuffer(this._sfxBuffer);
    }
    return;
  }

  // If loading is already in progress, play oscillator to avoid delay
  if (this._sfxLoading) {
    playOscillator();
    return;
  }

  // Try to fetch and decode the local shimmer file (assets/audio/shimmer.mp3)
  if (this._audioCtx) {
    this._sfxLoading = true;
    fetch('assets/audio/shimmer.mp3', { cache: 'force-cache' })
      .then(resp => {
        if (!resp.ok) throw new Error('sfx fetch failed: ' + resp.status);
        return resp.arrayBuffer();
      })
      .then(ab => this._audioCtx.decodeAudioData(ab))
      .then(decoded => {
        this._sfxBuffer = decoded;
        this._sfxLoading = false;
        if (this._audioCtx.state === 'suspended') {
          this._audioCtx.resume().then(()=>playBuffer(this._sfxBuffer)).catch(()=>playBuffer(this._sfxBuffer));
        } else {
          playBuffer(this._sfxBuffer);
        }
      })
      .catch(err => {
        this._sfxLoading = false;
        console.debug('RadiantSphere: shimmer decode failed, using oscillator fallback', err);
        playOscillator();
      });
    return;
  }

  // Final fallback: play Audio element
  try { new Audio('assets/audio/shimmer.mp3').play().catch(()=>{ playOscillator(); }); } catch(e){ playOscillator(); }
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

        // compute orb position and desired dialog location (above the orb, with gap)
        const orbEl = document.getElementById('orb-wrapper') || document.querySelector('.orb-wrapper') || document.querySelector('#orb');
        const rect = orbEl ? orbEl.getBoundingClientRect() : null;

        // default position (center-top fallback)
        let dialogWidth = 280;
        dialog.style.width = `${dialogWidth}px`;

        if (rect) {
            const margin = 12;
            // responsive dialog width
            dialogWidth = Math.min(320, Math.max(180, Math.floor(window.innerWidth * 0.28)));
            dialog.style.width = `${dialogWidth}px`;

            // compute left so dialog sits slightly left of the orb's right edge (not glued)
            const nudgeFactor = 0.38;
            const candidateRight = Math.round(rect.left + window.scrollX + rect.width + margin);
            let left = Math.round(candidateRight - Math.floor(dialogWidth * nudgeFactor));

            // measure height after width applied so we can position above
            // force reflow
            const measuredHeight = dialog.offsetHeight || 80;
            const gap = 14; // space between dialog's tail and orb
            let top = Math.round(rect.top + window.scrollY - measuredHeight - gap);

            // if not enough space above, fall back to right-side placement
            const minTop = 8 + window.scrollY;
            if (top < minTop) {
                // try right-of-orb placement (slightly above orb center)
                left = Math.round(rect.left + window.scrollX + rect.width + margin - Math.floor(dialogWidth * nudgeFactor));
                top = Math.round(rect.top + window.scrollY + (rect.height * 0.08));
                dialog.style.transformOrigin = 'top left';
                tail.style.bottom = ''; // ensure tail is positioned by top/bottom appropriately
                tail.style.left = `${Math.round(10)}px`;
            } else {
                // dialog above orb; tail should point downwards (tail is positioned with bottom:-6px)
                dialog.style.transformOrigin = 'bottom left';
                tail.style.bottom = '-6px';
            }

            // prevent overflow right
            const maxLeft = Math.round(window.scrollX + window.innerWidth - dialogWidth - 8);
            if (left > maxLeft) left = maxLeft;

            // prevent overflow left
            const minLeft = Math.round(window.scrollX + 8);
            if (left < minLeft) left = minLeft;

            // set computed left/top
            dialog.style.left = `${left}px`;
            dialog.style.top = `${top}px`;

            // position the tail horizontally so it visually points to orb center
            const orbCenterX = Math.round(rect.left + window.scrollX + rect.width / 2);
            let tailLeft = orbCenterX - left - 6; // center tail (tail width 12 -> half 6)
            // clamp tail left so it doesn't overflow dialog edges
            tailLeft = Math.max(10, Math.min(Math.round(dialogWidth - 22), tailLeft));
            tail.style.left = `${tailLeft}px`;
        } else {
            // fallback: center-top
            const left = Math.round(window.innerWidth / 2 - dialogWidth / 2);
            const top = 80 + window.scrollY;
            dialog.style.left = `${left}px`;
            dialog.style.top = `${top}px`;
            tail.style.left = `12px`;
            dialog.style.transformOrigin = 'top left';
        }

        // make sure dialog is interactive
        overlay.style.pointerEvents = 'auto';

        // entrance animation
        requestAnimationFrame(() => {
            dialog.style.opacity = '1';
            dialog.style.transform = 'translateY(0) scale(1)';
        });

        // outside click handler — remove any previous then attach after a tick
        if (overlay._onDocClick) {
            try { document.removeEventListener('click', overlay._onDocClick, { capture: true }); } catch(e){/* ignore */ }
            overlay._onDocClick = null;
        }

        const onDocClick = (ev) => {
            if (!dialog.contains(ev.target)) {
                setTimeout(() => this.hideAffirmation(), 0);
            }
        };
        overlay._onDocClick = onDocClick;

        // attach listeners on next turn to avoid closing immediately from the opening click
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
            let removed = false;
            const remover = () => {
                if (removed) return;
                removed = true;
                if (overlay.parentElement) overlay.parentElement.removeChild(overlay);
            };
            // use transitionend with a fallback timeout in case it doesn't fire
            dialog.addEventListener('transitionend', remover, { once: true });
            // fallback after 300ms
            setTimeout(remover, 350);
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
        this.playSfx();
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
