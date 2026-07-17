/**
 * Formatter - Data formatting utilities
 */

class Formatter {
  /**
   * Format currency
   */
  static formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format number with commas
   */
  static formatNumber(number) {
    return new Intl.NumberFormat('en-IN').format(number);
  }

  /**
   * Format percentage
   */
  static formatPercentage(value, decimals = 2) {
    return (value * 100).toFixed(decimals) + '%';
  }

  /**
   * Format phone number
   */
  static formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return phone;
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Format title case
   */
  static titleCase(string) {
    return string
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Truncate text
   */
  static truncate(text, length = 50) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }

  /**
   * Format JSON for display
   */
  static formatJSON(obj, indent = 2) {
    return JSON.stringify(obj, null, indent);
  }

  /**
   * Format address
   */
  static formatAddress(address, city, state, pincode) {
    return [address, city, state, pincode].filter(Boolean).join(', ');
  }
}