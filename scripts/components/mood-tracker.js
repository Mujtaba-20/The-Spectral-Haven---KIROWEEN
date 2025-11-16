// Mood Tracker Component - Daily mood tracking with visualizations

import { StorageAdapter } from '../utils/storage.js';
import { uuid, getTodayDate } from '../utils/helpers.js';

export class MoodTracker {
    constructor() {
        this.container = null;
        this.storage = new StorageAdapter('moodEntries');
        this.entries = [];
        this.currentView = 'daily'; // daily | weekly | monthly
        this.selectedMood = null;
    }

    async init() {
        await this.storage.init();
        await this.loadEntries();
    }

    async loadEntries() {
        try {
            this.entries = await this.storage.getAll();
        } catch (error) {
            console.error('Failed to load mood entries:', error);
            this.entries = [];
        }
    }

    async render() {
        await this.init();
        
        this.container = document.getElementById('page-container');
        
        this.container.innerHTML = `
            <div class="mood-tracker-page">
                <h1>Mood Grove</h1>
                <p class="subtitle">The spirits shift with your mood — choose the ghost that reflects your day.</p>
                
                <div class="view-tabs">
                    <button class="view-tab ${this.currentView === 'daily' ? 'active' : ''}" data-view="daily">Daily Entry</button>
                    <button class="view-tab ${this.currentView === 'weekly' ? 'active' : ''}" data-view="weekly">Weekly Trend</button>
                    <button class="view-tab ${this.currentView === 'monthly' ? 'active' : ''}" data-view="monthly">Monthly Calendar</button>
                </div>
                
                <div class="mood-view-container">
                    ${this.renderCurrentView()}
                </div>
                
                <div class="data-management">
                    <button class="btn btn-secondary export-csv-btn">📥 Export CSV</button>
                    <button class="btn clear-data-btn">🗑️ Clear Local Data</button>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'daily':
                return this.renderDailyView();
            case 'weekly':
                return this.renderWeeklyView();
            case 'monthly':
                return this.renderMonthlyView();
            default:
                return this.renderDailyView();
        }
    }

    renderDailyView() {
        const today = getTodayDate();
        const todayEntry = this.entries.find(e => e.date === today);
        
        return `
            <div class="daily-view">
                <div class="privacy-notice">
                    <span class="privacy-icon">🔒</span>
                    <p>Mood data is stored on this device only</p>
                </div>
                
                <div class="mood-selection-card card">
                    <h3>How are you feeling today?</h3>
                    
                    <div class="mood-ghosts">
                        <button class="mood-ghost-btn ${todayEntry?.mood === 'scared' ? 'selected' : ''}" 
                                data-mood="scared" 
                                aria-label="Scared"
                                tabindex="0">
                            <div class="ghost-icon">👻</div>
                            <span class="mood-label">Scared</span>
                        </button>
                        
                        <button class="mood-ghost-btn ${todayEntry?.mood === 'depressed' ? 'selected' : ''}" 
                                data-mood="depressed" 
                                aria-label="Depressed"
                                tabindex="0">
                            <div class="ghost-icon">😔</div>
                            <span class="mood-label">Depressed</span>
                        </button>
                        
                        <button class="mood-ghost-btn ${todayEntry?.mood === 'sad' ? 'selected' : ''}" 
                                data-mood="sad" 
                                aria-label="Sad"
                                tabindex="0">
                            <div class="ghost-icon">😢</div>
                            <span class="mood-label">Sad</span>
                        </button>
                        
                        <button class="mood-ghost-btn ${todayEntry?.mood === 'happy' ? 'selected' : ''}" 
                                data-mood="happy" 
                                aria-label="Happy"
                                tabindex="0">
                            <div class="ghost-icon">😊</div>
                            <span class="mood-label">Happy</span>
                        </button>
                        
                        <button class="mood-ghost-btn ${todayEntry?.mood === 'excited' ? 'selected' : ''}" 
                                data-mood="excited" 
                                aria-label="Excited"
                                tabindex="0">
                            <div class="ghost-icon">🤩</div>
                            <span class="mood-label">Excited</span>
                        </button>
                    </div>
                    
                    <div class="mood-note-section">
                        <label for="mood-note">Optional note:</label>
                        <textarea 
                            id="mood-note" 
                            class="input textarea" 
                            placeholder="Add a note about your day..."
                            rows="3">${todayEntry?.note || ''}</textarea>
                    </div>
                    
                    <button class="btn btn-primary save-mood-btn" ${!this.selectedMood && !todayEntry ? 'disabled' : ''}>
                        ${todayEntry ? 'Update Mood' : 'Save Mood'}
                    </button>
                </div>
                
                ${todayEntry ? `
                    <div class="today-mood-display">
                        <p>Today's mood: <strong>${todayEntry.mood.charAt(0).toUpperCase() + todayEntry.mood.slice(1)}</strong></p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderWeeklyView() {
        const weekData = this.getLastSevenDays();
        
        if (weekData.every(day => !day.entry)) {
            return `
                <div class="weekly-view">
                    <div class="card">
                        <p class="no-data-message">No mood entries for the past 7 days. Start tracking your mood to see trends!</p>
                    </div>
                </div>
            `;
        }
        
        const maxScore = 5;
        
        return `
            <div class="weekly-view">
                <div class="weekly-chart-container">
                    <h3 class="weekly-chart-title">7-Day Mood Trend</h3>
                    
                    <div class="sparkline-container">
                        ${weekData.map(day => {
                            const score = day.entry?.score || 0;
                            const height = score > 0 ? (score / maxScore) * 100 : 10;
                            const dateLabel = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                            
                            return `
                                <div class="sparkline-bar" style="height: ${height}%;" title="${day.date}: ${day.entry?.mood || 'No entry'}">
                                    ${score > 0 ? `<span class="sparkline-bar-value">${score}</span>` : ''}
                                    <span class="sparkline-bar-label">${dateLabel}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div class="card">
                    <h3>Weekly Summary</h3>
                    <div class="weekly-stats">
                        ${this.renderWeeklyStats(weekData)}
                    </div>
                </div>
            </div>
        `;
    }

    getLastSevenDays() {
        const days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = getTodayDate.call({ formatDate: (d) => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }}, date);
            
            // Format date properly
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            
            const entry = this.entries.find(e => e.date === formattedDate);
            days.push({ date: formattedDate, entry });
        }
        
        return days;
    }

    renderWeeklyStats(weekData) {
        const entriesWithData = weekData.filter(d => d.entry);
        
        if (entriesWithData.length === 0) {
            return '<p>No data to display</p>';
        }
        
        const avgScore = entriesWithData.reduce((sum, d) => sum + d.entry.score, 0) / entriesWithData.length;
        const mostCommonMood = this.getMostCommonMood(entriesWithData);
        
        return `
            <p><strong>Days tracked:</strong> ${entriesWithData.length} / 7</p>
            <p><strong>Average mood score:</strong> ${avgScore.toFixed(1)} / 5</p>
            <p><strong>Most common mood:</strong> ${mostCommonMood}</p>
        `;
    }

    getMostCommonMood(entriesWithData) {
        if (entriesWithData.length === 0) return 'None';
        
        const moodCounts = {};
        entriesWithData.forEach(d => {
            const mood = d.entry.mood;
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        
        let maxCount = 0;
        let mostCommon = '';
        
        for (const [mood, count] of Object.entries(moodCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = mood;
            }
        }
        
        return mostCommon.charAt(0).toUpperCase() + mostCommon.slice(1);
    }

    renderMonthlyView() {
        const currentDate = this.currentMonthDate || new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        return `
            <div class="monthly-view">
                <div class="calendar-header">
                    <button class="calendar-nav-btn prev-month" aria-label="Previous month">◀</button>
                    <h3 class="calendar-title">${monthName}</h3>
                    <button class="calendar-nav-btn next-month" aria-label="Next month">▶</button>
                </div>
                
                <div class="calendar-grid">
                    ${this.renderCalendarDayHeaders()}
                    ${this.renderCalendarDays(year, month)}
                </div>
            </div>
        `;
    }

    renderCalendarDayHeaders() {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.map(day => `<div class="calendar-day-header">${day}</div>`).join('');
    }

    renderCalendarDays(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        
        let html = '';
        
        // Previous month's days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            html += `<div class="calendar-day other-month"><span class="calendar-day-number">${day}</span></div>`;
        }
        
        // Current month's days
        const today = getTodayDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const entry = this.entries.find(e => e.date === dateStr);
            const isToday = dateStr === today;
            
            const moodEmoji = this.getMoodEmoji(entry?.mood);
            
            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${entry ? 'has-mood' : ''}" 
                     data-date="${dateStr}" 
                     ${entry ? `data-score="${entry.score}"` : ''}>
                    <span class="calendar-day-number">${day}</span>
                    ${entry ? `<span class="calendar-day-mood">${moodEmoji}</span>` : ''}
                    ${entry ? this.renderCalendarTooltip(entry) : ''}
                </div>
            `;
        }
        
        // Next month's days to fill the grid
        const totalCells = startingDayOfWeek + daysInMonth;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let day = 1; day <= remainingCells; day++) {
            html += `<div class="calendar-day other-month"><span class="calendar-day-number">${day}</span></div>`;
        }
        
        return html;
    }

    getMoodEmoji(mood) {
        const emojis = {
            scared: '👻',
            depressed: '😔',
            sad: '😢',
            happy: '😊',
            excited: '🤩'
        };
        return emojis[mood] || '';
    }

    renderCalendarTooltip(entry) {
        const moodLabel = entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1);
        return `
            <div class="calendar-tooltip">
                <div class="calendar-tooltip-mood">${moodLabel}</div>
                ${entry.note ? `<div class="calendar-tooltip-note">${entry.note}</div>` : ''}
            </div>
        `;
    }

    attachEventListeners() {
        // View tab switching
        const tabs = this.container.querySelectorAll('.view-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.currentView = e.target.dataset.view;
                this.render();
            });
        });

        // Mood ghost button selection
        const moodBtns = this.container.querySelectorAll('.mood-ghost-btn');
        moodBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mood = e.currentTarget.dataset.mood;
                this.selectedMood = mood;
                
                // Update UI
                moodBtns.forEach(b => b.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                
                // Enable save button
                const saveBtn = this.container.querySelector('.save-mood-btn');
                if (saveBtn) saveBtn.disabled = false;
            });

            // Keyboard navigation
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const btns = Array.from(moodBtns);
                    const currentIndex = btns.indexOf(btn);
                    let nextIndex;
                    
                    if (e.key === 'ArrowRight') {
                        nextIndex = (currentIndex + 1) % btns.length;
                    } else {
                        nextIndex = (currentIndex - 1 + btns.length) % btns.length;
                    }
                    
                    btns[nextIndex].focus();
                }
            });
        });

        // Save mood button
        const saveBtn = this.container.querySelector('.save-mood-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                const today = getTodayDate();
                const todayEntry = this.entries.find(e => e.date === today);
                const mood = this.selectedMood || todayEntry?.mood;
                const note = this.container.querySelector('#mood-note')?.value || '';
                
                if (mood) {
                    await this.recordMood(mood, note);
                }
            });
        }

        // Month navigation
        const prevMonthBtn = this.container.querySelector('.prev-month');
        const nextMonthBtn = this.container.querySelector('.next-month');
        
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                if (!this.currentMonthDate) {
                    this.currentMonthDate = new Date();
                }
                this.currentMonthDate.setMonth(this.currentMonthDate.getMonth() - 1);
                this.render();
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                if (!this.currentMonthDate) {
                    this.currentMonthDate = new Date();
                }
                this.currentMonthDate.setMonth(this.currentMonthDate.getMonth() + 1);
                this.render();
            });
        }

        // Export CSV button
        const exportBtn = this.container.querySelector('.export-csv-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportCSV();
            });
        }

        // Clear data button
        const clearBtn = this.container.querySelector('.clear-data-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', async () => {
                await this.clearData();
            });
        }
    }

    exportCSV() {
        if (this.entries.length === 0) {
            alert('No mood data to export.');
            return;
        }

        const csv = this.generateCSV(this.entries);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mood-tracker-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    generateCSV(entries) {
        const headers = 'Date,Mood,Score,Note\n';
        const rows = entries
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(e => `${e.date},${e.mood},${e.score},"${(e.note || '').replace(/"/g, '""')}"`)
            .join('\n');
        return headers + rows;
    }

    async clearData() {
        const confirmed = confirm('Are you sure you want to delete all mood data? This cannot be undone.');
        
        if (confirmed) {
            try {
                await this.storage.clear();
                this.entries = [];
                await this.render();
                alert('All mood data has been cleared.');
            } catch (error) {
                console.error('Failed to clear mood data:', error);
                alert('Failed to clear mood data. Please try again.');
            }
        }
    }

    getMoodScore(mood) {
        const scores = {
            scared: 1,
            depressed: 2,
            sad: 3,
            happy: 4,
            excited: 5
        };
        return scores[mood] || 0;
    }

    async recordMood(mood, note = '') {
        const today = getTodayDate();
        const existing = this.entries.find(e => e.date === today);
        
        const entry = {
            id: existing?.id || uuid(),
            date: today,
            mood,
            score: this.getMoodScore(mood),
            note,
            timestamp: Date.now()
        };
        
        try {
            await this.storage.save(entry);
            
            if (existing) {
                const index = this.entries.findIndex(e => e.id === existing.id);
                this.entries[index] = entry;
            } else {
                this.entries.push(entry);
            }
            
            await this.render();
        } catch (error) {
            console.error('Failed to save mood entry:', error);
        }
    }

    destroy() {
        // Cleanup if needed
    }
}
