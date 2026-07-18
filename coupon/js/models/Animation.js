/**
 * Animation Model - Complete animation configuration for H4 Branding Studio
 * Supports animations across all screens with full customization
 */

class Animation {
  constructor(data = {}) {
    // ===== EXISTING PROPERTIES (DO NOT REMOVE) =====
    this.id = data.id || `anim_${Date.now()}`;
    this.name = data.name || 'Animation';
    this.type = data.type || 'fadeIn'; // fade, zoom, rotate, bounce, slide, flip, pulse, wave, etc.
    
    // Timing
    this.duration = data.duration || 0.3;         // seconds
    this.delay = data.delay || 0;                 // seconds
    this.speed = data.speed || 'normal';          // slow, normal, fast, custom
    
    // Behavior
    this.repeat = data.repeat || 1;               // iterations
    this.infinite = data.infinite || false;
    this.reverse = data.reverse || false;
    this.easing = data.easing || 'ease-in-out';   // ease, linear, ease-in, ease-out, ease-in-out
    
    // Effects
    this.direction = data.direction || 'normal';  // normal, reverse, alternate
    this.fillMode = data.fillMode || 'forwards';  // none, forwards, backwards, both
    
    // Metadata
    this.preview = data.preview || null;
    this.description = data.description || '';
    this.category = data.category || 'entrance';

    // ===== SECTION 1: ANIMATION TARGET =====
    // WHY: Admin needs to apply animations to specific screens/elements
    // WHERE: After category property in constructor
    // Identifies which screen or element this animation applies to
    this.target = data.target || 'global'; // login, splash, dashboard, coupon, reward, popup, banner, product, qrscanner, global
    
    // ===== SECTION 2: ANIMATION TRIGGER =====
    // WHY: Different animations need to trigger at different events
    // WHERE: After target property
    // Defines when this animation should play
    this.trigger = data.trigger || 'onLoad'; // onLoad, onClick, onHover, onScan, onReward, onSuccess, onError, manual
    
    // ===== SECTION 3: ENABLE / DISABLE =====
    // WHY: Admin must be able to turn animations on/off without deleting
    // WHERE: After trigger property
    // Controls whether this animation is active
    this.enabled = data.enabled !== false;
    
    // ===== SECTION 4: SOUND SUPPORT =====
    // WHY: Many animations benefit from accompanying sound effects
    // WHERE: After enabled property
    // Sound configuration for this animation
    this.sound = {
      enabled: data.sound?.enabled || false,
      file: data.sound?.file || null,              // Path or URL to audio file
      volume: data.sound?.volume || 0.8,           // 0-1
      loop: data.sound?.loop || false,
      fadeIn: data.sound?.fadeIn || 0,             // seconds
      fadeOut: data.sound?.fadeOut || 0            // seconds
    };
    
    // ===== SECTION 5: PARTICLE EFFECTS =====
    // WHY: Rich animations often include particles for visual impact (confetti, fireworks)
    // WHERE: After sound property
    // Particle configuration for enhanced visual effects
    this.particles = {
      enabled: data.particles?.enabled || false,
      type: data.particles?.type || 'none', // confetti, fireworks, sparkles, snow, rain, stars, smoke, custom
      count: data.particles?.count || 50,           // number of particles
      speed: data.particles?.speed || 'normal',     // slow, normal, fast, custom
      size: data.particles?.size || 'medium',       // small, medium, large, custom
      color: data.particles?.color || '#FF6B6B',    // hex color
      customType: data.particles?.customType || null // for custom particle type
    };
    
    // ===== SECTION 6: DEVICE SUPPORT =====
    // WHY: Different devices may need different animation settings
    // WHERE: After particles property
    // Specifies which devices support this animation
    this.deviceSupport = {
      mobile: data.deviceSupport?.mobile !== false,
      tablet: data.deviceSupport?.tablet !== false,
      desktop: data.deviceSupport?.desktop !== false
    };
    
    // ===== SECTION 7: PERFORMANCE SETTINGS =====
    // WHY: Animations can impact performance; need to control GPU usage and power consumption
    // WHERE: After deviceSupport property
    // Performance optimization settings
    this.performance = {
      useGPU: data.performance?.useGPU !== false,   // Hardware acceleration
      lowPowerMode: data.performance?.lowPowerMode || false, // Reduce animation complexity
      reduceMotion: data.performance?.reduceMotion || false   // Respect prefers-reduced-motion
    };
    
    // ===== SECTION 8: PREVIEW SETTINGS =====
    // WHY: Admin needs multiple preview formats to understand how animation looks
    // WHERE: After performance property
    // Storage for different preview formats
    this.previewSettings = {
      image: data.previewSettings?.image || null,   // Static preview image (base64 or URL)
      gif: data.previewSettings?.gif || null,       // Animated GIF (base64 or URL)
      video: data.previewSettings?.video || null,   // MP4 video (base64 or URL)
      thumbnail: data.previewSettings?.thumbnail || null, // Small thumbnail
      duration: data.previewSettings?.duration || 0 // Preview duration in seconds
    };
    
    // ===== SECTION 9: TAGS =====
    // WHY: Help admin search and categorize animations
    // WHERE: After previewSettings property
    // Tags for searching and filtering animations
    this.tags = data.tags || [];
    
    // ===== SECTION 10: IMAGE SETTINGS =====
    // WHY: Animations often involve images that need sizing and transformation
    // WHERE: After tags property
    // Image transformation properties
    this.imageSettings = {
      width: data.imageSettings?.width || 'auto',
      height: data.imageSettings?.height || 'auto',
      opacity: data.imageSettings?.opacity || 1,    // 0-1
      rotation: data.imageSettings?.rotation || 0,  // degrees
      scale: data.imageSettings?.scale || 1,        // multiplier
      crop: data.imageSettings?.crop || null,       // { x, y, width, height }
      borderRadius: data.imageSettings?.borderRadius || 0
    };
    
    // ===== SECTION 11: LOGO SETTINGS =====
    // WHY: Logo animations need specific positioning and sizing
    // WHERE: After imageSettings property
    // Logo-specific animation properties
    this.logoSettings = {
      width: data.logoSettings?.width || 80,
      height: data.logoSettings?.height || 80,
      opacity: data.logoSettings?.opacity || 1,     // 0-1
      position: data.logoSettings?.position || 'center', // top, center, bottom
      alignment: data.logoSettings?.alignment || 'center', // left, center, right
      rotation: data.logoSettings?.rotation || 0,   // degrees
      borderRadius: data.logoSettings?.borderRadius || 0
    };
    
    // ===== SECTION 12: POSITION SETTINGS =====
    // WHY: Animations need precise positioning using absolute coordinates
    // WHERE: After logoSettings property
    // Positioning properties for animation elements
    this.position = {
      top: data.position?.top || 'auto',
      left: data.position?.left || 'auto',
      right: data.position?.right || 'auto',
      bottom: data.position?.bottom || 'auto',
      centerX: data.position?.centerX !== undefined ? data.position.centerX : false,
      centerY: data.position?.centerY !== undefined ? data.position.centerY : false,
      x: data.position?.x || 0,                     // pixel offset
      y: data.position?.y || 0,                     // pixel offset
      zIndex: data.position?.zIndex || 1000
    };
    
    // ===== SECTION 17: LAYER SETTINGS =====
    // WHY: Admin needs control over stacking order and visibility of animated elements
    // WHERE: After position property
    // Layer management for animation
    this.layer = {
      zIndex: data.layer?.zIndex || 1000,
      visible: data.layer?.visible !== false,
      locked: data.layer?.locked || false          // Locked layers cannot be modified
    };
    
    // ===== SECTION 18: CONDITIONS =====
    // WHY: Animations should only play under specific conditions to improve UX
    // WHERE: After layer property
    // Conditions that must be met for animation to play
    this.conditions = {
      firstLoginOnly: data.conditions?.firstLoginOnly || false,
      rewardOnly: data.conditions?.rewardOnly || false,
      loggedInOnly: data.conditions?.loggedInOnly || false,
      campaignOnly: data.conditions?.campaignOnly || false,
      firstScanOnly: data.conditions?.firstScanOnly || false,
      scanSuccessOnly: data.conditions?.scanSuccessOnly || false,
      scanFailedOnly: data.conditions?.scanFailedOnly || false,
      pointsReached: data.conditions?.pointsReached || null, // threshold value
      rewardWon: data.conditions?.rewardWon || false
    };
    
    // ===== SECTION 19: RESPONSIVE SETTINGS =====
    // WHY: Different devices need different animation speeds/settings
    // WHERE: After conditions property
    // Device-specific animation settings
    this.responsive = {
      mobileSpeed: data.responsive?.mobileSpeed || 'normal',
      tabletSpeed: data.responsive?.tabletSpeed || 'normal',
      desktopSpeed: data.responsive?.desktopSpeed || 'normal',
      mobileEnabled: data.responsive?.mobileEnabled !== false,
      tabletEnabled: data.responsive?.tabletEnabled !== false,
      desktopEnabled: data.responsive?.desktopEnabled !== false
    };
    
    // ===== SECTION 20: TEXT ANIMATION =====
    // WHY: Text animations need special handling (typewriter, letter-by-letter, etc.)
    // WHERE: After responsive property
    // Text-specific animation configuration
    this.textAnimation = {
      animationType: data.textAnimation?.animationType || 'none', // typewriter, wave, fade, bounce
      startAnimation: data.textAnimation?.startAnimation || 'fadeIn',
      endAnimation: data.textAnimation?.endAnimation || 'fadeOut',
      startDelay: data.textAnimation?.startDelay || 0,
      endDelay: data.textAnimation?.endDelay || 0,
      duration: data.textAnimation?.duration || 1,  // overall duration
      repeat: data.textAnimation?.repeat || 1,
      infinite: data.textAnimation?.infinite || false,
      typingSpeed: data.textAnimation?.typingSpeed || 50, // milliseconds per character
      cursorBlink: data.textAnimation?.cursorBlink || true,
      wordByWord: data.textAnimation?.wordByWord || false,
      letterByLetter: data.textAnimation?.letterByLetter || false
    };
    
    // ===== SECTION 21: TIMELINE SETTINGS =====
    // WHY: Complex animations need precise timeline control
    // WHERE: After textAnimation property
    // Timeline configuration for animation sequences
    this.timeline = {
      startTime: data.timeline?.startTime || 0,          // milliseconds
      endTime: data.timeline?.endTime || null,           // null = no end
      totalDuration: data.timeline?.totalDuration || this.duration * 1000, // calculated
      loopDelay: data.timeline?.loopDelay || 0,          // delay between loops
      sequenceOrder: data.timeline?.sequenceOrder || 0   // order in sequence
    };
    
    // ===== SECTION 22: ANIMATION EVENTS =====
    // WHY: Admin needs hooks to trigger other actions during animation
    // WHERE: After timeline property
    // Event callbacks for animation lifecycle
    this.events = {
      beforeStart: data.events?.beforeStart || null,    // function callback
      onStart: data.events?.onStart || null,
      onPause: data.events?.onPause || null,
      onResume: data.events?.onResume || null,
      onComplete: data.events?.onComplete || null,
      onCancel: data.events?.onCancel || null,
      onDestroy: data.events?.onDestroy || null
    };
  }

  /**
   * SECTION 14: VALIDATION METHOD
   * WHY: Ensures animation configuration is valid before saving
   * WHERE: After constructor
   * Validates the animation configuration
   */
  validate() {
    const errors = [];

    // Validate required fields
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Animation name is required');
    }

    if (!this.type || this.type.trim().length === 0) {
      errors.push('Animation type is required');
    }

    // Validate numeric fields
    if (this.duration < 0) {
      errors.push('Duration cannot be negative');
    }

    if (this.delay < 0) {
      errors.push('Delay cannot be negative');
    }

    if (this.repeat < 0) {
      errors.push('Repeat count cannot be negative');
    }

    // Validate opacity
    if (this.imageSettings.opacity < 0 || this.imageSettings.opacity > 1) {
      errors.push('Image opacity must be between 0 and 1');
    }

    if (this.logoSettings.opacity < 0 || this.logoSettings.opacity > 1) {
      errors.push('Logo opacity must be between 0 and 1');
    }

    // Validate sound volume
    if (this.sound.volume < 0 || this.sound.volume > 1) {
      errors.push('Sound volume must be between 0 and 1');
    }

    // Validate device support
    const hasDeviceSupport = this.deviceSupport.mobile || this.deviceSupport.tablet || this.deviceSupport.desktop;
    if (!hasDeviceSupport) {
      errors.push('Animation must support at least one device type');
    }

    // Validate responsive settings
    if (!this.responsive.mobileEnabled && !this.responsive.tabletEnabled && !this.responsive.desktopEnabled) {
      errors.push('Animation must be enabled for at least one device');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * SECTION 15: CLONE METHOD
   * WHY: Admin needs to duplicate animations to save time
   * WHERE: After validate() method
   * Creates a deep copy of this animation
   */
  clone() {
    const clonedData = this.toJSON();
    clonedData.id = `anim_${Date.now()}_clone`;
    clonedData.name = `${this.name} (Copy)`;
    return new Animation(clonedData);
  }

  // ===== EXISTING METHODS (DO NOT REMOVE) =====

  /**
   * SECTION 13: EXPANDED ANIMATION LIBRARY
   * WHY: Provide comprehensive keyframe animations
   * WHERE: Existing getKeyframes() method - EXPAND this
   * Returns keyframes CSS for the animation type
   */
  getKeyframes() {
    const keyframes = {
      // Original animations
      fadeIn: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,
      fadeOut: `
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `,

      // EXPANDED: Zoom animations
      zoomIn: `
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `,
      zoomOut: `
        @keyframes zoomOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
      `,

      // EXPANDED: Rotate animations
      rotateIn: `
        @keyframes rotateIn {
          from { transform: rotate(-10deg); opacity: 0; }
          to { transform: rotate(0); opacity: 1; }
        }
      `,
      rotateOut: `
        @keyframes rotateOut {
          from { transform: rotate(0); opacity: 1; }
          to { transform: rotate(10deg); opacity: 0; }
        }
      `,

      // EXPANDED: Bounce animation
      bounce: `
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-20px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-10px); }
        }
      `,

      // EXPANDED: Flip animation
      flip: `
        @keyframes flip {
          0% { transform: perspective(400px) rotateY(0); }
          40% { transform: perspective(400px) rotateY(170deg); }
          50% { transform: perspective(400px) rotateY(190deg) scale(1); }
          80% { transform: perspective(400px) rotateY(360deg) scale(0.95); }
          100% { transform: perspective(400px) rotateY(360deg) scale(1); }
        }
      `,

      // EXPANDED: Pulse animation
      pulse: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `,

      // EXPANDED: Wave animation
      wave: `
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `,

      // EXPANDED: Glow animation
      glow: `
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(106, 63, 160, 0.5); }
          50% { box-shadow: 0 0 20px rgba(106, 63, 160, 0.8); }
        }
      `,

      // EXPANDED: Shake animation
      shake: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          75% { transform: translateX(-10px); }
        }
      `,

      // EXPANDED: Scale animation
      scale: `
        @keyframes scale {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `,

      // EXPANDED: Floating animation
      floating: `
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `,

      // EXPANDED: Slide animations
      slideLeft: `
        @keyframes slideLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `,
      slideRight: `
        @keyframes slideRight {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `,
      slideUp: `
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `,
      slideDown: `
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `,

      // EXPANDED: Marquee animation
      marquee: `
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `,

      // EXPANDED: Typewriter animation
      typewriter: `
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
      `,
      blink: `
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `,

      // EXPANDED: Confetti animation
      confetti: `
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `,

      // EXPANDED: Fireworks animation
      fireworks: `
        @keyframes fireworks {
          0% { transform: scale(0); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
      `,

      // EXPANDED: Sparkle animation
      sparkle: `
        @keyframes sparkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `,

      // EXPANDED: Ripple animation
      ripple: `
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
      `
    };

    return keyframes[this.type] || keyframes.fadeIn;
  }

  /**
   * EXISTING: Get CSS animation string
   * UPDATED: Now includes all new properties
   */
  getCSS() {
    // Calculate actual duration based on speed
    const speedMultipliers = {
      'very-slow': 2,
      'slow': 1.5,
      'normal': 1,
      'fast': 0.75,
      'very-fast': 0.5,
      'custom': 1
    };

    const multiplier = speedMultipliers[this.speed] || 1;
    const actualDuration = this.duration * multiplier;

    let css = `
      animation: ${this.type} ${actualDuration}s ${this.easing} ${this.delay}s ${this.infinite ? 'infinite' : this.repeat};
      animation-direction: ${this.direction};
      animation-fill-mode: ${this.fillMode};
    `;

    // Add GPU acceleration if enabled
    if (this.performance.useGPU) {
      css += `
        will-change: transform, opacity;
        transform: translateZ(0);
        backface-visibility: hidden;
      `;
    }

    // Add opacity
    if (this.imageSettings.opacity < 1) {
      css += `opacity: ${this.imageSettings.opacity};`;
    }

    // Add image transforms
    if (this.imageSettings.rotation > 0) {
      css += `transform: rotate(${this.imageSettings.rotation}deg);`;
    }

    if (this.imageSettings.scale !== 1) {
      css += `transform: scale(${this.imageSettings.scale});`;
    }

    if (this.imageSettings.borderRadius > 0) {
      css += `border-radius: ${this.imageSettings.borderRadius}px;`;
    }

    // Add position
    if (this.position.top !== 'auto') css += `top: ${this.position.top};`;
    if (this.position.left !== 'auto') css += `left: ${this.position.left};`;
    if (this.position.right !== 'auto') css += `right: ${this.position.right};`;
    if (this.position.bottom !== 'auto') css += `bottom: ${this.position.bottom};`;
    css += `z-index: ${this.layer.zIndex};`;

    // Add visibility
    if (!this.layer.visible) {
      css += `display: none;`;
    }

    // Add reduced motion support
    if (this.performance.reduceMotion) {
      css += `
        @media (prefers-reduced-motion: reduce) {
          animation: none;
        }
      `;
    }

    return css;
  }

  /**
   * SECTION 16: IMPROVED EXPORT
   * WHY: Export method must include all new properties
   * WHERE: Existing toJSON() method - EXPAND this
   * Exports animation configuration as JSON including all new properties
   */
  toJSON() {
    return {
      // Existing properties
      id: this.id,
      name: this.name,
      type: this.type,
      duration: this.duration,
      delay: this.delay,
      speed: this.speed,
      repeat: this.repeat,
      infinite: this.infinite,
      reverse: this.reverse,
      easing: this.easing,
      direction: this.direction,
      fillMode: this.fillMode,
      preview: this.preview,
      description: this.description,
      category: this.category,

      // NEW: All new properties
      target: this.target,
      trigger: this.trigger,
      enabled: this.enabled,
      sound: this.sound,
      particles: this.particles,
      deviceSupport: this.deviceSupport,
      performance: this.performance,
      previewSettings: this.previewSettings,
      tags: this.tags,
      imageSettings: this.imageSettings,
      logoSettings: this.logoSettings,
      position: this.position,
      layer: this.layer,
      conditions: this.conditions,
      responsive: this.responsive,
      textAnimation: this.textAnimation,
      timeline: this.timeline,
      events: this.events
    };
  }

  /**
   * HELPER METHOD: Check if animation should play based on conditions
   * WHY: Determine if animation is eligible to run
   * WHERE: After toJSON() method
   */
  shouldPlay(context = {}) {
    const {
      isFirstLogin = false,
      hasReward = false,
      isLoggedIn = false,
      isInCampaign = false,
      isFirstScan = false,
      scanSuccess = false,
      scanFailed = false,
      pointsEarned = 0,
      rewardWon = false
    } = context;

    // Check individual conditions
    if (this.conditions.firstLoginOnly && !isFirstLogin) return false;
    if (this.conditions.rewardOnly && !hasReward) return false;
    if (this.conditions.loggedInOnly && !isLoggedIn) return false;
    if (this.conditions.campaignOnly && !isInCampaign) return false;
    if (this.conditions.firstScanOnly && !isFirstScan) return false;
    if (this.conditions.scanSuccessOnly && !scanSuccess) return false;
    if (this.conditions.scanFailedOnly && !scanFailed) return false;
    if (this.conditions.pointsReached && pointsEarned < this.conditions.pointsReached) return false;
    if (this.conditions.rewardWon && !rewardWon) return false;

    return true;
  }

  /**
   * HELPER METHOD: Get animation speed for device
   * WHY: Different devices need different speeds
   * WHERE: After shouldPlay() method
   */
  getDeviceSpeed(device = 'desktop') {
    const speeds = {
      mobile: this.responsive.mobileSpeed,
      tablet: this.responsive.tabletSpeed,
      desktop: this.responsive.desktopSpeed
    };

    return speeds[device] || this.speed;
  }

  /**
   * HELPER METHOD: Check if animation is supported on device
   * WHY: Verify device compatibility before playing
   * WHERE: After getDeviceSpeed() method
   */
  isSupported(device = 'desktop') {
    const supported = {
      mobile: this.responsive.mobileEnabled,
      tablet: this.responsive.tabletEnabled,
      desktop: this.responsive.desktopEnabled
    };

    return supported[device] !== false;
  }

  /**
   * HELPER METHOD: Get sound configuration
   * WHY: Retrieve sound settings for playback
   * WHERE: After isSupported() method
   */
  getSound() {
    if (!this.sound.enabled || !this.sound.file) {
      return null;
    }

    return {
      file: this.sound.file,
      volume: this.sound.volume,
      loop: this.sound.loop,
      fadeIn: this.sound.fadeIn,
      fadeOut: this.sound.fadeOut
    };
  }

  /**
   * HELPER METHOD: Get particle configuration
   * WHY: Retrieve particle settings for rendering
   * WHERE: After getSound() method
   */
  getParticles() {
    if (!this.particles.enabled) {
      return null;
    }

    return {
      type: this.particles.type,
      count: this.particles.count,
      speed: this.particles.speed,
      size: this.particles.size,
      color: this.particles.color,
      customType: this.particles.customType
    };
  }

  /**
   * HELPER METHOD: Get animation timeline
   * WHY: Calculate total animation duration for scheduling
   * WHERE: After getParticles() method
   */
  getTimeline() {
    const totalFrameDuration = this.duration + this.delay + (this.timeline.loopDelay / 1000);
    const calculatedEndTime = this.timeline.endTime || (totalFrameDuration * (this.infinite ? 1 : this.repeat));

    return {
      startTime: this.timeline.startTime,
      endTime: this.timeline.endTime || calculatedEndTime,
      totalDuration: totalFrameDuration * 1000,
      loopDelay: this.timeline.loopDelay,
      sequenceOrder: this.timeline.sequenceOrder
    };
  }

  /**
   * STATIC METHOD: Create animation from preset
   * WHY: Allow quick creation from predefined templates
   * WHERE: After all instance methods, add static method
   */
  static createFromPreset(presetType, customData = {}) {
    const presets = {
      'welcome': {
        name: 'Welcome Animation',
        type: 'fadeIn',
        duration: 0.5,
        delay: 0.2,
        target: 'splash',
        trigger: 'onLoad',
        enabled: true,
        category: 'welcome'
      },
      'reward': {
        name: 'Reward Animation',
        type: 'bounce',
        duration: 1,
        delay: 0,
        target: 'reward',
        trigger: 'onReward',
        enabled: true,
        particles: { enabled: true, type: 'confetti' },
        category: 'reward',
        sound: { enabled: true, volume: 0.8 }
      },
      'success': {
        name: 'Success Animation',
        type: 'pulse',
        duration: 0.6,
        delay: 0,
        target: 'global',
        trigger: 'onSuccess',
        enabled: true,
        particles: { enabled: true, type: 'sparkles' },
        category: 'success'
      },
      'error': {
        name: 'Error Animation',
        type: 'shake',
        duration: 0.5,
        delay: 0,
        target: 'global',
        trigger: 'onError',
        enabled: true,
        category: 'error'
      }
    };

    const preset = presets[presetType] || {};
    return new Animation({ ...preset, ...customData });
  }

  /**
   * STATIC METHOD: Get default animation
   * WHY: Provide sensible defaults for new animations
   * WHERE: After createFromPreset() method
   */
  static getDefault() {
    return new Animation({
      name: 'Default Animation',
      type: 'fadeIn',
      duration: 0.3,
      delay: 0,
      speed: 'normal',
      enabled: true,
      target: 'global',
      trigger: 'onLoad'
    });
  }
}

// End of Animation.js