// Storage Utilities - IndexedDB and localStorage helpers

export class StorageAdapter {
    constructor(storeName) {
        this.storeName = storeName;
        this.useIndexedDB = 'indexedDB' in window;
        this.db = null;
    }

    async init() {
        if (this.useIndexedDB) {
            await this.initIndexedDB();
        }
    }

    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('HauntedChamberDB', 1);

            request.onerror = () => {
                console.warn('IndexedDB failed, falling back to localStorage');
                this.useIndexedDB = false;
                resolve();
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores if they don't exist
                if (!db.objectStoreNames.contains('moodEntries')) {
                    const moodStore = db.createObjectStore('moodEntries', { keyPath: 'id' });
                    moodStore.createIndex('date', 'date', { unique: false });
                    moodStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('tasks')) {
                    db.createObjectStore('tasks', { keyPath: 'id' });
                }
                
                if (!db.objectStoreNames.contains('focusSessions')) {
                    db.createObjectStore('focusSessions', { keyPath: 'id' });
                }
            };
        });
    }

    async getAll() {
        if (this.useIndexedDB && this.db) {
            return this.getAllFromIndexedDB();
        } else {
            return this.getAllFromLocalStorage();
        }
    }

    async getAllFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    getAllFromLocalStorage() {
        const data = localStorage.getItem(this.storeName);
        return data ? JSON.parse(data) : [];
    }

    async save(item) {
        if (this.useIndexedDB && this.db) {
            return this.saveToIndexedDB(item);
        } else {
            return this.saveToLocalStorage(item);
        }
    }

    async saveToIndexedDB(item) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(item);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveToLocalStorage(item) {
        const items = await this.getAllFromLocalStorage();
        const index = items.findIndex(i => i.id === item.id);
        
        if (index >= 0) {
            items[index] = item;
        } else {
            items.push(item);
        }
        
        localStorage.setItem(this.storeName, JSON.stringify(items));
        return item.id;
    }

    async delete(id) {
        if (this.useIndexedDB && this.db) {
            return this.deleteFromIndexedDB(id);
        } else {
            return this.deleteFromLocalStorage(id);
        }
    }

    async deleteFromIndexedDB(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async deleteFromLocalStorage(id) {
        const items = await this.getAllFromLocalStorage();
        const filtered = items.filter(i => i.id !== id);
        localStorage.setItem(this.storeName, JSON.stringify(filtered));
    }

    async clear() {
        if (this.useIndexedDB && this.db) {
            return this.clearIndexedDB();
        } else {
            return this.clearLocalStorage();
        }
    }

    async clearIndexedDB() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clearLocalStorage() {
        localStorage.removeItem(this.storeName);
    }
}
