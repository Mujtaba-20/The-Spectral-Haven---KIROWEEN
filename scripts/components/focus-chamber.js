// Focus Chamber Component - Stopwatch with visual feedback

import { formatDuration, uuid } from '../utils/helpers.js';
import { StorageAdapter } from '../utils/storage.js';

export class FocusChamber {
    constructor() {
        this.container = null;
        this.startTime = null;
        this.elapsed = 0;
        this.running = false;
        this.animationFrame = null;
        this.linkedTaskId = null;
        this.linkedTaskName = null;
        this.particles = [];
        this.storage = new StorageAdapter('focusSessions');
        this.taskStorage = new StorageAdapter('tasks');
    }

    async init() {
        await this.storage.init();
        await this.taskStorage.init();
    }

    async render() {
        await this.init();
        
        this.container = document.getElementById('page-container');
        
        // Load available tasks for linking
        const tasks = await this.loadTasks();
        
        this.container.innerHTML = `
            <div class="focus-chamber-page">
                <h1>Focus Chamber</h1>
                <p class="subtitle">Within this chamber, time glows, drifts, and obeys your will.</p>
                
                <div class="focus-chamber-content">
                    <div class="stopwatch-container">
                        <div class="mystical-stopwatch">
                            <div class="stopwatch-display">00:00</div>
                            ${this.linkedTaskName ? `<div class="linked-task">Focusing on: ${this.linkedTaskName}</div>` : ''}
                        </div>
                        
                        <div class="timer-controls">
                            <button class="btn-start" id="start-btn">Start</button>
                            <button class="btn-stop" id="stop-btn" disabled>Stop</button>
                            <button class="btn-reset" id="reset-btn">Reset</button>
                        </div>
                        
                        <div class="completion-message"></div>
                    </div>
                    
                    <div class="task-link-section">
                        <label for="task-select">Link to task (optional):</label>
                        <select id="task-select">
                            <option value="">No task linked</option>
                            ${tasks.map(task => `
                                <option value="${task.id}" ${task.id === this.linkedTaskId ? 'selected' : ''}>
                                    ${task.text}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <canvas id="particle-canvas" class="particle-canvas"></canvas>
                    <div class="candle-animation-container"></div>
                </div>
            </div>
        `;
        
        this.attachEventListeners();
        this.setupCanvas();
    }

    async loadTasks() {
        try {
            const allTasks = await this.taskStorage.getAll();
            // Only show active tasks (not completed)
            return allTasks.filter(task => task.state !== 'completed');
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }

    attachEventListeners() {
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        const resetBtn = document.getElementById('reset-btn');
        const taskSelect = document.getElementById('task-select');
        
        startBtn.addEventListener('click', () => this.start());
        stopBtn.addEventListener('click', () => this.stop());
        resetBtn.addEventListener('click', () => this.reset());
        taskSelect.addEventListener('change', (e) => this.linkTask(e.target.value));
    }

    setupCanvas() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    linkTask(taskId) {
        if (taskId) {
            this.linkedTaskId = taskId;
            this.taskStorage.getAll().then(tasks => {
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    this.linkedTaskName = task.text;
                    this.updateLinkedTaskDisplay();
                }
            });
        } else {
            this.linkedTaskId = null;
            this.linkedTaskName = null;
            this.updateLinkedTaskDisplay();
        }
    }

    updateLinkedTaskDisplay() {
        const stopwatch = document.querySelector('.mystical-stopwatch');
        const existingLinked = stopwatch.querySelector('.linked-task');
        
        if (existingLinked) {
            existingLinked.remove();
        }
        
        if (this.linkedTaskName) {
            const linkedDiv = document.createElement('div');
            linkedDiv.className = 'linked-task';
            linkedDiv.textContent = `Focusing on: ${this.linkedTaskName}`;
            stopwatch.appendChild(linkedDiv);
        }
    }

    start() {
        if (this.running) return;
        
        this.running = true;
        this.startTime = Date.now() - this.elapsed;
        
        // Update button states
        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
        
        // Clear completion message
        document.querySelector('.completion-message').textContent = '';
        
        // Add running class to stopwatch for glow effect
        document.querySelector('.mystical-stopwatch')?.classList.add('running');
        
        // Start clock ticking sound
        if (window.audioManager) {
            window.audioManager.playLoopingSFX('stopwatch-ticking');
        }
        
        // Start particle emission
        this.startParticleEmission();
        
        // Show candle animation
        this.showCandleAnimation();
        
        this.animate();
    }

    stop() {
        if (!this.running) return;
        
        this.running = false;
        this.elapsed = Date.now() - this.startTime;
        
        // Update button states
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        
        // Remove running class from stopwatch
        document.querySelector('.mystical-stopwatch')?.classList.remove('running');
        
        // Stop clock ticking sound
        if (window.audioManager) {
            window.audioManager.stopLoopingSFX('stopwatch-ticking');
        }
        
        // Cancel animation frame
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Stop particle emission
        this.stopParticleEmission();
        
        // Hide candle animation
        this.hideCandleAnimation();
        
        // Save session
        this.saveSession();
        
        // Show completion message
        this.showCompletionMessage();
    }

    reset() {
        this.running = false;
        this.elapsed = 0;
        this.startTime = null;
        
        // Update button states
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        
        // Remove running class from stopwatch
        document.querySelector('.mystical-stopwatch')?.classList.remove('running');
        
        // Stop clock ticking sound
        if (window.audioManager) {
            window.audioManager.stopLoopingSFX('stopwatch-ticking');
        }
        
        // Cancel animation frame
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Stop particle emission
        this.stopParticleEmission();
        
        // Clear particles
        this.particles = [];
        
        // Hide candle animation
        this.hideCandleAnimation();
        
        // Update display
        this.updateDisplay();
        
        // Clear completion message
        document.querySelector('.completion-message').textContent = '';
    }

    animate() {
        if (!this.running) return;
        
        this.elapsed = Date.now() - this.startTime;
        this.updateDisplay();
        this.updateParticles();
        this.updateCandleAnimation();
        
        // Optimized requestAnimationFrame loop (Requirement 16.3)
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    updateDisplay() {
        const display = document.querySelector('.stopwatch-display');
        if (display) {
            display.textContent = formatDuration(this.elapsed);
        }
    }

    async saveSession() {
        const session = {
            id: uuid(),
            startTime: this.startTime,
            endTime: Date.now(),
            duration: this.elapsed,
            linkedTaskId: this.linkedTaskId,
            completed: true
        };
        
        try {
            await this.storage.save(session);
        } catch (error) {
            console.error('Error saving focus session:', error);
        }
    }

    showCompletionMessage() {
        const minutes = Math.floor(this.elapsed / 60000);
        let message = '';
        
        if (minutes < 5) {
            message = "A brief haunting... but every moment counts.";
        } else if (minutes < 15) {
            message = "The spirits approve of your focus.";
        } else if (minutes < 30) {
            message = "Impressive dedication. The chamber glows brighter.";
        } else {
            message = "Legendary focus! The ghosts bow in respect.";
        }
        
        const messageEl = document.querySelector('.completion-message');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.classList.add('visible');
        }
    }

    // Particle emission methods
    startParticleEmission() {
        this.particleInterval = setInterval(() => {
            this.emitParticle();
        }, 200); // Emit particle every 200ms
    }

    stopParticleEmission() {
        if (this.particleInterval) {
            clearInterval(this.particleInterval);
            this.particleInterval = null;
        }
    }

    emitParticle() {
        if (!this.canvas) return;
        
        const stopwatch = document.querySelector('.mystical-stopwatch');
        if (!stopwatch) return;
        
        const rect = stopwatch.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const particle = {
            x: centerX + (Math.random() - 0.5) * 100,
            y: centerY + (Math.random() - 0.5) * 100,
            vx: (Math.random() - 0.5) * 2,
            vy: -1 - Math.random() * 2,
            life: 1.0,
            decay: 0.01 + Math.random() * 0.01,
            size: 3 + Math.random() * 4,
            hue: 170 + Math.random() * 20 // Teal color range
        };
        
        this.particles.push(particle);
        
        // Limit particle count
        if (this.particles.length > 50) {
            this.particles.shift();
        }
    }

    updateParticles() {
        if (!this.canvas || !this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Performance optimization: Limit particle count (Requirement 16.1)
        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            
            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Draw particle with optimized rendering
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = `hsl(${p.hue}, 70%, 60%)`;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = `hsl(${p.hue}, 70%, 60%)`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    // Candle animation methods
    showCandleAnimation() {
        const container = document.querySelector('.candle-animation-container');
        if (!container) return;
        
        container.classList.add('visible');
        
        // Create candle SVG
        container.innerHTML = `
            <svg class="focus-candle" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                <!-- Flame -->
                <g class="candle-flame">
                    <ellipse cx="50" cy="20" rx="15" ry="25" fill="url(#flameGradient)">
                        <animate attributeName="ry" values="25;28;25" dur="0.5s" repeatCount="indefinite"/>
                        <animate attributeName="rx" values="15;13;15" dur="0.7s" repeatCount="indefinite"/>
                    </ellipse>
                    <ellipse cx="50" cy="22" rx="10" ry="15" fill="#ffeb3b" opacity="0.8">
                        <animate attributeName="ry" values="15;18;15" dur="0.6s" repeatCount="indefinite"/>
                    </ellipse>
                </g>
                
                <!-- Wick -->
                <line x1="50" y1="20" x2="50" y2="50" stroke="#333" stroke-width="2"/>
                
                <!-- Wax body -->
                <rect class="candle-wax" x="30" y="50" width="40" height="130" 
                      fill="url(#waxGradient)" transform-origin="50% 100%"/>
                
                <!-- Base -->
                <rect x="25" y="180" width="50" height="15" fill="#8b4513"/>
                
                <!-- Gradients -->
                <defs>
                    <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#ff8c42;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#ffd700;stop-opacity:0.8" />
                    </linearGradient>
                    <linearGradient id="waxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#f5e6d3;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#e8d4b8;stop-opacity:1" />
                    </linearGradient>
                </defs>
            </svg>
        `;
        
        this.candleStartTime = Date.now();
    }

    hideCandleAnimation() {
        const container = document.querySelector('.candle-animation-container');
        if (container) {
            container.classList.remove('visible');
            container.innerHTML = '';
        }
        this.candleStartTime = null;
    }

    updateCandleAnimation() {
        if (!this.candleStartTime) return;
        
        const candleWax = document.querySelector('.candle-wax');
        if (!candleWax) return;
        
        // Calculate progress (candle melts over time)
        const elapsed = Date.now() - this.candleStartTime;
        const meltDuration = 30 * 60 * 1000; // 30 minutes for full melt
        const progress = Math.min(elapsed / meltDuration, 1);
        const remaining = 1 - progress;
        
        // Update wax height
        candleWax.style.transform = `scaleY(${remaining})`;
        
        // Move flame position
        const flame = document.querySelector('.candle-flame');
        if (flame) {
            const offset = progress * 130; // 130 is the wax height
            flame.style.transform = `translateY(${offset}px)`;
        }
    }

    destroy() {
        // Stop timer if running
        if (this.running) {
            this.running = false;
        }
        
        // Cancel animation frame
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Clear particles
        this.particles = [];
    }
}
