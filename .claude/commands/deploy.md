# /deploy - Multi-Platform Deployment

## Purpose

Deploy applications to various platforms (Netlify, Vercel, Docker, VPS) with automatic configuration detection and framework-specific optimizations.

## Usage

```
/deploy [platform] [options]
```

## Arguments

- `$ARGUMENTS`: Platform name and optional flags
  - `netlify` - Deploy to Netlify
  - `vercel` - Deploy to Vercel
  - `docker` - Build and deploy Docker container
  - `vps` - Deploy to VPS/self-hosted

---

Deploy to: **$ARGUMENTS**

## Workflow

### Phase 1: Environment Detection

1. **Detect Project Type**
   - Check for `package.json` (Node.js/Frontend)
   - Check for `pyproject.toml` or `requirements.txt` (Python)
   - Check for `Dockerfile` (Containerized)

2. **Detect Framework**
   - Next.js: `next.config.js` or `next.config.mjs`
   - Astro: `astro.config.mjs`
   - React/Vite: `vite.config.ts`
   - FastAPI: `main.py` with FastAPI imports
   - Django: `manage.py`

3. **Check Existing Configuration**
   - `netlify.toml` for Netlify
   - `vercel.json` for Vercel
   - `Dockerfile` for Docker
   - `.github/workflows/` for CI/CD

### Phase 2: Platform-Specific Setup

#### Netlify Deployment

1. **Activate Skill**
   - Load `netlify` skill from `.claude/skills/netlify/`

2. **Check Prerequisites**
   ```bash
   netlify status
   ```

3. **Initialize if Needed**
   ```bash
   netlify init
   ```

4. **Configure Build**
   - Create/update `netlify.toml` based on framework
   - Set environment variables

5. **Deploy**
   ```bash
   # Preview deploy
   netlify deploy

   # Production deploy
   netlify deploy --prod
   ```

#### Vercel Deployment

1. **Check Prerequisites**
   ```bash
   vercel whoami
   ```

2. **Deploy**
   ```bash
   # Preview deploy
   vercel

   # Production deploy
   vercel --prod
   ```

#### Docker Deployment

1. **Activate Skill**
   - Load `devops` skill from `.claude/skills/devops/`

2. **Build Image**
   ```bash
   docker build -t [app-name] .
   ```

3. **Push to Registry** (if configured)
   ```bash
   docker push [registry]/[app-name]:latest
   ```

4. **Deploy**
   ```bash
   docker-compose up -d
   ```

#### VPS Deployment

1. **Activate Skill**
   - Load `devops` skill

2. **Configure Process Manager**
   - PM2 for Node.js
   - systemd for Python/other

3. **Setup Nginx** (if needed)
   - Configure reverse proxy
   - Setup SSL with Certbot

### Phase 3: Verification

1. **Check Deployment Status**
   - Verify URL is accessible
   - Check health endpoint
   - Verify SSL certificate

2. **Report Results**
   - Deployment URL
   - Build logs summary
   - Any warnings or issues

## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--mode=[mode]` | Use specific behavioral mode | `--mode=implementation` |
| `--prod` | Production deployment | `--prod` |
| `--preview` | Preview/staging deployment | `--preview` |
| `--build-only` | Build without deploying | `--build-only` |
| `--skip-build` | Deploy existing build | `--skip-build` |
| `--framework=[fw]` | Override framework detection | `--framework=nextjs` |
| `--env=[file]` | Use specific env file | `--env=.env.production` |
| `--message=[msg]` | Deploy message | `--message="v1.2.0"` |

## Platform Quick Reference

| Platform | Skill | Prerequisites |
|----------|-------|---------------|
| Netlify | `netlify` | `netlify-cli`, `netlify login` |
| Vercel | `devops` | `vercel`, `vercel login` |
| Docker | `devops` | `docker`, `docker-compose` |
| VPS | `devops` | SSH access, PM2/systemd |

## Framework Configuration

### Next.js → Netlify

```toml
# netlify.toml (auto-generated)
[[plugins]]
  package = "@netlify/plugin-nextjs"

[build]
  command = "npm run build"
  publish = ".next"
```

### Astro → Netlify

```toml
# netlify.toml (auto-generated)
[build]
  command = "npm run build"
  publish = "dist"
```

### React/Vite → Netlify

```toml
# netlify.toml (auto-generated)
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Output Format

```markdown
## Deployment Report

### Target
- Platform: [Netlify/Vercel/Docker/VPS]
- Environment: [production/preview]
- Framework: [detected framework]

### URLs
- Production: [URL]
- Preview: [URL if applicable]

### Build Summary
- Duration: [time]
- Status: [success/failed]

### Configuration
- [List of config files created/modified]

### Next Steps
- [Any manual steps needed]
```

## Examples

```bash
# Deploy to Netlify production
/deploy netlify --prod

# Preview deploy to Netlify
/deploy netlify --preview

# Deploy with custom message
/deploy netlify --prod --message="Release v2.0"

# Deploy Docker to VPS
/deploy docker --prod

# Deploy with framework override
/deploy netlify --framework=astro --prod
```
