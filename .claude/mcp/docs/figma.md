# Figma MCP Server

Design-to-code integration with Figma designs.

## Package

```bash
npm install -g figma-developer-mcp
figma-developer-mcp --stdio
```

Requires `FIGMA_API_KEY` environment variable.

## Protocol Version

Compatible with MCP Protocol 2025-11-25

## Overview

The Figma MCP server provides design context from Figma files for AI-assisted code generation. It extracts design tokens, component properties, layout rules, and Code Connect mappings to enable accurate design-to-code workflows.

## Tools

| Tool | Description |
|------|-------------|
| `get_design_context` | Get design context for selected layer |
| `get_variable_defs` | Get variables and styles used |
| `get_code_connect_map` | Get Code Connect mappings |
| `get_strategy_for_mapping` | Detect component-to-code mappings |
| `send_get_strategy_response` | Confirm mapping decisions |

## Tool Parameters

### get_design_context

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `selection` | string | Yes | Selection ID or layer reference |

Returns:
- Node hierarchy
- Layout rules (auto-layout, constraints)
- Text styles (font, size, weight, color)
- Component properties
- Image references
- Design tokens

### get_variable_defs

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `selection` | string | Yes | Selection ID or layer reference |

Returns:
- Color variables
- Spacing variables
- Typography tokens
- Effect styles

### get_code_connect_map

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `selection` | string | Yes | Selection ID or node IDs |

Returns:
- Figma node ID to code component mappings
- Component file paths
- Props mappings

### get_strategy_for_mapping

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `selection` | string | Yes | Selection for analysis |

Returns:
- Suggested component mappings
- Confidence scores
- Alternative options

## Usage Examples

```
"Get the design context for the selected button"
→ get_design_context selection="selected-node-id"

"What design tokens are used in this component?"
→ get_variable_defs selection="component-id"

"Map this Figma component to my codebase"
→ get_code_connect_map selection="button-component-id"

"Suggest code mappings for this design"
→ get_strategy_for_mapping selection="card-component-id"
```

## Workflow

1. **Select layer in Figma** - Choose the component/frame to convert
2. **Get design context** - Extract design properties
3. **Get variables** - Retrieve design tokens
4. **Check Code Connect** - Find existing mappings
5. **Generate code** - Use context for accurate code generation

## Requirements

- Figma Dev Mode (paid feature)
- Figma access token with read permissions
- Single layer selection (multi-select not supported)

## Local Server

The Figma MCP server runs locally at `http://127.0.0.1:3845/sse` when Figma desktop app is running with Dev Mode enabled.

## When to Use

| Scenario | Use Figma MCP? |
|----------|----------------|
| Design-to-code | ✅ Yes |
| Extract design tokens | ✅ Yes |
| Component mapping | ✅ Yes |
| Style extraction | ✅ Yes |
| Bulk export | ❌ Use Figma API |
| Asset export | ❌ Use Figma export |

## Integration with Skills

- Works with `ui-ux-designer` agent for design implementation
- Use in `frontend` skills for component creation
- Combine with `frontend-design` skill for visual accuracy

## Best Practices

1. **Use Code Connect**: Set up mappings for reusable components
2. **Design tokens**: Ensure Figma uses variables for consistency
3. **Component structure**: Well-organized Figma = better code
4. **Single selection**: Select one layer at a time

## Resources

- [Figma MCP Server](https://developers.figma.com/docs/figma-mcp-server/)
- [Figma Dev Mode](https://www.figma.com/dev-mode/)
- [Code Connect](https://www.figma.com/developers/api#code-connect)
- [Figma API](https://www.figma.com/developers/api)
