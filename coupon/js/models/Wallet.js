/**
 * Wallet Model - Customer reward wallet (points, cashback, gifts)
 */

class Wallet extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.customerId = data.customerId || '';
    this.points = data.points || 0;
    this.cashback = data.cashback || 0;
    this.gifts = data.gifts || [];
    this.totalEarned = data.totalEarned || 0;
    this.totalRedeemed = data.totalRedeemed || 0;
    this.lastTransactionAt = data.lastTransactionAt || null;
  }

  static getRequiredFields() {
    return ['customerId'];
  }

  getBalance() {
    return {
      points: this.points,
      cashback: this.cashback,
      gifts: this.gifts.length
    };
  }

  addPoints(points) {
    this.points += points;
    this.totalEarned += points;
    this.lastTransactionAt = new Date().toISOString();
  }

  addCashback(amount) {
    this.cashback += amount;
    this.totalEarned += amount;
    this.lastTransactionAt = new Date().toISOString();
  }

  redeemPoints(points) {
    if (this.points < points) {
      throw new Error('Insufficient points');
    }
    this.points -= points;
    this.totalRedeemed += points;
    this.lastTransactionAt = new Date().toISOString();
  }
}