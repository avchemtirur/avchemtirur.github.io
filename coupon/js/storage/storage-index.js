/**
 * Storage module barrel export
 * Simplifies imports: import { db } from './storage/storage-index.js'
 */

const db = window.__h4DatabaseService;

export { db, DatabaseService, LocalStorageAdapter };