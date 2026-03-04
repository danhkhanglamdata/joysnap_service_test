# Skills Directory

## Purpose

Reference documentation and executable scripts organized by category for Claude Code.

## Overview

This directory contains 43 skill categories providing domain-specific knowledge, patterns, and automation scripts. Skills are matched by description and invoked via the Skill tool. Each skill category may contain reference docs, scripts, and a SKILL.md entry point.

## Key Files

| File | Purpose |
|------|---------|
| `README.md` | Skills overview and usage guide |
| `INSTALLATION.md` | Installation instructions for skill dependencies |
| `THIRD_PARTY_NOTICES.md` | Third-party license attributions |
| `agent_skills_spec.md` | Specification for creating new skills |
| `install.sh` | Installation script for skill dependencies |

## Skill Categories

### Backend & API
| Directory | Purpose |
|-----------|---------|
| `backend-development/` | API design, auth, performance, security |
| `better-auth/` | Better Auth authentication library |
| `fastapi/` | FastAPI framework patterns |
| `django/` | Django web framework |

### Frontend & UI
| Directory | Purpose |
|-----------|---------|
| `frontend/` | shadcn/ui, Tailwind CSS v4 |
| `frontend-design/` | Design aesthetics, imagery |
| `frontend-development/` | React/TypeScript patterns |
| `react/` | React library patterns |
| `nextjs/` | Next.js framework |
| `threejs/` | Three.js 3D graphics |

### Databases
| Directory | Purpose |
|-----------|---------|
| `databases/` | PostgreSQL, MongoDB (with scripts) |

### DevOps & Infrastructure
| Directory | Purpose |
|-----------|---------|
| `devops/` | Docker, CI/CD, PM2, deployment |
| `e2b-sandbox/` | E2B cloud sandbox execution |
| `netlify/` | Netlify deployment, Edge Functions, domains, HTTPS |
| `chrome-devtools/` | Browser debugging via CDP |

### Testing
| Directory | Purpose |
|-----------|---------|
| `testing/` | pytest, vitest, Playwright, Postman |

### Languages
| Directory | Purpose |
|-----------|---------|
| `languages/` | Python, TypeScript, JavaScript |

### Methodology
| Directory | Purpose |
|-----------|---------|
| `methodology/` | TDD, debugging, planning (14 sub-skills) |

### Tools & Integrations
| Directory | Purpose |
|-----------|---------|
| `claude-code/` | Claude Code best practices |
| `mcp-builder/` | MCP server creation |
| `mcp-management/` | MCP server management |
| `librarian/` | Documentation search via context7 |
| `sequential-thinking/` | Multi-step reasoning |
| `repomix/` | Repository packaging |
| `uv-package-manager/` | Fast Python package management with uv |

### Payments
| Directory | Purpose |
|-----------|---------|
| `stripe/` | Stripe payment integration |
| `polar/` | Polar payment platform |
| `sepay/` | SePay payment integration |

### Mobile
| Directory | Purpose |
|-----------|---------|
| `mobile-development/` | React Native, Flutter, iOS, Android |

### CMS & E-commerce
| Directory | Purpose |
|-----------|---------|
| `wordpress/` | WordPress development |
| `shopify/` | Shopify development |

### Other
| Directory | Purpose |
|-----------|---------|
| `code-review/` | Code review patterns |
| `debugging/` | Systematic debugging |
| `document-skills/` | Document processing (docx, pdf, pptx, xlsx) |
| `media-processing/` | Audio, video, image processing |
| `memory/` | Memory and persistence |
| `optimization/` | Token efficiency |
| `planning/` | Task planning |
| `problem-solving/` | Problem-solving patterns |
| `research/` | Technology research |
| `security/` | OWASP practices |
| `skill-creator/` | Skill creation guide |
| `common/` | Shared utilities |

## Patterns & Conventions

### Skill Directory Structure
```
skill-name/
├── SKILL.md           # Entry point with description and usage
├── references/        # Reference documentation files
│   ├── topic-1.md
│   └── topic-2.md
└── scripts/           # Optional executable scripts
    ├── package.json
    └── script.ts
```

### SKILL.md Template
```markdown
---
description: Brief description for skill matching
---

# Skill Name

## When to Use
[Conditions for using this skill]

## Key Concepts
[Important concepts and patterns]

## References
[Links to reference docs in references/]

## Examples
[Usage examples]
```

## Dependencies

- **Internal**: Skills are matched by description and invoked via Skill tool
- **External**: Some skills have npm/pip dependencies in scripts/

## Common Tasks

- **Add new skill**: Create directory with SKILL.md following template
- **Add reference doc**: Create `.md` file in `references/` subdirectory
- **Add script**: Create `scripts/` directory with package.json and script files

## Important Notes

- Skills are matched by their `description` field in SKILL.md frontmatter
- The `methodology/` directory contains 14 sub-skills for development practices
- Scripts in `scripts/` directories may require `npm install` or `pip install`
- Use `install.sh` to install all skill dependencies at once
- Skills can reference MCP servers for extended functionality
