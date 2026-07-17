/**
 * CouponRepository - Data access for coupons
 */

class CouponRepository extends BaseRepository {
  constructor(db) {
    super('coupons', Coupon, db);
  }

  /**
   * Find by code (most common lookup)
   */
  async findByCode(code) {
    return await this.findOne({ code });
  }

  /**
   * Find by batch
   */
  async findByBatch(batchId) {
    return await this.find({ batchId });
  }

  /**
   * Find by dealer (issued to)
   */
  async findByDealer(dealerId) {
    return await this.find({ dealerId });
  }

  /**
   * Find by customer (scanned by)
   */
  async findByCustomer(customerId) {
    return await this.find({ customerId });
  }

  /**
   * Find by status
   */
  async findByStatus(status) {
    return await this.find({ status });
  }

  /**
   * Find active coupons
   */
  async findActive() {
    const coupons = await this.findByStatus('active');
    return coupons.filter(c => !c.isExpired());
  }

  /**
   * Find expired coupons
   */
  async findExpired() {
    const all = await this.getAll();
    return all.filter(c => c.isExpired());
  }

  /**
   * Find blacklisted coupons
   */
  async findBlacklisted() {
    return await this.find({ isBlacklisted: true });
  }

  /**
   * Get coupon statistics
   */
  async getCouponStats() {
    const all = await this.getAll();

    return {
      total: all.length,
      active: all.filter(c => c.status === 'active').length,
      scanned: all.filter(c => c.isScanned()).length,
      expired: all.filter(c => c.isExpired()).length,
      blacklisted: all.filter(c => c.isBlacklisted).length,
      scanRate: (all.filter(c => c.isScanned()).length / all.length) * 100
    };
  }

  /**
   * Scan coupon
   */
  async scanCoupon(couponCode, customerId) {
    const coupon = await this.findByCode(couponCode);

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    if (!coupon.canBeScanned()) {
      throw new Error('Coupon cannot be scanned');
    }

    coupon.scan(customerId);
    return await this.update(coupon.id, coupon.toJSON());
  }

  /**
   * Blacklist coupon
   */
  async blacklistCoupon(id, reason = '') {
    const coupon = await this.getById(id);
    coupon.blacklist(reason);
    return await this.update(id, coupon.toJSON());
  }
}