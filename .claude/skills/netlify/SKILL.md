---
description: Deploy and manage web applications on Netlify - CLI commands, Edge Functions, serverless functions, build configuration, domain management, and framework integrations (Next.js, Astro, Angular, etc.). Use when deploying to Netlify, configuring builds, setting up domains, or working with Netlify-specific features.
---

# Netlify

## When to Use

- Deploying web applications to Netlify
- Configuring Netlify builds and deployments
- Setting up custom domains and HTTPS
- Working with Netlify Edge Functions or serverless functions
- Configuring environment variables for Netlify
- Setting up Netlify Forms for serverless form handling
- Using Netlify Blobs for key-value storage
- Working with Netlify CLI for local development
- Integrating frameworks (Next.js, Astro, Angular, etc.) with Netlify

## Key Concepts

### Netlify CLI

The Netlify CLI is the primary tool for local development and deployment:

```bash
# Install
npm install -g netlify-cli

# Login
netlify login

# Initialize a new site
netlify init

# Local development
netlify dev

# Deploy
netlify deploy           # Deploy preview
netlify deploy --prod    # Production deploy

# Link existing site
netlify link

# Open site in browser
netlify open
```

### netlify.toml Configuration

The `netlify.toml` file is the primary configuration file:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# Redirects
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"

# Edge Functions
[[edge_functions]]
  path = "/api/*"
  function = "api-handler"
```

### Deployment Methods

1. **Git-based deploys**: Push to connected repository
2. **CLI deploys**: `netlify deploy --prod`
3. **API deploys**: Via Netlify API
4. **Build hooks**: Trigger via webhook URL

### Environment Variables

> **⚠️ Security Note:** Never put sensitive values (API keys, secrets, tokens, passwords) in `netlify.toml` as it is committed to version control. Use the Netlify CLI (`netlify env:set`) or the Netlify UI for sensitive environment variables.

```bash
# Set via CLI (RECOMMENDED for sensitive values)
netlify env:set API_KEY "your-key"
netlify env:list
netlify env:get API_KEY

# Or in netlify.toml (NON-SENSITIVE values only!)
[build.environment]
  NODE_ENV = "production"  # OK - not sensitive
  # API_KEY = "your-key"   # NEVER do this!

# Or in Netlify UI: Site settings > Environment variables (recommended for secrets)
```

## Framework Support

| Framework | Adapter/Plugin | Key Features |
|-----------|---------------|--------------|
| Next.js | `@netlify/plugin-nextjs` | ISR, Image optimization, Middleware |
| Astro | `@astrojs/netlify` | SSR, Edge Functions |
| Angular | Built-in | SSR, Prerendering |
| Gatsby | `gatsby-plugin-netlify` | Incremental builds |
| Nuxt | `@nuxt/netlify` | SSR, Edge rendering |
| SvelteKit | `@sveltejs/adapter-netlify` | Edge/Serverless |
| Remix | `@netlify/remix-adapter` | Edge/Serverless |

## Serverless Functions

Create functions in `netlify/functions/`:

```javascript
// netlify/functions/hello.js
export default async (req, context) => {
  return new Response(JSON.stringify({ message: "Hello!" }), {
    headers: { "Content-Type": "application/json" }
  });
};
```

## Edge Functions

Create in `netlify/edge-functions/`:

```typescript
// netlify/edge-functions/geolocation.ts
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  return new Response(`Hello from ${context.geo.city}!`);
};

export const config = { path: "/geo" };
```

## References

- [CLI Reference](references/cli-reference.md) - Complete CLI commands
- [Build Configuration](references/build-configuration.md) - netlify.toml and build settings
- [Functions & Edge](references/functions-edge.md) - Serverless and Edge Functions
- [Domains & HTTPS](references/domains-https.md) - Custom domains and SSL
- [Framework Guides](references/framework-guides.md) - Framework-specific setup
- [Blobs](references/blobs.md) - Key-value storage for builds, functions, and Edge Functions
- [Forms](references/forms.md) - Serverless form handling with spam protection

## Common Tasks

### Deploy a Site

```bash
# First time setup
netlify init
netlify deploy --prod

# Subsequent deploys (if git-connected)
git push origin main
```

### Set Up Custom Domain

1. Go to Site settings > Domain management
2. Add custom domain
3. Configure DNS (use Netlify DNS or external)
4. HTTPS is automatic with Let's Encrypt

### Add Environment Variables

```bash
# Via CLI
netlify env:set DATABASE_URL "postgres://..."

# Via netlify.toml (non-sensitive only)
[build.environment]
  NODE_ENV = "production"
```

### Create a Redirect

```toml
# netlify.toml
[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301
```

### Set Up Build Hooks

1. Site settings > Build & deploy > Build hooks
2. Create hook with name
3. Use webhook URL to trigger builds

## Integration with /ship Command

When deploying to Netlify via `/ship`:

1. Ensure `netlify.toml` exists with proper configuration
2. Site should be linked (`netlify link`) or initialized (`netlify init`)
3. Use `netlify deploy --prod` for production deployments
4. For preview deployments, use `netlify deploy` without `--prod`

## Troubleshooting

### Build Failures

```bash
# Check build logs
netlify build

# Run locally to debug
netlify dev
```

### Function Errors

```bash
# Test functions locally
netlify functions:serve

# Invoke specific function
netlify functions:invoke function-name
```

### DNS Issues

- Verify DNS propagation: `dig yourdomain.com`
- Check Netlify DNS settings in dashboard
- Allow 24-48 hours for DNS propagation
