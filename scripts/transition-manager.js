// Transition Manager - Portal ripple and skeleton animations

export class TransitionManager {
    constructor() {
        this.skeletonEnabled = true;
        this.duration = 700; // Changed to 0.7 seconds
        this.portalRipple = null;
        this.skeletonContainer = null;
        this.captions = [
            'Passing through...',
            'Just passing by...',
            'Excuse me...',
            'Pardon the interruption...',
            'On my way...',
            'Bones in motion...',
            'Rattling along...'
        ];
    }

    init() {
        this.portalRipple = document.querySelector('.portal-ripple');
        this.skeletonContainer = document.querySelector('.skeleton-container');
        this.backgroundWorld = document.querySelector('.background-world');
        
        // Load skeleton enabled preference
        const savedSettings = localStorage.getItem('hauntedChamberSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.skeletonEnabled = settings.skeletonEnabled !== false;
        }
    }

    start(callback) {
        // Play page transition sound
        if (window.audioManager) {
            window.audioManager.playSFX('page-transition');
        }
        
        // Add two-layered transition effect
        this.addTwoLayerTransition();
        
        // Add page fade out
        this.fadeOutPage();
        
        if (this.skeletonEnabled) {
            this.showSkeleton(() => {
                callback();
                this.fadeInPage();
                this.hideSkeleton();
            });
        } else {
            setTimeout(() => {
                callback();
                this.fadeInPage();
            }, this.duration / 2);
        }
    }
    
    fadeOutPage() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.classList.add('page-fade-out');
        }
    }
    
    fadeInPage() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.classList.remove('page-fade-out');
            pageContainer.classList.add('page-fade-in');
            
            setTimeout(() => {
                pageContainer.classList.remove('page-fade-in');
            }, 500);
        }
    }
    
    addTwoLayerTransition() {
        const transitionLayer = document.getElementById('transition-layer');
        if (!transitionLayer) return;
        
        // Create cloud transition container
        const cloudContainer = document.createElement('div');
        cloudContainer.className = 'cloud-transition-container';
        
        // Create multiple cloud layers for depth
        for (let i = 1; i <= 5; i++) {
            const cloud = document.createElement('div');
            cloud.className = `transition-cloud cloud-${i}`;
            cloudContainer.appendChild(cloud);
        }
        
        transitionLayer.appendChild(cloudContainer);
        
        // Remove container after animation completes
        setTimeout(() => {
            cloudContainer.remove();
        }, this.duration);
    }



    showSkeleton(callback) {
        if (!this.skeletonContainer) {
            callback();
            return;
        }

        // Set random caption
        const captionEl = this.skeletonContainer.querySelector('.skeleton-caption');
        if (captionEl) {
            const randomCaption = this.captions[Math.floor(Math.random() * this.captions.length)];
            captionEl.textContent = randomCaption;
        }

        // Play skeleton enter SFX
        if (window.audioManager) {
            window.audioManager.playSFX('skeleton-enter');
        }

        // Slide in
        this.skeletonContainer.classList.add('slide-in');
        
        setTimeout(() => {
            this.skeletonContainer.classList.remove('slide-in');
            this.skeletonContainer.classList.add('tilting');
            
            // Execute callback during tilt
            setTimeout(() => {
                callback();
            }, 300);
            
            // Duration of tilt before slide out (600-900ms range)
            const tiltDuration = 600 + Math.random() * 300;
            setTimeout(() => {
                this.skeletonContainer.classList.remove('tilting');
            }, tiltDuration);
        }, 400);
    }

    hideSkeleton() {
        if (!this.skeletonContainer) return;
        
        this.skeletonContainer.classList.add('slide-out');
        
        setTimeout(() => {
            this.skeletonContainer.classList.remove('slide-out');
        }, 400);
    }

    setSkeletonEnabled(enabled) {
        this.skeletonEnabled = enabled;
    }
}
