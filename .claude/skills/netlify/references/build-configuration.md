# Netlify Build Configuration

## netlify.toml Overview

The `netlify.toml` file is the primary configuration file for Netlify builds and deployments.

## Basic Structure

```toml
# Build settings
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"
  edge_functions = "netlify/edge-functions"

# Build environment
[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

# Production context
[context.production]
  command = "npm run build:prod"

# Deploy preview context
[context.deploy-preview]
  command = "npm run build:preview"

# Branch deploy context
[context.branch-deploy]
  command = "npm run build:staging"

# Specific branch context
[context.staging]
  command = "npm run build:staging"
```

## Build Settings

### Core Build Options

| Setting | Description | Example |
|---------|-------------|---------|
| `command` | Build command | `"npm run build"` |
| `publish` | Publish directory | `"dist"`, `"build"`, `".next"` |
| `functions` | Functions directory | `"netlify/functions"` |
| `edge_functions` | Edge functions directory | `"netlify/edge-functions"` |
| `base` | Base directory for monorepos | `"packages/web"` |
| `ignore` | Ignore build command | `"git diff --quiet HEAD^ HEAD -- ./"` |

### Build Environment Variables

```toml
[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"
  YARN_VERSION = "1.22.19"
  PNPM_VERSION = "8"
  RUBY_VERSION = "3.2.0"
  GO_VERSION = "1.21"
  PYTHON_VERSION = "3.11"
  PHP_VERSION = "8.2"
```

## Context-Specific Configuration

### Available Contexts

| Context | Description |
|---------|-------------|
| `production` | Production deploys |
| `deploy-preview` | Pull request previews |
| `branch-deploy` | Branch deploys |
| `[branch-name]` | Specific branch |

### Context Examples

```toml
# Production-specific settings
[context.production]
  command = "npm run build:prod"
  [context.production.environment]
    API_URL = "https://api.example.com"

# Preview-specific settings
[context.deploy-preview]
  command = "npm run build:preview"
  [context.deploy-preview.environment]
    API_URL = "https://api-staging.example.com"

# Staging branch settings
[context.staging]
  command = "npm run build:staging"
  [context.staging.environment]
    API_URL = "https://api-staging.example.com"
```

## Redirects

### Basic Redirects

```toml
# Simple redirect
[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301

# Redirect with wildcard
[[redirects]]
  from = "/blog/*"
  to = "/articles/:splat"
  status = 301

# Proxy (invisible redirect)
[[redirects]]
  from = "/api/*"
  to = "https://api.example.com/:splat"
  status = 200

# SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Advanced Redirects

```toml
# Redirect with query parameters
[[redirects]]
  from = "/search"
  to = "/find"
  query = {q = ":q"}
  status = 301

# Conditional redirect (by country)
[[redirects]]
  from = "/*"
  to = "/uk/:splat"
  status = 302
  conditions = {Country = ["GB", "IE"]}

# Conditional redirect (by language)
[[redirects]]
  from = "/*"
  to = "/es/:splat"
  status = 302
  conditions = {Language = ["es"]}

# Role-based redirect (with Netlify Identity)
[[redirects]]
  from = "/admin/*"
  to = "/admin/:splat"
  status = 200
  conditions = {Role = ["admin"]}

# Signed URL redirect
[[redirects]]
  from = "/protected/*"
  to = "/:splat"
  status = 200
  signed = "API_SIGNATURE_TOKEN"
```

## Headers

### Basic Headers

```toml
# Global headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Cache headers for static assets
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# CORS headers for API
[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
```

### Security Headers

```toml
[[headers]]
  for = "/*"
  [headers.values]
    # Content Security Policy
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"

    # Strict Transport Security
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"

    # Permissions Policy
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

## Edge Functions Configuration

```toml
# Edge function for specific path
[[edge_functions]]
  path = "/api/*"
  function = "api-handler"

# Edge function with exclusions
[[edge_functions]]
  path = "/*"
  function = "middleware"
  excludedPath = ["/static/*", "/_next/*"]

# Multiple paths for same function
[[edge_functions]]
  path = ["/api/*", "/graphql"]
  function = "api-handler"
```

## Functions Configuration

```toml
[functions]
  # Default directory
  directory = "netlify/functions"

  # Node.js bundler
  node_bundler = "esbuild"

  # Include additional files
  included_files = ["data/**"]

  # External node modules
  external_node_modules = ["sharp"]

# Function-specific configuration
[functions."my-function"]
  external_node_modules = ["canvas"]
  included_files = ["fonts/**"]
```

## Plugins

```toml
# Install and configure plugins
[[plugins]]
  package = "@netlify/plugin-nextjs"

[[plugins]]
  package = "netlify-plugin-cache"
  [plugins.inputs]
    paths = [".cache", "node_modules/.cache"]

[[plugins]]
  package = "@netlify/plugin-lighthouse"
  [plugins.inputs]
    output_path = "reports/lighthouse.html"
```

## Build Hooks

```toml
# Build hooks are configured in the Netlify UI
# They generate webhook URLs that trigger builds

# You can use environment variables to store hook URLs
# NETLIFY_BUILD_HOOK_URL = "https://api.netlify.com/build_hooks/..."
```

## Ignore Builds

```toml
[build]
  # Ignore builds based on file changes
  ignore = "git diff --quiet HEAD^ HEAD -- src/"

  # Or use a script
  ignore = "./scripts/should-build.sh"
```

### Ignore Script Example

```bash
#!/bin/bash
# scripts/should-build.sh

# Skip builds for documentation-only changes
if git diff --quiet HEAD^ HEAD -- docs/; then
  echo "Docs only change, skipping build"
  exit 0
fi

# Build for all other changes
exit 1
```

## Monorepo Configuration

```toml
# Base directory for the app
[build]
  base = "apps/web"
  command = "npm run build"
  publish = "dist"

# Ignore builds for other packages
[build]
  ignore = "git diff --quiet HEAD^ HEAD -- apps/web/"
```

## Complete Example

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "20"

[context.production]
  command = "npm run build:prod"
  [context.production.environment]
    VITE_API_URL = "https://api.example.com"

[context.deploy-preview]
  command = "npm run build:preview"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[edge_functions]]
  path = "/geo/*"
  function = "geolocation"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```
