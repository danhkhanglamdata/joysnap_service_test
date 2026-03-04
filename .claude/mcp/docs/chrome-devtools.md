# Chrome DevTools MCP Server

Browser debugging and automation via Chrome DevTools Protocol.

## Package

```bash
npx -y chrome-devtools-mcp@latest
```

## Protocol Version

Compatible with MCP Protocol 2025-11-25

## Overview

Chrome DevTools MCP provides 26 tools for browser debugging, automation, and performance analysis via the Chrome DevTools Protocol (CDP). Ideal for quick inspection, debugging, and performance monitoring.

## Tools (26 total)

### Input Automation (6 tools)

| Tool | Description |
|------|-------------|
| `click_element` | Simulate mouse click on element |
| `type_text` | Type text into element |
| `press_key` | Press keyboard keys |
| `scroll_page` | Scroll page vertically/horizontally |
| `hover_element` | Move mouse over element |
| `focus_element` | Focus a specific element |

### Navigation (6 tools)

| Tool | Description |
|------|-------------|
| `navigate_to` | Navigate to a URL |
| `reload_page` | Reload current page |
| `go_back` | Go back in history |
| `go_forward` | Go forward in history |
| `wait_for_selector` | Wait for element to appear |
| `wait_for_timeout` | Sleep for fixed duration |

### Emulation (5 tools)

| Tool | Description |
|------|-------------|
| `set_viewport` | Set viewport size |
| `set_user_agent` | Override user agent |
| `emulate_timezone` | Emulate timezone |
| `emulate_geolocation` | Set fake geolocation |
| `set_offline_mode` | Enable/disable offline mode |

### Performance (4 tools)

| Tool | Description |
|------|-------------|
| `record_performance_trace` | Record performance trace |
| `analyze_lcp` | Analyze Largest Contentful Paint |
| `analyze_core_web_vitals` | Report Core Web Vitals |
| `get_page_metrics` | Get high-level page metrics |

### Network (2 tools)

| Tool | Description |
|------|-------------|
| `get_network_request` | Get details of a network request |
| `list_network_requests` | List captured network requests |

### Debugging (3 tools)

| Tool | Description |
|------|-------------|
| `evaluate_script` | Execute JavaScript in page |
| `list_console_messages` | List console messages |
| `take_screenshot` | Capture page screenshot |
| `take_snapshot` | Capture DOM snapshot |

## Key Tool Parameters

### click_element
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `selector` | string | Yes | CSS selector |
| `button` | string | No | "left", "right", "middle" |
| `clickCount` | number | No | Number of clicks |
| `delay` | number | No | Delay between mousedown/up (ms) |

### type_text
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to type |
| `selector` | string | No | Element to focus first |
| `delay` | number | No | Delay between keystrokes (ms) |

### navigate_to
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | URL to navigate to |
| `waitUntil` | string | No | "load", "domcontentloaded", "networkidle" |
| `timeout` | number | No | Timeout in ms |

### set_viewport
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `width` | number | Yes | Viewport width |
| `height` | number | Yes | Viewport height |
| `deviceScaleFactor` | number | No | Device scale factor |
| `isMobile` | boolean | No | Mobile emulation |

### evaluate_script
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `expression` | string | Yes | JavaScript code |
| `awaitPromise` | boolean | No | Wait for promises |
| `returnByValue` | boolean | No | Serialize result |

### take_screenshot
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fullPage` | boolean | No | Capture full page |
| `selector` | string | No | Capture specific element |
| `type` | string | No | "png" or "jpeg" |
| `quality` | number | No | JPEG quality (0-100) |

### list_network_requests
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `urlFilter` | string | No | URL substring filter |
| `method` | string | No | HTTP method filter |
| `statusCode` | number | No | Status code filter |
| `resourceType` | string | No | "document", "xhr", "image", etc. |
| `limit` | number | No | Max entries |

## Usage Examples

```
"Take a screenshot of the homepage"
→ navigate_to url="https://example.com"
→ take_screenshot fullPage=true

"Check Core Web Vitals"
→ navigate_to url="https://example.com"
→ analyze_core_web_vitals

"Debug network requests"
→ list_network_requests urlFilter="api" method="POST"

"Test mobile viewport"
→ set_viewport width=375 height=812 isMobile=true

"Execute JavaScript"
→ evaluate_script expression="document.title"
```

## When to Use

| Scenario | Use Chrome DevTools? |
|----------|---------------------|
| Quick inspection | ✅ Yes |
| Debugging | ✅ Yes |
| Screenshots | ✅ Yes |
| Performance analysis | ✅ Yes |
| Network monitoring | ✅ Yes |
| E2E test automation | ❌ Use Playwright |
| Complex test flows | ❌ Use Playwright |

## Security Notes

- Has full browser access - use with caution
- Can execute arbitrary JavaScript
- Only use on trusted/local sites
- Review actions before execution

## Integration with Skills

- Works with `chrome-devtools` skill for debugging patterns
- Use in `review` mode for performance analysis
- Combine with `debugging` skill for systematic analysis

## Resources

- [Chrome DevTools MCP](https://github.com/AshDevFr/chrome-devtools-mcp)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
