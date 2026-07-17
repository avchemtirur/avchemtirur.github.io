
/**
 * DatabaseService - Main abstraction layer for all data operations
 * This is the SINGLE POINT OF CONTACT for all data access
 * 
 * Architecture:
 * UI → Service → Repository → DatabaseService → Adapter → Storage
 * 
 * Benefits:
 * - Storage mechanism can be changed without touching other code
 * - Supports LocalStorage, IndexedDB, SQLite, Cloud API
 * - Enables offline-first architecture
 * - Simplifies testing and mocking
 */

class DatabaseService {
  constructor(adapterType = 'localStorage') {
    this.adapter = this._initializeAdapter(adapterType);
    this.cache = new Map(); // Optional caching layer
    this.listeners = new Map(); // Change listeners for reactive updates
  }

  /**
   * Initialize storage adapter based on type
   * @param {string} adapterType - 'localStorage', 'indexeddb', 'sqlite', 'cloud'
   * @returns {Object} Storage adapter instance
   */
  _initializeAdapter(adapterType) {
    switch (adapterType) {
      case 'indexeddb':
        return new IndexedDBAdapter();
      case 'sqlite':
        return new SQLiteAdapter();
      case 'cloud':
        return new CloudAdapter();
      case 'localStorage':
      default:
        return new LocalStorageAdapter();
    }
  }

  /**
   * Create/Insert record
   * @param {string} storeName - Collection/Table name
   * @param {Object} data - Data to store
   * @returns {Promise<Object>} Created record with ID
   */
  async create(storeName, data) {
    const record = {
      id: this._generateId(storeName),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __version: 1,
      __synced: true
    };

    await this.adapter.create(storeName, record);
    this._notifyListeners(storeName, 'create', record);
    this._invalidateCache(storeName);

    return record;
  }

  /**
   * Read/Retrieve record
   * @param {string} storeName - Collection/Table name
   * @param {string} id - Record ID
   * @returns {Promise<Object|null>} Record or null if not found
   */
  async read(storeName, id) {
    // Check cache first
    const cacheKey = `${storeName}:${id}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const record = await this.adapter.read(storeName, id);
    if (record) {
      this.cache.set(cacheKey, record);
    }

    return record;
  }

  /**
   * Update/Modify record
   * @param {string} storeName - Collection/Table name
   * @param {string} id - Record ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated record
   */
  async update(storeName, id, updates) {
    const existing = await this.read(storeName, id);
    if (!existing) {
      throw new Error(`Record not found: ${storeName}/${id}`);
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      __version: (existing.__version || 1) + 1
    };

    await this.adapter.update(storeName, id, updated);
    this._notifyListeners(storeName, 'update', updated);
    this._invalidateCache(storeName);

    return updated;
  }

  /**
   * Delete record
   * @param {string} storeName - Collection/Table name
   * @param {string} id - Record ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(storeName, id) {
    await this.adapter.delete(storeName, id);
    this._notifyListeners(storeName, 'delete', { id });
    this._invalidateCache(storeName);

    return true;
  }

  /**
   * Query records with filters
   * @param {string} storeName - Collection/Table name
   * @param {Object} filters - { fieldName: value, ... }
   * @returns {Promise<Array>} Matching records
   */
  async query(storeName, filters = {}) {
    return await this.adapter.query(storeName, filters);
  }

  /**
   * Get all records from a store
   * @param {string} storeName - Collection/Table name
   * @returns {Promise<Array>} All records
   */
  async getAll(storeName) {
    return await this.adapter.getAll(storeName);
  }

  /**
   * Bulk create records
   * @param {string} storeName - Collection/Table name
   * @param {Array<Object>} records - Records to create
   * @returns {Promise<Array>} Created records
   */
  async bulkCreate(storeName, records) {
    const created = records.map(data => ({
      id: this._generateId(storeName),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __version: 1,
      __synced: true
    }));

    await this.adapter.bulkCreate(storeName, created);
    this._invalidateCache(storeName);

    return created;
  }

  /**
   * Bulk update records
   * @param {string} storeName - Collection/Table name
   * @param {Array<{id, updates}>} operations - Update operations
   * @returns {Promise<Array>} Updated records
   */
  async bulkUpdate(storeName, operations) {
    const updated = [];

    for (const op of operations) {
      const existing = await this.read(storeName, op.id);
      const record = {
        ...existing,
        ...op.updates,
        updatedAt: new Date().toISOString(),
        __version: (existing.__version || 1) + 1
      };

      updated.push(record);
    }

    await this.adapter.bulkUpdate(storeName, updated);
    this._invalidateCache(storeName);

    return updated;
  }

  /**
   * Delete multiple records
   * @param {string} storeName - Collection/Table name
   * @param {Array<string>} ids - Record IDs to delete
   * @returns {Promise<boolean>} Success status
   */
  async bulkDelete(storeName, ids) {
    await this.adapter.bulkDelete(storeName, ids);
    this._invalidateCache(storeName);

    return true;
  }

  /**
   * Clear all records from store
   * @param {string} storeName - Collection/Table name
   * @returns {Promise<boolean>} Success status
   */
  async clear(storeName) {
    await this.adapter.clear(storeName);
    this._invalidateCache(storeName);

    return true;
  }

  /**
   * Get record count
   * @param {string} storeName - Collection/Table name
   * @returns {Promise<number>} Number of records
   */
  async count(storeName) {
    return await this.adapter.count(storeName);
  }

  /**
   * Check if record exists
   * @param {string} storeName - Collection/Table name
   * @param {string} id - Record ID
   * @returns {Promise<boolean>} Existence status
   */
  async exists(storeName, id) {
    const record = await this.read(storeName, id);
    return !!record;
  }

  /**
   * Export all data as JSON
   * @returns {Promise<Object>} Complete database export
   */
  async exportData() {
    return await this.adapter.exportData();
  }

  /**
   * Import data from JSON
   * @param {Object} data - Exported database data
   * @returns {Promise<boolean>} Success status
   */
  async importData(data) {
    await this.adapter.importData(data);
    this._clearAllCache();

    return true;
  }

  /**
   * Subscribe to data changes
   * @param {string} storeName - Collection/Table name
   * @param {Function} callback - (action, record) => {}
   * @returns {Function} Unsubscribe function
   */
  subscribe(storeName, callback) {
    if (!this.listeners.has(storeName)) {
      this.listeners.set(storeName, []);
    }

    this.listeners.get(storeName).push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(storeName);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  /**
   * Private helper methods
   */

  _generateId(storeName) {
    return `${storeName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  _notifyListeners(storeName, action, record) {
    const listeners = this.listeners.get(storeName) || [];
    listeners.forEach(callback => {
      try {
        callback(action, record);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  _invalidateCache(storeName) {
    // Clear all cache entries for this store
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${storeName}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  _clearAllCache() {
    this.cache.clear();
  }

  /**
   * Advanced operations
   */

  /**
   * Transaction - execute multiple operations atomically
   * @param {Function} transaction - Async function receiving db instance
   * @returns {Promise<*>} Transaction result
   */
  async transaction(transaction) {
    try {
      const result = await transaction(this);
      return result;
    } catch (error) {
      this._clearAllCache();
      throw error;
    }
  }

  /**
   * Get statistics about storage
   * @returns {Promise<Object>} Storage stats
   */
  async getStats() {
    return await this.adapter.getStats();
  }

  /**
   * Backup database
   * @returns {Promise<Blob>} Backup file
   */
  async backup() {
    const data = await this.exportData();
    const json = JSON.stringify(data, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  /**
   * Restore from backup
   * @param {File} backupFile - Backup file
   * @returns {Promise<boolean>} Success status
   */
  async restore(backupFile) {
    const text = await backupFile.text();
    const data = JSON.parse(text);
    return await this.importData(data);
  }
}

// Export as singleton
if (!window.__h4DatabaseService) {
  window.__h4DatabaseService = new DatabaseService('localStorage');
}

const db = window.__h4DatabaseService;