/**
 * Background Model - Background configuration
 */

class Background {
  constructor(data = {}) {
    this.id = data.id || `bg_${Date.now()}`;
    this.name = data.name || 'Background';
    
    // Type
    this.type = data.type || 'solid'; // solid, gradient, image, video, pattern
    
    // Solid
    this.color = data.color || '#FFFFFF';
    
    // Gradient
    this.gradient = data.gradient || null; // { type: 'linear', angle: 45, colors: ['#6A3FA0', '#8A6510'] }
    
    // Image/Video
    this.imageUrl = data.imageUrl || null;
    this.videoUrl = data.videoUrl || null;
    this.backgroundSize = data.backgroundSize || 'cover';    // cover, contain, auto
    this.backgroundPosition = data.backgroundPosition || 'center';
    this.backgroundAttachment = data.backgroundAttachment || 'scroll'; // scroll, fixed
    this.backgroundRepeat = data.backgroundRepeat || 'no-repeat';
    
    // Effects
    this.blur = data.blur || 0;                  // 0-100px
    this.brightness = data.brightness || 100;   // 0-200%
    this.contrast = data.contrast || 100;        // 0-200%
    this.saturation = data.saturation || 100;    // 0-200%
    
    // Overlay
    this.overlay = data.overlay || null;
    this.overlayOpacity = data.overlayOpacity || 0;
    this.overlayBlendMode = data.overlayBlendMode || 'multiply';
    
    // Glass Effect
    this.glassmorphism = data.glassmorphism || false;
    this.glassBlur = data.glassBlur || 10;
    this.glassBorder = data.glassBorder || 'rgba(255, 255, 255, 0.2)';
    
    // Pattern
    this.pattern = data.pattern || null; // dotted, striped, checkered, etc.
  }

  getCSS() {
    let css = '';

    switch (this.type) {
      case 'solid':
        css = `background-color: ${this.color};`;
        break;
      case 'gradient':
        if (this.gradient) {
          const colors = this.gradient.colors.join(', ');
          css = `background: linear-gradient(${this.gradient.angle}deg, ${colors});`;
        }
        break;
      case 'image':
        css = `
          background-image: url('${this.imageUrl}');
          background-size: ${this.backgroundSize};
          background-position: ${this.backgroundPosition};
          background-repeat: ${this.backgroundRepeat};
          background-attachment: ${this.backgroundAttachment};
        `;
        break;
      case 'video':
        css = `background: url('${this.videoUrl}') no-repeat center;`;
        break;
    }

    // Add effects
    if (this.blur > 0 || this.brightness !== 100 || this.contrast !== 100 || this.saturation !== 100) {
      css += `
        filter: blur(${this.blur}px) brightness(${this.brightness}%) contrast(${this.contrast}%) saturate(${this.saturation}%);
      `;
    }

    // Add overlay
    if (this.overlay && this.overlayOpacity > 0) {
      css += `
        ::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: ${this.overlay};
          opacity: ${this.overlayOpacity / 100};
          mix-blend-mode: ${this.overlayBlendMode};
          z-index: 1;
        }
      `;
    }

    // Add glassmorphism
    if (this.glassmorphism) {
      css += `
        backdrop-filter: blur(${this.glassBlur}px);
        border: 1px solid ${this.glassBorder};
      `;
    }

    return css;
  }

  toJSON() {
    return { ...this };
  }
}