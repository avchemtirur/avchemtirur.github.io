/**
 * Validator - Input validation utilities
 */

class Validator {
  /**
   * Validate email
   */
  static isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Validate mobile number (India)
   */
  static isValidMobile(mobile) {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(mobile);
  }

  /**
   * Validate GST number
   */
  static isValidGST(gst) {
    const regex = /^[0-9A-Z]{15}$/;
    return regex.test(gst);
  }

  /**
   * Validate password strength
   */
  static getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  }

  /**
   * Validate URL
   */
  static isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate date
   */
  static isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  /**
   * Validate pincode (India)
   */
  static isValidPincode(pincode) {
    const regex = /^[0-9]{6}$/;
    return regex.test(pincode);
  }

  /**
   * Validate required field
   */
  static isRequired(value) {
    return value !== null && value !== undefined && value !== '';
  }

  /**
   * Validate field length
   */
  static isValidLength(value, min, max) {
    const length = String(value).length;
    return length >= min && length <= max;
  }

  /**
   * Validate coupon code format
   */
  static isValidCouponCode(code) {
    const regex = /^[A-Z0-9]{12,20}$/;
    return regex.test(code);
  }
}