/**
 * BaseRepository
 * Common CRUD operations for all repositories
 */

class BaseRepository {
  constructor(storeName, databaseService) {
    this.storeName = storeName;
    this.db = databaseService;
  }

  async create(data) {
    return await this.db.create(this.storeName, data);
  }

  async findById(id) {
    return await this.db.read(this.storeName, id);
  }

  async update(id, data) {
    return await this.db.update(this.storeName, id, data);
  }

  async delete(id) {
    return await this.db.delete(this.storeName, id);
  }

  async findAll() {
    return await this.db.getAll(this.storeName);
  }

  async find(filters = {}) {
    return await this.db.query(this.storeName, filters);
  }

  async count() {
    return await this.db.count(this.storeName);
  }

  async clear() {
    return await this.db.clear(this.storeName);
  }

  async bulkCreate(records) {
    return await this.db.bulkCreate(this.storeName, records);
  }

  async bulkUpdate(records) {
    return await this.db.bulkUpdate(this.storeName, records);
  }

  async bulkDelete(ids) {
    return await this.db.bulkDelete(this.storeName, ids);
  }
}