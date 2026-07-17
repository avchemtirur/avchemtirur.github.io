/**
 * RewardRepository - Reward data access layer
 * Handles reward catalog and distribution records
 */

class RewardRepository extends BaseRepository {
  constructor(db) {
    super('rewards', Reward, db);
  }

  /**
   * Find rewards by type
   * @param {string} type - 'points',
'reward',
'cash_prize',
'cash_discount',
'lucky_draw',
'gift',
'voucher',
'product',
'custom'
   * @returns {Promise<Array<Reward>>}
   */
  async findByType(type) {
    return await this.find({ type });
  }

  /**
   * Find all active rewards
   * @returns {Promise<Array<Reward>>}
   */
  async findActive() {
    const all = await this.find({ status: 'active' });
    return all.filter(r => r.isValid()); // Also check expiry
  }

  /**
   * Find all expired rewards
   * @returns {Promise<Array<Reward>>}
   */
  async findExpired() {
    const all = await this.getAll();
    return all.filter(r => !r.isValid());
  }

  /**
   * Get rewards by minimum points required
   * @param {number} minPoints
   * @returns {Promise<Array<Reward>>}
   */
  async findByMinPoints(minPoints) {
    const all = await const all = await this.findActive();
return all.filter(r => r.pointsRequired <= minPoints);
    return all.filter(r => r.status === 'active');
  }

  /**
   * Get rewards available for customer with X points
   * @param {number} availablePoints
   * @returns {Promise<Array<Reward>>}
   */
  async getEligibleRewards(availablePoints) {
    const active = await this.findActive();
    return active.filter(r => r.pointsRequired <= availablePoints);
  }

  /**
   * Get top distributed rewards
   * @param {number} limit
   * @returns {Promise<Array<Reward>>}
   */
  async getTopDistributed(limit = 10) {
    const allRewards = await this.getAll();
    return allRewards
      .sort((a, b) => b.distributionCount - a.distributionCount)
      .slice(0, limit);
  }

  /**
   * Get top redeemed rewards
   * @param {number} limit
   * @returns {Promise<Array<Reward>>}
   */
  async getTopRedeemed(limit = 10) {
    const allRewards = await this.getAll();
    return allRewards
      .sort((a, b) => b.redemptionCount - a.redemptionCount)
      .slice(0, limit);
  }

  /**
   * Record reward distribution
   * @param {string} rewardId
   * @returns {Promise<Reward>}
   */
  async recordDistribution(rewardId) {
    const reward = await this.getById(rewardId);
    if (!reward) throw new Error('Reward not found');

    return await this.update(rewardId, {
      distributionCount: reward.distributionCount + 1
    });
  }

  /**
   * Record reward redemption
   * @param {string} rewardId
   * @returns {Promise<Reward>}
   */
  async recordRedemption(rewardId) {
    const reward = await this.getById(rewardId);
    if (!reward) throw new Error('Reward not found');

    return await this.update(rewardId, {
      redemptionCount: reward.redemptionCount + 1
    });
  }

  /**
   * Get reward statistics
   * @returns {Promise<Object>}
   */
  async findByMinPoints(minPoints) {
    const all = await this.findActive();

    return all.filter(r => r.pointsRequired <= minPoints);
}

async getStatistics() {
    const allRewards = await this.getAll();
    const active = allRewards.filter(r => r.status === 'active' && r.isValid());

    const totalDistributed = allRewards.reduce((sum, r) => sum + r.distributionCount, 0);
    const totalRedeemed = allRewards.reduce((sum, r) => sum + r.redemptionCount, 0);

    return {
    
      totalRewards: allRewards.length,
      activeRewards: active.length,
      expiredRewards: allRewards.filter(r => !r.isValid()).length,
      totalDistributed,
      totalRedeemed,
      overallRedemptionRate: totalDistributed > 0 
        ? ((totalRedeemed / totalDistributed) * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * Get rewards expiring soon (within X days)
   * @param {number} days
   * @returns {Promise<Array<Reward>>}
   */
  async getExpiringRewards(days = 7) {
    const allRewards = await this.getAll();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return allRewards.filter(r => {
      if (!r.validUntil) return false;
      const expiryDate = new Date(r.validUntil);
      return expiryDate < cutoffDate && expiryDate > new Date();
    });
  }

  /**
   * Update reward status
   * @param {string} rewardId
   * @param {string} status - 'active', 'inactive'
   * @returns {Promise<Reward>}
   */
  async updateStatus(rewardId, status) {
    return await this.update(rewardId, { status });
  }

  /**
   * Search rewards by name or description
   * @param {string} query
   * @returns {Promise<Array<Reward>>}
   */
  async search(query) {
    const allRewards = await this.getAll();
    const lowerQuery = query.toLowerCase();

    return allRewards.filter(reward => {
      return (
        (reward.name || '').toLowerCase().includes(lowerQuery) ||
        (reward.description && reward.description.toLowerCase().includes(lowerQuery))
      );
    });
  }
}