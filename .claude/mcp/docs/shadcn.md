# shadcn MCP Server

shadcn/ui component management for React projects.

## Package

```bash
npx shadcn@latest mcp
```

No environment variables required.

## Protocol Version

Compatible with MCP Protocol 2025-11-25

## Overview

shadcn MCP provides tools for managing shadcn/ui components in React projects. It allows searching, viewing, and installing components from the shadcn registry and custom registries.

## Tools

| Tool | Description |
|------|-------------|
| `get_project_registries` | Get configured registry names from components.json |
| `list_items_in_registries` | List all items from registries |
| `search_items_in_registries` | Search components using fuzzy matching |
| `view_items_in_registries` | View detailed component information |
| `get_item_examples_from_registries` | Find usage examples and demos |
| `get_add_command_for_items` | Get CLI command to add components |
| `get_audit_checklist` | Verify component setup |

## Usage Examples

### Search Components
```
"Find a button component"
→ search_items_in_registries registries=["@shadcn"] query="button"
```

### View Component Details
```
"Show me the card component"
→ view_items_in_registries items=["@shadcn/card"]
```

### Get Examples
```
"Show button usage examples"
→ get_item_examples_from_registries registries=["@shadcn"] query="button-demo"
```

### Get Install Command
```
"How do I add the dialog component?"
→ get_add_command_for_items items=["@shadcn/dialog"]
```

## Component Categories

| Category | Components |
|----------|------------|
| Inputs | Button, Input, Textarea, Select, Checkbox |
| Layout | Card, Dialog, Sheet, Drawer, Tabs |
| Data Display | Table, Avatar, Badge, Calendar |
| Feedback | Alert, Toast, Progress, Skeleton |
| Navigation | Breadcrumb, Dropdown Menu, Navigation Menu |

## Workflow

1. **Search**: Find components matching your needs
2. **View**: Check component details and dependencies
3. **Examples**: See usage patterns and demos
4. **Install**: Get the CLI command to add to project
5. **Audit**: Verify setup after installation

## When to Use

| Scenario | Use shadcn MCP? |
|----------|-----------------|
| Find shadcn components | Yes |
| View component code | Yes |
| Get usage examples | Yes |
| Install components | Yes |
| Custom component creation | No - Use Magic MCP |
| Non-React projects | No |

## Prerequisites

- React project with shadcn/ui initialized
- `components.json` file in project root

## Best Practices

1. **Search first**: Use fuzzy search to find components
2. **Check examples**: View demos before implementing
3. **Run audit**: Verify setup after adding components
4. **Use registries**: Specify registry for faster searches

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [shadcn/ui GitHub](https://github.com/shadcn-ui/ui)
- [Component Registry](https://ui.shadcn.com/docs/components)
