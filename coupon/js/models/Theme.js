/**
 * Theme Model - Complete theme configuration
 * Represents a complete branding theme with all customizations
 */

class Theme {
  constructor(data = {}) {
    // Metadata
    this.id = data.id || `theme_${Date.now()}`;
    this.name = data.name || 'Custom Theme';
    this.description = data.description || '';
    this.thumbnail = data.thumbnail || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.isActive = data.isActive || false;
    this.isLocked = data.isLocked || false;
    this.version = data.version || '1.0.0';

    // Brand Identity
    this.branding = {
      companyLogo: data.branding?.companyLogo || null,
      brandLogo: data.branding?.brandLogo || null,
      companyName: data.branding?.companyName || 'H4',
      tagline: data.branding?.tagline || 'Rewards & Loyalty Platform',
      favicon: data.branding?.favicon || null
    };

    // Colors
    this.colors = {
      primary: data.colors?.primary || '#6A3FA0',      // Purple
      secondary: data.colors?.secondary || '#8A6510',  // Gold
      accent: data.colors?.accent || '#FF6B6B',
      success: data.colors?.success || '#51CF66',
      warning: data.colors?.warning || '#FFD93D',
      error: data.colors?.error || '#FF6B6B',
      info: data.colors?.info || '#4ECDC4',
      background: data.colors?.background || '#FFFFFF',
      surface: data.colors?.surface || '#F5F5F5',
      textPrimary: data.colors?.textPrimary || '#1F2937',
      textSecondary: data.colors?.textSecondary || '#6B7280',
      textTertiary: data.colors?.textTertiary || '#9CA3AF',
      border: data.colors?.border || '#E5E7EB',
      shadow: data.colors?.shadow || 'rgba(0, 0, 0, 0.1)'
    };

    // Typography
    this.typography = {
      fontFamily: data.typography?.fontFamily || "'Inter', sans-serif",
      headingFont: data.typography?.headingFont || "'Barlow Condensed', sans-serif",
      fontSize: {
        h1: data.typography?.fontSize?.h1 || 32,
        h2: data.typography?.fontSize?.h2 || 28,
        h3: data.typography?.fontSize?.h3 || 24,
        body: data.typography?.fontSize?.body || 16,
        small: data.typography?.fontSize?.small || 14,
        tiny: data.typography?.fontSize?.tiny || 12
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      letterSpacing: data.typography?.letterSpacing || 0.5,
      lineHeight: data.typography?.lineHeight || 1.5
    };

    // Components
    this.components = {
      button: data.components?.button || {
        borderRadius: 8,
        height: 48,
        shadow: 'md',
        ripple: true,
        uppercase: false
      },
      card: data.components?.card || {
        borderRadius: 12,
        shadow: 'sm',
        elevation: 1,
        glassmorphism: false
      },
      input: data.components?.input || {
        borderRadius: 8,
        shadow: 'none',
        variant: 'outlined'
      },
      icon: data.components?.icon || {
        size: 24,
        weight: 400,
        fillOpacity: 1
      }
    };

    // Backgrounds
    this.backgrounds = {
      screen: data.backgrounds?.screen || {
        type: 'solid',           // solid, gradient, image, video
        color: '#FFFFFF',
        gradient: null,
        image: null,
        video: null,
        blur: 0,
        overlay: 'rgba(0,0,0,0)',
        overlayOpacity: 0
      },
      card: data.backgrounds?.card || {
        type: 'solid',
        color: '#F5F5F5',
        gradient: null,
        blur: 0,
        glassmorphism: false
      }
    };

    // Login Screen
    this.loginScreen = data.loginScreen || {
      logo: null,
      welcomeText: 'Welcome to H4',
      subtitle: 'Rewards & Loyalty Platform',
      backgroundType: 'gradient',
      backgroundColor: '#6A3FA0',
      backgroundImage: null,
      cardBackgroundOpacity: 0.95,
      cardShadow: 'lg',
      animation: 'fadeIn',
      buttonStyle: 'filled',
      inputVariant: 'outlined'
    };

    // Animations
    this.animations = {
      welcome: data.animations?.welcome || 'fadeIn',
      transition: data.animations?.transition || 'slideUp',
      scrollBehavior: data.animations?.scrollBehavior || 'smooth'
    };

    // Languages & Localization
    this.languages = data.languages || {
      default: 'en',
      supported: ['en', 'ml'],
      rtl: false,
      translations: {}
    };

    // Feature Flags
    this.features = data.features || {
      darkMode: true,
      animations: true,
      sounds: true,
      glassmorphism: false,
      gradient: true
    };

    // Settings
    this.settings = data.settings || {
      companyName: 'H4',
      supportEmail: 'support@h4.com',
      supportPhone: '+919895123456',
      supportWhatsApp: '+919895123456',
      websiteUrl: 'https://h4.local',
      privacyUrl: 'https://h4.local/privacy',
      termsUrl: 'https://h4.local/terms'
    };

    // Metadata
    this.metadata = data.metadata || {
      tags: [],
      category: 'custom',
      isFavorite: false,
      downloadCount: 0,
      rating: 0
    };
  }

  /**
   * Clone theme
   */
  clone() {
    return new Theme(JSON.parse(JSON.stringify(this)));
  }

  /**
   * Export theme as JSON
   */
  toJSON() {
    return { ...this };
  }

  /**
   * Get theme preview data
   */
  getPreviewData() {
    return {
      name: this.name,
      colors: this.colors,
      typography: this.typography,
      components: this.components,
      backgrounds: this.backgrounds
    };
  }

  /**
   * Validate theme completeness
   */
  validate() {
    const errors = [];
    if (!this.colors.primary) errors.push('Primary color is required');
    if (!this.typography.fontFamily) errors.push('Font family is required');
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Reset to default
   */
  static getDefault() {
    return new Theme();
  }

  /**
   * Get CSS variables string
   */
  toCSSVariables() {
    return `
      --color-primary: ${this.colors.primary};
      --color-secondary: ${this.colors.secondary};
      --color-accent: ${this.colors.accent};
      --color-success: ${this.colors.success};
      --color-warning: ${this.colors.warning};
      --color-error: ${this.colors.error};
      --font-family: ${this.typography.fontFamily};
      --font-heading: ${this.typography.headingFont};
      --font-size-h1: ${this.typography.fontSize.h1}px;
      --font-size-body: ${this.typography.fontSize.body}px;
      --border-radius-sm: 4px;
      --border-radius-md: ${this.components.card.borderRadius}px;
      --border-radius-lg: 16px;
    `;
  }
}