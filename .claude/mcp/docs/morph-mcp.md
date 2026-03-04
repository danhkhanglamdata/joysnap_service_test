# Morph MCP Server

Fast file editing and codebase search powered by Morph LLM.

## Package

```bash
npx -y @morphllm/morphmcp
```

Requires `MORPH_API_KEY` environment variable.

## Protocol Version

Compatible with MCP Protocol 2025-11-25

## Overview

Morph MCP provides two powerful tools for AI-assisted development: `edit_file` for fast, intelligent file editing and `warpgrep_codebase_search` for semantic codebase search. These tools are optimized for speed and accuracy in code modification workflows.

## Tools

| Tool | Description |
|------|-------------|
| `edit_file` | Fast file editing with partial code snippets |
| `warpgrep_codebase_search` | Semantic codebase search for finding relevant context |

## Tool Parameters

### edit_file

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file_path` | string | Yes | Path to the file to edit |
| `changes` | string | Yes | Code changes to apply (partial snippets supported) |

**Key Feature**: Works with partial code snippets - no need for full file content. This makes it faster and more efficient than traditional file editing approaches.

### warpgrep_codebase_search

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Semantic search query |
| `path` | string | No | Directory to search in (defaults to current directory) |

**Key Feature**: Semantic search that understands code context, not just keyword matching. Best for broader queries like "Find the authentication flow" or "Where is error handling done?"

## Usage Examples

### Fast File Editing
```
"Update the login function to add rate limiting"
→ edit_file with file_path="src/auth/login.ts", changes="<partial code snippet>"
```

### Semantic Codebase Search
```
"Find where user authentication is handled"
→ warpgrep_codebase_search with query="user authentication flow"

"How does the API handle errors?"
→ warpgrep_codebase_search with query="API error handling"
```

## Configuration

The `ENABLED_TOOLS` environment variable controls which tools are available:

```json
{
  "env": {
    "MORPH_API_KEY": "${MORPH_API_KEY}",
    "ENABLED_TOOLS": "edit_file,warpgrep_codebase_search"
  }
}
```

## Best Practices

1. **Use edit_file for modifications**: Faster than full file rewrites
2. **Use warpgrep for exploration**: Better for semantic queries than keyword search
3. **Combine both tools**: Search first to find context, then edit
4. **Partial snippets**: Only include the code you're changing, not the entire file

## Integration with Skills

- Recommended in CLAUDE.md as "Fast Apply" for file editing
- Works well with `debugging` skill for finding and fixing issues
- Combine with `code-review` skill for targeted improvements

## When to Use

| Scenario | Use Morph MCP? |
|----------|----------------|
| Quick file edits | Yes (edit_file) |
| Finding code flows | Yes (warpgrep) |
| Understanding codebase | Yes (warpgrep) |
| Full file rewrites | No (use standard tools) |
| Keyword-specific search | No (use Grep tool) |

## Comparison with Other Tools

| Tool | Best For |
|------|----------|
| `edit_file` (Morph) | Fast partial edits |
| `Edit` (Claude Code) | Precise string replacement |
| `warpgrep` (Morph) | Semantic code search |
| `Grep` (Claude Code) | Exact pattern matching |

## Resources

- [Morph LLM](https://morphllm.com)
- [Warp Terminal](https://warp.dev) - Warp Grep integration
