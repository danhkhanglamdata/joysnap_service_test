# MCP Directory

## Purpose

Model Context Protocol (MCP) server configurations and documentation.

## Overview

This directory contains configuration files and documentation for 12 MCP servers that extend Claude Code's capabilities. MCP servers provide specialized tools for documentation lookup, browser automation, web scraping, and more.

## Key Files

| File | Purpose |
|------|---------|
| `README.md` | MCP setup guide and server documentation |
| `CLAUDE.md` | This file - directory documentation |
| `configs/*.json` | Individual MCP server configurations (12 files) |
| `docs/*.md` | Detailed documentation for each server |

## Config Files (configs/)

### Core Servers
| File | Server | Purpose |
|------|--------|---------|
| `context7.json` | context7 | Library documentation lookup |
| `sequential-thinking.json` | sequential-thinking | Multi-step reasoning |

### Browser Automation
| File | Server | Purpose |
|------|--------|---------|
| `chrome-devtools.json` | chrome-devtools | Browser debugging via CDP |

### Extended Servers
| File | Server | Purpose |
|------|--------|---------|
| `magic.json` | magic | UI component generation |
| `perplexity-ask.json` | perplexity-ask | AI web search |
| `figma.json` | figma | Design-to-code integration |
| `firecrawl.json` | firecrawl-mcp | Web scraping |

### Development Tools
| File | Server | Purpose |
|------|--------|---------|
| `repomix.json` | repomix | Repository packaging |
| `shadcn.json` | shadcn | UI component management |
| `knowledge-graph.json` | knowledge-graph | Codebase analysis |
| `morph-mcp.json` | morph-mcp | Fast file editing and codebase search |

### Media Processing
| File | Server | Purpose |
|------|--------|---------|
| `toonify.json` | toonify | Image toonification

## Documentation Files (docs/)

| File | Server | Purpose |
|------|--------|---------|
| `context7.md` | context7 | Library documentation lookup |
| `sequential-thinking.md` | sequential-thinking | Multi-step reasoning |
| `chrome-devtools.md` | chrome-devtools | Browser debugging via CDP |
| `magic.md` | magic | UI component generation |
| `perplexity-ask.md` | perplexity-ask | AI web search |
| `figma.md` | figma | Design-to-code integration |
| `firecrawl.md` | firecrawl-mcp | Web scraping |
| `repomix.md` | repomix | Repository packaging |
| `shadcn.md` | shadcn | UI component management |
| `knowledge-graph.md` | knowledge-graph | Codebase analysis |
| `morph-mcp.md` | morph-mcp | Fast file editing and codebase search |
| `toonify.md` | toonify | Image toonification |

## Patterns & Conventions

- **Server Registry**: Main config in project root `.mcp.json`
- **Modular Configs**: Split configs in `configs/` for different use cases
- **Documentation**: Each server has a doc file in `docs/`
- **Transport Types**: stdio (default), sse (Server-Sent Events), http (hosted MCP)

## MCP Server Configuration Format

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "API_KEY": "${ENV_VAR_NAME}"
      },
      "disabled": false,
      "autoApprove": ["tool-name"]
    }
  }
}
```

### Transport Types

- **stdio** (default): Local process communication
- **sse**: Server-Sent Events for remote servers
- **http**: HTTP-based hosted MCP servers

## Dependencies

- **Internal**: Referenced by agents via `mcp:` frontmatter field
- **External**: npm packages for each MCP server

## Common Tasks

- **Add new MCP server**: Add entry to `.mcp.json`, create doc in `docs/`
- **Disable server**: Set `"disabled": true` in config
- **Configure server**: Modify `args` array or `env` in config
- **Auto-approve tools**: Add tool names to `autoApprove` array

## Important Notes

- MCP servers are started on-demand when tools are called
- Some servers require environment variables (API keys, tokens)
- Use `configs/` for modular configuration management
- Agents specify MCP dependencies in their frontmatter
- The `.mcp.json` file in project root is the main registry
