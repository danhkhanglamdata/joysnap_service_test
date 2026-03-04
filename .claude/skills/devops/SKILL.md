---
name: devops
description: DevOps practices for frontend and backend deployment, CI/CD pipelines (GitHub Actions, GitLab CI), containerization (Docker, Docker Compose), process managers (PM2, systemd), orchestration (Kubernetes), cloud platforms (Vercel, Netlify, AWS, GCP, Cloudflare), monitoring, and infrastructure as code. Use when deploying applications, setting up CI/CD, containerizing services, managing processes, or configuring cloud infrastructure.
---

# DevOps Skill

Comprehensive DevOps practices for modern application deployment and infrastructure management.

## Versions

- Docker 27.x (December 2024)
- Node.js 22.x LTS (December 2024)

## When to Use

- Setting up CI/CD pipelines
- Containerizing applications (Docker, Docker Compose)
- Deploying frontend/backend applications
- Managing processes (PM2, systemd)
- Configuring cloud platforms
- Setting up monitoring and logging
- Infrastructure as code

## Quick Reference

### Docker

```dockerfile
# Node.js app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://db:5432/app
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=app
      - POSTGRES_PASSWORD=secret

volumes:
  postgres_data:
```

### PM2 Process Manager

```bash
# Install
npm install -g pm2

# Start app
pm2 start dist/index.js --name "api"

# Cluster mode (use all CPUs)
pm2 start dist/index.js -i max --name "api"

# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production' }
  }]
}
```

### GitHub Actions CI/CD

```yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      # Deploy step here
```

## Deployment Strategies

| Strategy | Use Case | Rollback |
|----------|----------|----------|
| Blue-Green | Zero downtime, instant rollback | Instant |
| Canary | Gradual rollout, risk mitigation | Fast |
| Rolling | Resource efficient | Slower |
| Recreate | Simple, stateful apps | Downtime |

## Platform Quick Start

| Platform | Frontend | Backend | Command |
|----------|----------|---------|---------|
| Vercel | ✅ | Serverless | `vercel deploy` |
| Netlify | ✅ | Functions | `netlify deploy` |
| Railway | ✅ | ✅ | `railway up` |
| Fly.io | ✅ | ✅ | `fly deploy` |
| AWS | ✅ | ✅ | Various |
| Cloudflare | Pages/Workers | Workers | `wrangler deploy` |

## References

### Infrastructure
- `references/docker.md` - Dockerfile patterns, multi-stage builds, Docker Compose
- `references/ci-cd.md` - GitHub Actions, GitLab CI, pipeline patterns
- `references/process-managers.md` - PM2, systemd, Supervisor

### Cloud & Hosting
- `references/cloud-platforms.md` - AWS, GCP, Azure, Cloudflare
- `references/vps-self-host.md` - DigitalOcean, Linode, Hetzner, Nginx, SSL

### Framework Deployment
- `references/deploy-react-nextjs.md` - React, Next.js (Vercel, Docker, VPS)
- `references/deploy-nestjs-fastapi.md` - NestJS, FastAPI (Docker, PM2, Gunicorn)
- `references/deploy-mcp.md` - MCP servers (stdio, HTTP+SSE, remote)

## Best Practices

1. **Multi-stage Docker builds** - Smaller images, faster deploys
2. **Environment variables** - Never hardcode secrets
3. **Health checks** - Always implement `/health` endpoint
4. **Graceful shutdown** - Handle SIGTERM properly
5. **Logging** - Structured JSON logs for aggregation
6. **Monitoring** - Metrics, alerts, dashboards
7. **Infrastructure as Code** - Version control everything
