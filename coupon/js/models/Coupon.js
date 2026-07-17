/**
 * Coupon Model - QR coupon data
 */

class Coupon extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.code = data.code || '';
    this.qrCode = data.qrCode || '';
    this.productId = data.productId || '';
    this.batchId = data.batchId || '';
    this.dealerId = data.dealerId || null; // Issued to dealer
    this.customerId = data.customerId || null; // Scanned by customer
    this.status = data.status || 'active'; // active, scanned, expired, blacklisted
    this.expiryDate = data.expiryDate || null;
    this.scannedAt = data.scannedAt || null;
    this.pointsValue = data.pointsValue || 50;
    this.isBlacklisted = data.isBlacklisted || false;
    this.blacklistedReason = data.blacklistedReason || '';
  }

  static getRequiredFields() {
    return ['code', 'productId', 'batchId'];
  }

  isExpired() {
    if (!this.expiryDate) return false;
    return new Date() > new Date(this.expiryDate);
  }

  isScanned() {
    return this.status === 'scanned' || this.scannedAt !== null;
  }

  canBeScanned() {
    return this.status === 'active' && !this.isExpired() && !this.isBlacklisted;
  }

  scan(customerId) {
    this.status = 'scanned';
    this.customerId = customerId;
    this.scannedAt = new Date().toISOString();
    return this;
  }

  blacklist(reason = '') {
    this.isBlacklisted = true;
    this.blacklistedReason = reason;
    this.status = 'blacklisted';
    return this;
  }
}