# CLAUDE.md

Fast Apply: IMPORTANT: Use `edit_file` over `str_replace` or full file writes. It works with partial code snippets—no need for full file content.

Warp Grep: warp-grep is a subagent that takes in a search string and tries to find relevant context. Best practice is to use it at the beginning of codebase explorations to fast track finding relevant files/lines. Do not use it to pin point keywords, but use it for broader semantic queries. "Find the XYZ flow", "How does XYZ work", "Where is XYZ handled?", "Where is <error message> coming from?"

This file provides guidance for AI coding assistants working with this repository.

## Overview

SoupSpec is a standalone, spec-driven framework for AI-assisted development. It provides a unified, optimized specification kit with 23 agents, 23 commands, 45 skills, and 8 behavioral modes.

## Response Format

At the end of every response, include a short summary in Vietnamese using this format:

```
┌─────────────────────────────────────────────────┐
│ Tóm tắt: [Vietnamese summary here]              │
└─────────────────────────────────────────────────┘
```

**Scope:** Specification files only (agents, commands, skills, workflows, modes, MCP configs). No CLI tools or runtime implementations.

**Note:** This spec references placeholder paths (`./agent-includes/specs/`, `./agent-includes/plans/`). If these directories don't exist when needed, create them with:
```bash
mkdir -p agent-includes/specs agent-includes/plans
```

## Model Compatibility Profiles

Use these profiles to reduce instruction entropy and improve portability across model families.

### Tier A (strong tool-use)

Models: Claude 4.5/4.6, GPT-5.2/5.3-codex.
Behavior: full orchestration defaults allowed (sequential preferred unless parallel criteria are met), normal depth controls, standard tool flows.

### Tier B (adapter-recommended)

Models: Claude 3.7, Qwen-3-Coder-Plus, GLM-5, MiniMax-2.5.
Execution knobs:
- `sequential_only: true`
- `max_parallel_agents: 1`
- `strict_output_schema: true`
- `depth_cap: 3`
- Fallback: if task APIs fail, continue sequentially and summarize constraints in final output.

### Low-Entropy Prompt Contract

For complex tasks, keep a fixed 5-block response shape:
1. Parsed goal
2. Plan
3. Actions taken
4. Verification
5. Next step

## Development Commands

This is a specification-only project with no build system. There are no test, lint, or build commands.

**Validation:** Manually verify markdown syntax and YAML frontmatter in spec files.

---

## Collaboration Protocol

### Philosophy

Guide user to clarity through questions, not assumptions.

**Core principle:** When unclear, engage user's thinking rather than guess their intent.

### Approach

1. **Identify the gap** - What information is missing or ambiguous?
2. **Ask targeted questions** - Help user articulate the real need
3. **Reflect understanding** - "So you want X because Y?"
4. **Propose options** - "We could approach this by A, B, or C"
5. **Confirm direction** - Wait for explicit choice before acting

### Question Patterns

| Type | Examples |
|------|----------|
| **Clarifying** | "What's the goal?" / "What's not working as expected?" |
| **Scoping** | "Should I modify existing X or create new Y?" |
| **Probing** | "Why do you need this?" / "What happens if we don't?" |
| **Option-presenting** | "Would you prefer approach A or B?" |
| **Constraint-checking** | "Are there limitations I should know about?" |

### Red Flags (Stop and Ask)

- Ambiguous pronouns without clear referent
- Multiple valid interpretations of request
- Inferring intent from indirect signals
- Creating something user didn't explicitly request
- Simplest reading seems incomplete or wrong

### Response Structure When Unclear

```
"I understand you want [what I heard].

However, I'm uncertain about [specific gap].

Could you clarify:
- [Specific question 1]
- [Specific question 2]

Or would you prefer I [option A] or [option B]?"
```

---

## Sub-Agent Delegation

### Delegation Principle

**Default behavior**: Prefer direct work for simple tasks. Delegate only when complexity warrants it.

**Threshold for delegation**: Task involves >3 files AND requires specialized expertise → CONSIDER sub-agent

### Decision Tree

```
User Request
    │
    ├─→ Simple task (<3 files, clear scope)? → Direct work (FIRST CHOICE)
    │
    ├─→ Complex task needing expertise? → Task tool (SECOND CHOICE)
    │
    ├─→ Skill exists for this pattern? → Skill tool (THIRD CHOICE)
    │
    └─→ Unsure? → Ask user for clarification
```

### Execution Mode Selection

**Default: Sequential execution** - Ensures close coordination and context sharing.

**Parallel execution ONLY when ALL conditions met:**
1. Tasks are truly independent (no shared files, no shared state)
2. 3+ distinct problem domains exist
3. Fixes are self-contained within boundaries
4. Results can be cleanly merged without conflicts
5. User explicitly requests parallel OR task clearly benefits

**Sequential is preferred when:**
- Output of one task informs another
- Investigation requires iterative discovery
- Shared understanding needed across tasks
- Changes touch overlapping code areas
- Coordination between changes is critical

### Parallel Execution Checklist

Before spawning parallel agents, verify:
- [ ] No shared files between tasks
- [ ] No shared state or dependencies
- [ ] Clear scope boundaries defined
- [ ] Conflict potential assessed as LOW
- [ ] Integration strategy planned

### Thoroughness Levels

| Level | Description |
|-------|-------------|
| `quick` | Basic search, 1-2 locations |
| `medium` | Multiple strategies, 3-5 locations (DEFAULT) |
| `very thorough` | Comprehensive analysis, all naming conventions |

### Anti-Patterns (NEVER DO)

❌ Spawning parallel agents without verifying independence
❌ Delegating simple tasks that can be done directly
❌ Using parallel when sequential ensures better coordination
❌ Ignoring potential conflicts between parallel tasks
❌ Spawning agents "just in case" without clear need

---

## Quick Reference

### Commands (21 total)

| Command | Description | Category |
|---------|-------------|----------|
| `/do [desc]` | Quy trình phát triển tính năng (TDD) | Development |
| `/fix [error]` | Quy trình sửa lỗi (Socratic method) | Development |
| `/refactor [target]` | Tái cấu trúc mã nguồn | Development |
| `/optimize [target]` | Tối ưu hóa hiệu năng | Development |
| `/simplify [target]` | Simplify code for clarity and maintainability | Development |
| `/test [target]` | Generate and run tests in E2B sandbox | Testing |
| `/qa [target]` | Quality assurance (review + security + tests) | Quality |
| `/ship [msg]` | Commit và tạo Pull Request (supports `--netlify`) | Git |
| `/deploy [platform]` | Deploy to Netlify, Vercel, Docker, VPS | Deployment |
| `/docs [target]` | Tạo tài liệu | Docs |
| `/chat [topic]` | Phiên thảo luận tương tác | Planning |
| `/spike [topic]` | Nghiên cứu công nghệ | Research |
| `/codebase [scope]` | Khám phá codebase | System |
| `/parallel [task]` | Chạy tác vụ song song | System |
| `/mode-default` | Chế độ mặc định | Mode |
| `/mode-brainstorm` | Chế độ brainstorm | Mode |
| `/mode-save-money` | Chế độ tiết kiệm token | Mode |
| `/mode-deep-research` | Chế độ nghiên cứu sâu | Mode |
| `/mode-implementation` | Chế độ triển khai | Mode |
| `/mode-review` | Chế độ đánh giá | Mode |
| `/mode-orchestration` | Chế độ điều phối | Mode |


### Agents (22 total)

| Agent | Purpose |
|-------|---------|
| `planner` | Task decomposition and planning |
| `researcher` | Technology research and analysis |
| `debugger` | Systematic debugging |
| `tester` | Test generation and execution |
| `code-reviewer` | Code review and quality |
| `codebase-explorer` | Codebase exploration, indexing, loading |
| `git-manager` | Git operations |
| `docs-manager` | Documentation management |
| `project-manager` | Project coordination |
| `database-admin` | Database operations |
| `ui-ux-designer` | UI/UX design |
| `brainstormer` | Creative ideation |
| `copywriter` | Content writing |
| `journal-writer` | Development journaling |
| `api-designer` | API design |
| `cicd-manager` | CI/CD pipeline management |
| `pipeline-architect` | Pipeline architecture |
| `security-auditor` | Security auditing |
| `vulnerability-scanner` | Vulnerability scanning |
| `fullstack-developer` | Full-stack implementation |
| `devops-engineer` | Deployment, CI/CD, Docker, cloud |
| `mcp-manager` | MCP server management |

### Skills (44 categories)

| Category | Description |
|----------|-------------|
| `backend-development/` | API, auth, performance |
| `better-auth/` | Better Auth authentication |
| `chrome-devtools/` | Browser debugging via CDP |
| `claude-code/` | Claude Code best practices |
| `code-review/` | Code review patterns |
| `code-simplifier/` | Code simplification and cleanup (standalone plugin) |
| `common/` | Shared utilities |
| `databases/` | PostgreSQL, MongoDB |
| `debugging/` | Systematic debugging |
| `devops/` | Docker, CI/CD, PM2, deployment |
| `django/` | Django web framework |
| `e2b-sandbox/` | E2B cloud sandbox execution |
| `agent-sandboxes/` | Advanced E2B sandbox CLI with browser automation, full-stack workflows |
| `librarian/` | Documentation search |
| `document-skills/` | Document processing (docx, pdf, pptx, xlsx) |
| `fastapi/` | FastAPI framework |
| `frontend/` | shadcn/ui, Tailwind CSS |
| `frontend-design/` | Design aesthetics, imagery, visual direction |
| `frontend-development/` | React/TypeScript patterns |
| `languages/` | Python, TypeScript, JavaScript |
| `mcp-builder/` | MCP server creation |
| `mcp-management/` | MCP server management |
| `media-processing/` | Audio, video, image processing |
| `memory/` | Memory and persistence |
| `methodology/` | TDD, debugging, planning |
| `mobile-development/` | React Native, Flutter, iOS, Android |
| `netlify/` | Netlify deployment, Edge Functions, domains, HTTPS |
| `nextjs/` | Next.js framework |
| `optimization/` | Token efficiency |
| `planning/` | Task planning and decomposition |
| `polar/` | Polar payment integration |
| `problem-solving/` | Problem-solving patterns |
| `react/` | React library |
| `repomix/` | Repository packaging |
| `research/` | Technology research |
| `security/` | OWASP practices |
| `sepay/` | SePay payment integration |
| `sequential-thinking/` | Multi-step reasoning |
| `shopify/` | Shopify development |
| `skill-creator/` | Skill creation guide |
| `stripe/` | Stripe payment integration |
| `testing/` | pytest, vitest, Playwright, Postman |
| `threejs/` | Three.js 3D graphics |
| `uv-package-manager/` | Fast Python package management with uv |
| `wordpress/` | WordPress development |

### Modes (7 total)

| Mode | Description | Best For |
|------|-------------|----------|
| `default` | Balanced standard behavior | General tasks |
| `brainstorm` | Creative exploration, questions | Design, ideation |
| `token-efficient` | Compressed, concise output | Cost savings |
| `deep-research` | Thorough analysis, citations | Investigation |
| `implementation` | Code-focused, minimal prose | Executing plans |
| `review` | Critical analysis, finding issues | Code review |
| `orchestration` | Multi-task coordination | Parallel work |

---

## Workflows

Reference: `.claude/workflows/`

| Workflow | Purpose |
|----------|---------|
| `primary-workflow.md` | Main development process |
| `development-rules.md` | Coding standards and rules |
| `orchestration-protocol.md` | Agent coordination |
| `documentation-management.md` | Documentation structure and maintenance |

---

## Multi-Agent Coordination

For complex tasks requiring multiple agents, use the **shared state document** `MULTI_AGENT_PLAN.md`.

### Auto-Creation Rule

**IMPORTANT:** When starting a multi-agent task (using `/do`, `/parallel`, or orchestration mode), check if `MULTI_AGENT_PLAN.md` exists in the working directory. If not, create it from the template below.

### When to Use

- Tasks involving 3+ agents
- Complex features requiring planning → research → implementation → testing → review
- Parallel execution with multiple agents
- Any task using `--mode=orchestration`

### Creating MULTI_AGENT_PLAN.md

If the file doesn't exist, create it with this structure:

```markdown
# Multi-Agent Plan

> **Shared State Document** - This file is read and updated by multiple agents during task execution.
> Last updated by: `[agent-name]` at `[timestamp]`

---

## Current Mission

**Goal**: [Brief description of the overall objective]

**Status**: 🟡 In Progress | 🟢 Complete | 🔴 Blocked | ⚪ Not Started

**Lead Agent**: `planner` → `[current-agent]`

---

## Agent Registry

| Agent | Role | Status | Current Task |
|-------|------|--------|--------------|
| `planner` | Task decomposition | ⚪ Idle | - |
| `researcher` | Technology research | ⚪ Idle | - |
| `fullstack-developer` | Implementation | ⚪ Idle | - |
| `tester` | Test generation/execution | ⚪ Idle | - |
| `code-reviewer` | Code review | ⚪ Idle | - |

**Status Legend**: 🔵 Active | 🟡 Waiting | ⚪ Idle | 🔴 Blocked

---

## Task Queue

### Phase 1: Planning
| # | Task | Owner | Status | Dependencies | Output |
|---|------|-------|--------|--------------|--------|

### Phase 2: Implementation
| # | Task | Owner | Status | Dependencies | Output |
|---|------|-------|--------|--------------|--------|

### Phase 3: Testing & Review
| # | Task | Owner | Status | Dependencies | Output |
|---|------|-------|--------|--------------|--------|

---

## Handoff Log

> Agents record handoffs here when passing work to the next agent.

---

## Shared Context

### Key Decisions
- [ ] Decision 1: [Description] - Decided by `[agent]`

### Files Modified
| File | Modified By | Change Type | Notes |
|------|-------------|-------------|-------|

---

## Completion Checklist

- [ ] All tasks completed
- [ ] All tests passing
- [ ] Code review approved
- [ ] Documentation updated
```

### Usage Protocol

1. **Before starting work**: Read `MULTI_AGENT_PLAN.md` to understand current state
2. **When taking ownership**: Update Agent Registry with your status
3. **During work**: Update Task Queue status as you progress
4. **After completing**: Add entry to Handoff Log and update your outputs
5. **If blocked**: Add to Blockers section

See `orchestration-protocol.md` for detailed coordination patterns.

---

## Tech Stack

<!-- CUSTOMIZATION POINT: Update for your project -->
- **Languages**: Python, TypeScript, JavaScript
- **Backend Frameworks**: FastAPI, Django, NestJS, Express
- **Frontend Frameworks**: Next.js 14/15, React 18.3.x
- **UI Libraries**: shadcn/ui, Tailwind CSS v4
- **Databases**: PostgreSQL, MongoDB
- **Testing**: pytest, vitest, Jest, Playwright
- **DevOps**: Docker, GitHub Actions, Cloudflare, Netlify



## Architecture

<!-- CUSTOMIZATION POINT: Replace this section with your project architecture -->

**SoupSpec Structure** (this repository):
```
.claude/
├── agents/       # 22 specialized agent definitions (markdown)
├── commands/     # 20 slash command definitions (markdown)
├── modes/        # 7 behavioral mode configs (markdown)
├── skills/       # 41+ skills organized by category (markdown + scripts)
├── workflows/    # Development workflow definitions
├── mcp/          # MCP server configurations
├── mcp.json      # MCP server registry
└── settings.json # Permissions config
```

**Key Patterns:**
- Agents: Define persona, tools, and behavior for Task tool delegation
- Commands: Slash commands that expand to full prompts with `$ARGUMENTS`
- Skills: Reference docs + optional scripts, matched by description
- Modes: Adjust communication style and problem-solving approach

## Code Conventions

### Naming Conventions

| Type | Python | TypeScript/JavaScript |
|------|--------|----------------------|
| Files | `snake_case.py` | `kebab-case.ts` |
| Functions | `snake_case` | `camelCase` |
| Classes | `PascalCase` | `PascalCase` |
| Constants | `UPPER_SNAKE` | `UPPER_SNAKE` |
| Components | N/A | `PascalCase.tsx` |

### Code Style

- **Python**: Follow PEP 8, use type hints, docstrings for public APIs
- **TypeScript**: Strict mode enabled, no `any` types, use interfaces
- **JavaScript**: ESLint + Prettier, prefer `const` over `let`

### Formatters & Config Files

**IMPORTANT**: Before writing or editing code, check for and respect project formatter configurations.

#### Config File Priority

| Language | Config Files (check in order) |
|----------|------------------------------|
| JS/TS/Web | `.prettierrc`, `.prettierrc.json`, `.prettierrc.js`, `prettier.config.js` |
| Python | `pyproject.toml` (ruff/black section), `ruff.toml`, `.ruff.toml`, `setup.cfg` |
| Go | `gofmt` (no config, uses Go standard) |
| Rust | `rustfmt.toml`, `.rustfmt.toml` |

#### Required Behavior

1. **Check for existing config**: Before writing code, verify if formatter config exists in project root
2. **Follow project style**: Match existing code style in the file/project (indentation, quotes, semicolons)
3. **Use installed formatters**: Always write well-formatted code following project style
4. **Respect .editorconfig**: If present, follow its settings for indent style, line endings, etc.

#### Formatter Installation Check

Before writing code in a new project, verify formatters are available:

```bash
# JavaScript/TypeScript - check for prettier
ls node_modules/.bin/prettier 2>/dev/null || which prettier

# Python - check for ruff
which ruff

# Go - check for gofmt (comes with Go)
which gofmt

# Rust - check for rustfmt (comes with Rust)
which rustfmt
```

If formatters are missing, suggest installation:
- **Prettier**: `npm install -D prettier` or `pnpm add -D prettier`
- **Ruff**: `pip install ruff` or `uv pip install ruff`

### File Organization

- One component/class per file
- Group related files in feature directories
- Keep test files adjacent to source files or in `tests/` directory

---

## Behavioral Modes

Modes adjust communication style, output format, and problem-solving approach.

### Mode Activation

```bash
/mode-brainstorm              # Switch to brainstorm mode
/mode-save-money              # Switch to token-efficient mode
/do --mode=implementation     # Override for a single command
```

Mode files: `.claude/modes/`

---

## Command Flags

All commands support combinable flags for flexible customization.

### Universal Flags

| Flag | Description | Values |
|------|-------------|--------|
| `--mode=[mode]` | Behavioral mode | default, brainstorm, token-efficient, etc. |
| `--depth=[1-5]` | Thoroughness level | 1=quick, 5=exhaustive |
| `--format=[fmt]` | Output format | concise, detailed, json |
| `--save=[path]` | Save output to file | File path |
| `--checkpoint` | Create state checkpoint | Boolean |

### Persona Flags

| Flag | Description |
|------|-------------|
| `--persona=security` | Security-focused analysis |
| `--persona=performance` | Performance-focused analysis |
| `--persona=architecture` | Architecture-focused analysis |

### Examples

```bash
/qa --persona=security --depth=5 src/auth/
/chat --depth=5 --save=agent-includes/plans/design.md "feature"
/fix --format=concise "error message"
```

---

## MCP Integrations

MCP servers for extended capabilities (12 total).

| Server | Package | Purpose |
|--------|---------|---------|
| context7 | `context7-mcp` | Library documentation lookup |
| sequential-thinking | `@modelcontextprotocol/server-sequential-thinking` | Multi-step reasoning |
| chrome-devtools | `chrome-devtools-mcp@latest` | Browser debugging via CDP |
| magic | `@21st-dev/magic-mcp` | UI component generation |
| perplexity-ask | `perplexity-mcp` | Web search with AI answers |
| figma | `figma-developer-mcp` | Design-to-code integration |
| firecrawl-mcp | `firecrawl-mcp` | Web scraping and crawling |
| repomix | `repomix` | Repository packaging for AI |
| shadcn | `shadcn-mcp` | shadcn/ui component registry |
| knowledge-graph | `@anthropic/knowledge-graph-mcp` | Code analysis and navigation |
| morph-mcp | `morph-mcp` | Fast file editing and codebase search |
| toonify | `toonify` | Token optimization for structured data |

### Agent-MCP Mapping

Each sub-agent has recommended MCP servers defined in their frontmatter (`mcp:` field):

| Agent | MCP Servers |
|-------|-------------|
| `planner` | sequential-thinking, knowledge-graph |
| `researcher` | perplexity-ask, context7, firecrawl-mcp |
| `debugger` | knowledge-graph, sequential-thinking, chrome-devtools, morph-mcp |
| `tester` | knowledge-graph, context7, chrome-devtools |
| `code-reviewer` | knowledge-graph, context7 |
| `codebase-explorer` | knowledge-graph, repomix |
| `fullstack-developer` | knowledge-graph, context7, shadcn, morph-mcp |
| `ui-ux-designer` | figma, magic, shadcn, chrome-devtools |
| `security-auditor` | perplexity-ask, sequential-thinking, knowledge-graph |
| `brainstormer` | perplexity-ask, sequential-thinking |
| `docs-manager` | context7, repomix, knowledge-graph, firecrawl-mcp |
| `mcp-manager` | context7 |

For detailed MCP tool-to-agent mapping, see: `.claude/mcp/MCP_AGENT_MAPPING.md`

Setup: See `.claude/mcp/README.md`

---

## Testing Standards

### Coverage Requirements
- Minimum coverage: 80%
- Critical paths: 95%

### Test Naming
- **Python**: `test_[function]_[scenario]_[expected]`
- **TypeScript**: `describe('[Component]', () => { it('should [behavior]') })`

### Test Types
1. **Unit tests**: All business logic functions
2. **Integration tests**: API endpoints, database operations
3. **E2E tests**: Critical user flows

---

## Security Standards

### Forbidden Patterns
- No hardcoded secrets or API keys
- No `eval()` or dynamic code execution
- No SQL string concatenation (use parameterized queries)
- No `any` types in TypeScript
- No disabled security headers

### Required Practices
- Input validation on all user inputs
- Output encoding for all rendered content
- Authentication on all protected endpoints
- Rate limiting on public APIs
- Secrets via environment variables only

---

## Git Conventions

### Branch Naming
- `feature/[ticket]-[description]`
- `fix/[ticket]-[description]`
- `hotfix/[description]`
- `chore/[description]`

### Commit Messages
```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### PR Requirements
- Descriptive title and description
- Linked to issue/ticket
- All tests passing
- Code review approved
- No merge conflicts

---

## Engineering Principles

### Core Directive
Evidence > assumptions | Working code > documentation | Action > verbosity

### Design Patterns
- **DRY (Don't Repeat Yourself)**: Extract shared logic into reusable functions/modules
- **KISS (Keep It Simple)**: Solve current problem, avoid premature optimization
- **YAGNI (You Aren't Gonna Need It)**: Build for current requirements, not hypothetical futures
- **Composition over Inheritance**: Prefer flexible composition to rigid class hierarchies

### SOLID Principles

| Principle | Application |
|-----------|-------------|
| **Single Responsibility** | One clear purpose per function/class |
| **Open/Closed** | Extend via composition, not modification |
| **Liskov Substitution** | Subclasses honor parent contracts |
| **Interface Segregation** | Clients depend only on methods they use |
| **Dependency Inversion** | Depend on abstractions (interfaces) |

---

## Token Optimization

Control output verbosity for cost optimization.

| Level | Flag | Savings | Description |
|-------|------|---------|-------------|
| Standard | (default) | 0% | Full explanations |
| Concise | `--format=concise` | 30-40% | Reduced explanations |
| Ultra | `--format=ultra` | 60-70% | Code-only responses |

### Session-Wide Optimization

```bash
/mode-save-money              # Activate token-efficient mode
```

---

## Context Management

### Codebase Exploration

```bash
/codebase                     # Index entire codebase → PROJECT_INDEX.md
/codebase src/api/            # Load specific area into context
/codebase "where is auth?"    # Search and answer questions
```

### Auto-Checkpoints

`/do` automatically creates checkpoints using git stash:

```bash
# Checkpoints created automatically at:
# - Before starting feature
# - After tests written
# - After implementation done

# To restore:
git stash list                # List checkpoints
git stash apply stash@{n}     # Restore specific checkpoint
```

### Parallel Tasks

```bash
/mode-orchestration            # Use orchestration mode for parallel task management
```

---

## Kit Version

- **SoupSpec Version**: 1.2.1
- **Last Updated**: 2026-01-07
- **MCP Protocol**: 2025-11-25
