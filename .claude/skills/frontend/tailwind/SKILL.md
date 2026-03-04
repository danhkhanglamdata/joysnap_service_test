# Tailwind CSS

## Description

Tailwind CSS v4 utility-first styling with CSS-first configuration, container queries, 3D transforms, and modern color system.

## Version

Tailwind CSS v4.0 (Beta) / v3.4.x (Stable) - December 2024

## When to Use

- Styling React/Next.js components
- Responsive design
- Rapid UI development
- Design systems with CSS variables
- Container-based responsive layouts

---

## What's New in v4

### Performance
- **Oxide Engine**: 5x faster full builds, 100x faster incremental builds
- Rewritten in TypeScript and Rust
- Unified toolchain (no PostCSS, Autoprefixer, postcss-import needed)

### CSS-First Configuration
- Configure via CSS with `@theme` directive
- No `tailwind.config.js` required (optional)
- Native CSS cascade layers

### New Features
- **Container Queries**: Built-in, no plugin needed
- **3D Transforms**: `rotate-x-*`, `rotate-y-*`, `scale-z-*`, `translate-z-*`, `perspective-*`
- **OKLCH Colors**: Modern P3 color palette
- **New Gradients**: `bg-linear-*`, `bg-radial-*`, `bg-conic-*` with angles
- **field-sizing**: Auto-resize textareas
- **@starting-style**: Transition entry animations
- **not-* variant**: Negation selector

---

## Breaking Changes (v3 → v4)

### Import Syntax
```css
/* v3 - OLD */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 - NEW */
@import "tailwindcss";
```

### Gradient Classes
```html
<!-- v3 - OLD -->
<div class="bg-gradient-to-r from-blue-500 to-purple-500">

<!-- v4 - NEW -->
<div class="bg-linear-to-r from-blue-500 to-purple-500">
```

### Ring Width Default
```html
<!-- v3: ring = 3px, v4: ring = 1px -->
<!-- To keep 3px width in v4: -->
<button class="focus:ring-3 focus:ring-blue-500">
```

### CSS Variable Syntax
```html
<!-- v3 - OLD -->
<div class="bg-[--brand-color]">

<!-- v4 - NEW -->
<div class="bg-(--brand-color)">
```

### PostCSS Config
```js
// v3 - OLD
export default {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

// v4 - NEW
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

---

## Migration Guide

### Automated Upgrade
```bash
# Requires Node.js 20+
npx @tailwindcss/upgrade
```

### Manual Steps
1. Update imports in CSS files
2. Replace `bg-gradient-*` with `bg-linear-*`
3. Update `ring` to `ring-3` if needed
4. Update CSS variable syntax `[--var]` → `(--var)`
5. Remove postcss-import and autoprefixer from config

---

## Setup

### Vite (Recommended)
```typescript
// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

### PostCSS
```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### CSS Entry
```css
/* app.css */
@import "tailwindcss";
```

---

## CSS-First Configuration

### Theme Customization
```css
@import "tailwindcss";

@theme {
  --color-brand: oklch(0.7 0.15 200);
  --font-display: "Inter", sans-serif;
  --breakpoint-3xl: 1920px;
}
```

### Custom Utilities
```css
@utility scrollbar-hidden {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

---

## Core Patterns

### Layout

```html
<!-- Flexbox -->
<div class="flex items-center justify-between gap-4">
  <div>Left</div>
  <div>Right</div>
</div>

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Item</div>
</div>

<!-- Container -->
<div class="container mx-auto px-4">
  Content
</div>
```

### Responsive (Mobile-First)

```html
<!-- Breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px -->
<div class="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>

<h1 class="text-xl md:text-2xl lg:text-4xl">
  Responsive text
</h1>
```

### Container Queries (v4)

```html
<!-- Parent with @container -->
<div class="@container">
  <!-- Child responds to container size, not viewport -->
  <div class="@sm:flex @lg:grid @lg:grid-cols-2">
    Content adapts to container
  </div>
</div>

<!-- Named containers -->
<div class="@container/sidebar">
  <div class="@md/sidebar:hidden">
    Hidden when sidebar container is md+
  </div>
</div>
```

### 3D Transforms (v4)

```html
<!-- Rotate on X/Y axis -->
<div class="rotate-x-12 rotate-y-6">
  3D rotated element
</div>

<!-- Perspective -->
<div class="perspective-500">
  <div class="rotate-y-45">
    Element with perspective
  </div>
</div>

<!-- Backface visibility -->
<div class="backface-hidden">
  Hidden when rotated away
</div>

<!-- Scale on Z axis -->
<div class="scale-z-150">
  Scaled in 3D space
</div>
```

### Modern Gradients (v4)

```html
<!-- Linear with angle -->
<div class="bg-linear-45 from-blue-500 to-purple-500">
  45-degree gradient
</div>

<!-- Radial gradient -->
<div class="bg-radial from-white to-gray-200">
  Radial gradient
</div>

<!-- Conic gradient -->
<div class="bg-conic from-red-500 via-yellow-500 to-green-500">
  Conic gradient
</div>

<!-- Gradient interpolation -->
<div class="bg-linear-to-r from-blue-500 to-red-500 interpolate-oklch">
  Smooth color transition
</div>
```

### States

```html
<button class="
  bg-blue-500 hover:bg-blue-600
  focus:ring-3 focus:ring-blue-500 focus:ring-offset-2
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Button
</button>
```

### Dark Mode

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>

<!-- With color scheme -->
<html class="color-scheme-dark">
```

### Entry Animations (v4)

```html
<!-- @starting-style for entry transitions -->
<div class="
  opacity-100 transition-opacity
  starting:opacity-0
">
  Fades in on mount
</div>
```

### Field Sizing (v4)

```html
<!-- Auto-resize textarea -->
<textarea class="field-sizing-content">
  Grows with content
</textarea>
```

### Not Variant (v4)

```html
<!-- Style when NOT in a state -->
<div class="not-hover:opacity-50">
  Dimmed when not hovered
</div>

<input class="not-focus:border-gray-300">
```

---

## Best Practices

1. **Use CSS-first config** - Leverage `@theme` for customization
2. **Container queries over media queries** - For component-based responsive
3. **Consistent spacing scale** - Stick to default scale (4, 8, 12, 16...)
4. **Mobile-first design** - Start with base, add breakpoint modifiers
5. **Extract to components** - Not utilities, for repeated patterns
6. **Use @apply sparingly** - Prefer utility classes in markup
7. **Leverage OKLCH colors** - Better color interpolation
8. **Use cn() helper** - For conditional class merging

## Common Pitfalls

- **Old import syntax**: Use `@import "tailwindcss"` not `@tailwind`
- **Old gradient classes**: Use `bg-linear-*` not `bg-gradient-*`
- **Ring width changed**: Add `ring-3` for old 3px default
- **CSS variable syntax**: Use `(--var)` not `[--var]`
- **Missing Vite plugin**: Use `@tailwindcss/vite` for best DX
- **Too many classes**: Extract to components when truly repeated
- **Inconsistent spacing**: Stick to the spacing scale

## Commands

```bash
# Install
npm install tailwindcss @tailwindcss/vite

# Upgrade from v3
npx @tailwindcss/upgrade

# With PostCSS
npm install tailwindcss @tailwindcss/postcss
```

## Resources

- Tailwind CSS: https://tailwindcss.com
- Upgrade Guide: https://tailwindcss.com/docs/upgrade-guide
- v4 Blog Post: https://tailwindcss.com/blog/tailwindcss-v4
