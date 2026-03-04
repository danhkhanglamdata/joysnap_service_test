# Commands Directory

## Purpose

Slash command definitions that expand to full prompts for common workflows.

## Overview

This directory contains 20 slash command definitions. Commands are invoked with `/command-name [arguments]` and expand to full prompts with `$ARGUMENTS` substitution. Commands can specify default modes and support combinable flags.

## Key Files

### Development Commands

| File | Command | Description | Default Mode |
|------|---------|-------------|--------------|
| `do.md` | `/do [desc]` | Feature development workflow (TDD) | orchestration |
| `fix.md` | `/fix [error]` | Bug fixing (Socratic method) | default |
| `refactor.md` | `/refactor [target]` | Code refactoring | default |
| `optimize.md` | `/optimize [target]` | Performance optimization | default |
| `test.md` | `/test [target]` | Test generation & E2B sandbox execution | default |
| `qa.md` | `/qa [target]` | Quality assurance (review + security + tests) | review |

### Git & Deployment Commands

| File | Command | Description | Default Mode |
|------|---------|-------------|--------------|
| `ship.md` | `/ship [msg]` | Commit and create Pull Request | default |
| `deploy.md` | `/deploy [platform]` | Deploy to Netlify, Vercel, Docker, VPS | default |

### Documentation & Research Commands

| File | Command | Description | Default Mode |
|------|---------|-------------|--------------|
| `docs.md` | `/docs [target]` | Generate documentation | default |
| `chat.md` | `/chat [topic]` | Interactive discussion | default |
| `spike.md` | `/spike [topic]` | Technology research | deep-research |
| `codebase.md` | `/codebase [scope]` | Codebase exploration | deep-research |

### System Commands

| File | Command | Description | Default Mode |
|------|---------|-------------|--------------|
| `parallel.md` | `/parallel [task]` | Parallel task execution | orchestration |

### Mode Commands

| File | Command | Description |
|------|---------|-------------|
| `mode-default.md` | `/mode-default` | Switch to default mode |
| `mode-brainstorm.md` | `/mode-brainstorm` | Switch to brainstorm mode |
| `mode-save-money.md` | `/mode-save-money` | Switch to token-efficient mode |
| `mode-deep-research.md` | `/mode-deep-research` | Switch to deep research mode |
| `mode-implementation.md` | `/mode-implementation` | Switch to implementation mode |
| `mode-review.md` | `/mode-review` | Switch to review mode |
| `mode-orchestration.md` | `/mode-orchestration` | Switch to orchestration mode |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Commands overview and usage guide |

## Patterns & Conventions

### Command File Structure

```markdown
# /command-name - Command Title

## Purpose
[What this command does]

## Default Mode
[Which mode is active by default]

## Usage
\`\`\`
/command-name [arguments]
\`\`\`

## Arguments
- `$ARGUMENTS`: [Description of expected arguments]

---

[Command prompt content with $ARGUMENTS placeholder]

## Workflow
[Step-by-step process]

## Flags
[Available flags and their effects]
```

### Argument Substitution

Commands use `$ARGUMENTS` as a placeholder that gets replaced with user input:

```bash
/do add user authentication
# $ARGUMENTS = "add user authentication"
```

### Universal Flags

All commands support these flags:

| Flag | Description | Values |
|------|-------------|--------|
| `--mode=[mode]` | Override behavioral mode | default, brainstorm, token-efficient, etc. |
| `--depth=[1-5]` | Thoroughness level | 1=quick, 5=exhaustive |
| `--format=[fmt]` | Output format | concise, detailed, json |
| `--save=[path]` | Save output to file | File path |
| `--checkpoint` | Create state checkpoint | Boolean |

### Command-Specific Flags

| Command | Flag | Description |
|---------|------|-------------|
| `/do` | `--skip-tests` | Skip test generation phase |
| `/do` | `--skip-review` | Skip code review phase |
| `/do` | `--test-local` | Run tests locally instead of E2B |
| `/do` | `--review` | Prompt for code review after completion |
| `/ship` | `--netlify` | Deploy to Netlify after PR |
| `/test` | `--test-local` | Run tests locally instead of E2B |
| `/codebase` | `--claude-md-only` | Only generate CLAUDE.md files |
| `/codebase` | `--no-claude-md` | Skip CLAUDE.md generation |

## Dependencies

- **Internal**: Commands reference agents, skills, and modes
- **External**: Some commands use E2B sandbox for test execution

## Common Tasks

- **Add new command**: Create `.md` file with Purpose, Usage, Workflow sections
- **Modify command behavior**: Edit the Workflow section
- **Add new flag**: Add to Flags table and implement in Workflow

## Important Notes

- Commands expand to full prompts, not just execute actions
- The `$ARGUMENTS` placeholder is required for argument substitution
- Default mode can be overridden with `--mode=` flag
- Commands can delegate to agents via Task tool
- E2B sandbox is default for test execution; use `--test-local` for local tests
