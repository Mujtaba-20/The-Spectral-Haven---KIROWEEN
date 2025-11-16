// Background World Component - Persistent animated scene

export class BackgroundWorld {
    constructor(container) {
        this.container = container;
        this.elements = {};
    }

    init() {
        this.createSceneLayers();
        console.log('🌍 Background World initialized');
    }

    createSceneLayers() {
        // Create layer structure
        const layers = ['far', 'mid', 'near', 'overlay'];
        
        layers.forEach(layerName => {
            const layer = document.createElement('div');
            layer.className = `bg-layer bg-layer-${layerName}`;
            this.container.appendChild(layer);
            this.elements[layerName] = layer;
        });

        // Add scene elements (placeholders for now)
        this.addSceneElements();
    }

    addSceneElements() {
        // Add moon in far background
        this.addMoon('far');
        
        // Add haunted house silhouette
        this.addHauntedHouse('far');
        
        // Add ground area
        this.addGround('near');

        // Far layer - varied clouds drifting across sky
        this.addCloud('far', 'cloud-1', 5, -20, 'large');
        this.addCloud('far', 'cloud-2', 10, 15, 'medium');
        this.addCloud('far', 'cloud-3', 3, 50, 'small');
        this.addCloud('far', 'cloud-4', 12, 80, 'large');
        this.addCloud('far', 'cloud-5', 8, 110, 'medium');
        this.addCloud('far', 'cloud-6', 15, 140, 'small');
        this.addCloud('far', 'cloud-7', 6, 170, 'medium');
        
        // Mid layer - additional clouds for depth
        this.addCloud('mid', 'cloud-8', 18, -10, 'small');
        this.addCloud('mid', 'cloud-9', 22, 40, 'medium');
        this.addCloud('mid', 'cloud-10', 20, 90, 'large');

        // Mid layer - three trees in back on left side, one on right
        this.addSpookyTree('mid', 'tree-1', -3);
        this.addSpookyTree('mid', 'tree-2', 2);
        this.addSpookyTree('mid', 'tree-3', 7);
        this.addSpookyTree('mid', 'tree-4', 90);
        this.addSpiderWeb('mid', 'web-1', 3, 15);
        this.addSpiderWeb('mid', 'web-2', 94, 20);
        
        // Near layer - two trees in front on left, one in front on right
        this.addSpookyTree('near', 'tree-5', -5);
        this.addSpookyTree('near', 'tree-6', 1);
        this.addSpookyTree('near', 'tree-7', 85);

        // Carved pumpkins - two on left, one on right
        this.addGlowingPumpkin('near', 'pumpkin-1', 8, 8);
        this.addGlowingPumpkin('near', 'pumpkin-2', 18, 6);
        this.addGlowingPumpkin('near', 'pumpkin-3', 88, 7);
        
        // More bats flying across the screen
        this.addFlyingBat('near', 'bat-1', 20, 8);
        this.addFlyingBat('near', 'bat-2', 50, 12);
        this.addFlyingBat('near', 'bat-3', 70, 6);
        this.addFlyingBat('near', 'bat-4', 85, 15);
        this.addFlyingBat('mid', 'bat-5', 35, 10);
        this.addFlyingBat('mid', 'bat-6', 65, 18);
        
        this.addSpider('near', 'spider-1', 5, 18);
        this.addSpider('near', 'spider-2', 96, 23);
        this.addHangingSkeleton('near');
        
        // Add spooky bushes with glowing eyes
        this.addSpookyBush('near', 'bush-1', -3, 0);
        this.addSpookyBush('near', 'bush-2', 2, 0);
        this.addSpookyBush('near', 'bush-3', 95, 0);
        this.addSpookyBush('near', 'bush-4', 100, 0);
        
        // Add grass along the bottom
        this.addGrass('near');

        // Overlay layer - multiple fog layers with horizontal drift
        this.addFogLayer('overlay', 'fog-1', 25);
        this.addFogLayer('overlay', 'fog-2', 35);
        this.addFogLayer('overlay', 'fog-3', 45);
    }

    addMoon(layer) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'moon');
        svg.setAttribute('viewBox', '0 0 200 200');
        svg.innerHTML = `
            <defs>
                <radialGradient id="moon-glow">
                    <stop offset="0%" style="stop-color:#fff8e7;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#ffe4b3;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ffcc80;stop-opacity:0" />
                </radialGradient>
                <radialGradient id="moon-surface">
                    <stop offset="0%" style="stop-color:#fffef0;stop-opacity:1" />
                    <stop offset="70%" style="stop-color:#fff8e7;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ffe4b3;stop-opacity:1" />
                </radialGradient>
            </defs>
            <!-- Glow -->
            <circle cx="100" cy="100" r="90" fill="url(#moon-glow)" opacity="0.4"/>
            <!-- Moon surface -->
            <circle cx="100" cy="100" r="60" fill="url(#moon-surface)"/>
            <!-- Craters -->
            <circle cx="85" cy="90" r="8" fill="#f5e6d3" opacity="0.6"/>
            <circle cx="110" cy="95" r="12" fill="#f5e6d3" opacity="0.5"/>
            <circle cx="95" cy="110" r="6" fill="#f5e6d3" opacity="0.7"/>
            <circle cx="115" cy="85" r="5" fill="#f5e6d3" opacity="0.6"/>
        `;
        this.elements[layer].appendChild(svg);
    }

    addHauntedHouse(layer) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'haunted-castle');
        svg.setAttribute('viewBox', '0 0 500 550');
        svg.innerHTML = `
            <defs>
                <linearGradient id="castle-stone" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#0d0d0d;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#050505;stop-opacity:1" />
                </linearGradient>
                <pattern id="stone-texture" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="#0a0a0a"/>
                    <rect x="0" y="0" width="19" height="19" fill="none" stroke="#1a1a1a" stroke-width="0.5"/>
                    <circle cx="5" cy="5" r="1" fill="#0d0d0d"/>
                    <circle cx="15" cy="12" r="1" fill="#0d0d0d"/>
                </pattern>
            </defs>
            
            <!-- Main castle keep (center) -->
            <rect x="180" y="200" width="140" height="350" fill="url(#castle-stone)" stroke="#000" stroke-width="2"/>
            <rect x="180" y="200" width="140" height="350" fill="url(#stone-texture)" opacity="0.3"/>
            
            <!-- Battlements on main keep -->
            <rect x="180" y="190" width="20" height="20" fill="url(#castle-stone)"/>
            <rect x="210" y="190" width="20" height="20" fill="url(#castle-stone)"/>
            <rect x="240" y="190" width="20" height="20" fill="url(#castle-stone)"/>
            <rect x="270" y="190" width="20" height="20" fill="url(#castle-stone)"/>
            <rect x="300" y="190" width="20" height="20" fill="url(#castle-stone)"/>
            
            <!-- Left tower (tall) -->
            <rect x="100" y="120" width="80" height="430" fill="url(#castle-stone)" stroke="#000" stroke-width="2"/>
            <rect x="100" y="120" width="80" height="430" fill="url(#stone-texture)" opacity="0.3"/>
            <!-- Left tower battlements -->
            <rect x="100" y="110" width="15" height="20" fill="url(#castle-stone)"/>
            <rect x="125" y="110" width="15" height="20" fill="url(#castle-stone)"/>
            <rect x="150" y="110" width="15" height="20" fill="url(#castle-stone)"/>
            <rect x="165" y="110" width="15" height="20" fill="url(#castle-stone)"/>
            <!-- Left tower spire -->
            <path d="M 95 110 L 140 50 L 185 110 Z" fill="#0a0a0a" stroke="#000" stroke-width="1"/>
            <rect x="135" y="40" width="10" height="20" fill="#0a0a0a"/>
            <circle cx="140" cy="35" r="5" fill="#9d4edd" opacity="0.8" class="tower-orb"/>
            
            <!-- Right tower (tall) -->
            <rect x="320" y="140" width="80" height="410" fill="url(#castle-stone)" stroke="#000" stroke-width="2"/>
            <rect x="320" y="140" width="80" height="410" fill="url(#stone-texture)" opacity="0.3"/>
            <!-- Right tower battlements -->
            <rect x="320" y="130" width="15" height="20" fill="url(#castle-stone)"/>
            <rect x="345" y="130" width="15" height="20" fill="url(#castle-stone)"/>
            <rect x="370" y="130" width="15" height="20" fill="url(#castle-stone)"/>
            <rect x="385" y="130" width="15" height="20" fill="url(#castle-stone)"/>
            <!-- Right tower spire -->
            <path d="M 315 130 L 360 70 L 405 130 Z" fill="#0a0a0a" stroke="#000" stroke-width="1"/>
            <rect x="355" y="60" width="10" height="20" fill="#0a0a0a"/>
            <circle cx="360" cy="55" r="5" fill="#9d4edd" opacity="0.8" class="tower-orb"/>
            
            <!-- Far left turret -->
            <rect x="50" y="280" width="50" height="270" fill="url(#castle-stone)" stroke="#000" stroke-width="2"/>
            <rect x="50" y="280" width="50" height="270" fill="url(#stone-texture)" opacity="0.3"/>
            <rect x="50" y="270" width="10" height="15" fill="url(#castle-stone)"/>
            <rect x="65" y="270" width="10" height="15" fill="url(#castle-stone)"/>
            <rect x="80" y="270" width="10" height="15" fill="url(#castle-stone)"/>
            <path d="M 47 270 L 75 230 L 103 270 Z" fill="#0a0a0a"/>
            
            <!-- Far right turret -->
            <rect x="400" y="300" width="50" height="250" fill="url(#castle-stone)" stroke="#000" stroke-width="2"/>
            <rect x="400" y="300" width="50" height="250" fill="url(#stone-texture)" opacity="0.3"/>
            <rect x="400" y="290" width="10" height="15" fill="url(#castle-stone)"/>
            <rect x="415" y="290" width="10" height="15" fill="url(#castle-stone)"/>
            <rect x="430" y="290" width="10" height="15" fill="url(#castle-stone)"/>
            <path d="M 397 290 L 425 250 L 453 290 Z" fill="#0a0a0a"/>
            
            <!-- Windows with eerie purple/orange glow -->
            <rect x="120" y="180" width="25" height="35" fill="#9d4edd" opacity="0.7" class="castle-window"/>
            <rect x="150" y="180" width="25" height="35" fill="#9d4edd" opacity="0.7" class="castle-window"/>
            <rect x="120" y="250" width="25" height="35" fill="#7b2cbf" opacity="0.6" class="castle-window"/>
            <rect x="150" y="250" width="25" height="35" fill="#7b2cbf" opacity="0.6" class="castle-window"/>
            <rect x="120" y="350" width="25" height="35" fill="#ff6600" opacity="0.6" class="castle-window"/>
            <rect x="150" y="400" width="25" height="35" fill="#ff8800" opacity="0.5" class="castle-window"/>
            
            <rect x="340" y="200" width="25" height="35" fill="#9d4edd" opacity="0.7" class="castle-window"/>
            <rect x="370" y="200" width="25" height="35" fill="#9d4edd" opacity="0.7" class="castle-window"/>
            <rect x="340" y="280" width="25" height="35" fill="#7b2cbf" opacity="0.6" class="castle-window"/>
            <rect x="370" y="280" width="25" height="35" fill="#7b2cbf" opacity="0.6" class="castle-window"/>
            <rect x="340" y="380" width="25" height="35" fill="#ff6600" opacity="0.6" class="castle-window"/>
            <rect x="370" y="450" width="25" height="35" fill="#ff8800" opacity="0.5" class="castle-window"/>
            
            <rect x="200" y="260" width="30" height="45" fill="#ff8800" opacity="0.7" class="castle-window"/>
            <rect x="270" y="260" width="30" height="45" fill="#ff8800" opacity="0.7" class="castle-window"/>
            <rect x="200" y="340" width="30" height="45" fill="#ff6600" opacity="0.6" class="castle-window"/>
            <rect x="270" y="340" width="30" height="45" fill="#ff6600" opacity="0.6" class="castle-window"/>
            <rect x="235" y="420" width="30" height="45" fill="#9d4edd" opacity="0.7" class="castle-window"/>
            
            <rect x="60" y="320" width="20" height="30" fill="#ff8800" opacity="0.6" class="castle-window"/>
            <rect x="70" y="400" width="20" height="30" fill="#7b2cbf" opacity="0.6" class="castle-window"/>
            <rect x="410" y="350" width="20" height="30" fill="#ff8800" opacity="0.6" class="castle-window"/>
            <rect x="420" y="430" width="20" height="30" fill="#7b2cbf" opacity="0.6" class="castle-window"/>
            
            <!-- Grand entrance archway -->
            <path d="M 210 480 Q 210 450 250 450 Q 290 450 290 480 L 290 550 L 210 550 Z" fill="#000000" stroke="#1a1a1a" stroke-width="2"/>
            <path d="M 220 485 Q 220 460 250 460 Q 280 460 280 485" fill="none" stroke="#2a2a2a" stroke-width="2"/>
            
            <!-- Stone archway details -->
            <ellipse cx="250" cy="450" rx="40" ry="8" fill="#1a1a1a" opacity="0.8"/>
            <rect x="208" y="480" width="4" height="70" fill="#1a1a1a"/>
            <rect x="288" y="480" width="4" height="70" fill="#1a1a1a"/>
            
            <!-- Portcullis bars -->
            <line x1="225" y1="480" x2="225" y2="545" stroke="#3a3a3a" stroke-width="3"/>
            <line x1="240" y1="475" x2="240" y2="545" stroke="#3a3a3a" stroke-width="3"/>
            <line x1="250" y1="470" x2="250" y2="545" stroke="#3a3a3a" stroke-width="3"/>
            <line x1="260" y1="475" x2="260" y2="545" stroke="#3a3a3a" stroke-width="3"/>
            <line x1="275" y1="480" x2="275" y2="545" stroke="#3a3a3a" stroke-width="3"/>
            
            <!-- Flags on towers -->
            <line x1="140" y1="35" x2="140" y2="10" stroke="#2a2a2a" stroke-width="2"/>
            <path d="M 140 10 L 165 15 L 140 20 Z" fill="#5a189a" opacity="0.9"/>
            <line x1="360" y1="55" x2="360" y2="30" stroke="#2a2a2a" stroke-width="2"/>
            <path d="M 360 30 L 385 35 L 360 40 Z" fill="#5a189a" opacity="0.9"/>
            
            <!-- Cracks and damage -->
            <path d="M 130 300 L 135 320 L 130 340" stroke="#000" stroke-width="2" fill="none"/>
            <path d="M 250 350 L 255 370 L 250 390" stroke="#000" stroke-width="2" fill="none"/>
            <path d="M 370 400 L 375 420 L 370 440" stroke="#000" stroke-width="2" fill="none"/>
        `;
        this.elements[layer].appendChild(svg);
    }

    addGround(layer) {
        const ground = document.createElement('div');
        ground.className = 'ground-area';
        this.elements[layer].appendChild(ground);
    }

    addCloud(layer, className, topPercent, leftPercent, size = 'medium') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `cloud ${className} cloud-${size}`);
        svg.setAttribute('viewBox', '0 0 200 80');
        svg.style.top = `${topPercent}%`;
        svg.style.left = `${leftPercent}%`;
        
        // Different cloud shapes based on size
        let cloudShape = '';
        if (size === 'large') {
            cloudShape = `
                <!-- Large fluffy cloud -->
                <ellipse cx="40" cy="45" rx="38" ry="28" fill="rgba(140, 120, 160, 0.5)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="85" cy="38" rx="45" ry="32" fill="rgba(150, 130, 170, 0.55)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="130" cy="42" rx="42" ry="30" fill="rgba(140, 120, 160, 0.5)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="160" cy="48" rx="35" ry="25" fill="rgba(130, 110, 150, 0.45)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="60" cy="55" rx="35" ry="22" fill="rgba(120, 100, 140, 0.4)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="105" cy="58" rx="38" ry="24" fill="rgba(120, 100, 140, 0.4)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="145" cy="56" rx="32" ry="20" fill="rgba(110, 90, 130, 0.38)" filter="url(#cloud-blur-${className})"/>
            `;
        } else if (size === 'small') {
            cloudShape = `
                <!-- Small wispy cloud -->
                <ellipse cx="60" cy="40" rx="28" ry="18" fill="rgba(130, 110, 150, 0.35)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="90" cy="38" rx="32" ry="20" fill="rgba(140, 120, 160, 0.4)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="120" cy="42" rx="26" ry="16" fill="rgba(130, 110, 150, 0.35)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="75" cy="48" rx="22" ry="14" fill="rgba(120, 100, 140, 0.3)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="105" cy="50" rx="24" ry="15" fill="rgba(120, 100, 140, 0.3)" filter="url(#cloud-blur-${className})"/>
            `;
        } else {
            cloudShape = `
                <!-- Medium puffy cloud -->
                <ellipse cx="50" cy="40" rx="35" ry="24" fill="rgba(130, 110, 150, 0.42)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="90" cy="35" rx="40" ry="28" fill="rgba(140, 120, 160, 0.48)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="130" cy="38" rx="36" ry="25" fill="rgba(130, 110, 150, 0.42)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="70" cy="48" rx="30" ry="20" fill="rgba(120, 100, 140, 0.38)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="110" cy="50" rx="32" ry="21" fill="rgba(120, 100, 140, 0.38)" filter="url(#cloud-blur-${className})"/>
                <ellipse cx="150" cy="46" rx="28" ry="18" fill="rgba(110, 90, 130, 0.35)" filter="url(#cloud-blur-${className})"/>
            `;
        }
        
        svg.innerHTML = `
            <defs>
                <filter id="cloud-blur-${className}">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
                </filter>
            </defs>
            ${cloudShape}
        `;
        this.elements[layer].appendChild(svg);
    }

    addSpookyTree(layer, className, leftPercent) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `spooky-tree ${className}`);
        svg.setAttribute('viewBox', '0 0 300 500');
        svg.style.left = `${leftPercent}%`;
        svg.innerHTML = `
            <defs>
                <filter id="tree-shadow-${className}">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
                    <feOffset dx="2" dy="3" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.4"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <radialGradient id="trunk-gradient-${className}">
                    <stop offset="0%" style="stop-color:#6b5d4f;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#5a4d3f;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#4a3d2f;stop-opacity:1" />
                </radialGradient>
                <radialGradient id="pumpkin-gradient-${className}">
                    <stop offset="0%" style="stop-color:#ff8c42;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#ff6622;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#dd4411;stop-opacity:1" />
                </radialGradient>
            </defs>
            
            <!-- Thick trunk -->
            <path d="M 150 500 L 145 400 Q 140 350 145 300 Q 150 250 145 200 L 150 120" 
                  stroke="url(#trunk-gradient-${className})" stroke-width="35" fill="none" stroke-linecap="round" filter="url(#tree-shadow-${className})"/>
            <path d="M 150 500 L 155 400 Q 160 350 155 300 Q 150 250 155 200 L 150 120" 
                  stroke="#5a4d3f" stroke-width="30" fill="none" stroke-linecap="round" opacity="0.7"/>
            
            <!-- Trunk texture -->
            <path d="M 135 450 Q 138 430 135 410" stroke="#3a2d1f" stroke-width="2" opacity="0.5" fill="none"/>
            <path d="M 165 440 Q 162 420 165 400" stroke="#3a2d1f" stroke-width="2" opacity="0.5" fill="none"/>
            <path d="M 140 350 Q 143 330 140 310" stroke="#3a2d1f" stroke-width="2" opacity="0.4" fill="none"/>
            <path d="M 160 340 Q 157 320 160 300" stroke="#3a2d1f" stroke-width="2" opacity="0.4" fill="none"/>
            
            <!-- Massive lush canopy - Back layer (darkest) -->
            <ellipse cx="150" cy="120" rx="110" ry="130" fill="#1a4a1a" opacity="0.7"/>
            <ellipse cx="90" cy="140" rx="70" ry="80" fill="#153515" opacity="0.65"/>
            <ellipse cx="210" cy="140" rx="70" ry="80" fill="#153515" opacity="0.65"/>
            
            <!-- Middle layer - vibrant greens -->
            <ellipse cx="150" cy="110" rx="105" ry="120" fill="#2d5a2d" opacity="0.85"/>
            <ellipse cx="100" cy="130" rx="65" ry="75" fill="#3d6a3d" opacity="0.8"/>
            <ellipse cx="200" cy="130" rx="65" ry="75" fill="#3d6a3d" opacity="0.8"/>
            <ellipse cx="70" cy="150" rx="55" ry="65" fill="#2d5a2d" opacity="0.75"/>
            <ellipse cx="230" cy="150" rx="55" ry="65" fill="#2d5a2d" opacity="0.75"/>
            
            <!-- Top layer - bright greens -->
            <ellipse cx="150" cy="90" rx="95" ry="110" fill="#4a7a4a" opacity="0.9"/>
            <ellipse cx="110" cy="110" rx="60" ry="70" fill="#5a8a5a" opacity="0.85"/>
            <ellipse cx="190" cy="110" rx="60" ry="70" fill="#5a8a5a" opacity="0.85"/>
            <ellipse cx="80" cy="130" rx="50" ry="60" fill="#4a7a4a" opacity="0.8"/>
            <ellipse cx="220" cy="130" rx="50" ry="60" fill="#4a7a4a" opacity="0.8"/>
            
            <!-- Highlight layer - lightest greens -->
            <ellipse cx="150" cy="70" rx="75" ry="85" fill="#6a9a6a" opacity="0.85"/>
            <ellipse cx="125" cy="85" rx="50" ry="60" fill="#7aaa7a" opacity="0.8"/>
            <ellipse cx="175" cy="85" rx="50" ry="60" fill="#7aaa7a" opacity="0.8"/>
            <ellipse cx="150" cy="55" rx="55" ry="65" fill="#8aba8a" opacity="0.75"/>
            
            <!-- Outer leaf clusters for texture -->
            <ellipse cx="50" cy="120" rx="30" ry="35" fill="#4a7a4a" opacity="0.7" transform="rotate(-25 50 120)"/>
            <ellipse cx="250" cy="120" rx="30" ry="35" fill="#4a7a4a" opacity="0.7" transform="rotate(25 250 120)"/>
            <ellipse cx="65" cy="95" rx="25" ry="30" fill="#5a8a5a" opacity="0.65" transform="rotate(-30 65 95)"/>
            <ellipse cx="235" cy="95" rx="25" ry="30" fill="#5a8a5a" opacity="0.65" transform="rotate(30 235 95)"/>
            <ellipse cx="40" cy="145" rx="28" ry="33" fill="#3d6a3d" opacity="0.65" transform="rotate(-35 40 145)"/>
            <ellipse cx="260" cy="145" rx="28" ry="33" fill="#3d6a3d" opacity="0.65" transform="rotate(35 260 145)"/>
            
            <!-- Orange pumpkins scattered in the canopy -->
            <circle cx="120" cy="80" r="12" fill="url(#pumpkin-gradient-${className})" class="tree-pumpkin"/>
            <circle cx="180" cy="75" r="11" fill="url(#pumpkin-gradient-${className})" class="tree-pumpkin"/>
            <circle cx="150" cy="95" r="13" fill="url(#pumpkin-gradient-${className})" class="tree-pumpkin"/>
            <circle cx="95" cy="110" r="10" fill="url(#pumpkin-gradient-${className})" class="tree-pumpkin"/>
            <circle cx="205" cy="105" r="11" fill="url(#pumpkin-gradient-${className})" class="tree-pumpkin"/>
            <circle cx="135" cy="125" r="12" fill="url(#pumpkin-gradient-${className})" class="tree-pumpkin"/>
            <circle cx="170" cy="120" r="10" fill="url(#pumpkin-gradient-${className})" class="tree-pumpkin"/>
            <circle cx="110" cy="140" r="11" fill="url(#pumpkin-gradient-${className})" class="tree-pumpkin"/>
            <circle cx="190" cy="135" r="12" fill="url(#pumpkin-gradient-${className})" class="tree-pumpkin"/>
            <circle cx="150" cy="60" r="11" fill="url(#pumpkin-gradient-${className})" class="tree-pumpkin"/>
            
            <!-- Pumpkin stems -->
            <rect x="119" y="75" width="2" height="5" fill="#4a3d2f" opacity="0.8"/>
            <rect x="179" y="70" width="2" height="5" fill="#4a3d2f" opacity="0.8"/>
            <rect x="149" y="90" width="2" height="5" fill="#4a3d2f" opacity="0.8"/>
            <rect x="94" y="105" width="2" height="5" fill="#4a3d2f" opacity="0.8"/>
            <rect x="204" y="100" width="2" height="5" fill="#4a3d2f" opacity="0.8"/>
            
            <!-- Falling leaves -->
            <ellipse cx="60" cy="180" rx="4" ry="6" fill="#7aaa7a" opacity="0.6" transform="rotate(-15 60 180)" class="falling-leaf"/>
            <ellipse cx="240" cy="190" rx="4" ry="6" fill="#6a9a6a" opacity="0.6" transform="rotate(20 240 190)" class="falling-leaf"/>
            <ellipse cx="150" cy="200" rx="4" ry="6" fill="#5a8a5a" opacity="0.6" transform="rotate(-10 150 200)" class="falling-leaf"/>
        `;
        this.elements[layer].appendChild(svg);
    }

    addHowlingWolf(layer) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'howling-wolf');
        svg.setAttribute('viewBox', '0 0 200 220');
        svg.innerHTML = `
            <defs>
                <filter id="wolf-shadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                    <feOffset dx="3" dy="4" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.5"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <radialGradient id="wolf-eye-glow">
                    <stop offset="0%" style="stop-color:#ffff00;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#ffaa00;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ff6600;stop-opacity:0" />
                </radialGradient>
                <linearGradient id="wolf-fur" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#3a3a3a;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#2a2a2a;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
                </linearGradient>
            </defs>
            
            <!-- Realistic wolf facing right, howling -->
            
            <!-- Back leg (left side) -->
            <path d="M 60 180 L 60 210 L 65 220 L 70 220 L 72 210 L 72 185" fill="url(#wolf-fur)" filter="url(#wolf-shadow)"/>
            
            <!-- Body -->
            <ellipse cx="100" cy="175" rx="45" ry="30" fill="url(#wolf-fur)" filter="url(#wolf-shadow)"/>
            
            <!-- Chest/shoulder area -->
            <ellipse cx="130" cy="165" rx="30" ry="28" fill="url(#wolf-fur)"/>
            
            <!-- Haunches -->
            <ellipse cx="70" cy="175" rx="25" ry="28" fill="url(#wolf-fur)"/>
            
            <!-- Tail curved up -->
            <path d="M 55 170 Q 40 160 35 140 Q 33 130 35 120" 
                  stroke="url(#wolf-fur)" stroke-width="14" fill="none" stroke-linecap="round" filter="url(#wolf-shadow)"/>
            <path d="M 55 170 Q 40 160 35 140 Q 33 130 35 120" 
                  stroke="#2a2a2a" stroke-width="12" fill="none" stroke-linecap="round"/>
            
            <!-- Back leg (right side) -->
            <path d="M 85 180 L 85 210 L 90 220 L 95 220 L 97 210 L 97 185" fill="url(#wolf-fur)"/>
            
            <!-- Neck angled up -->
            <path d="M 140 160 Q 150 140 155 120" stroke="url(#wolf-fur)" stroke-width="28" fill="none" stroke-linecap="round"/>
            
            <!-- Head tilted back (howling position) -->
            <ellipse cx="160" cy="100" rx="22" ry="28" fill="url(#wolf-fur)" transform="rotate(25 160 100)"/>
            
            <!-- Snout pointing up and right -->
            <ellipse cx="172" cy="85" rx="12" ry="18" fill="#2a2a2a" transform="rotate(35 172 85)"/>
            <ellipse cx="178" cy="78" rx="8" ry="12" fill="#1a1a1a" transform="rotate(35 178 78)"/>
            
            <!-- Nose -->
            <ellipse cx="182" cy="72" rx="4" ry="5" fill="#0a0a0a" transform="rotate(35 182 72)"/>
            
            <!-- Ears pointing back -->
            <polygon points="155,75 150,60 158,72" fill="#2a2a2a"/>
            <polygon points="165,80 162,65 168,78" fill="#2a2a2a"/>
            
            <!-- Eye (glowing) -->
            <circle cx="165" cy="95" r="4" fill="url(#wolf-eye-glow)" class="wolf-eye"/>
            <circle cx="165" cy="95" r="2.5" fill="#ffff00" opacity="0.9"/>
            
            <!-- Front leg (left) -->
            <path d="M 125 185 L 125 210 L 130 220 L 135 220 L 137 210 L 137 190" fill="url(#wolf-fur)"/>
            
            <!-- Front leg (right) -->
            <path d="M 145 185 L 145 210 L 150 220 L 155 220 L 157 210 L 157 190" fill="url(#wolf-fur)"/>
            
            <!-- Paws -->
            <ellipse cx="132" cy="218" rx="6" ry="4" fill="#1a1a1a"/>
            <ellipse cx="152" cy="218" rx="6" ry="4" fill="#1a1a1a"/>
            <ellipse cx="67" cy="218" rx="6" ry="4" fill="#1a1a1a"/>
            <ellipse cx="92" cy="218" rx="6" ry="4" fill="#1a1a1a"/>
            
            <!-- Fur texture details -->
            <path d="M 90 165 L 88 170" stroke="#0a0a0a" stroke-width="2" opacity="0.4"/>
            <path d="M 100 168 L 98 173" stroke="#0a0a0a" stroke-width="2" opacity="0.4"/>
            <path d="M 110 170 L 108 175" stroke="#0a0a0a" stroke-width="2" opacity="0.4"/>
            <path d="M 120 168 L 118 173" stroke="#0a0a0a" stroke-width="2" opacity="0.4"/>
            <path d="M 75 172 L 73 177" stroke="#0a0a0a" stroke-width="2" opacity="0.4"/>
            
            <!-- Chest fur -->
            <path d="M 135 175 L 133 180" stroke="#3a3a3a" stroke-width="2" opacity="0.5"/>
            <path d="M 140 178 L 138 183" stroke="#3a3a3a" stroke-width="2" opacity="0.5"/>
        `;
        this.elements[layer].appendChild(svg);
    }

    addGrass(layer) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'grass-layer');
        svg.setAttribute('viewBox', '0 0 1200 120');
        svg.setAttribute('preserveAspectRatio', 'none');
        
        // Generate varied grass blades
        let backGrass = '';
        let midGrass = '';
        let frontGrass = '';
        
        // Back layer - short grass
        for (let i = 0; i < 150; i++) {
            const x = (i * 8) + (Math.random() * 4);
            const height = 15 + Math.random() * 10;
            const curve = 2 + Math.random() * 3;
            backGrass += `<path d="M ${x} 120 Q ${x + curve} ${120 - height/2} ${x + curve*2} ${120 - height}" 
                stroke="#2a5c0d" stroke-width="1.5" fill="none" opacity="0.6" stroke-linecap="round"/>`;
        }
        
        // Mid layer - medium grass
        for (let i = 0; i < 120; i++) {
            const x = (i * 10) + (Math.random() * 5);
            const height = 25 + Math.random() * 15;
            const curve = 3 + Math.random() * 4;
            midGrass += `<path d="M ${x} 120 Q ${x + curve} ${120 - height/2} ${x + curve*2} ${120 - height}" 
                stroke="#3a6c1d" stroke-width="2" fill="none" opacity="0.75" stroke-linecap="round"/>`;
        }
        
        // Front layer - tall grass
        for (let i = 0; i < 100; i++) {
            const x = (i * 12) + (Math.random() * 6);
            const height = 35 + Math.random() * 20;
            const curve = 4 + Math.random() * 5;
            frontGrass += `<path d="M ${x} 120 Q ${x + curve} ${120 - height/2} ${x + curve*2} ${120 - height}" 
                stroke="#4a7c2d" stroke-width="2.5" fill="none" opacity="0.85" stroke-linecap="round"/>`;
        }
        
        svg.innerHTML = `
            <defs>
                <linearGradient id="grass-base" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#2a5c0d;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#1a4c0d;stop-opacity:0.6" />
                </linearGradient>
            </defs>
            
            <!-- Base ground -->
            <rect x="0" y="90" width="1200" height="30" fill="url(#grass-base)"/>
            
            <!-- Grass blade layers -->
            ${backGrass}
            ${midGrass}
            ${frontGrass} 
        `;
        this.elements[layer].appendChild(svg);
    }

    addGlowingPumpkin(layer, className, leftPercent, bottomPercent) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `glowing-pumpkin ${className}`);
        svg.setAttribute('viewBox', '0 0 80 80');
        svg.style.position = 'absolute';
        svg.style.left = `${leftPercent}%`;
        svg.style.bottom = `${bottomPercent}%`;
        svg.style.zIndex = layer === 'near' ? '6' : '4';
        console.log(`🎃 Adding pumpkin: ${className} at left:${leftPercent}%, bottom:${bottomPercent}%`);
        svg.innerHTML = `
            <defs>
                <filter id="glow-${className}">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <radialGradient id="pumpkin-grad-${className}">
                    <stop offset="0%" style="stop-color:#ff9944;stop-opacity:1" />
                    <stop offset="60%" style="stop-color:#ff7722;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ee5511;stop-opacity:1" />
                </radialGradient>
                <radialGradient id="pumpkin-highlight-${className}">
                    <stop offset="0%" style="stop-color:#ffbb66;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ff9944;stop-opacity:0" />
                </radialGradient>
            </defs>
            
            <!-- Outer glow -->
            <circle cx="40" cy="50" r="32" fill="rgba(255, 140, 66, 0.4)" filter="url(#glow-${className})"/>
            
            <!-- Pumpkin body - simple round shape -->
            <circle cx="40" cy="50" r="28" fill="url(#pumpkin-grad-${className})" class="tree-pumpkin"/>
            
            <!-- Highlight for 3D effect -->
            <ellipse cx="35" cy="45" rx="12" ry="15" fill="url(#pumpkin-highlight-${className})"/>
            
            <!-- Subtle ridges -->
            <path d="M 40 22 Q 40 50 40 78" stroke="#dd6611" stroke-width="1.5" fill="none" opacity="0.4"/>
            <path d="M 28 26 Q 28 50 28 74" stroke="#dd6611" stroke-width="1" fill="none" opacity="0.3"/>
            <path d="M 52 26 Q 52 50 52 74" stroke="#dd6611" stroke-width="1" fill="none" opacity="0.3"/>
            
            <!-- Stem -->
            <rect x="38" y="18" width="4" height="8" fill="#5a4d3f" rx="1"/>
            <rect x="37" y="16" width="6" height="3" fill="#6a5d4f" rx="1"/>
            
            <!-- Small leaf on stem -->
            <ellipse cx="43" cy="20" rx="3" ry="2" fill="#4a7a4a" opacity="0.8" transform="rotate(30 43 20)"/>
            
            <!-- Carved Jack-o'-lantern face -->
            <!-- Left eye -->
            <polygon points="28,42 32,38 36,42 32,46" fill="#ffaa00" filter="url(#glow-${className})"/>
            <polygon points="29,42 32,40 35,42 32,45" fill="#ff6600" class="pumpkin-flicker"/>
            
            <!-- Right eye -->
            <polygon points="44,42 48,38 52,42 48,46" fill="#ffaa00" filter="url(#glow-${className})"/>
            <polygon points="45,42 48,40 51,42 48,45" fill="#ff6600" class="pumpkin-flicker"/>
            
            <!-- Triangular nose -->
            <polygon points="40,50 36,56 44,56" fill="#ffaa00" filter="url(#glow-${className})"/>
            <polygon points="40,51 37,55 43,55" fill="#ff6600" class="pumpkin-flicker"/>
            
            <!-- Wicked grin with teeth -->
            <path d="M 26 60 Q 28 64 30 60 Q 32 64 34 60 Q 36 64 38 60 Q 40 64 42 60 Q 44 64 46 60 Q 48 64 50 60 Q 52 64 54 60" 
                  stroke="#ffaa00" stroke-width="3" fill="none" filter="url(#glow-${className})"/>
            <path d="M 26 60 Q 28 64 30 60 Q 32 64 34 60 Q 36 64 38 60 Q 40 64 42 60 Q 44 64 46 60 Q 48 64 50 60 Q 52 64 54 60" 
                  stroke="#ff6600" stroke-width="2" fill="none" class="pumpkin-flicker"/>
            
            <!-- Inner glow from carved face -->
            <circle cx="40" cy="50" r="22" fill="rgba(255, 170, 0, 0.3)" class="pumpkin-flicker"/>
        `;
        this.elements[layer].appendChild(svg);
    }

    addPineTree(layer, className, leftPercent, bottomPercent) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `pine-tree ${className}`);
        svg.setAttribute('viewBox', '0 0 80 150');
        svg.style.left = `${leftPercent}%`;
        svg.style.bottom = `${bottomPercent}%`;
        svg.innerHTML = `
            <!-- Trunk -->
            <rect x="35" y="110" width="10" height="40" fill="#1a1a1a" opacity="0.8"/>
            <!-- Pine layers (triangles) -->
            <polygon points="40,110 20,130 60,130" fill="#0a1a1a" opacity="0.7"/>
            <polygon points="40,95 15,120 65,120" fill="#0a1a1a" opacity="0.7"/>
            <polygon points="40,80 10,110 70,110" fill="#0a1a1a" opacity="0.7"/>
            <polygon points="40,65 12,100 68,100" fill="#0a1a1a" opacity="0.7"/>
            <polygon points="40,50 15,85 65,85" fill="#0a1a1a" opacity="0.7"/>
            <polygon points="40,35 20,70 60,70" fill="#0a1a1a" opacity="0.7"/>
            <polygon points="40,20 25,55 55,55" fill="#0a1a1a" opacity="0.7"/>
            <polygon points="40,10 30,40 50,40" fill="#0a1a1a" opacity="0.7"/>
        `;
        this.elements[layer].appendChild(svg);
    }

    addFlyingBat(layer, className, leftPercent, topPercent) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `flying-bat ${className}`);
        svg.setAttribute('viewBox', '0 0 60 40');
        svg.style.left = `${leftPercent}%`;
        svg.style.top = `${topPercent}%`;
        svg.innerHTML = `
            <!-- Body -->
            <ellipse cx="30" cy="20" rx="6" ry="9" fill="#1a1a1a"/>
            <!-- Head -->
            <circle cx="30" cy="14" r="5" fill="#1a1a1a"/>
            <!-- Pointy ears -->
            <polygon points="27,11 25,6 28,12" fill="#1a1a1a"/>
            <polygon points="33,11 35,6 32,12" fill="#1a1a1a"/>
            <!-- Red eyes -->
            <circle cx="28" cy="14" r="1.5" fill="#ff0000" opacity="0.9"/>
            <circle cx="32" cy="14" r="1.5" fill="#ff0000" opacity="0.9"/>
            <!-- Left wing -->
            <path d="M 24 20 Q 10 12 3 18 Q 4 22 8 21 Q 12 20 16 22 Q 20 23 24 24" 
                  fill="#0d0d0d" class="bat-wing-left"/>
            <path d="M 24 20 L 12 16 M 24 22 L 14 19 M 24 24 L 16 22" 
                  stroke="#1a1a1a" stroke-width="0.8" fill="none"/>
            <!-- Right wing -->
            <path d="M 36 20 Q 50 12 57 18 Q 56 22 52 21 Q 48 20 44 22 Q 40 23 36 24" 
                  fill="#0d0d0d" class="bat-wing-right"/>
            <path d="M 36 20 L 48 16 M 36 22 L 46 19 M 36 24 L 44 22" 
                  stroke="#1a1a1a" stroke-width="0.8" fill="none"/>
            <!-- Feet -->
            <line x1="28" y1="28" x2="28" y2="32" stroke="#1a1a1a" stroke-width="1"/>
            <line x1="32" y1="28" x2="32" y2="32" stroke="#1a1a1a" stroke-width="1"/>
        `;
        this.elements[layer].appendChild(svg);
    }

    addSpiderWeb(layer, className, leftPercent, topPercent) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `spider-web ${className}`);
        svg.setAttribute('viewBox', '0 0 120 120');
        svg.style.left = `${leftPercent}%`;
        svg.style.top = `${topPercent}%`;
        svg.innerHTML = `
            <defs>
                <radialGradient id="web-grad-${className}">
                    <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#cccccc;stop-opacity:0.4" />
                </radialGradient>
            </defs>
            <!-- Radial threads -->
            <line x1="60" y1="60" x2="60" y2="10" stroke="url(#web-grad-${className})" stroke-width="1.5"/>
            <line x1="60" y1="60" x2="95" y2="20" stroke="url(#web-grad-${className})" stroke-width="1.5"/>
            <line x1="60" y1="60" x2="110" y2="45" stroke="url(#web-grad-${className})" stroke-width="1.5"/>
            <line x1="60" y1="60" x2="110" y2="75" stroke="url(#web-grad-${className})" stroke-width="1.5"/>
            <line x1="60" y1="60" x2="95" y2="100" stroke="url(#web-grad-${className})" stroke-width="1.5"/>
            <line x1="60" y1="60" x2="60" y2="110" stroke="url(#web-grad-${className})" stroke-width="1.5"/>
            <line x1="60" y1="60" x2="25" y2="100" stroke="url(#web-grad-${className})" stroke-width="1.5"/>
            <line x1="60" y1="60" x2="10" y2="75" stroke="url(#web-grad-${className})" stroke-width="1.5"/>
            <line x1="60" y1="60" x2="10" y2="45" stroke="url(#web-grad-${className})" stroke-width="1.5"/>
            <line x1="60" y1="60" x2="25" y2="20" stroke="url(#web-grad-${className})" stroke-width="1.5"/>
            <!-- Circular threads -->
            <circle cx="60" cy="60" r="15" fill="none" stroke="url(#web-grad-${className})" stroke-width="1.2"/>
            <circle cx="60" cy="60" r="30" fill="none" stroke="url(#web-grad-${className})" stroke-width="1"/>
            <circle cx="60" cy="60" r="45" fill="none" stroke="url(#web-grad-${className})" stroke-width="0.8"/>
            <!-- Dew drops -->
            <circle cx="75" cy="40" r="2" fill="rgba(200, 220, 255, 0.6)"/>
            <circle cx="45" cy="50" r="1.5" fill="rgba(200, 220, 255, 0.6)"/>
            <circle cx="80" cy="70" r="1.8" fill="rgba(200, 220, 255, 0.6)"/>
        `;
        this.elements[layer].appendChild(svg);
    }

    addSpider(layer, className, leftPercent, topPercent) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `spider ${className}`);
        svg.setAttribute('viewBox', '0 0 50 50');
        svg.style.left = `${leftPercent}%`;
        svg.style.top = `${topPercent}%`;
        svg.innerHTML = `
            <!-- Silk thread -->
            <line x1="25" y1="0" x2="25" y2="18" stroke="rgba(255, 255, 255, 0.4)" stroke-width="0.8"/>
            <!-- Body -->
            <ellipse cx="25" cy="28" rx="6" ry="8" fill="#1a1a1a"/>
            <!-- Head -->
            <circle cx="25" cy="20" r="4" fill="#1a1a1a"/>
            <!-- Red eyes -->
            <circle cx="23" cy="20" r="1" fill="#ff0000"/>
            <circle cx="27" cy="20" r="1" fill="#ff0000"/>
            <!-- Legs (4 pairs) -->
            <path d="M 19 24 Q 10 22 8 26" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
            <path d="M 19 26 Q 8 26 6 30" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
            <path d="M 19 30 Q 10 32 8 36" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
            <path d="M 19 32 Q 8 36 6 40" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
            <path d="M 31 24 Q 40 22 42 26" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
            <path d="M 31 26 Q 42 26 44 30" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
            <path d="M 31 30 Q 40 32 42 36" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
            <path d="M 31 32 Q 42 36 44 40" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
        `;
        this.elements[layer].appendChild(svg);
    }

    addHangingSkeleton(layer) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'skeleton-hanging');
        svg.setAttribute('viewBox', '0 0 140 200');
        svg.innerHTML = `
            <defs>
                <radialGradient id="bone-gradient">
                    <stop offset="0%" style="stop-color:#f5f5f5;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#e8e8e8;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#d0d0d0;stop-opacity:1" />
                </radialGradient>
                <filter id="bone-shadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                    <feOffset dx="1" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            <!-- Rope with frayed texture -->
            <line x1="70" y1="0" x2="70" y2="25" stroke="#6b5d4f" stroke-width="3" stroke-linecap="round"/>
            <line x1="68" y1="5" x2="68" y2="20" stroke="#8b7355" stroke-width="1" opacity="0.6"/>
            <line x1="72" y1="5" x2="72" y2="20" stroke="#8b7355" stroke-width="1" opacity="0.6"/>
            
            <!-- Skull with realistic details -->
            <ellipse cx="70" cy="45" rx="20" ry="24" fill="url(#bone-gradient)" filter="url(#bone-shadow)"/>
            
            <!-- Skull shading -->
            <ellipse cx="70" cy="48" rx="18" ry="20" fill="none" stroke="#d0d0d0" stroke-width="0.5" opacity="0.5"/>
            
            <!-- Eye sockets with depth -->
            <ellipse cx="62" cy="42" rx="5" ry="6" fill="#1a1a1a"/>
            <ellipse cx="78" cy="42" rx="5" ry="6" fill="#1a1a1a"/>
            <ellipse cx="62" cy="41" rx="3" ry="4" fill="#000000"/>
            <ellipse cx="78" cy="41" rx="3" ry="4" fill="#000000"/>
            <circle cx="63" cy="40" r="1" fill="#ff0000" opacity="0.6"/>
            <circle cx="79" cy="40" r="1" fill="#ff0000" opacity="0.6"/>
            
            <!-- Nasal cavity -->
            <path d="M 68 50 L 65 55 L 70 56 L 75 55 L 72 50 Z" fill="#1a1a1a"/>
            
            <!-- Teeth and jaw -->
            <path d="M 55 58 Q 70 62 85 58" stroke="#1a1a1a" stroke-width="2" fill="none"/>
            <rect x="60" y="58" width="3" height="4" fill="#f5f5f5" stroke="#d0d0d0" stroke-width="0.5"/>
            <rect x="64" y="58" width="3" height="4" fill="#f5f5f5" stroke="#d0d0d0" stroke-width="0.5"/>
            <rect x="68" y="58" width="3" height="4" fill="#f5f5f5" stroke="#d0d0d0" stroke-width="0.5"/>
            <rect x="72" y="58" width="3" height="4" fill="#f5f5f5" stroke="#d0d0d0" stroke-width="0.5"/>
            <rect x="76" y="58" width="3" height="4" fill="#f5f5f5" stroke="#d0d0d0" stroke-width="0.5"/>
            
            <!-- Jaw bone -->
            <path d="M 55 58 L 52 64 Q 70 68 88 64 L 85 58" fill="url(#bone-gradient)" stroke="#d0d0d0" stroke-width="1"/>
            
            <!-- Cervical vertebrae (neck) -->
            <ellipse cx="70" cy="72" rx="6" ry="4" fill="url(#bone-gradient)" stroke="#d0d0d0" stroke-width="1"/>
            <ellipse cx="70" cy="77" rx="5.5" ry="3.5" fill="url(#bone-gradient)" stroke="#d0d0d0" stroke-width="1"/>
            
            <!-- Clavicles (collar bones) -->
            <path d="M 70 80 Q 55 82 48 78" stroke="url(#bone-gradient)" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M 70 80 Q 85 82 92 78" stroke="url(#bone-gradient)" stroke-width="4" fill="none" stroke-linecap="round"/>
            
            <!-- Spine with vertebrae detail -->
            <rect x="67" y="80" width="6" height="60" fill="url(#bone-gradient)" rx="3" filter="url(#bone-shadow)"/>
            <circle cx="70" cy="85" r="3" fill="#d0d0d0" opacity="0.5"/>
            <circle cx="70" cy="95" r="3" fill="#d0d0d0" opacity="0.5"/>
            <circle cx="70" cy="105" r="3" fill="#d0d0d0" opacity="0.5"/>
            <circle cx="70" cy="115" r="3" fill="#d0d0d0" opacity="0.5"/>
            <circle cx="70" cy="125" r="3" fill="#d0d0d0" opacity="0.5"/>
            <circle cx="70" cy="135" r="3" fill="#d0d0d0" opacity="0.5"/>
            
            <!-- Rib cage with individual ribs -->
            <ellipse cx="70" cy="92" rx="18" ry="10" fill="none" stroke="url(#bone-gradient)" stroke-width="2.5"/>
            <ellipse cx="70" cy="102" rx="17" ry="9" fill="none" stroke="url(#bone-gradient)" stroke-width="2.5"/>
            <ellipse cx="70" cy="111" rx="16" ry="8" fill="none" stroke="url(#bone-gradient)" stroke-width="2.5"/>
            <ellipse cx="70" cy="119" rx="15" ry="7" fill="none" stroke="url(#bone-gradient)" stroke-width="2.5"/>
            <ellipse cx="70" cy="126" rx="14" ry="6" fill="none" stroke="url(#bone-gradient)" stroke-width="2"/>
            
            <!-- Sternum -->
            <rect x="68" y="85" width="4" height="45" fill="url(#bone-gradient)" rx="2" opacity="0.8"/>
            
            <!-- Scapulae (shoulder blades) -->
            <ellipse cx="52" cy="88" rx="8" ry="12" fill="url(#bone-gradient)" opacity="0.6" transform="rotate(-20 52 88)"/>
            <ellipse cx="88" cy="88" rx="8" ry="12" fill="url(#bone-gradient)" opacity="0.6" transform="rotate(20 88 88)"/>
            
            <!-- Left arm with joints -->
            <line x1="70" y1="82" x2="48" y2="95" stroke="url(#bone-gradient)" stroke-width="4" stroke-linecap="round" filter="url(#bone-shadow)"/>
            <circle cx="48" cy="95" r="4" fill="url(#bone-gradient)" stroke="#d0d0d0" stroke-width="1"/>
            <line x1="48" y1="95" x2="38" y2="118" stroke="url(#bone-gradient)" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="38" cy="118" r="3.5" fill="url(#bone-gradient)" stroke="#d0d0d0" stroke-width="1"/>
            <line x1="38" y1="118" x2="32" y2="135" stroke="url(#bone-gradient)" stroke-width="3" stroke-linecap="round"/>
            <!-- Left hand bones -->
            <line x1="32" y1="135" x2="30" y2="142" stroke="url(#bone-gradient)" stroke-width="2"/>
            <line x1="32" y1="135" x2="33" y2="143" stroke="url(#bone-gradient)" stroke-width="2"/>
            <line x1="32" y1="135" x2="36" y2="142" stroke="url(#bone-gradient)" stroke-width="2"/>
            
            <!-- Right arm with joints -->
            <line x1="70" y1="82" x2="92" y2="95" stroke="url(#bone-gradient)" stroke-width="4" stroke-linecap="round" filter="url(#bone-shadow)"/>
            <circle cx="92" cy="95" r="4" fill="url(#bone-gradient)" stroke="#d0d0d0" stroke-width="1"/>
            <line x1="92" y1="95" x2="102" y2="118" stroke="url(#bone-gradient)" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="102" cy="118" r="3.5" fill="url(#bone-gradient)" stroke="#d0d0d0" stroke-width="1"/>
            <line x1="102" y1="118" x2="108" y2="135" stroke="url(#bone-gradient)" stroke-width="3" stroke-linecap="round"/>
            <!-- Right hand bones -->
            <line x1="108" y1="135" x2="110" y2="142" stroke="url(#bone-gradient)" stroke-width="2"/>
            <line x1="108" y1="135" x2="107" y2="143" stroke="url(#bone-gradient)" stroke-width="2"/>
            <line x1="108" y1="135" x2="104" y2="142" stroke="url(#bone-gradient)" stroke-width="2"/>
            
            <!-- Pelvis with realistic shape -->
            <ellipse cx="70" cy="145" rx="16" ry="8" fill="url(#bone-gradient)" filter="url(#bone-shadow)"/>
            <path d="M 54 145 Q 54 150 58 152" stroke="url(#bone-gradient)" stroke-width="3" fill="none"/>
            <path d="M 86 145 Q 86 150 82 152" stroke="url(#bone-gradient)" stroke-width="3" fill="none"/>
            <ellipse cx="62" cy="148" rx="6" ry="8" fill="none" stroke="url(#bone-gradient)" stroke-width="2"/>
            <ellipse cx="78" cy="148" rx="6" ry="8" fill="none" stroke="url(#bone-gradient)" stroke-width="2"/>
            
            <!-- Left leg with joints -->
            <line x1="62" y1="152" x2="56" y2="175" stroke="url(#bone-gradient)" stroke-width="4" stroke-linecap="round" filter="url(#bone-shadow)"/>
            <circle cx="56" cy="175" r="4" fill="url(#bone-gradient)" stroke="#d0d0d0" stroke-width="1"/>
            <line x1="56" y1="175" x2="52" y2="195" stroke="url(#bone-gradient)" stroke-width="3.5" stroke-linecap="round"/>
            <!-- Left foot -->
            <ellipse cx="50" cy="197" rx="5" ry="3" fill="url(#bone-gradient)"/>
            
            <!-- Right leg with joints -->
            <line x1="78" y1="152" x2="84" y2="175" stroke="url(#bone-gradient)" stroke-width="4" stroke-linecap="round" filter="url(#bone-shadow)"/>
            <circle cx="84" cy="175" r="4" fill="url(#bone-gradient)" stroke="#d0d0d0" stroke-width="1"/>
            <line x1="84" y1="175" x2="88" y2="195" stroke="url(#bone-gradient)" stroke-width="3.5" stroke-linecap="round"/>
            <!-- Right foot -->
            <ellipse cx="90" cy="197" rx="5" ry="3" fill="url(#bone-gradient)"/>
        `;
        this.elements[layer].appendChild(svg);
    }

    addSpookyBush(layer, className, leftPercent, bottomPercent) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `spooky-bush ${className}`);
        svg.setAttribute('viewBox', '0 0 150 100');
        svg.style.left = `${leftPercent}%`;
        svg.style.bottom = `${bottomPercent}%`;
        svg.innerHTML = `
            <defs>
                <filter id="eye-glow-${className}">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <radialGradient id="bush-grad-${className}">
                    <stop offset="0%" style="stop-color:#1a3a1a;stop-opacity:1" />
                    <stop offset="70%" style="stop-color:#0d2a0d;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#051a05;stop-opacity:1" />
                </radialGradient>
            </defs>
            
            <!-- Bush body - cluster of circles for leafy appearance -->
            <ellipse cx="75" cy="70" rx="45" ry="30" fill="url(#bush-grad-${className})" opacity="0.9"/>
            <ellipse cx="50" cy="75" rx="35" ry="25" fill="#0d2a0d" opacity="0.85"/>
            <ellipse cx="100" cy="75" rx="35" ry="25" fill="#0d2a0d" opacity="0.85"/>
            <ellipse cx="75" cy="80" rx="40" ry="22" fill="#051a05" opacity="0.9"/>
            <ellipse cx="60" cy="85" rx="30" ry="18" fill="#0a1f0a" opacity="0.8"/>
            <ellipse cx="90" cy="85" rx="30" ry="18" fill="#0a1f0a" opacity="0.8"/>
            
            <!-- Glowing eyes peering from the bush -->
            <ellipse cx="60" cy="70" rx="5" ry="7" fill="#ffff00" filter="url(#eye-glow-${className})" class="bush-eye"/>
            <ellipse cx="60" cy="70" rx="3" ry="5" fill="#ffee00" class="bush-eye"/>
            <ellipse cx="60" cy="68" rx="2" ry="3" fill="#ffffff" opacity="0.8"/>
            
            <ellipse cx="90" cy="70" rx="5" ry="7" fill="#ffff00" filter="url(#eye-glow-${className})" class="bush-eye"/>
            <ellipse cx="90" cy="70" rx="3" ry="5" fill="#ffee00" class="bush-eye"/>
            <ellipse cx="90" cy="68" rx="2" ry="3" fill="#ffffff" opacity="0.8"/>
            
            <!-- Dark shadows for depth -->
            <ellipse cx="75" cy="88" rx="35" ry="12" fill="#000000" opacity="0.3"/>
        `;
        this.elements[layer].appendChild(svg);
    }

    addFogLayer(layer, className, topPercent) {
        const fog = document.createElement('div');
        fog.className = `fog-layer ${className}`;
        fog.style.top = `${topPercent}%`;
        this.elements[layer].appendChild(fog);
        console.log(`🌫️ Added fog layer: ${className} at ${topPercent}%`);
    }
}
