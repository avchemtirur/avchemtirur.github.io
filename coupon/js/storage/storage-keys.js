/**
 * LocalStorage Schema Structure
 * All keys prefixed with 'h4_branding_'
 */

STORAGE_KEYS = {
  // Themes
  THEMES: 'h4_branding_themes',                    // { [themeId]: Theme }
  ACTIVE_THEME: 'h4_branding_active_theme',        // String (themeId)
  THEME_HISTORY: 'h4_branding_theme_history',      // Array of theme versions
  
  // Campaigns
  CAMPAIGNS: 'h4_branding_campaigns',              // { [campaignId]: Campaign }
  ACTIVE_CAMPAIGNS: 'h4_branding_active_campaigns', // Array of campaign IDs
  
  // Components
  BUTTONS: 'h4_branding_buttons',                  // { [buttonId]: Button }
  CARDS: 'h4_branding_cards',                      // { [cardId]: Card }
  ICONS: 'h4_branding_icons',                      // { [iconId]: Icon }
  BACKGROUNDS: 'h4_branding_backgrounds',          // { [bgId]: Background }
  ANIMATIONS: 'h4_branding_animations',            // { [animId]: Animation }
  TYPOGRAPHY: 'h4_branding_typography',            // { [typoId]: Typography }
  POPUPS: 'h4_branding_popups',                    // { [popupId]: Popup }
  
  // Content
  LOGOS: 'h4_branding_logos',                      // { [logoId]: Logo }
  BANNERS: 'h4_branding_banners',                  // { [bannerId]: Banner }
  PRODUCTS: 'h4_branding_products',                // { [productId]: Product }
  LAYOUTS: 'h4_branding_layouts',                  // { [layoutId]: Layout }
  SOUNDS: 'h4_branding_sounds',                    // { [soundId]: Sound }
  QR_SCANNER: 'h4_branding_qr_scanner',            // { config: QRScanner }
  
  // Languages
  LANGUAGES: 'h4_branding_languages',              // { [langCode]: translations }
  ACTIVE_LANGUAGE: 'h4_branding_active_language',  // String (langCode)
  
  // Presets
  WALLPAPER_THEMES: 'h4_branding_wallpaper_themes', // Pre-built wallpaper themes
  FONT_FAMILIES: 'h4_branding_font_families',      // Available fonts
  ICON_PACKS: 'h4_branding_icon_packs',            // Available icon packs
  COLOR_PALETTES: 'h4_branding_color_palettes',    // Pre-built color palettes
  
  // Permissions
  PERMISSIONS: 'h4_branding_permissions',          // { [role]: Permission }
  CURRENT_USER: 'h4_branding_current_user',        // { role, userId }
  
  // Settings
  GLOBAL_SETTINGS: 'h4_branding_global_settings',  // Global config
  UNDO_STACK: 'h4_branding_undo_stack',            // Array of changes for undo
  REDO_STACK: 'h4_branding_redo_stack',            // Array of changes for redo
  DRAFTS: 'h4_branding_drafts',                    // Auto-saved drafts
  BACKUPS: 'h4_branding_backups',                  // Theme backups
  
  // Media
  UPLOADED_IMAGES: 'h4_branding_uploaded_images',  // { [imageId]: base64 }
  UPLOADED_VIDEOS: 'h4_branding_uploaded_videos',  // { [videoId]: url }
  UPLOADED_AUDIO: 'h4_branding_uploaded_audio',    // { [audioId]: url }
  
  // Metadata
  METADATA: 'h4_branding_metadata',                // { version, lastSync, stats }
  USAGE_STATS: 'h4_branding_usage_stats'           // { themes, campaigns, etc. }
};