# Magic MCP Server

AI-powered UI component generation from 21st.dev.

## Package

```bash
npx -y @21st-dev/magic@latest
```

Requires `MAGIC_21ST_DEV_API_KEY` environment variable (set as `API_KEY`).

## Protocol Version

Compatible with MCP Protocol 2025-11-25

## Overview

Magic MCP from 21st.dev provides AI-powered UI component generation. It creates production-ready, customizable React/TypeScript components from natural language descriptions, inspired by the 21st.dev component library.

## Tools

| Tool | Description |
|------|-------------|
| `21st_magic_component_builder` | Build new UI components from descriptions |
| `21st_magic_component_inspiration` | Get component inspiration and previews |
| `21st_magic_component_refiner` | Refine/improve existing components |
| `logo_search` | Search for company logos in JSX/TSX/SVG format |

## Usage

Magic MCP is activated via the `/ui` or `/21` slash commands:

```
/ui [component description]
/21 [component description]
```

## Usage Examples

```
/ui create a modern navigation bar with responsive design

/ui responsive navbar with logo and dark mode toggle

/ui create a responsive pricing card with a gradient background

/ui hero section with animated background and CTA buttons

/ui data table with sorting, filtering, and pagination

/ui modal dialog with form validation
```

## Component Types

| Category | Examples |
|----------|----------|
| Navigation | Navbar, sidebar, breadcrumbs, tabs |
| Layout | Hero sections, grids, cards, containers |
| Forms | Input fields, selects, checkboxes, validation |
| Feedback | Modals, toasts, alerts, progress bars |
| Data Display | Tables, lists, charts, stats cards |
| Interactive | Buttons, dropdowns, accordions, carousels |

## Output Format

Generated components include:
- React/TypeScript component code
- Tailwind CSS styling
- Responsive design
- Accessibility attributes
- TypeScript interfaces

## When to Use

| Scenario | Use Magic? |
|----------|------------|
| Quick UI prototyping | Yes |
| Component scaffolding | Yes |
| Design inspiration | Yes |
| Responsive components | Yes |
| Complex business logic | No - Manual coding |
| Existing component library | No - Use your library |

## Integration with Skills

- Works with `ui-ux-designer` agent for design implementation
- Use in `frontend` skills for rapid development
- Combine with `frontend-development` skill for React patterns

## Resources

- [21st.dev](https://21st.dev)
- [Magic MCP GitHub](https://github.com/21st-dev/magic-mcp)
- [21st.dev Component Library](https://21st.dev/components)
