/**
 * AppConstants - Application-wide constants
 */

const AppConstants = {
  // App Info
  APP_NAME: 'H4 Coupon',
  APP_VERSION: '2.0.0',
  ORGANIZATION: 'AV CHEM CHEMICAL &  MANUFACTURING ',

  // Storage
  STORAGE_QUOTA_WARNING: 0.8,
  STORAGE_PREFIX: 'h4_coupon_',

  // Timeouts
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  API_TIMEOUT: 30000, // 30 seconds

  // Pagination
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 500,

  // Cache TTL
  CACHE_TTL_SHORT: 5 * 60 * 1000, // 5 minutes
  CACHE_TTL_MEDIUM: 30 * 60 * 1000, // 30 minutes
  CACHE_TTL_LONG: 24 * 60 * 60 * 1000, // 24 hours

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  // Thresholds
  MIN_PASSWORD_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  ACCOUNT_LOCKOUT_DURATION: 30 * 60 * 1000 // 30 minutes
};

Object.freeze(AppConstants);