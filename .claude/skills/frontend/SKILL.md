---
name: frontend
description: Build beautiful, accessible UIs with shadcn/ui (Radix + Tailwind v4), Tailwind CSS v4 utilities, container queries, 3D transforms, and canvas-based designs. Use when implementing UI components, responsive layouts, dark mode, theming, forms, dialogs, tables, or any React-based frontend styling.
---

# Frontend UI Skill

Comprehensive skill for shadcn/ui components + Tailwind CSS v4 styling.

## Quick Start

```bash
npx shadcn@latest init          # Setup shadcn + Tailwind
npx shadcn@latest add button card dialog form
```

## Core Stack

- **shadcn/ui**: Accessible components via Radix UI primitives
- **Tailwind CSS v4**: Utility-first styling with Oxide engine, CSS-first config
- **TypeScript**: Full type safety

## Sub-Skills

- `shadcn-ui/SKILL.md` - Component patterns (Button, Form, Dialog, etc.)
- `tailwind/SKILL.md` - Tailwind v4: CSS-first config, container queries, 3D transforms, OKLCH colors

## References

### shadcn/ui
- `references/shadcn-components.md` - Complete component catalog
- `references/shadcn-theming.md` - Theme customization, CSS variables
- `references/shadcn-accessibility.md` - ARIA, keyboard nav, focus

### Tailwind CSS v4
- `references/tailwind-utilities.md` - Layout, spacing, typography
- `references/tailwind-responsive.md` - Breakpoints, mobile-first, container queries
- `references/tailwind-customization.md` - CSS-first @theme config, custom utilities

### Visual Design
- `references/canvas-design-system.md` - Design philosophy

## Common Patterns

### Form with Validation
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"

const form = useForm({ resolver: zodResolver(schema) });
```

### Responsive Dark Mode
```tsx
<div className="bg-white dark:bg-gray-900 grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card className="hover:shadow-lg transition-shadow" />
</div>
```

## Best Practices

1. Use `cn()` for conditional classes
2. Mobile-first responsive design
3. Leverage Radix accessibility
4. CSS variables for theming
5. Extract components only for true repetition

## Resources

- shadcn/ui: https://ui.shadcn.com
- Tailwind: https://tailwindcss.com
- Radix UI: https://radix-ui.com
