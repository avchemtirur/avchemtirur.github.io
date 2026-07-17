/**
 * LocalStorageAdapter - Current implementation using browser LocalStorage
 * 
 * This adapter implements the storage interface for LocalStorage
 * Can be replaced with IndexedDB, SQLite, or Cloud adapter without changing code
 */

class LocalStorageAdapter {
  constructor() {
    this.prefix = 'h4_erp_';
    this.maxStorageSize = 10 * 1024 * 1024; // 10MB
    this.warningThreshold = 0.8; // Warn at 80% full
  }

  /**
   * Create record
   */
  async create(storeName, record) {
    const store = this._getStore(storeName);
    store[record.id] = record;
    this._saveStore(storeName, store);
    this._checkStorageQuota();
    return record;
  }

  /**
   * Read record
   */
  async read(storeName, id) {
    const store = this._getStore(storeName);
    return store[id] || null;
  }

  /**
   * Update record
   */
  async update(storeName, id, record) {
    const store = this._getStore(storeName);
    store[id] = record;
    this._saveStore(storeName, store);
    this._checkStorageQuota();
    return record;
  }

  /**
   * Delete record
   */
  async delete(storeName, id) {
    const store = this._getStore(storeName);
    delete store[id];
    this._saveStore(storeName, store);
    return true;
  }

  /**
   * Query records with filters
   */
  async query(storeName, filters = {}) {
    const store = this._getStore(storeName);
    const results = Object.values(store);

    return results.filter(record => {
      return Object.entries(filters).every(([key, value]) => {
        if (typeof value === 'function') {
          return value(record[key]);
        }
        return record[key] === value;
      });
    });
  }

  /**
   * Get all records
   */
  async getAll(storeName) {
    const store = this._getStore(storeName);
    return Object.values(store);
  }

  /**
   * Bulk create
   */
  async bulkCreate(storeName, records) {
    const store = this._getStore(storeName);
    records.forEach(record => {
      store[record.id] = record;
    });
    this._saveStore(storeName, store);
    this._checkStorageQuota();
    return records;
  }

  /**
   * Bulk update
   */
  async bulkUpdate(storeName, records) {
    const store = this._getStore(storeName);
    records.forEach(record => {
      store[record.id] = record;
    });
    this._saveStore(storeName, store);
    this._checkStorageQuota();
    return records;
  }

  /**
   * Bulk delete
   */
  async bulkDelete(storeName, ids) {
    const store = this._getStore(storeName);
    ids.forEach(id => {
      delete store[id];
    });
    this._saveStore(storeName, store);
    return true;
  }

  /**
   * Clear store
   */
  async clear(storeName) {
    localStorage.removeItem(this._getKey(storeName));
    return true;
  }

  /**
   * Count records
   */
  async count(storeName) {
    const store = this._getStore(storeName);
    return Object.keys(store).length;
  }

  /**
   * Export all data
   */
  async exportData() {
    const data = {};
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const storeName = key.replace(this.prefix, '');
        data[storeName] = JSON.parse(localStorage.getItem(key));
      }
    });

    return data;
  }

  /**
   * Import data
   */
  async importData(data) {
    for (const [storeName, records] of Object.entries(data)) {
      this._saveStore(storeName, records);
    }
  }

  /**
   * Get storage statistics
   */
  async getStats() {
    let totalSize = 0;
    const stores = {};

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const size = localStorage.getItem(key).length;
        totalSize += size;
        const storeName = key.replace(this.prefix, '');
        stores[storeName] = size;
      }
    });

    return {
      totalSize,
      maxSize: this.maxStorageSize,
      percentUsed: (totalSize / this.maxStorageSize) * 100,
      stores
    };
  }

  /**
   * Private helper methods
   */

  _getKey(storeName) {
    return `${this.prefix}${storeName}`;
  }

  _getStore(storeName) {
    const key = this._getKey(storeName);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  }

  _saveStore(storeName, data) {
    const key = this._getKey(storeName);
    const json = JSON.stringify(data);

    try {
      localStorage.setItem(key, json);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        throw new Error(`Storage quota exceeded for ${storeName}`);
      }
      throw error;
    }
  }

  _checkStorageQuota() {
    this.getStats().then(stats => {
      if (stats.percentUsed > this.warningThreshold * 100) {
        console.warn(`Storage usage at ${stats.percentUsed.toFixed(1)}%`);
        window.dispatchEvent(new CustomEvent('storageQuotaWarning', { detail: stats }));
      }
    });
  }
}

// Placeholder adapters for future implementations
class IndexedDBAdapter {
  async create(storeName, record) { throw new Error('Not implemented'); }
  async read(storeName, id) { throw new Error('Not implemented'); }
  // ... other methods
}

class SQLiteAdapter {
  async create(storeName, record) { throw new Error('Not implemented'); }
  async read(storeName, id) { throw new Error('Not implemented'); }
  // ... other methods
}

class CloudAdapter {
  async create(storeName, record) { throw new Error('Not implemented'); }
  async read(storeName, id) { throw new Error('Not implemented'); }
  // ... other methods
}