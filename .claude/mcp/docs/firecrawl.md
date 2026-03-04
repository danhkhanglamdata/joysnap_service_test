# Firecrawl MCP Server

Web scraping and crawling for AI applications.

## Package

```bash
npx -y firecrawl-mcp
```

Requires `FIRECRAWL_API_KEY` environment variable.

## Protocol Version

Compatible with MCP Protocol 2025-11-25

## Overview

Firecrawl MCP provides powerful web scraping, crawling, and data extraction capabilities. It can scrape single pages, crawl entire websites, map site structures, and extract structured data using AI.

## Tools

| Tool | Description |
|------|-------------|
| `firecrawl_scrape` | Scrape content from a single URL |
| `firecrawl_crawl` | Crawl multiple pages from a website |
| `firecrawl_map` | Discover all URLs on a website |
| `firecrawl_search` | Search the web and extract content |
| `firecrawl_extract` | Extract structured data using AI |
| `firecrawl_agent` | Autonomous web data gathering agent |

## Tool Selection Guide

| Task | Best Tool |
|------|-----------|
| Single page content | `firecrawl_scrape` |
| Multiple related pages | `firecrawl_crawl` |
| Discover site URLs | `firecrawl_map` |
| Web search with extraction | `firecrawl_search` |
| Structured data extraction | `firecrawl_extract` |
| Complex data gathering | `firecrawl_agent` |

## Usage Examples

### Scrape Single Page
```
"Get the content of https://example.com"
→ firecrawl_scrape url="https://example.com" formats=["markdown"]
```

### Crawl Website
```
"Get all blog posts from example.com/blog"
→ firecrawl_crawl url="https://example.com/blog" maxDiscoveryDepth=2 limit=20
```

### Map Site Structure
```
"List all URLs on example.com"
→ firecrawl_map url="https://example.com"
```

### Search and Extract
```
"Find latest AI research papers"
→ firecrawl_search query="latest AI research papers 2025" limit=5
```

### Extract Structured Data
```
"Extract product info from these pages"
→ firecrawl_extract urls=["https://example.com/product1"] prompt="Extract name, price, description"
```

## Output Formats

- `markdown` - Clean markdown content
- `html` - Raw HTML
- `links` - Extracted links
- `screenshot` - Page screenshot
- `json` - Structured JSON extraction

## When to Use

| Scenario | Use Firecrawl? |
|----------|----------------|
| Web page content | Yes |
| Site crawling | Yes |
| Data extraction | Yes |
| Web research | Yes |
| API documentation | No - Use Context7 |
| Real-time search | Consider Perplexity |

## Best Practices

1. **Use caching**: Add `maxAge` parameter for faster repeated scrapes
2. **Limit crawl depth**: Keep `maxDiscoveryDepth` low to avoid timeouts
3. **Prefer scrape over crawl**: For known URLs, use scrape directly
4. **Use map first**: Discover URLs before deciding what to crawl

## Resources

- [Firecrawl Documentation](https://docs.firecrawl.dev/)
- [Firecrawl API](https://firecrawl.dev/)
