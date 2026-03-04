# Agents Directory

## Purpose

Specialized agent definitions for task delegation via the Task tool.

## Overview

This directory contains 22 agent definitions. Each agent is a specialized persona with defined capabilities, tools, and workflows. Agents are invoked via the Task tool with `subagent_type` matching the agent name.

## Key Files

| File | Purpose | MCP Servers |
|------|---------|-------------|
| `planner.md` | Task decomposition and planning | sequential-thinking, knowledge-graph |
| `researcher.md` | Technology research and analysis | perplexity-ask, context7 |
| `debugger.md` | Systematic debugging | knowledge-graph, chrome-devtools |
| `tester.md` | Test generation and execution | knowledge-graph, context7 |
| `code-reviewer.md` | Code review and quality | knowledge-graph, context7 |
| `codebase-explorer.md` | Codebase exploration, indexing | knowledge-graph, repomix |
| `fullstack-developer.md` | Full-stack implementation | context7, knowledge-graph, shadcn |
| `git-manager.md` | Git operations | - |
| `docs-manager.md` | Documentation management | context7, repomix, knowledge-graph |
| `project-manager.md` | Project coordination | - |
| `database-admin.md` | Database operations | - |
| `ui-ux-designer.md` | UI/UX design | magic, figma, shadcn, chrome-devtools |
| `brainstormer.md` | Creative ideation | perplexity-ask, sequential-thinking |
| `copywriter.md` | Content writing | - |
| `journal-writer.md` | Development journaling | - |
| `api-designer.md` | API design | - |
| `cicd-manager.md` | CI/CD pipeline management | - |
| `pipeline-architect.md` | Pipeline architecture | - |
| `security-auditor.md` | Security auditing | perplexity-ask, sequential-thinking, knowledge-graph |
| `vulnerability-scanner.md` | Vulnerability scanning | - |
| `devops-engineer.md` | Deployment, CI/CD, Docker | - |
| `mcp-manager.md` | MCP server management | context7 |

## Patterns & Conventions

### Agent File Structure

```markdown
---
name: agent-name
description: Brief description for agent matching
tools: Glob, Grep, Read, Bash, TaskCreate, TaskUpdate, TaskList, TaskGet
mcp: server1, server2
mode: default
---

# Agent Name

## Role
[What this agent does]

## Capabilities
[List of capabilities]

## Collaboration Protocol
[How the agent interacts with users]

## Workflow
[Step-by-step process]

## Quality Standards
[Checklist of quality criteria]

## Output Format
[Expected output structure]

## Collaboration
[Other agents this one works with]

## Example Usage
[Input/output examples]
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Agent identifier (matches filename) |
| `description` | Yes | Brief description for agent matching |
| `tools` | Yes | Available tools (Glob, Grep, Read, Bash, etc.) |
| `mcp` | No | MCP servers the agent uses |
| `mode` | No | Default behavioral mode |

## Agent Categories

### Planning & Research
- `planner` - Task decomposition, implementation planning
- `researcher` - Technology research, best practices
- `brainstormer` - Creative ideation, exploration

### Development
- `fullstack-developer` - Full-stack implementation
- `debugger` - Systematic debugging
- `codebase-explorer` - Codebase exploration, indexing

### Quality & Review
- `code-reviewer` - Code review, quality analysis
- `tester` - Test generation, execution
- `security-auditor` - Security auditing
- `vulnerability-scanner` - Vulnerability scanning

### Operations
- `git-manager` - Git operations, branching
- `devops-engineer` - Deployment, CI/CD, Docker
- `cicd-manager` - CI/CD pipeline management
- `pipeline-architect` - Pipeline architecture

### Documentation & Content
- `docs-manager` - Documentation management
- `copywriter` - Content writing
- `journal-writer` - Development journaling

### Design & Architecture
- `ui-ux-designer` - UI/UX design
- `api-designer` - API design
- `database-admin` - Database operations

### Management
- `project-manager` - Project coordination
- `mcp-manager` - MCP server management

## Dependencies

- **Internal**: Agents reference skills, modes, and MCP servers
- **External**: MCP servers must be configured in `.mcp.json`

## Common Tasks

- **Add new agent**: Create `.md` file with frontmatter and sections
- **Modify agent behavior**: Edit the Workflow or Capabilities sections
- **Add MCP integration**: Add server to `mcp:` frontmatter field

## Important Notes

- Agents are invoked via Task tool with `subagent_type` parameter
- The `description` field is used for agent matching
- Agents follow the Collaboration Protocol (ask when unclear)
- Agents can delegate to other agents for specialized tasks
- GKG (Global Knowledge Graph) is preferred for codebase exploration

## MCP Integration

For detailed MCP tool-to-agent mapping, see: `.claude/mcp/MCP_AGENT_MAPPING.md`

This document provides:
- Quick reference matrix of MCP servers to agents
- Detailed analysis of each MCP server's tools
- Recommended `mcp:` frontmatter values for each agent
- Decision tree for MCP tool selection
