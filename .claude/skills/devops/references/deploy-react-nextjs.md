# Deploy React & Next.js

## React (Vite/CRA)

### Static Build
```bash
npm run build  # Creates dist/ or build/
```

### Vercel
```bash
npm i -g vercel
vercel  # Follow prompts
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Nginx (VPS)
```nginx
server {
    listen 80;
    server_name myapp.com;
    root /var/www/myapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## Next.js

### Build Modes
```bash
# SSR (default) - requires Node.js server
npm run build && npm start

# Static export - no server needed
# next.config.js: output: 'export'
npm run build  # Creates out/
```

### Vercel (Recommended)
```bash
# Auto-detects Next.js, zero config
vercel
```

### Docker (SSR)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
```

```javascript
// next.config.js (enable standalone)
module.exports = {
  output: 'standalone'
}
```

### PM2 (VPS)
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nextjs',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/myapp',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### Cloudflare Pages
```bash
# next.config.js
module.exports = {
  output: 'export'  # Static only
}

# Or use @cloudflare/next-on-pages for SSR
npx wrangler pages deploy .vercel/output/static
```

### AWS Amplify
```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production (set in platform dashboard)
NEXT_PUBLIC_API_URL=https://api.myapp.com
DATABASE_URL=postgres://...
```

**Note:** `NEXT_PUBLIC_` prefix exposes to browser.
