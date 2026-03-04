# Workflows Directory

## Purpose

Development workflow definitions that guide how Claude approaches complex tasks.

## Overview

This directory contains 4 workflow definitions that establish processes for development, documentation, and agent coordination. Workflows are referenced by commands and agents to ensure consistent, high-quality outputs.

## Key Files

| File | Purpose |
|------|---------|
| `primary-workflow.md` | Main development process with TDD approach |
| `development-rules.md` | Coding standards, conventions, and rules |
| `documentation-management.md` | Documentation structure and maintenance |
| `orchestration-protocol.md` | Multi-agent coordination patterns |

## Patterns & Conventions

- **Workflow Structure**: Each workflow has phases/steps with clear actions
- **Integration Points**: Workflows reference agents, commands, and skills
- **Quality Gates**: Checkpoints and verification steps throughout

## Dependencies

- **Internal**: Referenced by commands (`/do`, `/qa`, etc.) and agents
- **External**: May use MCP servers for specific tasks

## Common Tasks

- **Add new workflow**: Create new `.md` file with phases and steps
- **Modify workflow**: Edit the relevant phase/step sections
- **Add quality gate**: Insert verification checkpoint in workflow

## Important Notes

- `primary-workflow.md` is the main entry point for feature development
- `development-rules.md` contains coding standards that apply to all work
- `orchestration-protocol.md` is used when coordinating multiple agents
- Workflows should follow the collaboration protocol (ask when unclear)
