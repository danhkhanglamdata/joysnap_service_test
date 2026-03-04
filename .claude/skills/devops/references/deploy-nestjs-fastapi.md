# Deploy NestJS & FastAPI

## NestJS

### Build
```bash
npm run build  # Creates dist/
```

### Docker
```dockerfile
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
COPY package*.json ./

ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Docker Compose (with DB)
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:secret@db:5432/app
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### PM2
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nestjs-api',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### Railway/Render
```bash
# Procfile
web: node dist/main.js
```

---

## FastAPI

### Docker
```dockerfile
FROM python:3.12-slim AS builder
WORKDIR /app
RUN pip install uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /app/.venv ./.venv
COPY src ./src

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
USER nobody
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgres://postgres:secret@db:5432/app
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Gunicorn (Production)
```bash
# With uvicorn workers
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

```dockerfile
# Dockerfile with Gunicorn
CMD ["gunicorn", "src.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
```

### systemd
```ini
# /etc/systemd/system/fastapi.service
[Unit]
Description=FastAPI App
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/api
ExecStart=/var/www/api/.venv/bin/gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

### GCP Cloud Run
```bash
gcloud run deploy fastapi-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Health Check Endpoint

```python
# FastAPI
@app.get("/health")
def health():
    return {"status": "ok"}
```

```typescript
// NestJS
@Controller()
export class HealthController {
  @Get('health')
  check() {
    return { status: 'ok' };
  }
}
```
