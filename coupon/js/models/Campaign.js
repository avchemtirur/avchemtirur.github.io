/**
 * Campaign Model - Marketing campaign configuration
 */

class Campaign {
  constructor(data = {}) {
    this.id = data.id || `campaign_${Date.now()}`;
    this.name = data.name || 'New Campaign';
    this.description = data.description || '';
    this.banner = data.banner || null;
    this.thumbnail = data.thumbnail || null;
    
    // Dates
    this.startDate = data.startDate || new Date().toISOString();
    this.endDate = data.endDate || null;
    this.isActive = data.isActive !== false;
    
    // Customization
    this.theme = data.theme || null;              // Theme ID
    this.animation = data.animation || 'fadeIn';
    this.priority = data.priority || 0;           // Higher = more prominent
    
    // Reward Rules
    this.rewards = data.rewards || {
      pointsMultiplier: 1.0,
      bonusPoints: 0,
      maxPoints: null,
      minPurchase: null
    };
    
    // Display
    this.displayOn = data.displayOn || ['home', 'dashboard', 'rewards'];
    this.position = data.position || 'top';       // top, middle, bottom
    
    // Category
    this.category = data.category || 'promotional'; // promotional, seasonal, festive, dealer
    this.tags = data.tags || [];
    
    // Metadata
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  isExpired() {
    if (!this.endDate) return false;
    return new Date() > new Date(this.endDate);
  }

  isStarted() {
    return new Date() >= new Date(this.startDate);
  }

  isRunning() {
    return this.isActive && this.isStarted() && !this.isExpired();
  }

  getDaysRemaining() {
    if (!this.endDate) return null;
    const days = Math.ceil((new Date(this.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  }

  toJSON() {
    return { ...this };
  }
}