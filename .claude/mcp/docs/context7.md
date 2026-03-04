# Context7 MCP Server

Up-to-date library documentation lookup for AI-assisted development.

## Package

```bash
npx -y @upstash/context7-mcp
```

Requires `CONTEXT7_API_KEY` environment variable.

## Protocol Version

Compatible with MCP Protocol 2025-11-25

## Overview

Context7 provides LLMs with up-to-date, version-specific code documentation and examples to fix AI code inaccuracies. Featured on Thoughtworks Technology Radar (Nov 2025) as highly useful for AI-assisted software development.

## Tools

| Tool | Description |
|------|-------------|
| `resolve-library-id` | Find library IDs for documentation lookup |
| `get-library-docs` | Fetch documentation for a specific library |

## Tool Parameters

### resolve-library-id

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `libraryName` | string | Yes | Library name to search for |

Returns list of matching libraries with:
- Library ID (Context7-compatible format: /org/project)
- Name and description
- Code snippet count
- Source reputation (High, Medium, Low)
- Benchmark score (0-100)
- Available versions

### get-library-docs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `context7CompatibleLibraryID` | string | Yes | Library ID from resolve-library-id |
| `topic` | string | No | Focus on specific topic (e.g., 'hooks', 'routing') |
| `mode` | string | No | 'code' for API refs (default), 'info' for conceptual guides |
| `page` | integer | No | Page number for pagination (1-10) |

## Usage Examples

### Find Library ID
```
"What's the library ID for React?"
→ resolve-library-id with libraryName="react"
```

### Get Documentation
```
"Show me Next.js App Router docs"
→ get-library-docs with context7CompatibleLibraryID="/vercel/next.js", topic="app router"

"How do I use FastAPI dependency injection?"
→ get-library-docs with context7CompatibleLibraryID="/fastapi/fastapi", topic="dependency injection", mode="code"

"Explain Playwright testing concepts"
→ get-library-docs with context7CompatibleLibraryID="/microsoft/playwright", mode="info"
```

## Popular Library IDs

| Library | Context7 ID |
|---------|-------------|
| Next.js | /vercel/next.js |
| React | /facebook/react |
| FastAPI | /fastapi/fastapi |
| Playwright | /microsoft/playwright |
| Prisma | /prisma/prisma |
| Tailwind CSS | /tailwindlabs/tailwindcss |
| TypeScript | /microsoft/typescript |
| Django | /django/django |
| Express | /expressjs/express |
| Vue.js | /vuejs/vue |

## Best Practices

1. **Always resolve first**: Use `resolve-library-id` to get the correct library ID
2. **Use mode appropriately**: 
   - `mode='code'` for API references and code examples
   - `mode='info'` for conceptual guides and architecture
3. **Specify topic**: Focus on specific features for better results
4. **Check versions**: Some libraries have version-specific docs
5. **Paginate if needed**: Use `page` parameter for more results

## Integration with Skills

- Works well with `librarian` skill for comprehensive documentation search
- Use in `deep-research` mode for thorough investigation
- Combine with `sequential-thinking` for complex research tasks

## When to Use

| Scenario | Use Context7? |
|----------|---------------|
| Latest API documentation | ✅ Yes |
| Code examples | ✅ Yes |
| Version-specific features | ✅ Yes |
| Conceptual understanding | ✅ Yes (mode='info') |
| General web search | ❌ Use Perplexity |
| Real-time information | ❌ Use Perplexity |

## Resources

- [Context7 Website](https://context7.com)
- [Thoughtworks Technology Radar](https://www.thoughtworks.com/radar)
