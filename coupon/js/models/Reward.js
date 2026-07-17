/**
 * Reward Model - Rewards offered to customers
 */

class Reward extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || 'points'; // points, cashback, gift, discount
    this.value = data.value || 0;
    this.pointsRequired = data.pointsRequired || 0;
    this.minimumOrders = data.minimumOrders || 0;
    this.status = data.status || 'active';
    this.validUntil = data.validUntil || null;
    this.image = data.image || '';
    this.distributionCount = data.distributionCount || 0;
    this.redemptionCount = data.redemptionCount || 0;
  }

  static getRequiredFields() {
    return ['name', 'type', 'value'];
  }

  isValid() {
    if (!this.validUntil) return true;
    return new Date() < new Date(this.validUntil);
  }

  getRedemptionRate() {
    if (this.distributionCount === 0) return 0;
    return (this.redemptionCount / this.distributionCount) * 100;
  }
}