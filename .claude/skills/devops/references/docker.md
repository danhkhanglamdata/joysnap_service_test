# Docker & Docker Compose

## Dockerfile Best Practices

### Multi-stage Build (Node.js)
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Multi-stage Build (Python)
```dockerfile
FROM python:3.12-slim AS builder
WORKDIR /app
RUN pip install --user uv
COPY pyproject.toml uv.lock ./
RUN ~/.local/bin/uv sync --frozen

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /app/.venv ./.venv
COPY src ./src
ENV PATH="/app/.venv/bin:$PATH"
USER nobody
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0"]
```

## Docker Compose Patterns

### Development Stack
```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      target: development
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Production Stack
```yaml
version: '3.8'
services:
  app:
    image: myapp:latest
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    environment:
      - NODE_ENV=production
```

## Optimization Tips

1. **Use .dockerignore** - Exclude node_modules, .git, logs
2. **Layer caching** - Copy package.json before source code
3. **Alpine images** - Smaller base images
4. **Non-root user** - Security best practice
5. **Health checks** - Enable container orchestration
