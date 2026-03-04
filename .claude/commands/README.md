# SoupSpec Commands

This folder contains all slash commands available in SoupSpec.

## Command Flags System

All commands support a universal flags system for customizing behavior:

### Universal Flags

| Flag | Description | Values | Example |
|------|-------------|--------|---------|
| `--mode=[mode]` | Override behavioral mode | default, brainstorm, token-efficient, deep-research, implementation, review, orchestration | `--mode=implementation` |
| `--depth=[1-5]` | Thoroughness level | 1 (quick) to 5 (exhaustive) | `--depth=4` |
| `--format=[fmt]` | Output format | concise, detailed, json | `--format=detailed` |
| `--persona=[type]` | Apply expertise focus | security, performance, architecture, testing, accessibility | `--persona=security` |
| `--save=[path]` | Save output to file | File path | `--save=agent-includes/specs/output.md` |
| `--checkpoint` | Create state checkpoint | Boolean flag | `--checkpoint` |

### Mode Options

| Mode | Description | Best For |
|------|-------------|----------|
| `default` | Balanced standard behavior | General tasks |
| `brainstorm` | Creative exploration, more questions | Design, ideation |
| `token-efficient` | Compressed, concise output | High-volume, cost savings |
| `deep-research` | Thorough analysis, citations | Investigation, audits |
| `implementation` | Code-focused, minimal prose | Executing plans |
| `review` | Critical analysis, finding issues | Code review, QA |
| `orchestration` | Multi-task coordination | Complex parallel work |

### Depth Levels

| Level | Behavior |
|-------|----------|
| 1 | Quick overview, key points only |
| 2 | Standard analysis |
| 3 | Thorough with examples |
| 4 | Comprehensive with trade-offs |
| 5 | Exhaustive with citations |

### Persona Options

| Persona | Focus Area |
|---------|------------|
| `security` | Vulnerabilities, auth, data protection |
| `performance` | Efficiency, queries, caching |
| `architecture` | Patterns, coupling, SOLID |
| `testing` | Coverage, test quality |
| `accessibility` | A11y compliance |

## Usage Examples

```bash
# Feature with implementation mode
/do --mode=implementation "add user profile"

# Deep research with high depth
/spike --depth=5 --format=detailed "authentication patterns"

# Security-focused code review
/qa --persona=security --depth=4 src/auth/

# Feature with brainstorm mode
/do --mode=brainstorm --checkpoint "payment integration"

# Save output to file
/chat --save=agent-includes/plans/design.md "API architecture"
```

## Command Categories

### Development
- `/do` - Feature development workflow (TDD)
- `/fix` - Debug and fix bugs
- `/refactor` - Improve code structure
- `/optimize` - Performance optimization

### Quality & Testing
- `/test` - Generate and run tests in E2B sandbox
- `/qa` - Quality assurance (review + security + tests)

### Git & Deployment
- `/ship` - Commit + PR automation (supports `--netlify`)
- `/deploy` - Multi-platform deployment (Netlify, Vercel, Docker, VPS)

### Documentation & Planning
- `/docs` - Generate documentation
- `/chat` - Interactive discussion session
- `/spike` - Technology research

### System
- `/codebase` - Explore, index, load codebase
- `/parallel` - Launch parallel background task (deprecated, use orchestration mode)

### Mode Commands
- `/mode-default` - Switch to default mode
- `/mode-brainstorm` - Switch to brainstorm mode
- `/mode-save-money` - Switch to token-efficient mode
- `/mode-deep-research` - Switch to deep research mode
- `/mode-implementation` - Switch to implementation mode
- `/mode-review` - Switch to review mode
- `/mode-orchestration` - Switch to orchestration mode

## E2B Sandbox Testing

Commands that run tests default to E2B cloud sandbox execution:

| Command | Test Behavior |
|---------|---------------|
| `/test` | Primary test generation and E2B execution |
| `/do` | TDD workflow with E2B test verification |
| `/fix` | Bug fix verification in E2B sandbox |
| `/ship` | Pre-commit test validation in E2B |
| `/qa` | Test coverage analysis in E2B |
| `/refactor` | Post-refactor verification in E2B |

Use `--test-local` flag to run tests locally instead of E2B sandbox.
