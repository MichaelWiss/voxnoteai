# VoxNote AI - Style Documentation

## Design System Overview

VoxNote AI uses a modern, clean design system built with Tailwind CSS that emphasizes usability, accessibility, and visual hierarchy for video and voice note management.

## Current Implementation Notes

**Style Approach**: The current dashboard implementation uses a mix of Tailwind utility classes and inline styles with a custom color palette featuring warm, earth-tone colors (beige, brown, orange-red). This documentation includes both the current implementation and alternative approaches for future reference.

**Color Scheme**: Warm, minimal aesthetic with beige backgrounds (#e5e5df), dark brown text (#333328), and orange-red accents (#fa6147) - inspired by modern design systems but with a unique brand identity.

**Layout**: Full-width header + main content layout (no sidebar) with responsive grid systems for note management.

## Design Principles

### 1. **Clarity & Focus**
- Clean, uncluttered interfaces that prioritize content
- Clear visual hierarchy with proper spacing and typography
- Minimal cognitive load for users managing media-rich content

### 2. **Accessibility First**
- WCAG 2.1 AA compliance
- High contrast ratios for text and interactive elements
- Keyboard navigation support
- Screen reader friendly markup

### 3. **Media-Centric Design**
- Visual emphasis on video and audio content
- Clear differentiation between media types
- Responsive media players and controls

### 4. **Consistency**
- Unified spacing, colors, and typography across all components
- Predictable interaction patterns
- Consistent visual language for similar functions

## Color Palette

### Primary Brand Colors
```css
/* Actual VoxNote AI Brand Colors (as implemented) */
--primary-bg: #e5e5df;       /* Main background (warm beige) */
--primary-text: #333328;     /* Primary text (dark brown) */
--secondary-text: #545268;   /* Secondary text (medium gray) */
--accent-primary: #fa6147;   /* Primary accent (orange-red) */
--accent-hover: #e5533a;     /* Accent hover state */
--border-color: #acaca9;     /* Border color (light gray) */
--card-bg: #ffffff;          /* Card backgrounds (white) */
--icon-bg: #333328;          /* Icon backgrounds (dark brown) */
--icon-color: #e5e5df;       /* Icon color (light beige) */
```

### Legacy/Alternative Colors (documented for reference)
```css
/* Alternative color scheme (not currently used) */
--blue-primary: #3b82f6;     /* Blue primary alternative */
--blue-hover: #2563eb;       /* Blue hover alternative */
--gray-50: #f9fafb;          /* Gray background alternative */
```

### Semantic Colors
```css
/* Success States */
--success-50: #f0fdf4;     /* Success background */
--success-500: #22c55e;    /* Success primary */
--success-700: #15803d;    /* Success dark */

/* Warning States */
--warning-50: #fffbeb;     /* Warning background */
--warning-500: #f59e0b;    /* Warning primary */
--warning-700: #a16207;    /* Warning dark */

/* Error States */
--error-50: #fef2f2;       /* Error background */
--error-500: #ef4444;      /* Error primary */
--error-700: #b91c1c;      /* Error dark */

/* Neutral Colors */
--gray-50: #f9fafb;        /* Light background */
--gray-100: #f3f4f6;       /* Card backgrounds */
--gray-200: #e5e7eb;       /* Borders */
--gray-300: #d1d5db;       /* Disabled states */
--gray-500: #6b7280;       /* Secondary text */
--gray-700: #374151;       /* Body text */
--gray-900: #111827;       /* Headings */
```

### Media-Specific Colors
```css
/* Video Content */
--video-primary: #fa6147;    /* Orange-red for video (matches accent) */
--video-bg: #fff5f2;         /* Light orange background */

/* Audio Content */
--audio-primary: #059669;    /* Green for audio indicators */
--audio-bg: #f0fdf4;         /* Light green background */

/* Recording States */
--recording: #fa6147;        /* Orange-red for active recording (matches accent) */
--recording-bg: #fff5f2;     /* Recording background */
```

## Typography

### Font Stack
```css
/* Primary Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;

/* Monospace for code/technical content */
font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
```

### Typography Scale
```css
/* Headings */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* h1 */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* h2 */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }       /* h3 */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }    /* h4 */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }   /* h5 */

/* Body Text */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* Base */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }   /* Small */
.text-xs { font-size: 0.75rem; line-height: 1rem; }       /* Extra small */
```

### Typography Usage
```css
/* Page Titles */
.page-title {
  @apply text-3xl font-bold text-gray-900 mb-6;
}

/* Section Headings */
.section-heading {
  @apply text-xl font-semibold text-gray-800 mb-4;
}

/* Card Titles */
.card-title {
  @apply text-lg font-medium text-gray-900 mb-2;
}

/* Body Text */
.body-text {
  @apply text-base text-gray-700 leading-relaxed;
}

/* Captions */
.caption {
  @apply text-sm text-gray-500;
}
```

## Spacing System

### Base Spacing Scale
```css
/* Tailwind spacing scale (4px base unit) */
.space-1 { margin/padding: 0.25rem; }   /* 4px */
.space-2 { margin/padding: 0.5rem; }    /* 8px */
.space-3 { margin/padding: 0.75rem; }   /* 12px */
.space-4 { margin/padding: 1rem; }      /* 16px */
.space-6 { margin/padding: 1.5rem; }    /* 24px */
.space-8 { margin/padding: 2rem; }      /* 32px */
.space-12 { margin/padding: 3rem; }     /* 48px */
.space-16 { margin/padding: 4rem; }     /* 64px */
```

### Layout Spacing
```css
/* Container spacing */
.container-padding {
  @apply px-4 sm:px-6 lg:px-8;
}

/* Section spacing */
.section-spacing {
  @apply py-12 sm:py-16 lg:py-20;
}

/* Card spacing */
.card-padding {
  @apply p-6;
}

/* Form spacing */
.form-spacing {
  @apply space-y-6;
}
```

## Component Patterns

### Buttons
```css
/* Primary Button (Current Implementation) */
.btn-primary {
  @apply inline-flex items-center px-4 py-2 text-sm font-normal transition-colors;
  background-color: #fa6147;
  color: #e5e5df;
}

.btn-primary:hover {
  background-color: #e5533a;
}

/* Alternative Primary Button (Tailwind utilities) */
.btn-primary-alt {
  @apply inline-flex items-center px-4 py-2 border border-transparent 
         text-sm font-medium rounded-md shadow-sm text-white 
         bg-primary-600 hover:bg-primary-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-colors duration-200;
}

/* Secondary Button */
.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border text-sm font-normal transition-colors;
  border-color: #acaca9;
  color: #333328;
  background-color: white;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

/* Danger Button */
.btn-danger {
  @apply inline-flex items-center px-4 py-2 border border-transparent 
         text-sm font-medium rounded-md shadow-sm text-white 
         bg-red-600 hover:bg-red-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-red-500
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-colors duration-200;
}
```

### Cards
```css
/* Base Card */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

/* Note Card */
.note-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6
         hover:shadow-md transition-shadow duration-200
         cursor-pointer;
}

/* Media Card */
.media-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-4
         hover:shadow-md transition-shadow duration-200;
}

/* Video Card Accent */
.video-card {
  @apply border-l-4 border-l-red-500;
}

/* Audio Card Accent */
.audio-card {
  @apply border-l-4 border-l-green-500;
}
```

### Form Elements
```css
/* Input Fields */
.form-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md
         shadow-sm placeholder-gray-400 focus:outline-none
         focus:ring-primary-500 focus:border-primary-500
         disabled:bg-gray-50 disabled:text-gray-500
         disabled:border-gray-300 disabled:cursor-not-allowed;
}

/* Textarea */
.form-textarea {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md
         shadow-sm placeholder-gray-400 focus:outline-none
         focus:ring-primary-500 focus:border-primary-500
         resize-none min-h-[100px];
}

/* Select */
.form-select {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md
         shadow-sm focus:outline-none focus:ring-primary-500
         focus:border-primary-500 bg-white;
}

/* Labels */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

/* Helper Text */
.form-helper {
  @apply text-sm text-gray-500 mt-1;
}

/* Error Text */
.form-error {
  @apply text-sm text-red-600 mt-1;
}
```

## Media Components

### Video Player
```css
.video-player {
  @apply relative w-full bg-black rounded-lg overflow-hidden;
}

.video-controls {
  @apply absolute bottom-0 left-0 right-0 bg-gradient-to-t 
         from-black/80 to-transparent p-4;
}

.video-progress {
  @apply w-full h-1 bg-white/30 rounded-full overflow-hidden mb-2;
}

.video-progress-bar {
  @apply h-full bg-red-500 transition-all duration-300;
}
```

### Audio Player
```css
.audio-player {
  @apply bg-white border border-gray-200 rounded-lg p-4;
}

.audio-waveform {
  @apply w-full h-16 bg-gray-100 rounded mb-4;
}

.audio-controls {
  @apply flex items-center justify-between;
}

.audio-progress {
  @apply flex-1 mx-4 h-1 bg-gray-200 rounded-full overflow-hidden;
}

.audio-progress-bar {
  @apply h-full bg-green-500 transition-all duration-300;
}
```

### Recording States
```css
.recording-indicator {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs
         font-medium bg-red-100 text-red-800;
}

.recording-pulse {
  @apply animate-pulse;
}

.recording-button {
  @apply w-12 h-12 rounded-full bg-red-600 hover:bg-red-700
         focus:outline-none focus:ring-2 focus:ring-red-500
         flex items-center justify-center text-white
         transition-colors duration-200;
}

.recording-button.active {
  @apply bg-red-700 animate-pulse;
}
```

## Layout Patterns

### Dashboard Layout (Current Implementation)
```css
.dashboard-layout {
  @apply min-h-screen;
  background-color: #e5e5df; /* Warm beige background */
}

.dashboard-header {
  @apply bg-white border-b;
  border-color: #acaca9;
}

.dashboard-container {
  @apply max-w-7xl mx-auto px-6;
}

.dashboard-header-content {
  @apply py-8;
}

.dashboard-main {
  @apply max-w-7xl mx-auto px-6 py-12;
}

/* No sidebar - full width layout */
```

### Alternative Dashboard Layout (Legacy/Future Option)
```css
.dashboard-layout-sidebar {
  @apply min-h-screen bg-gray-50;
}

.dashboard-nav {
  @apply bg-white shadow-sm w-64 fixed left-0 top-0 h-full
         border-r border-gray-200;
}

.dashboard-main-sidebar {
  @apply ml-64 p-8;
}
```

### Grid Systems
```css
/* Note Grid */
.notes-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

/* Media Grid */
.media-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
}

/* Two Column Layout */
.two-column {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-8;
}
```

## State Management

### Loading States
```css
.loading-spinner {
  @apply inline-block w-4 h-4 border-2 border-gray-300 
         border-t-primary-600 rounded-full animate-spin;
}

.loading-skeleton {
  @apply animate-pulse bg-gray-200 rounded;
}

.loading-text {
  @apply h-4 bg-gray-200 rounded w-3/4;
}

.loading-avatar {
  @apply w-10 h-10 bg-gray-200 rounded-full;
}
```

### Focus States
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 
         focus:ring-offset-2;
}

.focus-ring-inset {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 
         focus:ring-inset;
}
```

### Hover Effects
```css
.hover-lift {
  @apply transition-transform duration-200 hover:-translate-y-1;
}

.hover-scale {
  @apply transition-transform duration-200 hover:scale-105;
}

.hover-shadow {
  @apply transition-shadow duration-200 hover:shadow-lg;
}
```

## Responsive Design

### Breakpoints
```css
/* Tailwind CSS Breakpoints */
sm: 640px    /* Small devices (landscape phones) */
md: 768px    /* Medium devices (tablets) */
lg: 1024px   /* Large devices (laptops) */
xl: 1280px   /* Extra large devices (desktops) */
2xl: 1536px  /* 2X Large devices (large desktops) */
```

### Mobile-First Patterns
```css
/* Mobile navigation */
.mobile-nav {
  @apply fixed inset-0 z-50 bg-white lg:hidden;
}

/* Responsive text */
.responsive-heading {
  @apply text-2xl sm:text-3xl lg:text-4xl;
}

/* Responsive spacing */
.responsive-padding {
  @apply px-4 sm:px-6 lg:px-8;
}

/* Responsive grid */
.responsive-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}
```

## Animations & Transitions

### Standard Transitions
```css
.transition-default {
  @apply transition-all duration-200 ease-in-out;
}

.transition-fast {
  @apply transition-all duration-150 ease-in-out;
}

.transition-slow {
  @apply transition-all duration-300 ease-in-out;
}
```

### Custom Animations
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
```

## Accessibility Guidelines

### Color Contrast
- Text on white: minimum 4.5:1 ratio
- Large text: minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio for borders

### Focus Management
```css
/* Skip link */
.skip-link {
  @apply sr-only focus:not-sr-only focus:absolute focus:top-4 
         focus:left-4 bg-primary-600 text-white px-4 py-2 
         rounded z-50;
}

/* Focus visible */
.focus-visible {
  @apply focus-visible:outline-none focus-visible:ring-2 
         focus-visible:ring-primary-500 focus-visible:ring-offset-2;
}
```

### Screen Reader Support
```css
.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden 
         whitespace-nowrap border-0;
}

.not-sr-only {
  @apply static w-auto h-auto p-0 m-0 overflow-visible 
         whitespace-normal;
}
```

## Custom CSS Extensions

### Media Query Utilities
```css
@media (prefers-reduced-motion: reduce) {
  .motion-safe {
    animation: none !important;
    transition: none !important;
  }
}

@media (prefers-color-scheme: dark) {
  /* Dark mode styles when implemented */
}
```

### Print Styles
```css
@media print {
  .no-print {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
}
```

## Performance Considerations

### CSS Optimization
- Use Tailwind's purge functionality to remove unused styles
- Minimize custom CSS in favor of utility classes
- Use `@apply` directive for component patterns
- Avoid deep nesting in custom CSS

### Asset Loading
- Preload critical fonts
- Use system fonts as fallbacks
- Optimize icon usage with SVG sprites
- Implement lazy loading for non-critical images

## Browser Support

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallbacks
```css
/* CSS Grid fallback */
.grid-fallback {
  display: flex;
  flex-wrap: wrap;
}

/* Custom property fallback */
.color-fallback {
  background-color: #3b82f6; /* fallback */
  background-color: var(--primary-500);
}
```

## Implementation Notes

### Development Workflow
1. Use Tailwind utility classes for most styling
2. Create component classes with `@apply` for repeated patterns
3. Document any custom CSS decisions
4. Test across all target browsers
5. Validate accessibility with automated tools

### Code Organization
- Keep custom styles in dedicated CSS modules
- Use CSS custom properties for dynamic values
- Organize component styles co-located with components
- Maintain consistent naming conventions

This style system ensures VoxNote AI maintains a cohesive, accessible, and performant visual design while supporting the application's video and voice note functionality.
