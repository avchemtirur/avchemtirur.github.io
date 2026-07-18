/**
 * Animation Model - Animation configuration
 */

class Animation {
  constructor(data = {}) {
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
  }

  getKeyframes() {
    const keyframes = {
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
      zoomIn: `
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `,
      slideUp: `
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `,
      // ... more keyframes
    };

    return keyframes[this.type] || keyframes.fadeIn;
  }

  getCSS() {
    return `
      animation: ${this.type} ${this.duration}s ${this.easing} ${this.delay}s ${this.infinite ? 'infinite' : this.repeat};
      animation-direction: ${this.direction};
      animation-fill-mode: ${this.fillMode};
    `;
  }

  toJSON() {
    return { ...this };
  }
}