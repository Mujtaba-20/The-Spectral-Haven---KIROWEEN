// Whisper Well Component - Symbolic text release with privacy guarantee

export class WhisperWell {
    constructor() {
        this.container = null;
        this.ballCount = 0;
        this.ballColors = [
            'rgba(93, 217, 193, 0.6)',   // Teal
            'rgba(157, 78, 221, 0.6)',   // Purple
            'rgba(255, 140, 66, 0.6)',   // Orange
            'rgba(255, 105, 180, 0.6)',  // Pink
            'rgba(138, 43, 226, 0.6)',   // Blue-purple
            'rgba(50, 205, 50, 0.6)',    // Green
        ];
    }

    render() {
        this.container = document.getElementById('page-container');
        
        this.container.innerHTML = `
            <div class="whisper-well-page">
                <h1>The Whisper Well</h1>
                <p class="subtitle">Speak a small secret and watch it vanish into the depths.</p>
                
                <div class="privacy-notice">
                    <span class="privacy-icon">🔒</span>
                    <p>This is symbolic. Nothing you type is saved, sent, or viewable. Do not enter personal or sensitive data.</p>
                </div>
                
                <div class="well-layout">
                    <!-- The Well Structure on Left -->
                    <div class="well-structure">
                        <svg class="stone-well" viewBox="0 0 300 450" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="stone-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#5a5a5a;stop-opacity:1" />
                                    <stop offset="50%" style="stop-color:#3a3a3a;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:1" />
                                </linearGradient>
                                <linearGradient id="stone-wall" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style="stop-color:#4a4a4a;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:1" />
                                </linearGradient>
                                <radialGradient id="well-darkness">
                                    <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
                                </radialGradient>
                                <radialGradient id="spirit-glow">
                                    <stop offset="0%" style="stop-color:#5dd9c1;stop-opacity:0.9" />
                                    <stop offset="50%" style="stop-color:#5dd9c1;stop-opacity:0.5" />
                                    <stop offset="100%" style="stop-color:#5dd9c1;stop-opacity:0" />
                                </radialGradient>
                                <filter id="spirit-blur">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
                                </filter>
                            </defs>
                            
                            <!-- Well shaft (visible depth) - shorter -->
                            <ellipse cx="150" cy="180" rx="90" ry="25" fill="#1a1a1a" opacity="0.8"/>
                            <rect x="60" y="180" width="180" height="220" fill="url(#stone-wall)"/>
                            <ellipse cx="150" cy="400" rx="90" ry="25" fill="#0a0a0a"/>
                            
                            <!-- Inner wall texture - stone blocks -->
                            <rect x="65" y="190" width="40" height="30" fill="#3a3a3a" stroke="#2a2a2a" stroke-width="1" opacity="0.8"/>
                            <rect x="110" y="195" width="35" height="28" fill="#3a3a3a" stroke="#2a2a2a" stroke-width="1" opacity="0.8"/>
                            <rect x="150" y="193" width="38" height="30" fill="#3a3a3a" stroke="#2a2a2a" stroke-width="1" opacity="0.8"/>
                            <rect x="193" y="197" width="42" height="28" fill="#3a3a3a" stroke="#2a2a2a" stroke-width="1" opacity="0.8"/>
                            
                            <rect x="70" y="230" width="38" height="32" fill="#353535" stroke="#2a2a2a" stroke-width="1" opacity="0.7"/>
                            <rect x="115" y="235" width="40" height="30" fill="#353535" stroke="#2a2a2a" stroke-width="1" opacity="0.7"/>
                            <rect x="160" y="233" width="35" height="32" fill="#353535" stroke="#2a2a2a" stroke-width="1" opacity="0.7"/>
                            <rect x="200" y="238" width="30" height="28" fill="#353535" stroke="#2a2a2a" stroke-width="1" opacity="0.7"/>
                            
                            <rect x="68" y="275" width="42" height="30" fill="#303030" stroke="#2a2a2a" stroke-width="1" opacity="0.6"/>
                            <rect x="118" y="280" width="38" height="28" fill="#303030" stroke="#2a2a2a" stroke-width="1" opacity="0.6"/>
                            <rect x="162" y="278" width="40" height="30" fill="#303030" stroke="#2a2a2a" stroke-width="1" opacity="0.6"/>
                            <rect x="207" y="282" width="28" height="26" fill="#303030" stroke="#2a2a2a" stroke-width="1" opacity="0.6"/>
                            
                            <!-- Deeper blocks fading into darkness -->
                            <rect x="75" y="320" width="35" height="28" fill="#2a2a2a" stroke="#1a1a1a" stroke-width="1" opacity="0.5"/>
                            <rect x="120" y="325" width="40" height="30" fill="#2a2a2a" stroke="#1a1a1a" stroke-width="1" opacity="0.5"/>
                            <rect x="168" y="323" width="38" height="28" fill="#2a2a2a" stroke="#1a1a1a" stroke-width="1" opacity="0.5"/>
                            
                            <!-- Bottom darkness -->
                            <rect x="60" y="360" width="180" height="40" fill="url(#well-darkness)"/>
                            
                            <!-- Well opening at top -->
                            <ellipse cx="150" cy="180" rx="100" ry="30" fill="url(#well-darkness)" class="well-opening"/>
                            
                            <!-- Stone rim -->
                            <ellipse cx="150" cy="180" rx="110" ry="35" fill="none" stroke="url(#stone-gradient)" stroke-width="10"/>
                            
                            <!-- Stone blocks around rim (3D effect) -->
                            <rect x="45" y="168" width="35" height="28" fill="url(#stone-gradient)" rx="2"/>
                            <rect x="85" y="165" width="32" height="30" fill="url(#stone-gradient)" rx="2"/>
                            <rect x="122" y="163" width="35" height="32" fill="url(#stone-gradient)" rx="2"/>
                            <rect x="162" y="163" width="33" height="32" fill="url(#stone-gradient)" rx="2"/>
                            <rect x="200" y="165" width="32" height="30" fill="url(#stone-gradient)" rx="2"/>
                            <rect x="237" y="168" width="35" height="28" fill="url(#stone-gradient)" rx="2"/>
                            
                            <!-- Moss and age details on rim -->
                            <ellipse cx="55" cy="180" rx="10" ry="5" fill="#2a4a2a" opacity="0.7"/>
                            <ellipse cx="245" cy="182" rx="12" ry="6" fill="#2a4a2a" opacity="0.7"/>
                            <ellipse cx="150" cy="175" rx="15" ry="4" fill="#2a4a2a" opacity="0.6"/>
                            <ellipse cx="100" cy="178" rx="8" ry="4" fill="#2a4a2a" opacity="0.5"/>
                            <ellipse cx="200" cy="179" rx="9" ry="4" fill="#2a4a2a" opacity="0.5"/>
                            
                            <!-- Spirit emerging from well - moved up -->
                            <g class="well-spirit spirit-idle">
                                <!-- Glow aura -->
                                <ellipse cx="150" cy="120" rx="70" ry="80" fill="url(#spirit-glow)" class="spirit-aura"/>
                                
                                <!-- Ghost body emerging from opening -->
                                <path d="M 90 155 Q 90 100 150 80 Q 210 100 210 155 L 210 190 Q 203 184 196 190 Q 189 196 182 190 Q 175 184 168 190 Q 161 196 154 190 Q 147 184 140 190 Q 133 196 126 190 Q 119 184 112 190 Q 105 196 98 190 Q 91 184 90 190 Z" 
                                      fill="#5dd9c1" opacity="0.85" filter="url(#spirit-blur)" class="spirit-body"/>
                                
                                <!-- Eyes -->
                                <ellipse cx="130" cy="120" rx="8" ry="10" fill="#0a0a0a" class="spirit-eye-left"/>
                                <ellipse cx="170" cy="120" rx="8" ry="10" fill="#0a0a0a" class="spirit-eye-right"/>
                                
                                <!-- Eye highlights -->
                                <circle cx="132" cy="118" r="3" fill="#5dd9c1" opacity="0.9"/>
                                <circle cx="172" cy="118" r="3" fill="#5dd9c1" opacity="0.9"/>
                                
                                <!-- Mouth -->
                                <path d="M 135 140 Q 150 147 165 140" stroke="#0a0a0a" stroke-width="3" fill="none" class="spirit-mouth"/>
                                
                                <!-- Wispy trails going down into well -->
                                <path d="M 100 180 Q 105 210 110 240 Q 112 270 115 300" stroke="#5dd9c1" stroke-width="2.5" opacity="0.5" fill="none" class="spirit-wisp-1"/>
                                <path d="M 150 185 Q 150 220 150 260 Q 150 300 150 340" stroke="#5dd9c1" stroke-width="3" opacity="0.6" fill="none" class="spirit-wisp-2"/>
                                <path d="M 200 180 Q 195 210 190 240 Q 188 270 185 300" stroke="#5dd9c1" stroke-width="2.5" opacity="0.5" fill="none" class="spirit-wisp-3"/>
                            </g>
                            
                            <!-- Mist rising from well -->
                            <ellipse cx="150" cy="175" rx="85" ry="18" fill="#5dd9c1" opacity="0.2" class="well-mist-1"/>
                            <ellipse cx="150" cy="170" rx="75" ry="15" fill="#5dd9c1" opacity="0.15" class="well-mist-2"/>
                            <ellipse cx="150" cy="165" rx="65" ry="12" fill="#5dd9c1" opacity="0.1" class="well-mist-3"/>
                        </svg>
                        
                        <!-- Animation area for characters falling into well -->
                        <div class="well-animation-area"></div>
                    </div>
                    
                    <!-- Input Area on Right -->
                    <div class="whisper-input-section">
                        <div class="whisper-input-area">
                            <textarea 
                                class="whisper-input" 
                                placeholder="Type your whisper here..."
                                rows="8"
                                maxlength="500"
                                aria-label="Whisper text input"
                            ></textarea>
                            
                            <button class="btn btn-primary release-btn" aria-label="Release whisper">
                                Release into the Well
                            </button>
                        </div>
                        
                        <!-- Spirit's reply appears here -->
                        <div class="spirit-reply-area" role="status" aria-live="polite"></div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.startIdleAnimation();
    }

    attachEventListeners() {
        const releaseBtn = this.container.querySelector('.release-btn');
        const input = this.container.querySelector('.whisper-input');
        
        releaseBtn.addEventListener('click', () => this.release());
        
        // Allow Enter key to release (with Shift+Enter for new lines)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.release();
            }
        });
        
        // Spirit reacts to typing
        input.addEventListener('input', () => this.spiritReactToTyping());
        
        // Spirit reacts to focus
        input.addEventListener('focus', () => this.spiritReactToFocus());
        input.addEventListener('blur', () => this.spiritReactToBlur());
    }
    
    startIdleAnimation() {
        const spirit = this.container.querySelector('.well-spirit');
        if (spirit) {
            spirit.classList.add('spirit-idle');
        }
    }
    
    spiritReactToTyping() {
        const spirit = this.container.querySelector('.well-spirit');
        const eyes = this.container.querySelectorAll('.spirit-eye-left, .spirit-eye-right');
        
        if (spirit) {
            spirit.classList.add('spirit-listening');
            
            // Eyes widen
            eyes.forEach(eye => {
                eye.setAttribute('ry', '11');
            });
            
            setTimeout(() => {
                eyes.forEach(eye => {
                    eye.setAttribute('ry', '9');
                });
            }, 200);
        }
    }
    
    spiritReactToFocus() {
        const spirit = this.container.querySelector('.well-spirit');
        const mouth = this.container.querySelector('.spirit-mouth');
        
        if (spirit && mouth) {
            spirit.classList.add('spirit-attentive');
            mouth.setAttribute('d', 'M 135 140 Q 150 150 165 140');
        }
    }
    
    spiritReactToBlur() {
        const spirit = this.container.querySelector('.well-spirit');
        const mouth = this.container.querySelector('.spirit-mouth');
        
        if (spirit && mouth) {
            spirit.classList.remove('spirit-attentive');
            mouth.setAttribute('d', 'M 135 140 Q 150 147 165 140');
        }
    }

    release() {
        const input = this.container.querySelector('.whisper-input');
        const text = input.value;
        
        if (!text.trim()) {
            return;
        }
        
        // Spirit reacts
        this.spiritPrepareToReceive();
        
        // Clear input immediately
        input.value = '';
        
        // Animate text falling into well
        this.animateFallIntoWell(text);
        
        // Spirit responds after consuming
        setTimeout(() => {
            this.spiritRespond();
        }, 2500);
        
        // Play release SFX
        if (window.audioManager) {
            window.audioManager.playSFX('release');
        }
    }
    
    spiritPrepareToReceive() {
        const spirit = this.container.querySelector('.well-spirit');
        const mouth = this.container.querySelector('.spirit-mouth');
        const aura = this.container.querySelector('.spirit-aura');
        
        if (!spirit) return;
        
        spirit.classList.add('spirit-receiving');
        
        if (mouth) {
            mouth.setAttribute('d', 'M 130 140 Q 150 158 170 140');
        }
        
        if (aura) {
            aura.style.transition = 'all 0.5s ease-out';
            aura.style.opacity = '1';
        }
    }
    
    animateFallIntoWell(text) {
        const animationArea = this.container.querySelector('.well-animation-area');
        const wellOpening = this.container.querySelector('.well-opening');
        const inputArea = this.container.querySelector('.whisper-input-area');
        
        if (!animationArea || !wellOpening) return;
        
        // Clear only temporary elements, keep permanent balls
        const tempElements = animationArea.querySelectorAll('.falling-char, .spirit-ball-temp');
        tempElements.forEach(el => el.remove());
        
        const wellRect = wellOpening.getBoundingClientRect();
        const areaRect = animationArea.getBoundingClientRect();
        const inputRect = inputArea ? inputArea.getBoundingClientRect() : null;
        
        // Calculate well center relative to animation area
        const wellCenterX = wellRect.left + wellRect.width / 2 - areaRect.left;
        const wellCenterY = wellRect.top + wellRect.height / 2 - areaRect.top;
        
        // Calculate starting position from input area
        let startX = wellCenterX + 200;
        let startY = wellCenterY - 100;
        
        if (inputRect) {
            startX = inputRect.left + inputRect.width / 2 - areaRect.left;
            startY = inputRect.top + inputRect.height / 2 - areaRect.top;
        }
        
        // Calculate gathering point (midway between input and well)
        const gatherX = (startX + wellCenterX) / 2;
        const gatherY = (startY + wellCenterY) / 2;
        
        const chars = text.split('');
        const charElements = [];
        
        // Phase 1: Characters appear and float toward gathering point (slower)
        chars.forEach((char, index) => {
            if (char.trim() === '') return;
            
            const charEl = document.createElement('span');
            charEl.className = 'falling-char';
            charEl.textContent = char;
            
            // Start from input area (right side)
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 50;
            
            charEl.style.left = `${startX + offsetX}px`;
            charEl.style.top = `${startY + offsetY}px`;
            
            animationArea.appendChild(charEl);
            charElements.push(charEl);
            
            // Animate to gathering point (slower)
            setTimeout(() => {
                this.animateCharacterToGather(charEl, gatherX, gatherY);
            }, index * 50);
        });
        
        // Phase 2: After gathering, create spirit ball (slower timing)
        const gatherTime = chars.length * 50 + 1200;
        setTimeout(() => {
            // Remove characters
            charElements.forEach(el => el.remove());
            
            // Create spirit ball that descends down the well
            this.createSpiritBall(animationArea, gatherX, gatherY, wellCenterX, wellCenterY);
        }, gatherTime);
    }
    
    animateCharacterToGather(charEl, gatherX, gatherY) {
        const currentX = parseFloat(charEl.style.left);
        const currentY = parseFloat(charEl.style.top);
        
        const deltaX = gatherX - currentX + (Math.random() - 0.5) * 20;
        const deltaY = gatherY - currentY + (Math.random() - 0.5) * 20;
        
        // Slower, smoother gathering
        charEl.style.transition = 'all 1.2s ease-in-out';
        charEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.8) rotate(${Math.random() * 360}deg)`;
        charEl.style.color = '#5dd9c1';
    }
    
    createSpiritBall(container, startX, startY, targetX, targetY) {
        // Get random color for this ball
        const color = this.ballColors[this.ballCount % this.ballColors.length];
        
        // Create glowing spirit ball (temporary, for animation)
        const ball = document.createElement('div');
        ball.className = 'spirit-ball spirit-ball-temp';
        ball.style.left = `${startX}px`;
        ball.style.top = `${startY}px`;
        ball.style.setProperty('--ball-color', color);
        
        container.appendChild(ball);
        
        // Animate ball descending down the well shaft (slower and smoother)
        setTimeout(() => {
            const deltaX = targetX - startX;
            // Make it go deeper into the well
            const deltaY = targetY - startY + 150;
            
            ball.style.transition = 'all 3.5s cubic-bezier(0.4, 0, 0.2, 1)';
            ball.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.4)`;
            ball.style.opacity = '0.3';
        }, 200);
        
        // Add permanent ball to well after it descends
        setTimeout(() => {
            this.addPermanentBallToWell(container, targetX, targetY, color);
            ball.remove();
        }, 3700);
        
        this.ballCount++;
    }
    
    addPermanentBallToWell(container, wellX, wellY, color) {
        // Create permanent ball that stays in the well
        const permanentBall = document.createElement('div');
        permanentBall.className = 'well-ball-permanent';
        
        // Random position within the well shaft area
        const offsetX = (Math.random() - 0.5) * 80;
        const offsetY = 80 + Math.random() * 120; // Deeper in the well
        
        permanentBall.style.left = `${wellX + offsetX}px`;
        permanentBall.style.top = `${wellY + offsetY}px`;
        permanentBall.style.setProperty('--ball-color', color);
        
        // Random size variation
        const size = 15 + Math.random() * 20;
        permanentBall.style.width = `${size}px`;
        permanentBall.style.height = `${size}px`;
        
        // Random animation delay for floating effect
        permanentBall.style.animationDelay = `${Math.random() * 3}s`;
        
        // Higher z-index to be visible
        permanentBall.style.zIndex = '80';
        
        container.appendChild(permanentBall);
        
        // Fade in the permanent ball
        setTimeout(() => {
            permanentBall.style.opacity = '0.7';
        }, 100);
    }
    
    spiritRespond() {
        const spirit = this.container.querySelector('.well-spirit');
        const mouth = this.container.querySelector('.spirit-mouth');
        const aura = this.container.querySelector('.spirit-aura');
        const wellStructure = this.container.querySelector('.well-structure');
        
        if (spirit) {
            spirit.classList.remove('spirit-receiving');
            spirit.classList.add('spirit-satisfied');
            
            if (mouth) {
                mouth.setAttribute('d', 'M 135 140 Q 150 150 165 140');
            }
            
            if (aura) {
                aura.style.opacity = '';
            }
        }
        
        // Show speech bubble near the spirit
        if (wellStructure) {
            const speechBubble = document.createElement('div');
            speechBubble.className = 'spirit-speech-bubble';
            speechBubble.innerHTML = `
                <div class="speech-bubble-content">
                    "I have your secret safe with me."
                </div>
            `;
            
            wellStructure.appendChild(speechBubble);
            
            // Fade in
            setTimeout(() => {
                speechBubble.classList.add('visible');
            }, 100);
            
            // Clear speech bubble after 5 seconds
            setTimeout(() => {
                speechBubble.classList.remove('visible');
                setTimeout(() => speechBubble.remove(), 500);
            }, 5000);
        }
        
        // Return to idle
        setTimeout(() => {
            if (spirit) {
                spirit.classList.remove('spirit-satisfied');
            }
            if (mouth) {
                mouth.setAttribute('d', 'M 135 140 Q 150 147 165 140');
            }
        }, 2000);
    }

    destroy() {
        const animationArea = this.container?.querySelector('.well-animation-area');
        if (animationArea) {
            animationArea.innerHTML = '';
        }
    }
}
