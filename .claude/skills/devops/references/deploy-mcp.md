# Deploy MCP Servers

MCP servers can run as stdio (local) or HTTP+SSE (remote/shared).

## Local Deployment (stdio)

### Python MCP Server
```bash
# Install globally with uvx (recommended)
uvx install my-mcp-server

# Or install in project
uv add my-mcp-server
```

### Node.js MCP Server
```bash
# Install globally
npm install -g my-mcp-server

# Or use npx
npx my-mcp-server
```

### Claude Desktop Config
```json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "my-server": {
      "command": "uvx",
      "args": ["my-mcp-server"],
      "env": {
        "API_KEY": "xxx"
      }
    }
  }
}
```

---

## Remote Deployment (HTTP+SSE)

### Python (FastMCP with SSE)
```python
# server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("my-server")

@mcp.tool()
def my_tool(param: str) -> str:
    return f"Result: {param}"

# Run with SSE transport
if __name__ == "__main__":
    mcp.run(transport="sse", port=8000)
```

### Docker
```dockerfile
FROM python:3.12-slim
WORKDIR /app
RUN pip install uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen
COPY . .
ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000
CMD ["python", "server.py"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  mcp-server:
    build: .
    ports:
      - "8000:8000"
    environment:
      - API_KEY=${API_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## Cloud Deployment

### Railway
```bash
# Procfile
web: python server.py
```

### Fly.io
```toml
# fly.toml
app = "my-mcp-server"
primary_region = "iad"

[http_service]
  internal_port = 8000
  force_https = true

[env]
  PORT = "8000"
```

```bash
fly launch
fly secrets set API_KEY=xxx
fly deploy
```

### GCP Cloud Run
```bash
gcloud run deploy mcp-server \
  --source . \
  --port 8000 \
  --allow-unauthenticated
```

---

## Nginx Reverse Proxy (SSE)

```nginx
server {
    listen 443 ssl;
    server_name mcp.myapp.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_set_header Host $host;
        
        # SSE specific
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400s;
        chunked_transfer_encoding off;
    }
}
```

---

## Client Configuration (Remote)

```json
{
  "mcpServers": {
    "remote-server": {
      "url": "https://mcp.myapp.com/sse",
      "headers": {
        "Authorization": "Bearer xxx"
      }
    }
  }
}
```

## Security Considerations

1. **Authentication** - Add API key or JWT validation
2. **HTTPS** - Always use TLS in production
3. **Rate limiting** - Prevent abuse
4. **Input validation** - Sanitize all tool inputs
5. **Secrets** - Use environment variables, never hardcode
