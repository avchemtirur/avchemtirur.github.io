/**
 * Complete Settings Schema
 * How all configurable settings are structured
 */

const SETTINGS_SCHEMA = {
  // BRAND SETTINGS
  brand: {
    companyName: String,
    companyLogo: {
  type: "file",
  default: null
}
    brandLogo: File | Blob | null,
    favicon: File | Blob | null,
    companyTagline: String,
    companyEmail: String,
    companyPhone: String,
    companyWebsite: String,
    industryCategory: String, // construction, retail, services, etc.
    businessType: String // b2b, b2c, b2b2c, etc.
  },

  // COLOR SETTINGS
  colors: {
    primary: HexColor,
    secondary: HexColor,
    accent: HexColor,
    success: HexColor,
    warning: HexColor,
    error: HexColor,
    info: HexColor,
    background: HexColor,
    surface: HexColor,
    textPrimary: HexColor,
    textSecondary: HexColor,
    textTertiary: HexColor,
    border: HexColor,
    shadow: HexColor,
    customColors: Map<String, HexColor> // For additional custom colors
  },

  // TYPOGRAPHY SETTINGS
  typography: {
    defaultFontFamily: String,
    headingFontFamily: String,
    monospaceFontFamily: String,
    fontSizes: {
      h1: Number,
      h2: Number,
      h3: Number,
      h4: Number,
      h5: Number,
      h6: Number,
      body: Number,
      small: Number,
      tiny: Number,
      label: Number,
      caption: Number
    },
    fontWeights: {
      thin: 100,
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    },
    letterSpacing: Number,
    textTransform: Enum // none, uppercase, lowercase, capitalize
  },

  // COMPONENT SETTINGS
  components: {
    button: {
      height: Number,
      width: String | Number,
      borderRadius: Number,
      padding: { top, right, bottom, left },
      shadow: Enum // none, sm, md, lg, xl
      ripple: Boolean,
      glow: Boolean,
      uppercase: Boolean,
      fontWeight: Number,
      variants: { filled, outlined, text, elevated, tonal }
    },
    card: {
      borderRadius: Number,
      shadow: Enum,
      elevation: Number,
      glassmorphism: Boolean,
      padding: { top, right, bottom, left },
      margin: { top, right, bottom, left }
    },
    input: {
      height: Number,
      borderRadius: Number,
      shadow: Enum,
      variant: Enum, // outlined, filled, standard
      borderColor: HexColor,
      focusColor: HexColor,
      padding: { top, right, bottom, left }
    },
    icon: {
      defaultSize: Number,
      weight: Number,
      fillOpacity: Number,
      variants: { outlined, filled, rounded, sharp }
    },
    checkbox: {
      size: Number,
      borderRadius: Number,
      color: HexColor
    },
    radio: {
      size: Number,
      color: HexColor
    },
    switch: {
      width: Number,
      height: Number,
      color: HexColor,
      trackColor: HexColor
    }
  },

  // BACKGROUND SETTINGS
  backgrounds: {
    screen: {
      type: Enum, // solid, gradient, image, video, pattern
      color: HexColor,
      gradient: { type, angle, colors[] },
      imageUrl: String,
      videoUrl: String,
      blur: Number, // 0-100
      brightness: Number, // 0-200
      contrast: Number, // 0-200
      saturation: Number, // 0-200
      overlay: HexColor,
      overlayOpacity: Number, // 0-1
      pattern: Enum // dotted, striped, checkered, etc.
    },
    card: {
      type: Enum,
      color: HexColor,
      gradient: { type, angle, colors[] },
      blur: Number,
      glassmorphism: Boolean
    },
    input: {
      type: Enum,
      color: HexColor,
      gradient: { type, angle, colors[] }
    }
  },

  // ANIMATION SETTINGS
  animations: {
    enableAnimations: Boolean,
    globalSpeed: Enum, // slow, normal, fast, custom
    globalDuration: Number,
    globalDelay: Number,
    defaultAnimation: String,
    enterAnimation: String,
    exitAnimation: String,
    transitionAnimation: String,
    scrollBehavior: Enum, // auto, smooth
    reducedMotion: Boolean
  },

  // SHADOW SETTINGS
  shadows: {
    none: "none",
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
    custom: String
  },

  // BORDER RADIUS SETTINGS
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999
  },

  // SPACING SETTINGS
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
    36: 144,
    40: 160,
    44: 176,
    48: 192,
    52: 208,
    56: 224,
    60: 240,
    64: 256,
    72: 288,
    80: 320,
    96: 384
  },

  // LOGIN SCREEN SETTINGS
  loginScreen: {
    logo: File | Blob | null,
    welcomeText: String,
    subtitle: String,
    backgroundType: Enum, // solid, gradient, image, video
    backgroundColor: HexColor,
    backgroundImage: String,
    backgroundGradient: { type, angle, colors[] },
    backgroundVideo: String,
    cardBackgroundColor: HexColor,
    cardBackgroundOpacity: Number, // 0-1
    cardShadow: Enum, // sm, md, lg, xl
    cardBorderRadius: Number,
    cardAnimation: String,
    buttonStyle: Enum, // filled, outlined, text, elevated
    buttonColor: HexColor,
    inputVariant: Enum, // outlined, filled, standard
    showRememberMe: Boolean,
    showForgotPassword: Boolean,
    showSocialLogin: Boolean,
    socialLogins: { google, facebook, apple },
    supportText: String,
    supportPhone: String,
    supportEmail: String,
    supportWhatsApp: String
  },

  // LANGUAGE SETTINGS
  languages: {
    default: String, // en, ml, hi, etc.
    supported: String[], // array of language codes
    rtl: Boolean, // right-to-left support
    autoDetect: Boolean, // detect browser language
    translations: {
      [languageCode]: {
        [key]: String // translations for all text
      }
    }
  },

  // FEATURE FLAGS
  features: {
    darkMode: Boolean,
    animations: Boolean,
    sounds: Boolean,
    glassmorphism: Boolean,
    gradient: Boolean,
    blur: Boolean,
    multiTheme: Boolean,
    offline: Boolean,
    webp: Boolean,
    webgl: Boolean,
    serviceWorker: Boolean,
    pwa: Boolean
  },

  // SOUND SETTINGS
  sounds: {
    enabled: Boolean,
    defaultVolume: Number, // 0-1
    sounds: {
      welcome: { url, volume, loop, fadeIn, fadeOut },
      reward: { url, volume, loop, fadeIn, fadeOut },
      win: { url, volume, loop, fadeIn, fadeOut },
      error: { url, volume, loop, fadeIn, fadeOut },
      scan: { url, volume, loop, fadeIn, fadeOut },
      click: { url, volume, loop, fadeIn, fadeOut }
    }
  },

  // STORAGE SETTINGS
  storage: {
    autoSave: Boolean,
    autoSaveInterval: Number, // milliseconds
    autoBackup: Boolean,
    backupInterval: Number,
    maxBackups: Number,
    maxDrafts: Number,
    maxUploads: Number,
    compressionEnabled: Boolean,
    encryptionEnabled: Boolean
  },

  // PRIVACY & CONSENT
  privacy: {
    cookiesEnabled: Boolean,
    analyticsEnabled: Boolean,
    crashReportingEnabled: Boolean,
    personalizeContent: Boolean,
    privacyUrl: String,
    termsUrl: String,
    cookiePolicyUrl: String
  },

  // PERFORMANCE SETTINGS
  performance: {
    enableCache: Boolean,
    cacheExpiry: Number, // milliseconds
    enableLazyLoad: Boolean,
    imageOptimization: Boolean,
    videoOptimization: Boolean,
    minifyCSS: Boolean,
    minifyJS: Boolean,
    gzipCompression: Boolean
  },

  // METADATA
  metadata: {
    createdAt: String, // ISO 8601
    updatedAt: String, // ISO 8601
    version: String,
    databaseVersion: String,
    theme: String, // currently active theme ID
    campaign: String, // currently active campaign ID
    language: String, // currently active language
    timezone: String,
    locale: String
  }
};