---
name: figma-mcp
description: Connect Figma designs to code using the official Figma MCP server. Extract design tokens, component specs, layout information, and generate code from Figma files.
version: 1.0.0
mcp: figma
---

# Figma MCP Integration

Bridge design and development using the official Figma MCP server.

## When to Use

- Extracting design tokens (colors, typography, spacing)
- Getting component specifications from Figma
- Generating code from Figma designs
- Syncing design system with codebase
- Understanding layout and spacing from mockups

## MCP Server Setup

### Official Figma Desktop Server (Recommended)
1. Open Figma Desktop app
2. Go to Dev Mode
3. Enable "Desktop MCP server"
4. Server runs at `http://127.0.0.1:3845/mcp`

```json
{
  "mcpServers": {
    "figma": {
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

### Community Server (API-based)
For headless/CI environments using Figma API:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    }
  }
}
```

GitHub: https://github.com/GLips/Figma-Context-MCP

## Core Capabilities

### Design Token Extraction
- Colors and color styles
- Typography (fonts, sizes, weights)
- Spacing and layout values
- Border radius, shadows, effects

### Component Information
- Component structure and variants
- Props and properties
- Auto-layout settings
- Constraints and responsiveness

### Layout Analysis
- Frame dimensions and positioning
- Padding and gaps
- Alignment and distribution
- Responsive breakpoints

### Asset Export
- Export images and icons
- Get SVG code for vectors
- Access image fills and backgrounds

## Usage Patterns

### Extract Design Tokens
```
"Get all color styles from the Design System file"
```

### Analyze Component
```
"Show me the specs for the Button component including all variants"
```

### Generate Code from Frame
```
"Generate React/Tailwind code for the Hero Section frame"
```

### Get Layout Information
```
"What are the spacing values used in the Card component?"
```

## Integration with Development Workflow

### Design-to-Code Pipeline
1. **Design Review**: Analyze Figma frames for implementation
2. **Token Extraction**: Get design tokens for CSS/Tailwind config
3. **Component Specs**: Understand component structure before coding
4. **Code Generation**: Generate initial component code
5. **Validation**: Compare implementation with design specs

### Design System Sync
```
Figma Design System → Extract Tokens → Generate CSS Variables → Update Codebase
```

## Best Practices

- Use Figma's Dev Mode for accurate specs
- Organize designs with clear naming conventions
- Use Auto Layout for responsive designs
- Define components with variants in Figma
- Keep design tokens in sync with code

## Combining with Other Skills

### With frontend-design
- Use Figma specs + design best practices for implementation

### With frontend-design
- Extract Figma tokens → Apply to Tailwind/CSS

### With code-review
- Validate implementation matches Figma specs

## References

- Official Docs: https://developers.figma.com/docs/figma-mcp-server/
- Figma Blog: https://www.figma.com/blog/introducing-figma-mcp-server/
- Community Server: https://github.com/GLips/Figma-Context-MCP
