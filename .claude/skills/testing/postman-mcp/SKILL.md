---
name: postman-mcp
description: Automate API testing and collection management using Postman MCP server. Create workspaces, collections, environments, mock servers, and run tests programmatically via natural language.
version: 1.0.0
mcp: postman
---

# Postman MCP Integration

Automate API testing workflows using the official Postman MCP server.

## When to Use

- Creating and managing API collections programmatically
- Running API tests from AI agents
- Setting up mock servers for development
- Managing Postman workspaces and environments
- Automating API documentation workflows

## MCP Server Setup

### Remote Server (Recommended)
```json
{
  "mcpServers": {
    "postman": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-remote@latest", "https://mcp.postman.com/sse"],
      "env": {
        "POSTMAN_API_KEY": "${POSTMAN_API_KEY}"
      }
    }
  }
}
```

### Local Server (Docker)
```json
{
  "mcpServers": {
    "postman": {
      "command": "npx",
      "args": ["@postman/mcp-server@latest", "--full"],
      "env": {
        "POSTMAN_API_KEY": "${POSTMAN_API_KEY}"
      }
    }
  }
}
```

## Core Capabilities

### Workspace Management
- Create, list, and manage workspaces
- Organize collections by project/team

### Collection Operations
- Create collections from OpenAPI specs
- Add/update requests and folders
- Import/export collections

### Environment Management
- Create environments (dev, staging, prod)
- Manage environment variables
- Switch between environments

### Testing
- Run collection tests
- Execute specific requests
- Validate responses programmatically

### Mock Servers
- Create mock servers from collections
- Generate sample responses
- Test against mocks during development

## Usage Patterns

### Create Collection from OpenAPI
```
"Create a Postman collection from the OpenAPI spec at ./api/openapi.yaml"
```

### Run API Tests
```
"Run all tests in the 'User API' collection against staging environment"
```

### Setup Mock Server
```
"Create a mock server for the Payment API collection"
```

### Manage Environments
```
"Create a new environment called 'production' with BASE_URL=https://api.example.com"
```

## Integration with Testing Workflow

1. **Design Phase**: Create collections from API specs
2. **Development**: Use mock servers for frontend development
3. **Testing**: Run automated tests in CI/CD
4. **Documentation**: Generate API docs from collections

## Best Practices

- Use environment variables for sensitive data
- Organize collections by API domain
- Write tests for each endpoint
- Use pre-request scripts for auth tokens
- Keep collections in sync with OpenAPI specs

## References

- GitHub: https://github.com/postmanlabs/postman-mcp-server
- npm: `@postman/mcp-server`
- Docs: https://www.postman.com/explore/mcp-servers
