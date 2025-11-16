// Haunted To-Do Component - Task management with ghost animations

import { uuid, getSettings } from '../utils/helpers.js';

export class HauntedToDo {
    constructor() {
        this.container = null;
        this.tasks = [];
        this.settings = getSettings();
        this.whisperPhrases = [
            "I'm waiting...",
            "Don't forget me...",
            "Set me free...",
            "Complete me, please...",
            "I haunt your to-do list...",
            "Release me from this list...",
            "Your procrastination feeds me...",
            "I grow stronger with delay..."
        ];
        this.taskEmojis = [
            '👻', '💀', '🎃', '🕷️', '🦇', '🕸️', '🌙', '⭐', 
            '🔮', '🧙', '🧛', '🧟', '👹', '👺', '🌟', '✨',
            '🕯️', '🪦', '⚰️', '🗝️', '📿', '🦉', '🐈‍⬛', '🌑'
        ];
    }

    async init() {
        await this.loadTasks();
    }

    async loadTasks() {
        try {
            const tasksJson = localStorage.getItem('tasks');
            if (tasksJson) {
                this.tasks = JSON.parse(tasksJson);
                // Update overdue states
                this.updateTaskStates();
            }
        } catch (e) {
            console.error('Error loading tasks:', e);
            this.tasks = [];
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        } catch (e) {
            console.error('Error saving tasks:', e);
        }
    }

    updateTaskStates() {
        const now = Date.now();
        this.tasks.forEach(task => {
            if (task.state !== 'completed' && task.dueAt && task.dueAt < now) {
                task.state = 'overdue';
            } else if (task.state === 'new') {
                // Keep as new for a short time, then transition to active
                const newDuration = 2000; // 2 seconds
                if (now - task.createdAt > newDuration) {
                    task.state = 'active';
                }
            }
        });
    }

    getRandomEmoji() {
        return this.taskEmojis[Math.floor(Math.random() * this.taskEmojis.length)];
    }

    addTask(text) {
        if (!text || !text.trim()) return;

        const task = {
            id: uuid(),
            text: text.trim(),
            state: 'new',
            createdAt: Date.now(),
            dueAt: null,
            completedAt: null,
            emoji: this.getRandomEmoji()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateFog();

        // Transition from 'new' to 'active' after animation
        setTimeout(() => {
            const taskObj = this.tasks.find(t => t.id === task.id);
            if (taskObj && taskObj.state === 'new') {
                taskObj.state = 'active';
                this.saveTasks();
                this.renderTasks();
            }
        }, 2000);
    }

    editTask(id, newText) {
        const task = this.tasks.find(t => t.id === id);
        if (task && newText && newText.trim()) {
            task.text = newText.trim();
            this.saveTasks();
            this.renderTasks();
        }
    }

    completeTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task && task.state !== 'completed') {
            task.state = 'completed';
            task.completedAt = Date.now();
            this.saveTasks();
            
            // Play completion sound
            if (window.audioManager) {
                window.audioManager.playSFX('task-complete');
            }
            
            // Animate completion
            this.animateTaskCompletion(id);
            
            // Update fog after animation
            setTimeout(() => {
                this.updateFog();
            }, 1500);
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updateFog();
    }

    animateTaskCompletion(id) {
        const taskElement = document.querySelector(`[data-task-id="${id}"]`);
        if (taskElement) {
            taskElement.classList.add('completing');
            
            setTimeout(() => {
                this.renderTasks();
            }, 1500);
        }
    }

    updateFog() {
        const incompleteTasks = this.tasks.filter(t => t.state !== 'completed').length;
        const opacity = Math.min(0.8, incompleteTasks * 0.1);
        
        const fogOverlay = document.querySelector('.fog-overlay');
        if (fogOverlay) {
            fogOverlay.style.opacity = opacity;
        }
    }

    getRandomWhisper() {
        return this.whisperPhrases[Math.floor(Math.random() * this.whisperPhrases.length)];
    }

    async render() {
        this.container = document.getElementById('page-container');
        
        await this.init();
        
        this.container.innerHTML = `
            <div class="haunted-todo-page">
                <div class="fog-overlay"></div>
                
                <h1>Haunted To-Do List</h1>
                <p class="subtitle">Every task here becomes a wandering spirit. Free them one by one.</p>
                
                <div class="card task-input-card">
                    <div class="task-input-container">
                        <input 
                            type="text" 
                            id="new-task-input" 
                            class="task-input" 
                            placeholder="What haunts your mind today?"
                            maxlength="200"
                            aria-label="New task description"
                        />
                        <button id="add-task-btn" class="btn btn-primary" aria-label="Add new task">
                            Add Task
                        </button>
                    </div>
                </div>

                <div class="view-toggle-container">
                    <button id="toggle-view-btn" class="btn btn-secondary">
                        ${this.settings.plainListMode ? 'Show Ghost View' : 'Show Plain List'}
                    </button>
                </div>
                
                <div class="task-counter">
                    No. of tasks: <span id="task-count">${this.tasks.filter(t => t.state !== 'completed').length}</span>
                </div>
                
                <div id="tasks-container" class="tasks-container ${this.settings.plainListMode ? 'plain-list-mode' : 'ghost-mode'}">
                    ${this.renderTasksHTML()}
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.updateFog();
        this.updateTaskCounter();
    }

    renderTasks() {
        const tasksContainer = document.getElementById('tasks-container');
        if (tasksContainer) {
            tasksContainer.innerHTML = this.renderTasksHTML();
            this.attachTaskEventListeners();
        }
        this.updateTaskCounter();
    }
    
    updateTaskCounter() {
        const taskCountEl = document.getElementById('task-count');
        if (taskCountEl) {
            const activeTaskCount = this.tasks.filter(t => t.state !== 'completed').length;
            taskCountEl.textContent = activeTaskCount;
        }
    }

    renderTasksHTML() {
        if (this.tasks.length === 0) {
            return `
                <div class="empty-state">
                    <p>No spirits haunt this list yet...</p>
                    <p class="empty-hint">Add a task above to summon your first ghost.</p>
                </div>
            `;
        }

        if (this.settings.plainListMode) {
            return this.renderPlainList();
        } else {
            return this.renderGhostView();
        }
    }

    renderGhostView() {
        const activeTasks = this.tasks.filter(t => t.state !== 'completed');
        
        return `
            <div class="ghost-tasks">
                ${activeTasks.map(task => this.renderGhostTask(task)).join('')}
            </div>
        `;
    }

    renderGhostTask(task) {
        const stateClass = `ghost-${task.state}`;
        const whisper = this.getRandomWhisper();
        const emoji = task.emoji || this.getRandomEmoji();
        
        return `
            <div class="ghost-task ${stateClass}" data-task-id="${task.id}" data-whisper="${whisper}">
                <div class="ghost-visual">
                    <div class="task-emoji">${emoji}</div>
                </div>
                <div class="ghost-task-content">
                    <div class="task-text" data-task-id="${task.id}">${this.escapeHtml(task.text)}</div>
                    <div class="task-actions">
                        <button class="btn-icon edit-task-btn" data-task-id="${task.id}" title="Edit task" aria-label="Edit task: ${this.escapeHtml(task.text)}">
                            ✏️
                        </button>
                        <button class="btn-icon complete-task-btn" data-task-id="${task.id}" title="Complete task" aria-label="Complete task: ${this.escapeHtml(task.text)}">
                            ✓
                        </button>
                        <button class="btn-icon delete-task-btn" data-task-id="${task.id}" title="Delete task" aria-label="Delete task: ${this.escapeHtml(task.text)}">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="ghost-whisper">${whisper}</div>
            </div>
        `;
    }

    renderPlainList() {
        const activeTasks = this.tasks.filter(t => t.state !== 'completed');
        
        return `
            <ul class="plain-task-list">
                ${activeTasks.map(task => this.renderPlainTask(task)).join('')}
            </ul>
        `;
    }

    renderPlainTask(task) {
        const stateLabel = task.state === 'overdue' ? ' (overdue)' : '';
        const emoji = task.emoji || this.getRandomEmoji();
        
        return `
            <li class="plain-task-item" data-task-id="${task.id}">
                <div class="plain-task-content">
                    <span class="task-emoji-plain">${emoji}</span>
                    <span class="task-text">${this.escapeHtml(task.text)}${stateLabel}</span>
                    <div class="task-actions">
                        <button class="btn-icon edit-task-btn" data-task-id="${task.id}" title="Edit task" aria-label="Edit task: ${this.escapeHtml(task.text)}">
                            ✏️
                        </button>
                        <button class="btn-icon complete-task-btn" data-task-id="${task.id}" title="Complete task" aria-label="Complete task: ${this.escapeHtml(task.text)}">
                            ✓
                        </button>
                        <button class="btn-icon delete-task-btn" data-task-id="${task.id}" title="Delete task" aria-label="Delete task: ${this.escapeHtml(task.text)}">
                            🗑️
                        </button>
                    </div>
                </div>
            </li>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    attachEventListeners() {
        // Add task button
        const addBtn = document.getElementById('add-task-btn');
        const input = document.getElementById('new-task-input');
        
        if (addBtn && input) {
            addBtn.addEventListener('click', () => {
                this.addTask(input.value);
                input.value = '';
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addTask(input.value);
                    input.value = '';
                }
            });
        }

        // View toggle button
        const toggleBtn = document.getElementById('toggle-view-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.settings.plainListMode = !this.settings.plainListMode;
                
                // Save setting
                const savedSettings = localStorage.getItem('hauntedChamberSettings');
                const settings = savedSettings ? JSON.parse(savedSettings) : {};
                settings.plainListMode = this.settings.plainListMode;
                localStorage.setItem('hauntedChamberSettings', JSON.stringify(settings));
                
                // Update view
                toggleBtn.textContent = this.settings.plainListMode ? 'Show Ghost View' : 'Show Plain List';
                const tasksContainer = document.getElementById('tasks-container');
                if (tasksContainer) {
                    tasksContainer.className = `tasks-container ${this.settings.plainListMode ? 'plain-list-mode' : 'ghost-mode'}`;
                }
                this.renderTasks();
            });
        }

        this.attachTaskEventListeners();
    }

    attachTaskEventListeners() {
        // Complete buttons
        document.querySelectorAll('.complete-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = btn.getAttribute('data-task-id');
                this.completeTask(taskId);
            });
        });

        // Edit buttons
        document.querySelectorAll('.edit-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = btn.getAttribute('data-task-id');
                this.startEditTask(taskId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = btn.getAttribute('data-task-id');
                if (confirm('Delete this task?')) {
                    this.deleteTask(taskId);
                }
            });
        });
    }

    startEditTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const taskTextEl = document.querySelector(`.task-text[data-task-id="${taskId}"]`);
        if (!taskTextEl) return;

        const currentText = task.text;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-edit-input';
        input.value = currentText;
        input.maxLength = 200;

        taskTextEl.replaceWith(input);
        input.focus();
        input.select();

        const finishEdit = () => {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                this.editTask(taskId, newText);
            } else {
                this.renderTasks();
            }
        };

        input.addEventListener('blur', finishEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                finishEdit();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.renderTasks();
            }
        });
    }

    destroy() {
        // Cleanup if needed
    }
}
