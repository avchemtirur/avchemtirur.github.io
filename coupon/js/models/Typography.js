/**
 * Typography Model - Text styling configuration
 */

class Typography {
  constructor(data = {}) {
    this.id = data.id || `typo_${Date.now()}`;
    this.name = data.name || 'Text Style';
    this.role = data.role || 'body'; // h1, h2, h3, body, small, tiny, label, caption
    
    // Font
    this.fontFamily = data.fontFamily || "'Inter', sans-serif";
    this.fontSize = data.fontSize || 16;
    this.fontWeight = data.fontWeight || 400;    // 300, 400, 500, 600, 700
    this.fontStyle = data.fontStyle || 'normal'; // normal, italic
    
    // Color & Effects
    this.color = data.color || '#1F2937';
    this.gradient = data.gradient || null;
    this.shadow = data.shadow || null;
    this.stroke = data.stroke || null;
    this.opacity = data.opacity || 1;
    
    // Spacing & Alignment
    this.letterSpacing = data.letterSpacing || 0;
    this.lineHeight = data.lineHeight || 1.5;
    this.textAlign = data.textAlign || 'left'; // left, center, right, justify
    this.textTransform = data.textTransform || 'none'; // none, uppercase, lowercase, capitalize
    
    // Decoration
    this.textDecoration = data.textDecoration || 'none';
    this.textIndent = data.textIndent || 0;
  }

  getCSS() {
    return `
      font-family: ${this.fontFamily};
      font-size: ${this.fontSize}px;
      font-weight: ${this.fontWeight};
      font-style: ${this.fontStyle};
      color: ${this.color};
      letter-spacing: ${this.letterSpacing}px;
      line-height: ${this.lineHeight};
      text-align: ${this.textAlign};
      text-transform: ${this.textTransform};
      text-decoration: ${this.textDecoration};
      opacity: ${this.opacity};
      ${this.shadow ? `text-shadow: ${this.shadow};` : ''}
      ${this.gradient ? `background: ${this.gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;` : ''}
    `;
  }

  toJSON() {
    return { ...this };
  }
}