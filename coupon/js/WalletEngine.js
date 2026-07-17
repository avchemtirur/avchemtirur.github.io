/**
 * WalletEngine - Wallet calculation logic
 * Handles points calculation, conversions, expiry logic
 */

class WalletEngine {
  constructor() {
    this.pointToRupeeRatio = AppConstants.POINT_TO_RUPEE_RATIO; // 1 point = ₹0.50
    this.pointExpiryDays = 365; // Points expire after 1 year
    this.minimumRedemptionPoints = 100;
    this.maximumPointsPerScan = 500;
  }

  /**
   * Calculate points for coupon scan
   * @param {Object} coupon - Coupon object
   * @param {Object} customer - Customer object
   * @returns {number} Points earned
   */
  calculatePointsForScan(coupon, customer) {
    let points = coupon.pointsValue || 50;

    // Loyalty bonus: +10% for every 10 scans
  const loyaltyBonus =
Math.floor(customer.totalScans / 10) * 5;

    // Cap points at maximum
    points = Math.min(points, this.maximumPointsPerScan);

    return points;
  }

  /**
   * Calculate points expiry date
   * @param {Date} earnedDate
   * @returns {Date} Expiry date
   */
  calculateExpiryDate(earnedDate = new Date()) {
    const expiryDate = new Date(earnedDate);
    expiryDate.setDate(expiryDate.getDate() + this.pointExpiryDays);
    return expiryDate;
  }

  /**
   * Calculate equivalent cash value of points
   * @param {number} points
   * @returns {number} Cash value in rupees
   */
  calculateCashValue(points) {
    return points * this.pointToRupeeRatio;
  }

  /**
   * Validate redemption amount
   * @param {number} points - Points to redeem
   * @returns {Object} { isValid, message }
   */
  validateRedemption(points) {
    if (points < this.minimumRedemptionPoints) {
      return {
        isValid: false,
        message: `Minimum ${this.minimumRedemptionPoints} points required for redemption`
      };
    }

    return { isValid: true, message: 'Valid for redemption' };
  }

  /**
   * Get milestone bonus for accumulated points
   * @param {number} totalPoints
   * @returns {number} Bonus points
   */
  getMilestoneBonus(totalPoints) {
    if (totalPoints >= 5000) return 500; // 10% bonus
    if (totalPoints >= 1000) return 100; // 10% bonus
    if (totalPoints >= 500) return 50; // 10% bonus
    return 0;
  }

  /**
   * Get redemption rate for customer
   * @param {number} pointsEarned
   * @param {number} pointsRedeemed
   * @returns {number} Rate as percentage
   */
  getRedemptionRate(pointsEarned, pointsRedeemed) {
    if (pointsEarned === 0) return 0;
    return (pointsRedeemed / pointsEarned) * 100;
  }

  /**
   * Calculate seasonal bonus multiplier
   * @returns {number} Multiplier (1.0 = no bonus)
   */
  getSeasonalMultiplier() {
    const month = new Date().getMonth();

    // Festival season (October-December)
    if (month >= 9) return 1.5;

    // Summer (April-June)
    if (month >= 3 && month <= 5) return 1.25;

    // Regular
    return 1.0;
}
    
    // Festival season (October-December): 1.5x
    if (month >= 9) return 1.5;
    
    // Summer (April-June): 1.25x
    if (month >= 3 && month <= 5) return 1.25;
    
    // Regular: 1.0x
    return 1.0;
  }

  /**
   * Apply seasonal bonus to points
   * @param {number} points
   * @returns {number} Points with seasonal multiplier
   */
  applySeasonalBonus(points) {
    const multiplier = this.getSeasonalMultiplier();
    return Math.floor(points * multiplier);
  }

  /**
   * Calculate wallet health score (0-100)
   * @param {Object} wallet
   * @returns {number} Health score
   */
  getWalletHealthScore(wallet) {
    let score = 0;

    // Points balance: up to 40 points
    if (wallet.points > 0) {
      score += Math.min(40, (wallet.points / 1000) * 40);
    }

    // Redemption history: up to 30 points
    const redemptionRate = this.getRedemptionRate(wallet.totalEarned, wallet.totalRedeemed);
    score += (redemptionRate / 100) * 30;

    // Regular usage: up to 20 points
    if (wallet.lastTransactionAt) {
      const lastTransactionDate = new Date(wallet.lastTransactionAt);
      const daysSinceLastTransaction = Math.floor((new Date() - lastTransactionDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastTransaction <= 30) score += 20;
      else if (daysSinceLastTransaction <= 90) score += 10;
    }

    // Gifts redeemed: up to 10 points
    if (wallet.gifts && wallet.gifts.length > 0) {
      score += 10;
    }

    return Math.min(100, Math.round(score));
  }

  /**
   * Get wallet level based on points
   * @param {number} totalPoints
   * @returns {Object} { level, name, nextLevelPoints }
   */
  getWalletLevel(totalPoints) {
    if (totalPoints >= 10000) {
      return { level: 5, name: 'Platinum', nextLevelPoints: null };
    }
    if (totalPoints >= 5000) {
      return { level: 4, name: 'Gold', nextLevelPoints: 10000 };
    }
    if (totalPoints >= 1000) {
      return { level: 3, name: 'Silver', nextLevelPoints: 5000 };
    }
    if (totalPoints >= 500) {
      return { level: 2, name: 'Bronze', nextLevelPoints: 1000 };
    }
    return { level: 1, name: 'New Member', nextLevelPoints: 500 };
  }

  /**
   * Get level-based benefits
   * @param {number} level
   * @returns {Array<string>}
   */
  getLevelBenefits(level) {
    const benefits = {
      1: ['Basic point earning', 'Participate in promotions'],
      2: ['1% bonus on points', 'Priority support', 'Early access to new rewards'],
      3: ['5% bonus on points', 'Birthday bonus', 'Exclusive gift rewards'],
      4: ['10% bonus on points', 'Monthly bonus points', 'VIP customer status'],
      5: ['20% bonus on points', 'Lifetime VIP status', 'Personal account manager']
    };

    return benefits[level] || benefits[1];
  }
}