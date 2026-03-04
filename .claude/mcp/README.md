# MCP Server Integrations

Model Context Protocol (MCP) servers extend Claude Code capabilities with specialized tools and integrations.

## Protocol Version

Compatible with MCP Protocol **2025-11-25** (Latest)

Key protocol features:
- SEP-1024: Client security for local installs
- SEP-835: Default OAuth scopes
- SEP-1577: Sampling with tools for agentic servers
- SEP-986: Standardized tool names

## Quick Start

SoupSpec includes a pre-configured `mcp.json` with 12 MCP servers:

```bash
# Core servers
- context7            # @upstash/context7-mcp (library documentation)
- sequential-thinking # @modelcontextprotocol/server-sequential-thinking

# Browser automation
- playwright          # @playwright/mcp@latest
- chrome-devtools     # chrome-devtools-mcp@latest

# Extended
- magic               # @21st-dev/magic@latest (UI generation)
- perplexity-ask      # server-perplexity-ask (AI web search)
- figma               # mcp.figma.com (HTTP, design-to-code)
- firecrawl-mcp       # firecrawl-mcp (web scraping)
- github              # @modelcontextprotocol/server-github
- postgres            # @modelcontextprotocol/server-postgres
- mem0                # mem0-mcp (long-term memory)

# Development tools
- repomix             # repomix --mcp (repository packaging)
- shadcn              # shadcn@latest mcp (UI components)
- knowledge-graph     # localhost:27495 (SSE, codebase analysis)
```

To enable/disable servers, edit `soupspec/.claude/mcp.json` and set `"disabled": true/false`.

## Directory Structure

```
.claude/mcp/
├── README.md           # This file
├── CLAUDE.md           # Directory documentation
├── configs/            # Individual server configurations
│   ├── context7.json           # Library documentation lookup (core)
│   ├── sequential-thinking.json # Multi-step reasoning (core)
│   ├── chrome-devtools.json    # Browser debugging via CDP (browser)
│   ├── magic.json              # UI component generation (extended)
│   ├── perplexity-ask.json     # AI web search (extended)
│   ├── figma.json              # Design-to-code (extended)
│   ├── firecrawl.json          # Web scraping (extended)
│   ├── repomix.json            # Repository packaging (tools)
│   ├── shadcn.json             # UI component management (tools)
│   ├── knowledge-graph.json    # Codebase analysis (tools)
│   ├── morph-mcp.json          # Fast file editing (tools)
│   └── toonify.json            # Image toonification (media)
└── docs/               # Detailed documentation
    ├── context7.md             # Library documentation lookup
    ├── sequential-thinking.md  # Multi-step reasoning
    ├── chrome-devtools.md      # Browser debugging via CDP
    ├── magic.md                # UI component generation
    ├── perplexity-ask.md       # AI web search
    ├── figma.md                # Design-to-code
    ├── firecrawl.md            # Web scraping
    ├── repomix.md              # Repository packaging
    ├── shadcn.md               # UI component management
    ├── knowledge-graph.md      # Codebase analysis
    ├── morph-mcp.md            # Fast file editing
    └── toonify.md              # Image toonification
```

## Available MCP Servers

### Core Servers

| Server | Package | Purpose | Default |
|--------|---------|---------|---------|
| Context7 | `@upstash/context7-mcp` | Library documentation lookup | ✅ Enabled |
| Sequential Thinking | `@modelcontextprotocol/server-sequential-thinking` | Multi-step reasoning | ✅ Enabled |

### Browser Automation

| Server | Package | Purpose | Default |
|--------|---------|---------|---------|
| Playwright | `@playwright/mcp@latest` | E2E browser testing | ✅ Enabled |
| Chrome DevTools | `chrome-devtools-mcp@latest` | Browser debugging via CDP | ✅ Enabled |

### Extended

| Server | Package | Purpose | Default |
|--------|---------|---------|---------|
| Magic | `@21st-dev/magic@latest` | UI component generation | ✅ Enabled |
| Perplexity Ask | `server-perplexity-ask` | AI web search | ✅ Enabled |
| Figma | `mcp.figma.com` (HTTP) | Design-to-code | ✅ Enabled |
| Firecrawl | `firecrawl-mcp` | Web scraping | ✅ Enabled |
| GitHub | `@modelcontextprotocol/server-github` | GitHub API operations | ✅ Enabled |
| PostgreSQL | `@modelcontextprotocol/server-postgres` | Database access | ✅ Enabled |
| Mem0 | `mem0-mcp` | Long-term memory | ✅ Enabled |

### Development Tools

| Server | Package | Purpose | Default |
|--------|---------|---------|---------|
| Repomix | `repomix --mcp` | Repository packaging | ✅ Enabled |
| shadcn | `shadcn@latest mcp` | UI component management | ✅ Enabled |
| Knowledge Graph | `localhost:27495` (SSE) | Codebase analysis | ✅ Enabled |
| Morph MCP | `@morphllm/morphmcp` | Fast file editing | ✅ Enabled |

### Media Processing

| Server | Package | Purpose | Default |
|--------|---------|---------|---------|
| Toonify | `toonify-mcp` | Image toonification | ✅ Enabled |

## Installation

### Prerequisites
- Node.js 18+
- npx available in PATH

### Configuration Location

- **Project**: `.mcp.json` (root) - auto-loaded by Claude Code
- **User**: `~/.claude/settings.json` - global settings
- **Reference**: `.claude/mcp/configs/*.json` - copy configs from here

## Platform-Specific Configuration

### Linux / macOS

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "context7-mcp"]
    }
  }
}
```

### Windows

Windows requires the `cmd /c` wrapper to execute npx:

```json
{
  "mcpServers": {
    "context7": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "context7-mcp"]
    }
  }
}
```

## Server Configurations

### Context7 (Documentation Lookup)

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      },
      "autoApprove": ["get-library-docs", "resolve-library-id"]
    }
  }
}
```

Requires `CONTEXT7_API_KEY` env var.

**Tools**:
- `resolve-library-id` - Find library IDs for documentation lookup
- `get-library-docs` - Fetch documentation for a specific library

### Sequential Thinking

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

**Tools**:
- `sequentialthinking` - Dynamic problem-solving through thought sequences

### Chrome DevTools (Browser Automation)

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

**Capabilities**: Screenshot capture, DOM inspection, Network monitoring, Console log access, JavaScript execution

### Playwright (E2E Browser Testing)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

**Options**: `--browser`, `--headless`, `--viewport-size`, `--device`

### Filesystem (Secure File Operations)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

**Tools**: `read_file`, `write_file`, `edit_file`, `create_directory`, `list_directory`, `directory_tree`, `move_file`, `search_files`, `get_file_info`

### Magic MCP (UI Component Generation)

```json
{
  "mcpServers": {
    "magic": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest"],
      "env": {
        "API_KEY": "${MAGIC_21ST_DEV_API_KEY}"
      }
    }
  }
}
```

Requires `MAGIC_21ST_DEV_API_KEY` env var.

### Postman (API Testing)

```json
{
  "mcpServers": {
    "postman": {
      "command": "npx",
      "args": ["@postman/postman-mcp-server", "--full", "--region", "us"]
    }
  }
}
```

Requires `POSTMAN_API_KEY` env var.

### Figma (Design-to-Code)

```json
{
  "mcpServers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

Uses Figma's hosted MCP server (no local installation required).

### Perplexity Ask (AI Web Search)

```json
{
  "mcpServers": {
    "perplexity-ask": {
      "command": "npx",
      "args": ["-y", "server-perplexity-ask"],
      "env": {
        "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}"
      },
      "autoApprove": ["perplexity_ask"]
    }
  }
}
```

Requires `PERPLEXITY_API_KEY` env var.

### GitHub (GitHub API Operations)

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

Requires `GITHUB_TOKEN` env var.

### PostgreSQL (Database Access)

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"]
    }
  }
}
```

Requires `DATABASE_URL` env var.

### Mem0 (Long-term Memory)

```json
{
  "mcpServers": {
    "mem0": {
      "command": "npx",
      "args": ["-y", "mem0-mcp"]
    }
  }
}
```

Requires `MEM0_API_KEY` env var.

**Tools**: `add_memory`, `search_memories`, `get_all_memories`, `delete_memory`

### Firecrawl (Web Scraping)

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}"
      }
    }
  }
}
```

Requires `FIRECRAWL_API_KEY` env var.

**Tools**: `scrape`, `crawl`, `map`, `search`

### Repomix (Repository Packaging)

```json
{
  "mcpServers": {
    "repomix": {
      "command": "npx",
      "args": ["-y", "repomix", "--mcp"]
    }
  }
}
```

**Tools**: `pack_codebase`, `pack_remote_repository`, `generate_skill`, `read_repomix_output`, `grep_repomix_output`

### shadcn (UI Components)

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

**Tools**: Component installation and management for shadcn/ui

### Knowledge Graph (Codebase Analysis)

```json
{
  "mcpServers": {
    "knowledge-graph": {
      "type": "sse",
      "url": "http://localhost:27495/mcp/sse",
      "approvedTools": true
    }
  }
}
```

Requires local knowledge-graph server running on port 27495.

**Tools**: `search_codebase_definitions`, `get_references`, `read_definitions`, `repo_map`, `import_usage`

### Morph MCP (Fast File Editing)

```json
{
  "mcpServers": {
    "morph-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@morphllm/morphmcp"],
      "env": {
        "MORPH_API_KEY": "${MORPH_API_KEY}",
        "ENABLED_TOOLS": "edit_file,warpgrep_codebase_search"
      }
    }
  }
}
```

Requires `MORPH_API_KEY` env var.

**Tools**: `edit_file`, `warpgrep_codebase_search`

### Toonify (Image Toonification)

```json
{
  "mcpServers": {
    "toonify": {
      "type": "stdio",
      "command": "toonify-mcp",
      "args": [],
      "env": {}
    }
  }
}
```

Requires `toonify-mcp` binary installed locally.

**Tools**: `toonify`

## Full Configuration Example

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      },
      "disabled": false,
      "autoApprove": ["get-library-docs", "resolve-library-id"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "env": {},
      "disabled": false,
      "autoApprove": ["sequentialthinking"]
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"],
      "disabled": false
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "magic": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest"],
      "env": {
        "API_KEY": "${MAGIC_21ST_DEV_API_KEY}"
      }
    },
    "perplexity-ask": {
      "command": "npx",
      "args": ["-y", "server-perplexity-ask"],
      "env": {
        "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}"
      },
      "disabled": false,
      "autoApprove": ["perplexity_ask"]
    },
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    },
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}"
      }
    },
    "repomix": {
      "command": "npx",
      "args": ["-y", "repomix", "--mcp"]
    },
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    },
    "knowledge-graph": {
      "type": "sse",
      "url": "http://localhost:27495/mcp/sse",
      "approvedTools": true
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"]
    },
    "mem0": {
      "command": "npx",
      "args": ["-y", "mem0-mcp"]
    },
    "morph-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@morphllm/morphmcp"],
      "env": {
        "MORPH_API_KEY": "${MORPH_API_KEY}",
        "ENABLED_TOOLS": "edit_file,warpgrep_codebase_search"
      }
    },
    "toonify": {
      "type": "stdio",
      "command": "toonify-mcp",
      "args": [],
      "env": {}
    }
  }
}
```

## Troubleshooting

### Server Not Loading
- Check Node.js version (18+ required)
- Verify npx is in PATH
- Check for typos in configuration

### Permission Errors
- Ensure network access for package installation
- Check firewall settings

### Slow Startup
- First run downloads packages (one-time)
- Consider pre-installing packages globally

## Security Notes

- MCP servers run with your user permissions
- Review server source before installing
- Chrome DevTools has browser access - use carefully
- Filesystem server restricts access to specified directories

## Additional Recommended MCP Servers

These servers are recommended for enhanced AI-assisted development workflows:

| Server | Package | Purpose |
|--------|---------|---------|
| Sentry | `@sentry/mcp-server` | Error tracking and observability |
| MongoDB Atlas | `@mongodb/mcp-server` | MongoDB database operations |
| StarRocks | `starrocks-mcp` | BI and large-scale analytics |
| FastMCP | `fastmcp` | Python framework for MCP development |

### Sentry MCP (Error Tracking)

```json
{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server"]
    }
  }
}
```

Requires `SENTRY_AUTH_TOKEN` env var.

### MongoDB Atlas MCP

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "npx",
      "args": ["-y", "@mongodb/mcp-server"]
    }
  }
}
```

Requires `MONGODB_URI` env var.

## Agent-MCP Mapping

For detailed guidance on which MCP servers are best suited for each agent, see:

**[MCP_AGENT_MAPPING.md](./MCP_AGENT_MAPPING.md)**

This document provides:
- Quick reference matrix of MCP servers to agents
- Detailed analysis of each MCP server's tools
- Recommended `mcp:` frontmatter values for each agent
- Decision tree for MCP tool selection

## Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP Registry](https://modelcontextprotocol.io/registry) - Discover more servers
- [Available MCP Servers](https://github.com/modelcontextprotocol/servers)
- [Playwright MCP](https://github.com/microsoft/playwright-mcp)
- [Context7](https://context7.com) - Library documentation lookup
- [FastMCP](https://github.com/jlowin/fastmcp) - Python MCP framework
