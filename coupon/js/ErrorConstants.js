/**
 * ErrorConstants - Error codes and messages
 */

const ErrorConstants = {
  // Auth Errors
  AUTH: {
    INVALID_CREDENTIALS: { code: 'AUTH_001', message: 'Invalid username or password' },
    USER_NOT_FOUND: { code: 'AUTH_002', message: 'User not found' },
    ACCOUNT_INACTIVE: { code: 'AUTH_003', message: 'Account is inactive' },
    SESSION_EXPIRED: { code: 'AUTH_004', message: 'Session has expired' }
  },

  // Validation Errors
  VALIDATION: {
    INVALID_EMAIL: { code: 'VAL_001', message: 'Invalid email format' },
    INVALID_PHONE: { code: 'VAL_002', message: 'Invalid phone number' },
    INVALID_PASSWORD: { code: 'VAL_003', message: 'Password does not meet requirements' },
    REQUIRED_FIELD: { code: 'VAL_004', message: 'This field is required' }
  },

  // Storage Errors
  STORAGE: {
    QUOTA_EXCEEDED: { code: 'STO_001', message: 'Storage quota exceeded' },
    DATA_CORRUPTED: { code: 'STO_002', message: 'Stored data is corrupted' },
    NOT_FOUND: { code: 'STO_003', message: 'Record not found' }
  },

  // Coupon Errors
  COUPON: {
    NOT_FOUND: { code: 'COU_001', message: 'Coupon not found' },
    ALREADY_SCANNED: { code: 'COU_002', message: 'Coupon already scanned' },
    EXPIRED: { code: 'COU_003', message: 'Coupon has expired' },
  BLACKLISTED: {
  code: 'COU_004',
  message: 'Coupon is blacklisted'
},
INVALID_QR: { code: 'COU_005', message: 'Invalid QR Code' },
INVALID_SERIAL: { code: 'COU_006', message: 'Invalid Serial Number' },
REWARD_ALREADY_CLAIMED: { code: 'COU_007', message: 'Reward already claimed' },
REWARD_OUT_OF_STOCK: { code: 'COU_008', message: 'Reward out of stock' },
POINTS_INSUFFICIENT: { code: 'COU_009', message: 'Insufficient points'}
  }
};

Object.freeze(ErrorConstants);