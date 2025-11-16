// Utility Helper Functions

// Generate UUID
export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Format date to YYYY-MM-DD
export function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format time duration (milliseconds to MM:SS)
export function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Get today's date string
export function getTodayDate() {
    return formatDate(new Date());
}

// Debounce function
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if animations should be reduced
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Get settings from localStorage
export function getSettings() {
    const savedSettings = localStorage.getItem('hauntedChamberSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
        theme: 'night',
        animationsEnabled: true,
        skeletonEnabled: true,
        plainListMode: false,
        muted: false
    };
}

// Save settings to localStorage
export function saveSettings(settings) {
    localStorage.setItem('hauntedChamberSettings', JSON.stringify(settings));
}

// Update a single setting
export function updateSetting(key, value) {
    const settings = getSettings();
    settings[key] = value;
    saveSettings(settings);
    return settings;
}
