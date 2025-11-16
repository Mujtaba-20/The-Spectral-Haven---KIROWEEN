// Transition Manager - Portal ripple and cloud transitions

export class TransitionManager {
    constructor() {
        this.duration = 700; // 0.7 seconds
        this.portalRipple = null;
        this.backgroundWorld = null;
    }

    init() {
        this.portalRipple = document.querySelector('.portal-ripple');
        this.backgroundWorld = document.querySelector('.background-world');
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
        
        setTimeout(() => {
            callback();
            this.fadeInPage();
        }, this.duration / 2);
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
}
