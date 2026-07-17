/**
 * WalletRepository - Wallet data access layer
 * Handles wallet records (points, cashPrize, rewards:)
 */

class WalletRepository extends BaseRepository {
  constructor(db) {
    super('wallets', Wallet, db);
  }

  /**
   * Get or create wallet for customer
   * @param {string} customerId
   * @returns {Promise<Wallet>}
   */
  async getOrCreate(customerId) {
    let wallet = await this.findOne({ customerId });

    if (!wallet) {
      wallet = await this.create({
        customerId,
        points: 0,
        cashback: 0,
        gifts: [],
        totalEarned: 0,
        totalRedeemed: 0
      });
    }

    return wallet;
  }

  /**
   * Get wallet by customer ID
   * @param {string} customerId
   * @returns {Promise<Wallet|null>}
   */
  async findByCustomer(customerId) {
    const wallets = await this.find({ customerId });
    return wallets.length > 0 ? wallets[0] : null;
  }

  /**
   * Add points to wallet
   * @param {string} customerId
   * @param {number} points
   * @returns {Promise<Wallet>}
   */
  async addPoints(customerId, points) {
    const wallet = await this.getOrCreate(customerId);

    return await this.update(wallet.id, {
      points: wallet.points + points,
      totalEarned: wallet.totalEarned + points,
      lastTransactionAt: new Date().toISOString()
    });
  }

  /**
   * Deduct points from wallet
   * @param {string} customerId
   * @param {number} points
   * @returns {Promise<Wallet>}
   * @throws Error if insufficient points
   */
  async deductPoints(customerId, points) {
    const wallet = await this.getOrCreate(customerId);

    if (wallet.points < points) {
      throw new Error(`Insufficient points. Available: ${wallet.points}, Required: ${points}`);
    }

    return await this.update(wallet.id, {
      points: wallet.points - points,
      totalRedeemed: wallet.totalRedeemed + points,
      lastTransactionAt: new Date().toISOString()
    });
  }

  /**
   * addCashPrize()
deductCashPrize()
   * @param {string} customerId
   * @param {number} amount
   * @returns {Promise<Wallet>}
   */
  async addCashback(customerId, amount) {
    const wallet = await this.getOrCreate(customerId);

    return await this.update(wallet.id, {
      cashback: wallet.cashback + amount,
      totalEarned: wallet.totalEarned + amount,
      lastTransactionAt: new Date().toISOString()
    });
  }

  /**
   * Deduct cashback from wallet
   * @param {string} customerId
   * @param {number} amount
   * @returns {Promise<Wallet>}
   */
  async deductCashback(customerId, amount) {
    const wallet = await this.getOrCreate(customerId);

    if (wallet.cashback < amount) {
      throw new Error(`Insufficient cashback. Available: ₹${wallet.cashback}, Required: ₹${amount}`);
    }

    return await this.update(wallet.id, {
      cashback: wallet.cashback - amount,
      totalRedeemed: wallet.totalRedeemed + amount,
      lastTransactionAt: new Date().toISOString()
    });
  }

  /**
   * Add gift to wallet
   * @param {string} customerId
   * @param {Object} gift - { giftId, name, status }
   * @returns {Promise<Wallet>}
   */
  async addGift(customerId, gift) {
    const wallet = await this.getOrCreate(customerId);
    const gifts = wallet.gifts || [];

    gifts.push({
      ...gift,
      addedAt: new Date().toISOString()
    });

    return await this.update(wallet.id, { gifts });
  }

  /**
   * Remove gift from wallet
   * @param {string} customerId
   * @param {string} giftId
   * @returns {Promise<Wallet>}
   */
  async removeGift(customerId, giftId) {
    const wallet = await this.getOrCreate(customerId);
    const gifts = (wallet.gifts || []).filter(g => g.giftId !== giftId);

    return await this.update(wallet.id, { gifts });
  }

  /**
   * Get wallet balance as formatted object
   * @param {string} customerId
   * @returns {Promise<Object>}
   */
  async getBalance(customerId) {
    const wallet = await this.getOrCreate(customerId);

    return {
      points: wallet.points,
      cashback: wallet.cashback,
      gifts: (wallet.gifts || []).length,
      formattedCashback: Formatter.formatCurrency(wallet.cashback),
      formattedPoints: Formatter.formatNumber(wallet.points)
    };
  }

  /**
   * Get wallet summary
   * @param {string} customerId
   * @returns {Promise<Object>}
   */
  async getSummary(customerId) {
    const wallet = await this.getOrCreate(customerId);

    return {
      customerId,
      currentPoints: wallet.points,
      currentCashback: wallet.cashback,
      gifts: wallet.gifts || [],
      lifetime: {
        totalEarned: wallet.totalEarned,
        totalRedeemed: wallet.totalRedeemed,
        netBalance: wallet.totalEarned - wallet.totalRedeemed
      },
      lastTransaction: wallet.lastTransactionAt
    };
  }

  /**
   * Get aggregate wallet statistics
   * @returns {Promise<Object>}
   */
  async getAggregateStats() {
    const allWallets = await this.getAll();

    return {
      totalWallets: allWallets.length,
      totalPointsDistributed: allWallets.reduce((sum, w) => sum + w.totalEarned, 0),
      totalPointsRedeemed: allWallets.reduce((sum, w) => sum + w.totalRedeemed, 0),
      totalCashbackDistributed: allWallets.reduce((sum, w) => sum + w.totalEarned, 0), // Simplified
      averagePointsPerWallet: allWallets.length > 0 
        ? allWallets.reduce((sum, w) => sum + w.points, 0) / allWallets.length 
        : 0,
      totalGiftsAwarded: allWallets.reduce((sum, w) => sum + (w.gifts || []).length, 0)
    };
  }
}