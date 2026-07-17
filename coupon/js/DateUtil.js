/**
 * DateUtil - Date operations and formatting
 */

class DateUtil {
  /**
   * Format date as DD/MM/YYYY
   */
  static formatDate(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  /**
   * Format date as DD/MM/YYYY HH:MM
   */
  static formatDateTime(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const dateStr = this.formatDate(date);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${dateStr} ${hours}:${minutes}`;
  }

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  static getRelativeTime(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return this.formatDate(date);
  }

  /**
   * Check if date is today
   */
  static isToday(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Add days to date
   */
  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Check if date is expired
   */
  static isExpired(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date < new Date();
  }

  /**
   * Get day of week
   */
  static getDayOfWeek(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }
}