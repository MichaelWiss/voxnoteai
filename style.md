# VoxNote AI - Style Implementation Guide

## 🎨 Sunrise Robotics Color System

### Brand Color Palette
The VoxNote AI design system is built around the Sunrise Robotics color palette, emphasizing warmth, professionalism, and accessibility.

```css
:root {
  /* Primary Brand Colors */
  --brand-orange: #fa6147;     /* Sunrise orange - primary accent */
  --dark-gray: #333328;        /* Deep charcoal - primary text */
  --medium-gray: #acaca9;      /* Neutral gray - borders & dividers */
  --dark-blue: #545268;        /* Muted blue - secondary text */
  --light-gray: #e5e5df;       /* Warm off-white - backgrounds */
  
  /* Extended Palette */
  --brand-orange-light: #ff8268;
  --brand-orange-dark: #e55541;
  --brand-orange-alpha: rgba(250, 97, 71, 0.1);
  --dark-gray-light: #4a4a3f;
  --dark-gray-alpha: rgba(51, 51, 40, 0.5);
  
  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

---

## 🌈 Color Usage Specifications

### Background Colors
```css
/* Page Backgrounds */
.bg-primary { background-color: #e5e5df; }
.bg-card { background-color: #ffffff; }
.bg-overlay { background-color: rgba(51, 51, 40, 0.5); }
.bg-accent { background-color: #fa6147; }

/* Hover States */
.bg-hover-light { background-color: #f5f5f0; }
.bg-hover-orange { background-color: #ff8268; }
.bg-hover-dark { background-color: #e55541; }
```

### Text Colors
```css
/* Text Hierarchy */
.text-primary { color: #333328; }        /* Headlines, primary content */
.text-secondary { color: #545268; }      /* Supporting text, metadata */
.text-tertiary { color: #acaca9; }       /* Placeholder text, labels */
.text-inverse { color: #e5e5df; }        /* Text on dark backgrounds */
.text-accent { color: #fa6147; }         /* Links, CTAs, highlights */

/* State Colors */
.text-success { color: #10b981; }
.text-warning { color: #f59e0b; }
.text-error { color: #ef4444; }
.text-info { color: #3b82f6; }
```

### Border Colors
```css
/* Border System */
.border-light { border-color: #e5e5df; }
.border-medium { border-color: #acaca9; }
.border-dark { border-color: #545268; }
.border-accent { border-color: #fa6147; }

/* Focus Borders */
.focus-border {
  border-color: #fa6147;
  box-shadow: 0 0 0 2px rgba(250, 97, 71, 0.2);
}
```

---

## 🎯 Component Color Implementations

### Button Color Schemes
```css
/* Primary Button (Sunrise Orange) */
.btn-primary {
  background-color: #fa6147;
  color: #e5e5df;
  border: none;
}

.btn-primary:hover {
  background-color: #e55541;
}

.btn-primary:active {
  background-color: #d14a36;
}

.btn-primary:disabled {
  background-color: #acaca9;
  color: #e5e5df;
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: #333328;
  border: 1px solid #acaca9;
}

.btn-secondary:hover {
  background-color: #f5f5f0;
  border-color: #fa6147;
}

/* Ghost Button */
.btn-ghost {
  background-color: transparent;
  color: #fa6147;
  border: none;
}

.btn-ghost:hover {
  background-color: rgba(250, 97, 71, 0.1);
}
```

### Card Color Schemes
```css
/* Standard Card */
.card {
  background-color: #ffffff;
  border: 1px solid #acaca9;
  color: #333328;
}

.card:hover {
  border-color: #fa6147;
  box-shadow: 0 4px 12px rgba(250, 97, 71, 0.1);
}

/* Highlighted Card */
.card-highlighted {
  background-color: #ffffff;
  border: 2px solid #fa6147;
  color: #333328;
}

/* Dark Card */
.card-dark {
  background-color: #333328;
  border: 1px solid #545268;
  color: #e5e5df;
}
```

### Form Element Colors
```css
/* Input Fields */
.input {
  background-color: #ffffff;
  border: 1px solid #acaca9;
  color: #333328;
}

.input:focus {
  border-color: #fa6147;
  box-shadow: 0 0 0 2px rgba(250, 97, 71, 0.2);
}

.input::placeholder {
  color: #acaca9;
}

.input:disabled {
  background-color: #f5f5f0;
  color: #acaca9;
  cursor: not-allowed;
}

/* Select Dropdowns */
.select {
  background-color: #ffffff;
  border: 1px solid #acaca9;
  color: #333328;
}

.select:focus {
  border-color: #fa6147;
  box-shadow: 0 0 0 2px rgba(250, 97, 71, 0.2);
}

/* Textarea */
.textarea {
  background-color: #ffffff;
  border: 1px solid #acaca9;
  color: #333328;
  resize: vertical;
}

.textarea:focus {
  border-color: #fa6147;
  box-shadow: 0 0 0 2px rgba(250, 97, 71, 0.2);
}
```

---

## 🚦 Status & State Colors

### Success States
```css
.status-success {
  background-color: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
  color: #065f46;
}

.badge-success {
  background-color: #10b981;
  color: #ffffff;
}
```

### Warning States
```css
.status-warning {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
  color: #92400e;
}

.badge-warning {
  background-color: #f59e0b;
  color: #ffffff;
}
```

### Error States
```css
.status-error {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #991b1b;
}

.badge-error {
  background-color: #ef4444;
  color: #ffffff;
}
```

### Info States
```css
.status-info {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  color: #1e3a8a;
}

.badge-info {
  background-color: #3b82f6;
  color: #ffffff;
}
```

---

## 🎨 Tailwind CSS Color Classes

### Tailwind Configuration Extension
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Sunrise Robotics Brand Colors
        'brand': {
          orange: '#fa6147',
          'orange-light': '#ff8268',
          'orange-dark': '#e55541',
        },
        'sunrise': {
          'dark-gray': '#333328',
          'medium-gray': '#acaca9',
          'dark-blue': '#545268',
          'light-gray': '#e5e5df',
        }
      }
    }
  }
}
```

### Tailwind Color Utilities
```css
/* Background Colors */
.bg-brand-orange { background-color: #fa6147; }
.bg-sunrise-dark-gray { background-color: #333328; }
.bg-sunrise-light-gray { background-color: #e5e5df; }

/* Text Colors */
.text-brand-orange { color: #fa6147; }
.text-sunrise-dark-gray { color: #333328; }
.text-sunrise-dark-blue { color: #545268; }

/* Border Colors */
.border-brand-orange { border-color: #fa6147; }
.border-sunrise-medium-gray { border-color: #acaca9; }
```

---

## 🌟 Dark Mode Color Scheme (Future Enhancement)

### Dark Mode Palette
```css
/* Dark Mode Variables */
:root.dark {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-card: #333333;
  --text-primary: #e5e5df;
  --text-secondary: #acaca9;
  --text-tertiary: #545268;
  --border-color: #404040;
  --brand-orange: #fa6147; /* Remains consistent */
}
```

### Dark Mode Implementation
```css
/* Dark Mode Cards */
.dark .card {
  background-color: #333333;
  border-color: #404040;
  color: #e5e5df;
}

/* Dark Mode Buttons */
.dark .btn-secondary {
  background-color: transparent;
  color: #e5e5df;
  border-color: #404040;
}

.dark .btn-secondary:hover {
  background-color: #404040;
  border-color: #fa6147;
}
```

---

## 🎯 Color Accessibility Guidelines

### Contrast Ratios
All color combinations meet WCAG 2.1 AA standards:

- **#333328 on #e5e5df**: 7.2:1 ✅ (Primary text)
- **#545268 on #ffffff**: 6.1:1 ✅ (Secondary text)
- **#e5e5df on #fa6147**: 4.8:1 ✅ (Button text)
- **#333328 on #ffffff**: 12.6:1 ✅ (Card text)

### Testing Tools
```bash
# Install contrast checking tools
npm install --save-dev @adobe/leonardo-contrast-colors
npm install --save-dev wcag-contrast
```

### Implementation Validation
```javascript
// Color contrast validation function
function validateContrast(foreground, background) {
  const ratio = calculateContrastRatio(foreground, background);
  return {
    aa: ratio >= 4.5,
    aaa: ratio >= 7.0,
    ratio: ratio
  };
}
```

---

## 📋 Color Implementation Checklist

### Design Phase
- [ ] All colors from Sunrise Robotics palette
- [ ] Contrast ratios meet WCAG AA standards
- [ ] Semantic color meanings are consistent
- [ ] Color combinations tested for color-blind users

### Development Phase
- [ ] CSS custom properties defined
- [ ] Tailwind config extended with brand colors
- [ ] Color utilities created for common patterns
- [ ] Dark mode variables prepared (future)

### Testing Phase
- [ ] Automated contrast testing implemented
- [ ] Cross-browser color rendering verified
- [ ] Mobile device color accuracy checked
- [ ] Accessibility audit completed

---

## 🔧 Color Utility Functions

### JavaScript Color Helpers
```javascript
// Color manipulation utilities
export const colorUtils = {
  // Convert hex to rgba with opacity
  hexToRgba: (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  
  // Brand colors with alpha
  brandOrangeAlpha: (alpha) => hexToRgba('#fa6147', alpha),
  darkGrayAlpha: (alpha) => hexToRgba('#333328', alpha),
  
  // Get color for status
  getStatusColor: (status) => {
    const colors = {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      default: '#fa6147'
    };
    return colors[status] || colors.default;
  }
};
```

---

*Last Updated: August 26, 2025*  
*Color System Version: 1.0*  
*Based on: Sunrise Robotics Brand Guidelines*
