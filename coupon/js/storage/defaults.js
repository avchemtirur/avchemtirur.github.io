/**
 * Themes Storage
 */
h4_branding_themes = {
  "theme_1234567890": {
    id: "theme_1234567890",
    name: "Purple Gold",
    description: "Premium purple and gold theme",
    isActive: true,
    branding: { companyLogo, brandLogo, ... },
    colors: { primary, secondary, ... },
    typography: { fontFamily, fontSize, ... },
    components: { button, card, icon, ... },
    backgrounds: { screen, card, ... },
    loginScreen: { logo, welcomeText, ... },
    animations: { welcome, transition, ... },
    languages: { default, supported, translations, ... },
    features: { darkMode, animations, ... },
    settings: { companyName, supportEmail, ... },
    metadata: { tags, category, isFavorite, ... },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    version: "1.0.0"
  }
}

/**
 * Campaigns Storage
 */
h4_branding_campaigns = {
  "campaign_1234567890": {
    id: "campaign_1234567890",
    name: "Onam Festival",
    description: "Special Onam celebration campaign",
    banner: { image, gradient, text, ... },
    thumbnail: "data:image/...",
    startDate: "2024-08-15T00:00:00Z",
    endDate: "2024-09-15T23:59:59Z",
    isActive: true,
    theme: "theme_1234567890",
    animation: "slideUp",
    priority: 1,
    rewards: {
      pointsMultiplier: 1.5,
      bonusPoints: 50,
      maxPoints: 500
    },
    displayOn: ["home", "dashboard", "rewards"],
    position: "top",
    category: "festive",
    tags: ["onam", "festival", "2024"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  }
}

/**
 * Animations Storage
 */
h4_branding_animations = {
  "anim_fadeIn": {
    id: "anim_fadeIn",
    name: "Fade In",
    type: "fadeIn",
    duration: 0.3,
    delay: 0,
    speed: "normal",
    repeat: 1,
    infinite: false,
    reverse: false,
    easing: "ease-in-out",
    direction: "normal",
    fillMode: "forwards",
    preview: "data:video/...",
    category: "entrance"
  }
}

/**
 * Global Settings Storage
 */
h4_branding_global_settings = {
  appName: "H4 Coupon System",
  appVersion: "2.0.0",
  companyName: "AV CHEM",
  companyEmail: "support@h4.com",
  companyPhone: "+919895123456",
  companyWebsite: "https://h4.local",
  
  features: {
    darkMode: true,
    animations: true,
    sounds: true,
    multiLanguage: true,
    multiTheme: true
  },
  
  defaults: {
    defaultTheme: "theme_1234567890",
    defaultLanguage: "en",
    defaultAnimation: "fadeIn",
    defaultShadow: "md"
  },
  
  storage: {
    autoSave: true,
    autoBackup: true,
    backupInterval: 3600000, // 1 hour
    maxBackups: 10,
    maxDrafts: 5
  },
  
  performance: {
    enableCache: true,
    cacheExpiry: 86400000, // 24 hours
    enableLazyLoad: true
  },
  
  lastSync: "2024-01-15T10:30:00Z",
  version: "1.0.0"
}

/**
 * Permissions Storage
 */
h4_branding_permissions = {
  "owner": {
    role: "owner",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      settings: true,
      reports: true,
      permissions: true,
      backup: true
    }
  },
  "admin": {
    role: "admin",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      settings: true,
      reports: true,
      permissions: false,
      backup: false
    }
  },
  "staff": {
    role: "staff",
    permissions: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      settings: false,
      reports: false,
      permissions: false,
      backup: false
    }
  }
}

/**
 * Metadata Storage
 */
h4_branding_metadata = {
  version: "2.0.0",
  databaseVersion: "1.0.0",
  lastSync: "2024-01-15T10:30:00Z",
  lastBackup: "2024-01-15T09:30:00Z",
  totalThemes: 5,
  totalCampaigns: 12,
  totalAnimations: 25,
  totalLogos: 8,
  storageUsed: 2500000, // bytes
  storageLimit: 10000000, // bytes
  stats: {
    themesCreated: 5,
    campaignsActive: 3,
    animationsUsed: 12,
    imagesUploaded: 45,
    lastEdited: "2024-01-15T10:30:00Z"
  }
}