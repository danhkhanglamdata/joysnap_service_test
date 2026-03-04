# MCP Tool to Agent Mapping

> **Purpose**: Comprehensive mapping of MCP servers/tools to suitable agents based on their capabilities and workflows.

## Quick Reference Matrix

| MCP Server | Primary Agents | Secondary Agents |
|------------|----------------|------------------|
| **knowledge-graph** | codebase-explorer, debugger, code-reviewer | planner, fullstack-developer, security-auditor, tester, docs-manager |
| **sequential-thinking** | planner, debugger, security-auditor | brainstormer, researcher |
| **context7** | researcher, docs-manager, mcp-manager | tester, fullstack-developer, code-reviewer |
| **perplexity-ask** | researcher, brainstormer, security-auditor | planner |
| **figma** | ui-ux-designer | fullstack-developer |
| **magic** | ui-ux-designer | fullstack-developer |
| **shadcn** | ui-ux-designer, fullstack-developer | - |
| **chrome-devtools** | debugger, ui-ux-designer, tester | - |
| **firecrawl-mcp** | researcher | docs-manager |
| **repomix** | codebase-explorer, docs-manager | planner |
| **morph-mcp** | fullstack-developer, debugger | code-reviewer |
| **toonify** | ui-ux-designer | - |

---

## Detailed MCP Server Analysis

### 1. knowledge-graph (Codebase Analysis)

**Tools Available**:
- `search_codebase_definitions` - Find functions, classes, methods
- `get_references` - Find all usages of a symbol
- `read_definitions` - Read complete implementations
- `repo_map` - Get project structure overview
- `import_usage` - Analyze import patterns
- `get_definition` - Go to definition
- `list_projects` - List indexed projects
- `index_project` - Build knowledge graph

**Best Suited Agents**:

| Agent | Use Case | Priority |
|-------|----------|----------|
| **codebase-explorer** | Primary tool for semantic code navigation | ⭐⭐⭐ |
| **debugger** | Trace call chains, find function callers | ⭐⭐⭐ |
| **code-reviewer** | Impact analysis, find similar patterns | ⭐⭐⭐ |
| **planner** | Understand codebase before planning | ⭐⭐ |
| **fullstack-developer** | Navigate code during implementation | ⭐⭐ |
| **security-auditor** | Trace data flow, find auth implementations | ⭐⭐ |
| **tester** | Find related code to test | ⭐⭐ |
| **docs-manager** | Understand code for documentation | ⭐⭐ |

---

### 2. sequential-thinking (Multi-step Reasoning)

**Tools Available**:
- `sequentialthinking` - Dynamic problem-solving through thought sequences

**Best Suited Agents**:

| Agent | Use Case | Priority |
|-------|----------|----------|
| **planner** | Complex task decomposition | ⭐⭐⭐ |
| **debugger** | Systematic root cause analysis | ⭐⭐⭐ |
| **security-auditor** | Methodical vulnerability analysis | ⭐⭐⭐ |
| **brainstormer** | Structured creative exploration | ⭐⭐ |
| **researcher** | Multi-step research synthesis | ⭐⭐ |

---

### 3. context7 (Library Documentation)

**Tools Available**:
- `resolve-library-id` - Find library IDs for documentation lookup
- `get-library-docs` - Fetch documentation for a specific library

**Best Suited Agents**:

| Agent | Use Case | Priority |
|-------|----------|----------|
| **researcher** | Research library best practices | ⭐⭐⭐ |
| **docs-manager** | Reference official docs for documentation | ⭐⭐⭐ |
| **mcp-manager** | Look up MCP-related library docs | ⭐⭐⭐ |
| **tester** | Find testing patterns from library docs | ⭐⭐ |
| **fullstack-developer** | Look up API usage during implementation | ⭐⭐ |
| **code-reviewer** | Verify code follows library best practices | ⭐⭐ |

---

### 4. perplexity-ask (AI Web Search)

**Tools Available**:
- `perplexity_ask` - AI-powered web search with citations

**Best Suited Agents**:

| Agent | Use Case | Priority |
|-------|----------|----------|
| **researcher** | Real-time web research, technology comparisons | ⭐⭐⭐ |
| **brainstormer** | Explore ideas, find inspiration | ⭐⭐⭐ |
| **security-auditor** | Research latest vulnerabilities, CVEs | ⭐⭐⭐ |
| **planner** | Research before planning complex features | ⭐⭐ |

---

### 5. figma (Design-to-Code)

**Tools Available**:
- `get_design_context` - Generate UI code from Figma nodes
- `get_screenshot` - Screenshot Figma designs
- `get_metadata` - Get node structure in XML
- `get_variable_defs` - Get design variables
- `get_code_connect_map` - Map Figma to code components
- `add_code_connect_map` - Create Figma-code mappings
- `generate_diagram` - Create diagrams in FigJam

**Best Suited Agents**:

| Agent | Use Case | Priority |
|-------|----------|----------|
| **ui-ux-designer** | Convert Figma designs to React components | ⭐⭐⭐ |
| **fullstack-developer** | Implement UI from design specs | ⭐⭐ |

---

### 6. magic (UI Component Generation)

**Tools Available**:
- `21st_magic_component_builder` - Generate UI components
- `21st_magic_component_inspiration` - Get component inspiration
- `21st_magic_component_refiner` - Improve existing components
- `logo_search` - Search for company logos

**Best Suited Agents**:

| Agent | Use Case | Priority |
|-------|----------|----------|
| **ui-ux-designer** | Generate and refine UI components | ⭐⭐⭐ |
| **fullstack-developer** | Quick UI component generation | ⭐⭐ |

---

### 7. shadcn (UI Component Registry)

**Tools Available**:
- `get_project_registries` - Get configured registries
- `list_items_in_registries` - List available components
- `search_items_in_registries` - Search for components
- `view_items_in_registries` - View component details
- `get_item_examples_from_registries` - Get usage examples
- `get_add_command_for_items` - Get CLI add commands
- `get_audit_checklist` - Verify component setup

**Best Suited Agents**:

| Agent | Use Case | Priority |
|-------|----------|----------|
| **ui-ux-designer** | Find and use shadcn components | ⭐⭐⭐ |
| **fullstack-developer** | Add UI components to project | ⭐⭐⭐ |

---

### 8. chrome-devtools (Browser Debugging)

**Tools Available**:
- `take_snapshot` - Accessibility tree snapshot
- `take_screenshot` - Page screenshots
- `click`, `fill`, `hover` - Page interactions
- `navigate_page` - Browser navigation
- `list_console_messages` - Console logs
- `list_network_requests` - Network monitoring
- `evaluate_script` - Execute JavaScript
- `performance_start_trace` / `performance_stop_trace` - Performance profiling

**Best Suited Agents**:

| Agent | Use Case | Priority |
|-------|----------|----------|
| **debugger** | Debug frontend issues, inspect DOM | ⭐⭐⭐ |
| **ui-ux-designer** | Verify UI implementation, visual testing | ⭐⭐⭐ |
| **tester** | E2E testing, visual regression | ⭐⭐ |

---

### 9. firecrawl-mcp (Web Scraping)

**Tools Available**:
- `firecrawl_scrape` - Scrape single URL
- `firecrawl_crawl` - Crawl multiple pages
- `firecrawl_map` - Discover site URLs
- `firecrawl_search` - Search and scrape
- `firecrawl_extract` - Extract structured data
- `firecrawl_agent` - Autonomous data gathering

**Best Suited Agents**:

| Agent | Use Case | Priority |
|-------|----------|----------|
| **researcher** | Gather information from websites | ⭐⭐⭐ |
| **docs-manager** | Scrape documentation for reference | ⭐⭐ |

---

### 10. repomix (Repository Packaging)

**Tools Available**:
- `pack_codebase` - Package local codebase
- `pack_remote_repository` - Package GitHub repos
- `generate_skill` - Create Claude Agent Skills
- `attach_packed_output` - Attach existing packed files
- `read_repomix_output` - Read packed content
- `grep_repomix_output` - Search packed content

**Best Suited Agents**:

| Agent | Use Case | Priority |
|-------|----------|----------|
| **codebase-explorer** | Package and analyze codebases | ⭐⭐⭐ |
| **docs-manager** | Generate documentation from code | ⭐⭐⭐ |
| **planner** | Understand external repos before planning | ⭐⭐ |

---

### 11. morph-mcp (Fast File Editing)

**Tools Available**:
- `edit_file` - Fast file editing with partial snippets
- `warpgrep_codebase_search` - Semantic codebase search

**Best Suited Agents**:

| Agent | Use Case | Priority |
|-------|----------|----------|
| **fullstack-developer** | Fast code editing during implementation | ⭐⭐⭐ |
| **debugger** | Quick fixes, semantic search for issues | ⭐⭐⭐ |
| **code-reviewer** | Search for patterns during review | ⭐⭐ |

---

### 12. toonify (Image Processing)

**Tools Available**:
- `optimize_content` - Optimize structured data
- `get_stats` - Token optimization statistics
- `clear_cache` / `get_cache_stats` / `cleanup_expired_cache` - Cache management

**Best Suited Agents**:

| Agent | Use Case | Priority |
|-------|----------|----------|
| **ui-ux-designer** | Image processing for UI assets | ⭐⭐ |

---

## Recommended Agent MCP Configurations

Based on the analysis, here are the recommended `mcp:` frontmatter values for each agent:

```yaml
# Planning & Research
planner:           mcp: sequential-thinking, knowledge-graph
researcher:        mcp: perplexity-ask, context7, firecrawl-mcp
brainstormer:      mcp: perplexity-ask, sequential-thinking

# Development
fullstack-developer: mcp: knowledge-graph, context7, shadcn, morph-mcp
codebase-explorer:   mcp: knowledge-graph, repomix
debugger:            mcp: knowledge-graph, sequential-thinking, chrome-devtools, morph-mcp

# Quality & Review
code-reviewer:     mcp: knowledge-graph, context7
tester:            mcp: knowledge-graph, context7, chrome-devtools
security-auditor:  mcp: knowledge-graph, perplexity-ask, sequential-thinking

# Design
ui-ux-designer:    mcp: figma, magic, shadcn, chrome-devtools

# Documentation & Management
docs-manager:      mcp: context7, repomix, knowledge-graph, firecrawl-mcp
mcp-manager:       mcp: context7

# Operations (no MCP needed)
git-manager:       mcp: -
project-manager:   mcp: -
devops-engineer:   mcp: -
cicd-manager:      mcp: -
pipeline-architect: mcp: -
database-admin:    mcp: -
copywriter:        mcp: -
journal-writer:    mcp: -
api-designer:      mcp: -
vulnerability-scanner: mcp: -
```

---

## MCP Tool Selection Decision Tree

```
Need to understand code structure?
├── Yes → knowledge-graph (search_codebase_definitions, repo_map)
└── No ↓

Need library documentation?
├── Yes → context7 (resolve-library-id, get-library-docs)
└── No ↓

Need web research?
├── Yes → perplexity-ask or firecrawl-mcp
└── No ↓

Need complex reasoning?
├── Yes → sequential-thinking
└── No ↓

Need UI components?
├── From Figma design → figma
├── Generate new → magic
├── Use shadcn → shadcn
└── No ↓

Need browser debugging?
├── Yes → chrome-devtools
└── No ↓

Need fast file editing?
├── Yes → morph-mcp
└── No ↓

Need to package codebase?
├── Yes → repomix
└── Use standard tools
```

---

## Version

- **Document Version**: 1.0.0
- **Last Updated**: 2026-01-09
- **Based on**: `.mcp.json` configuration
