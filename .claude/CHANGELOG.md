# Changelog

All notable changes to SoupSpec will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.1] - 2026-01-08

### Added
- **`MULTI_AGENT_PLAN.md`** - Shared state document for multi-agent coordination
  - Agent Registry for tracking active/idle/blocked agents
  - Phased Task Queue (Planning → Research → Implementation → Testing → Review)
  - Handoff Log for agent-to-agent communication
  - Shared Context section for key decisions and file modifications
  - Blockers & Issues tracking
  - Agent Outputs sections for each agent's findings
- **Multi-Agent Coordination section in CLAUDE.md** - Instructions for auto-creating `MULTI_AGENT_PLAN.md`
  - Auto-creation rule for multi-agent tasks
  - Template for creating the file if it doesn't exist
  - Usage protocol for agents
- **`/test` command** - Test generation and E2B sandbox execution with SDK-based approach

### Changed
- **`orchestration-protocol.md`** - Enhanced with shared state document integration
  - Added mandatory `MULTI_AGENT_PLAN.md` usage instructions
  - Added Before Starting / During Execution / On Handoff protocols
  - Added Handoff Protocol template
  - Added Status Legend for agent states
- Updated `PROJECT_INDEX.md` to include `MULTI_AGENT_PLAN.md` reference
- **E2B SDK integration** - All test commands now default to E2B cloud sandbox execution
  - Python codebase → `e2b_code_interpreter` Python SDK
  - TypeScript/JS codebase → `@e2b/code-interpreter` TypeScript SDK
  - Mixed codebase → Both SDKs in parallel
- **`--test-local` flag** - Added to `/do`, `/fix`, `/ship`, `/qa`, `/refactor`, `/test` for local test execution
- **Netlify skill** - Complete deployment skill with CLI reference, build configuration, Edge Functions, domains/HTTPS, and framework guides
- **`/deploy` command** - Multi-platform deployment support (Netlify, Vercel, Docker, VPS)
- **Netlify GitHub Actions workflow** in cicd-manager agent
- **Netlify deployment phase** in primary-workflow
- **`--netlify` flag** for `/ship` command
- **E2B Sandbox skill** - Secure cloud sandbox execution for AI-generated code
- **LICENSE file** - Added copyright and licensing information
- **GitHub issue templates** - Standardized issue reporting
- **GitHub sponsors button** - Community support option

### Changed
- Updated command count from 19 to 20 (added `/test`)
- Updated MCP server count from 12 to 11 (removed limited e2b-server MCP)
- Updated skill count from 40 to 41 categories
- Updated devops-engineer agent with Netlify skill references
- Enhanced primary-workflow with deployment platform quick reference table
- Updated tester agent with E2B SDK execution capabilities

### Improved
- **secrets-aware hook** - Added write blocking capability and comprehensive test suite
- **Hook documentation** - Updated BLOCKED_WRITE message and documented known limitations

## [1.2.0] - 2025-12-17

### Added
- CLAUDE.md context files for all directories (agents, commands, skills, modes, workflows, hooks, mcp)
- Hook documentation in main CLAUDE.md

### Changed
- Merged `/review`, `/testcases`, `/scan-security` into unified `/qa` command
- Fixed command count documentation

### Fixed
- Hook security and error handling improvements
- Resolved blind/secrets-aware conflict for .env files

## [1.1.0] - 2025-12-15

### Changed
- Translated Vietnamese to English across commands and modes
- Restructured command system with Vietnamese naming conventions

### Fixed
- Blind hook improvements ("now still blind but it can feel")

## [1.0.0] - 2025-12-10

### Added
- Initial release of SoupSpec framework
- 22 specialized agents for task delegation
- 19 slash commands for development workflows
- 40+ skills organized by category
- 7 behavioral modes
- MCP server integrations (12 servers)
- Hooks system (blind.cjs, secrets-aware.cjs)
- Workflow definitions (primary, development-rules, orchestration, documentation)
