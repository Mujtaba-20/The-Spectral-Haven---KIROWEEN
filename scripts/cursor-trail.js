// Cursor Trail - Ghost trail effect following cursor

export class CursorTrail {
    constructor() {
        this.particles = [];
        this.maxParticles = 12; // Reduced particles for better performance
        this.mouseX = 0;
        this.mouseY = 0;
        this.container = null;
        this.animationFrame = null;
        this.isInitialized = false;
        this.colors = [
            'rgba(157, 123, 216, 0.7)',  // Purple
            'rgba(93, 217, 193, 0.7)',   // Teal
            'rgba(255, 140, 66, 0.7)',   // Orange
            'rgba(255, 105, 180, 0.7)',  // Pink
            'rgba(138, 43, 226, 0.7)',   // Blue-purple
        ];
        this.currentColorIndex = 0;
        this.colorChangeInterval = null;
        this.cursorAudio = null;
        this.isMoving = false;
        this.moveTimeout = null;
        this.fadeInterval = null;
        this.activeVolume = 0.15; // Volume when cursor is moving (reduced)
        this.minVolume = 0.01;    // Minimum volume when idle (reduced)
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth <= 768;
    }

    init() {
        // Don't initialize on mobile devices for better performance
        if (this.isMobileDevice()) {
            console.log('📱 Cursor trail disabled on mobile device');
            return;
        }
        
        this.container = document.getElementById('cursor-trail');
        if (!this.container) {
            console.error('Cursor trail container not found');
            return;
        }

        this.createParticles();
        this.setupMouseTracking();
        this.setupCursorAudio();
        this.startColorChange();
        this.animate();
        this.isInitialized = true;
    }
    
    setupCursorAudio() {
        // Create audio element for cursor movement
        this.cursorAudio = new Audio('assets/audio/wind.mp3');
        this.cursorAudio.loop = true;
        this.cursorAudio.volume = this.minVolume; // Start at minimum volume
        this.cursorAudio.preload = 'auto';
        
        // Handle loading errors gracefully
        this.cursorAudio.addEventListener('error', () => {
            console.log('Cursor audio file not found');
        });
        
        // Start playing at minimum volume
        this.cursorAudio.play().catch(err => {
            console.log('Cursor audio playback prevented:', err);
        });
    }
    
    startColorChange() {
        // Change colors every 3 seconds
        this.colorChangeInterval = setInterval(() => {
            this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
        }, 3000);
    }

    createParticles() {
        // Initialize particle array - particles centered on cursor
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'trail-particle mist-particle';
            this.container.appendChild(particle);
            
            // No offset - all particles at cursor point, layered effect
            this.particles.push({
                element: particle,
                x: 0,
                y: 0,
                targetX: 0,
                targetY: 0,
                offsetX: 0,
                offsetY: 0,
                size: 15 + Math.random() * 20,
                delay: i * 0.02 // Slight delay for trailing effect
            });
            
            // Set initial size
            particle.style.width = `${this.particles[i].size}px`;
            particle.style.height = `${this.particles[i].size}px`;
        }
    }

    setupMouseTracking() {
        // Track mouse position with mousemove listener
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Play audio when cursor moves
            this.handleCursorMovement();
        });
    }
    
    handleCursorMovement() {
        // Check if audio should play (not muted)
        const isMuted = window.audioManager && window.audioManager.muted;
        
        // Clear existing timeout and fade interval
        if (this.moveTimeout) {
            clearTimeout(this.moveTimeout);
        }
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }
        
        if (!isMuted && this.cursorAudio) {
            // Start playing if not already playing
            if (this.cursorAudio.paused) {
                this.cursorAudio.play().catch(err => {
                    console.log('Cursor audio playback prevented:', err);
                });
            }
            
            // Instantly increase volume when moving
            this.cursorAudio.volume = this.activeVolume;
            this.isMoving = true;
            
            // Start fade down after 100ms of no movement
            this.moveTimeout = setTimeout(() => {
                this.fadeDown();
            }, 100);
        } else if (this.cursorAudio && !this.cursorAudio.paused) {
            // If muted, pause the audio
            this.cursorAudio.pause();
        }
    }
    
    fadeDown() {
        this.isMoving = false;
        if (!this.cursorAudio || this.cursorAudio.paused) return;
        
        // Gradually fade down volume
        this.fadeInterval = setInterval(() => {
            if (this.cursorAudio.volume > this.minVolume) {
                this.cursorAudio.volume = Math.max(this.minVolume, this.cursorAudio.volume - 0.02);
            } else {
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
            }
        }, 50); // Fade step every 50ms
    }

    animate() {
        // Update particle positions - all centered on cursor with trailing effect
        const currentColor = this.colors[this.currentColorIndex];
        
        this.particles.forEach((particle, index) => {
            // Much faster easing for instant response - first particle follows immediately
            const easingFactor = index === 0 ? 1 : 0.3 - (index * 0.015);
            particle.targetX = this.mouseX;
            particle.targetY = this.mouseY;
            
            // Smooth interpolation for trailing effect
            particle.x += (particle.targetX - particle.x) * easingFactor;
            particle.y += (particle.targetY - particle.y) * easingFactor;
            
            // Center the particle on cursor point by offsetting by half its size
            const offsetX = particle.x - (particle.size / 2);
            const offsetY = particle.y - (particle.size / 2);
            
            // Use will-change and transform for better performance
            particle.element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
            
            // Fade based on trail position
            const opacity = (1 - (index / this.maxParticles)) * 0.6;
            particle.element.style.opacity = opacity;
            
            // Only update color if it changed (performance optimization)
            if (particle.lastColor !== currentColor) {
                particle.element.style.background = currentColor;
                particle.lastColor = currentColor;
            }
        });

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    updateTheme() {
        // Theme-specific styling is handled by CSS variables
        // This method can be called when theme changes to trigger any JS-based updates
        // Currently, CSS handles all theme transitions automatically
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        if (this.colorChangeInterval) {
            clearInterval(this.colorChangeInterval);
        }
        
        if (this.moveTimeout) {
            clearTimeout(this.moveTimeout);
        }
        
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
        }
        
        if (this.cursorAudio) {
            this.cursorAudio.pause();
            this.cursorAudio = null;
        }
        
        // Clean up particles
        this.particles.forEach(particle => {
            if (particle.element && particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        });
        this.particles = [];
        this.isInitialized = false;
    }
}
