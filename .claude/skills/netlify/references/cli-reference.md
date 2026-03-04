# Netlify CLI Reference

## Installation

```bash
# Install globally
npm install -g netlify-cli

# Or use npx
npx netlify-cli <command>
```

## Authentication

```bash
# Login to Netlify
netlify login

# Logout
netlify logout

# Check login status
netlify status
```

## Site Management

### Initialize & Link

```bash
# Initialize new site (interactive)
netlify init

# Link to existing site
netlify link
netlify link --name <site-name>
netlify link --id <site-id>

# Unlink site
netlify unlink
```

### Site Information

```bash
# Show current site status
netlify status

# Open site in browser
netlify open
netlify open:site    # Open site
netlify open:admin   # Open admin panel

# List all sites
netlify sites:list
```

### Create & Delete Sites

```bash
# Create new site
netlify sites:create
netlify sites:create --name <site-name>

# Delete site
netlify sites:delete <site-id>
```

## Deployment

### Deploy Commands

```bash
# Deploy to draft URL (preview)
netlify deploy

# Deploy to production
netlify deploy --prod

# Deploy specific directory
netlify deploy --dir=<directory>

# Deploy with build
netlify deploy --build

# Deploy with message
netlify deploy --message "Deploy message"

# Deploy and open in browser
netlify deploy --open
```

### Deploy Options

| Flag | Description |
|------|-------------|
| `--prod` | Deploy to production |
| `--dir` | Specify publish directory |
| `--functions` | Specify functions directory |
| `--build` | Run build command before deploy |
| `--message` | Deploy message |
| `--open` | Open site after deploy |
| `--json` | Output as JSON |
| `--timeout` | Timeout for deploy (default: 1200s) |

## Local Development

### Netlify Dev

```bash
# Start local dev server
netlify dev

# Start with specific port
netlify dev --port 8888

# Start with live reload
netlify dev --live

# Start in offline mode
netlify dev --offline

# Start with specific framework
netlify dev --framework <framework>
```

### Dev Options

| Flag | Description |
|------|-------------|
| `--port` | Port for dev server |
| `--targetPort` | Port of your app server |
| `--dir` | Directory to serve |
| `--functions` | Functions directory |
| `--offline` | Disable network features |
| `--live` | Enable live reload |
| `--debug` | Enable debug mode |

## Environment Variables

```bash
# List all env vars
netlify env:list

# Get specific env var
netlify env:get <name>

# Set env var
netlify env:set <name> <value>

# Set env var for specific context
netlify env:set <name> <value> --context production
netlify env:set <name> <value> --context deploy-preview
netlify env:set <name> <value> --context branch-deploy

# Unset env var
netlify env:unset <name>

# Import from .env file
netlify env:import .env

# Clone env vars from another site
netlify env:clone --from <site-id>
```

## Functions

### Function Commands

```bash
# List functions
netlify functions:list

# Create new function
netlify functions:create
netlify functions:create <name>
netlify functions:create --name <name>

# Serve functions locally
netlify functions:serve

# Invoke function locally
netlify functions:invoke <name>
netlify functions:invoke <name> --payload '{"key": "value"}'
netlify functions:invoke <name> --querystring "key=value"
```

### Function Options

| Flag | Description |
|------|-------------|
| `--name` | Function name |
| `--url` | URL template |
| `--payload` | JSON payload |
| `--querystring` | Query string |
| `--identity` | Include identity context |

## Build

```bash
# Run build locally
netlify build

# Run build with specific config
netlify build --context production
netlify build --context deploy-preview

# Run build in dry-run mode
netlify build --dry

# Run build in offline mode
netlify build --offline
```

## Logs

```bash
# Stream function logs
netlify logs:function
netlify logs:function <name>

# Stream deploy logs
netlify logs:deploy
```

## Blobs (Key-Value Storage)

```bash
# List blobs
netlify blobs:list

# Get blob
netlify blobs:get <store> <key>

# Set blob
netlify blobs:set <store> <key> <value>

# Delete blob
netlify blobs:delete <store> <key>
```

## Recipes (Common Workflows)

```bash
# List available recipes
netlify recipes:list

# Run a recipe
netlify recipes <name>

# Example: VS Code debugging setup
netlify recipes vscode
```

## Addons

```bash
# List available addons
netlify addons:list

# Create addon
netlify addons:create <name>

# Delete addon
netlify addons:delete <name>

# Show addon auth info
netlify addons:auth <name>
```

## Completion

```bash
# Generate shell completion
netlify completion:generate
netlify completion:generate:bash
netlify completion:generate:zsh
netlify completion:generate:fish
```

## Common Workflows

### First-Time Setup

```bash
# 1. Install CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Initialize site
cd your-project
netlify init

# 4. Deploy
netlify deploy --prod
```

### Continuous Deployment

```bash
# Link to existing site
netlify link

# Make changes, then deploy
netlify deploy --prod --message "Feature: Add new component"
```

### Local Development with Functions

```bash
# Start dev server with functions
netlify dev

# In another terminal, invoke function
netlify functions:invoke my-function --payload '{"test": true}'
```

### Environment Variable Management

```bash
# Set production secrets
netlify env:set API_KEY "secret-key" --context production

# Set preview secrets
netlify env:set API_KEY "test-key" --context deploy-preview

# Import from file
netlify env:import .env.production --context production
```
