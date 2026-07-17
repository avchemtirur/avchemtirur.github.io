/**
 * StatusConstants - Status enumerations
 */

const StatusConstants = {
  // User Status
  USER_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING: 'pending',
    DELETED: 'deleted'
  },

  // User Roles
  USER_ROLE: {
    ADMIN
CUSTOMER

  ACTIVE
SCANNED
EXPIRED
BLACKLISTED
  },

  REWARD_TYPE: {
  POINTS: 'points',                     // പോയിന്റുകൾ
  REWARD: 'reward',                     // സാധാരണ സമ്മാനം
  POINTS_REWARD: 'points_reward',       // പോയിന്റ് + സമ്മാനം
  CASH_PRIZE: 'cash_prize',             // ക്യാഷ് പ്രൈസ്
  CASH_DISCOUNT: 'cash_discount',       // ക്യാഷ് ഡിസ്കൗണ്ട്
  LUCKY_DRAW: 'lucky_draw',             // ലക്കി ഡ്രോ എൻട്രി

  GIFT_VOUCHER: 'gift_voucher',         // Gift Voucher
  PRODUCT: 'product',                   // H4 Product
  COUPON: 'coupon',                     // Discount Coupon
  FREE_GIFT: 'free_gift',               // Free Gift
  BONUS_POINTS: 'bonus_points',         // Bonus Points
  INSTANT_WIN: 'instant_win',           // Instant Win
  SPIN_WIN: 'spin_win',                 // Spin & Win
  SCRATCH_CARD: 'scratch_card',         // Scratch Card
  MYSTERY_BOX: 'mystery_box',           // Mystery Reward
  GRAND_PRIZE: 'grand_prize',           // Grand Prize
  CUSTOM: 'custom'                      // 
}
  }

  
  TRANSACTION_TYPE: {
  SCAN: 'scan',
  POINT_EARN: 'point_earn',
  REWARD: 'reward',
  CASH_PRIZE: 'cash_prize',
  CASH_DISCOUNT: 'cash_discount',
  LUCKY_DRAW: 'lucky_draw',
  REDEEM: 'redeem',
  EXPIRE: 'expire'
  }
};

Object.freeze(StatusConstants);