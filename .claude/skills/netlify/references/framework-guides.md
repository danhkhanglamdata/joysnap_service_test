# Netlify Framework Integration Guides

## Overview

Netlify provides optimized support for popular web frameworks with automatic detection, build configuration, and runtime features.

## Next.js

### Automatic Setup

Netlify automatically detects Next.js and configures optimal settings.

### Manual Setup

```bash
# Install the Netlify adapter
npm install @netlify/plugin-nextjs
```

```toml
# netlify.toml
[[plugins]]
  package = "@netlify/plugin-nextjs"

[build]
  command = "npm run build"
  publish = ".next"
```

### Supported Features

| Feature | Support |
|---------|---------|
| Static Generation (SSG) | ✅ Full |
| Server-Side Rendering (SSR) | ✅ Full |
| Incremental Static Regeneration (ISR) | ✅ Full |
| Image Optimization | ✅ Via Netlify Image CDN |
| Middleware | ✅ Via Edge Functions |
| API Routes | ✅ Via Serverless Functions |
| App Router | ✅ Full |
| Pages Router | ✅ Full |

### Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify handles image optimization
  images: {
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
  // Enable experimental features
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

### Environment Variables

```bash
# Netlify-specific Next.js env vars
NETLIFY=true
NETLIFY_LOCAL=true  # When using netlify dev
URL=https://your-site.netlify.app
DEPLOY_URL=https://deploy-preview-123--your-site.netlify.app
```

---

## Astro

### Setup

```bash
# Install Netlify adapter
npm install @astrojs/netlify
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server', // or 'hybrid' for mixed static/SSR
  adapter: netlify(),
});
```

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
```

### Supported Features

| Feature | Support |
|---------|---------|
| Static Sites | ✅ Full |
| SSR | ✅ Via Functions/Edge |
| Hybrid Rendering | ✅ Full |
| Image Optimization | ✅ Via Netlify Image CDN |
| Edge Functions | ✅ Full |

### Edge Functions with Astro

```javascript
// astro.config.mjs
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify({
    edgeMiddleware: true, // Use Edge Functions for middleware
  }),
});
```

---

## Angular

### Setup

Angular is automatically detected. For SSR:

```bash
# Add Angular Universal
ng add @angular/ssr
```

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist/your-app/browser"

# For SSR
[build]
  command = "npm run build:ssr"
  publish = "dist/your-app/browser"
```

### Supported Features

| Feature | Support |
|---------|---------|
| Static Sites | ✅ Full |
| SSR (Angular Universal) | ✅ Full |
| Prerendering | ✅ Full |
| Image Optimization | ✅ Via Netlify Image CDN |

---

## Gatsby

### Setup

```bash
# Install Gatsby plugin
npm install gatsby-plugin-netlify
```

```javascript
// gatsby-config.js
module.exports = {
  plugins: ['gatsby-plugin-netlify'],
};
```

```toml
# netlify.toml
[build]
  command = "gatsby build"
  publish = "public"

[[plugins]]
  package = "gatsby-plugin-netlify"
```

### Supported Features

| Feature | Support |
|---------|---------|
| Static Generation | ✅ Full |
| Deferred Static Generation | ✅ Full |
| Incremental Builds | ✅ With cache plugin |
| Image Optimization | ✅ Via gatsby-plugin-image |
| Functions | ✅ Full |

### Incremental Builds

```toml
# netlify.toml
[[plugins]]
  package = "netlify-plugin-gatsby-cache"
```

---

## Nuxt

### Setup (Nuxt 3)

```bash
# Nuxt 3 has built-in Netlify support
npx nuxi init my-app
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'netlify',
  },
});
```

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".output/public"
```

### Supported Features

| Feature | Support |
|---------|---------|
| Static Generation | ✅ Full |
| SSR | ✅ Full |
| Hybrid Rendering | ✅ Full |
| Edge Rendering | ✅ Via Edge Functions |
| API Routes | ✅ Full |

### Edge Rendering

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'netlify_edge',
  },
});
```

---

## SvelteKit

### Setup

```bash
# Install Netlify adapter
npm install -D @sveltejs/adapter-netlify
```

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-netlify';

export default {
  kit: {
    adapter: adapter({
      edge: false, // Set to true for Edge Functions
      split: false, // Split into separate functions
    }),
  },
};
```

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "build"
```

### Supported Features

| Feature | Support |
|---------|---------|
| Static Sites | ✅ Full |
| SSR | ✅ Full |
| Edge Functions | ✅ Full |
| Form Actions | ✅ Full |
| API Routes | ✅ Full |

---

## Remix

### Setup

```bash
# Install Netlify adapter
npm install @netlify/remix-adapter
```

```javascript
// remix.config.js
module.exports = {
  serverBuildTarget: 'netlify',
  server: './server.js',
};
```

```toml
# netlify.toml
[build]
  command = "remix build"
  publish = "public"

[functions]
  included_files = ["./build/**"]
```

### Supported Features

| Feature | Support |
|---------|---------|
| SSR | ✅ Full |
| Edge Functions | ✅ Full |
| Loaders/Actions | ✅ Full |
| Streaming | ✅ Full |

---

## Vue / Vite

### Setup

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

# SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### With SSR (Vite SSR)

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    ssr: true,
  },
});
```

---

## Hugo

### Setup

```toml
# netlify.toml
[build]
  command = "hugo"
  publish = "public"

[build.environment]
  HUGO_VERSION = "0.121.0"
```

### Extended Hugo

```toml
[build.environment]
  HUGO_VERSION = "0.121.0"
  HUGO_EXTENDED = "true"
```

---

## Eleventy (11ty)

### Setup

```toml
# netlify.toml
[build]
  command = "npx @11ty/eleventy"
  publish = "_site"
```

### With Edge Functions

```javascript
// .eleventy.js
module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-netlify-edge"));
};
```

---

## Express.js

### Setup

Deploy Express as a Netlify Function:

```javascript
// netlify/functions/api.js
const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

module.exports.handler = serverless(app);
```

```toml
# netlify.toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

---

## Common Configuration Patterns

### SPA Fallback (All Frameworks)

```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### API Proxy

```toml
# netlify.toml
[[redirects]]
  from = "/api/*"
  to = "https://api.example.com/:splat"
  status = 200
  force = true
```

### Cache Headers for Static Assets

```toml
# netlify.toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Environment-Specific Builds

```toml
# netlify.toml
[context.production]
  command = "npm run build:prod"
  [context.production.environment]
    NODE_ENV = "production"
    API_URL = "https://api.example.com"

[context.deploy-preview]
  command = "npm run build:preview"
  [context.deploy-preview.environment]
    NODE_ENV = "development"
    API_URL = "https://api-staging.example.com"
```
