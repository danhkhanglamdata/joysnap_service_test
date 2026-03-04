# Modes Directory

## Purpose

Behavioral mode configurations that adjust Claude's communication style and problem-solving approach.

## Overview

This directory contains 7 behavioral modes. Modes modify how Claude responds, balancing factors like verbosity, thoroughness, creativity, and cost. Modes can be activated globally or per-command using the `--mode=` flag.

## Key Files

| File | Purpose | Best For |
|------|---------|----------|
| `default.md` | Standard balanced behavior | General tasks |
| `brainstorm.md` | Creative exploration, questions | Design, ideation |
| `deep-research.md` | Thorough analysis, citations | Investigation |
| `implementation.md` | Code-focused, minimal prose | Executing plans |
| `review.md` | Critical analysis, finding issues | Code review |
| `token-efficient.md` | Compressed, concise output | Cost savings |
| `orchestration.md` | Multi-task coordination | Parallel work |

## Patterns & Conventions

- **Description Section**: What the mode does
- **When Active Section**: Conditions for activation
- **Behavior Section**: How communication, problem-solving, and output change
- **Activation Section**: How to enable the mode
- **MCP Integration Section**: Which MCP servers the mode uses

## Mode File Template

```markdown
# Mode Name

## Description
[What this mode does]

## When Active
[When this mode is used]

---

## Behavior

### Communication
- [Style point 1]
- [Style point 2]

### Problem Solving
- [Approach 1]
- [Approach 2]

### Output Format
- [Format point 1]
- [Format point 2]

---

## Activation

[How to activate this mode]

---

## MCP Integration

[Which MCP servers this mode uses]

---

## Compatible With

[Which commands/workflows work with this mode]
```

## Dependencies

- **Internal**: Modes are referenced by commands via `--mode=` flag
- **External**: Some modes use specific MCP servers

## Common Tasks

- **Add new mode**: Create new `.md` file following the template
- **Modify mode behavior**: Edit the Behavior section
- **Add MCP integration**: Add to MCP Integration section

## Important Notes

- Default mode is active unless another is specified
- Modes can be activated with `/mode-[name]` command
- Modes can be overridden per-command with `--mode=` flag
- Token-efficient mode can save 30-70% on token costs
- Orchestration mode is for coordinating multiple parallel tasks
