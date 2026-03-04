# /codebase - Codebase Exploration

## Purpose

Explore, map, and load codebase context. Automatically index the entire codebase, generate `PROJECT_INDEX.md` and create `CLAUDE.md` files for each major directory to help AI coding assistants understand the codebase better.

## Default Mode

**This command uses `--mode=deep-research` by default** for thorough analysis and comprehensive documentation. Override with `--mode=default` for standard behavior.

## Usage

```
/codebase [scope]
```

## Arguments

- `$ARGUMENTS`:
  - No argument or `all`: Index entire codebase, generate `PROJECT_INDEX.md` and `CLAUDE.md` files
  - Path (e.g., `src/api/`): Load specific area into context
  - Query (e.g., `"where is auth handled?"`): Search and answer questions

---

Explore codebase for: **$ARGUMENTS**

## Setup
- If saving to `agent-includes/` directory and it doesn't exist, create it first:
  ```bash
  mkdir -p agent-includes/specs agent-includes/plans
  ```

## Workflow

### Mode 1: Full Codebase Index (no argument or `all`)

When user runs `/codebase` or `/codebase all`:

1. **Scan Project Structure**
   - Scan entire directory structure
   - Exclude: `node_modules/`, `.git/`, `__pycache__/`, `dist/`, `build/`, `.next/`, `venv/`, `.claude/`

2. **Identify Key Components**
   - Entry Points: Main files, index files, app entry
   - API/Routes: Endpoint definitions
   - Models/Types: Data structures, schemas
   - Services: Business logic
   - Utilities: Helper functions
   - Tests: Test files
   - Configuration: Config files, env templates

3. **Map Dependencies**
   - Package managers (package.json, requirements.txt, pyproject.toml)
   - Internal import relationships
   - External service integrations

4. **Generate Index**
   - Create `PROJECT_INDEX.md` with structure
   - Include Quick Navigation, Directory Structure, Key Files, Dependencies

5. **Generate CLAUDE.md Files** ⭐ NEW
   - Create `CLAUDE.md` in each major directory (src/, lib/, app/, api/, components/, services/, utils/, models/, etc.)
   - Each `CLAUDE.md` contains:
     - Directory purpose and responsibility
     - Key files and their roles
     - Important patterns and conventions used
     - Dependencies (internal and external)
     - Common tasks and how to perform them
     - Things to watch out for

### Mode 2: Load Specific Area (path argument)

When user runs `/codebase src/api/` or `/codebase auth`:

1. **Identify Target**
   - Parse path or category name
   - Locate relevant files

2. **Load Files**
   - Read identified files
   - Summarize file purposes
   - Note key exports/functions
   - Map dependencies

3. **Generate/Update CLAUDE.md** ⭐ NEW
   - Create or update `CLAUDE.md` in the target directory
   - Include detailed analysis of the loaded area

4. **Provide Context**
   - File summaries
   - Relationships between files
   - Current state

### Mode 3: Search Query (question argument)

When user runs `/codebase "where is auth handled?"`:

1. **Parse Query**
   - Understand what information is needed
   - Identify search strategy

2. **Search Execution**
   - Use Glob for file patterns
   - Use Grep for content search
   - Combine strategies

3. **Report Findings**
   - File paths with descriptions
   - Relevant code snippets
   - Patterns observed

## CLAUDE.md Generation Rules ⭐ NEW

### When to Create CLAUDE.md

Create `CLAUDE.md` in directories that:
- Contain 3+ code files
- Represent a logical component (api, services, models, utils, components, etc.)
- Have a distinct responsibility in the codebase

### CLAUDE.md Template

```markdown
# [Directory Name]

## Purpose
[One-line description of what this directory is responsible for]

## Overview
[2-3 sentences explaining the role of this directory in the project]

## Key Files
| File | Purpose |
|------|---------|
| `file1.ts` | Description |
| `file2.ts` | Description |

## Patterns & Conventions
- [Pattern 1 used in this directory]
- [Pattern 2 used in this directory]

## Dependencies
- **Internal**: [Other project modules this depends on]
- **External**: [npm packages, libraries]

## Common Tasks
- **Add new [item]**: [How to do it]
- **Modify [item]**: [How to do it]

## Important Notes
- [Gotcha or important consideration]
- [Another important note]
```

### Directories to Generate CLAUDE.md

| Directory Pattern | Should Generate |
|-------------------|-----------------|
| `src/` | ✅ Yes (root source) |
| `src/api/` or `api/` | ✅ Yes |
| `src/services/` or `services/` | ✅ Yes |
| `src/models/` or `models/` | ✅ Yes |
| `src/utils/` or `utils/` or `lib/` | ✅ Yes |
| `src/components/` or `components/` | ✅ Yes |
| `src/hooks/` or `hooks/` | ✅ Yes |
| `src/pages/` or `pages/` or `app/` | ✅ Yes |
| `src/middleware/` or `middleware/` | ✅ Yes |
| `src/config/` or `config/` | ✅ Yes |
| `src/types/` or `types/` | ✅ Yes |
| `tests/` or `__tests__/` | ✅ Yes |
| `scripts/` | ✅ Yes |
| `node_modules/` | ❌ No |
| `dist/`, `build/`, `.next/` | ❌ No |
| `.git/`, `.claude/` | ❌ No |

## Categories (for Mode 2)

| Category | What It Loads |
|----------|---------------|
| `api` | API routes and endpoints |
| `models` | Data models and types |
| `services` | Business logic services |
| `utils` | Utility functions |
| `tests` | Test files |
| `config` | Configuration files |
| `auth` | Authentication related |
| `db` | Database related |

## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--depth=[N]` | Limit directory depth | `--depth=3` |
| `--include=[pattern]` | Include additional patterns | `--include="*.md"` |
| `--exclude=[pattern]` | Exclude patterns | `--exclude="*.test.ts"` |
| `--output=[path]` | Custom output path for index | `--output=agent-includes/specs/INDEX.md` |
| `--shallow` | Load only file summaries | `--shallow` |
| `--deep` | Load full file contents | `--deep` |
| `--related` | Include related files | `--related` |
| `--no-claude-md` | Skip CLAUDE.md generation | `--no-claude-md` |
| `--claude-md-only` | Only generate CLAUDE.md files | `--claude-md-only` |
| `--update-claude-md` | Update existing CLAUDE.md files | `--update-claude-md` |

## Usage Examples

```bash
# Index entire codebase (creates PROJECT_INDEX.md + CLAUDE.md files)
/codebase
/codebase all

# Load specific area (creates/updates CLAUDE.md for that area)
/codebase src/api/
/codebase auth
/codebase models --related

# Search queries
/codebase "where is user authentication?"
/codebase "what uses the UserService?"
/codebase "how does payment work?"

# With flags
/codebase --depth=2
/codebase src/services/ --deep
/codebase auth --related --shallow

# CLAUDE.md specific
/codebase --claude-md-only          # Only generate CLAUDE.md files
/codebase --no-claude-md            # Skip CLAUDE.md generation
/codebase src/api/ --update-claude-md  # Update existing CLAUDE.md
```

## Output Format

### For Full Index

Creates `PROJECT_INDEX.md`:

```markdown
# Project Index

## Quick Navigation
- Entry: `src/index.ts`
- API: `src/api/`
- Models: `src/models/`

## Directory Structure
[Tree structure]

## Key Files
[Important files with descriptions]

## Dependencies
[Package dependencies]

## Generated CLAUDE.md Files
- `src/CLAUDE.md`
- `src/api/CLAUDE.md`
- `src/services/CLAUDE.md`
- `src/models/CLAUDE.md`
...
```

### For Specific Area

```markdown
## Loaded: src/api/

### Files (5)
1. `auth.ts` - Authentication endpoints
2. `users.ts` - User CRUD operations
...

### Key Exports
- `authRouter` from auth.ts
- `userRouter` from users.ts

### Dependencies
- Internal: UserService, AuthService
- External: express, jsonwebtoken

### Generated
- Created/Updated: `src/api/CLAUDE.md`
```

### For Search Query

```markdown
## Query: "where is auth handled?"

### Primary Findings
1. `src/api/auth.ts` - Main auth endpoints
2. `src/services/AuthService.ts` - Auth business logic
3. `src/middleware/auth.ts` - Auth middleware

### Related Files
- `src/models/User.ts` - User model
- `src/utils/jwt.ts` - JWT utilities
```

## Example Generated CLAUDE.md

For `src/api/`:

```markdown
# API Directory

## Purpose
RESTful API endpoints for the application.

## Overview
This directory contains all HTTP route handlers organized by resource. Each file exports an Express router that handles CRUD operations for its respective resource. Authentication middleware is applied at the router level.

## Key Files
| File | Purpose |
|------|---------|
| `index.ts` | Main router that combines all sub-routers |
| `auth.ts` | Login, logout, register, password reset endpoints |
| `users.ts` | User CRUD operations |
| `products.ts` | Product management endpoints |

## Patterns & Conventions
- Each file exports a single Express Router
- Route handlers are async/await with try-catch
- Validation using Zod schemas before processing
- Consistent error response format: `{ error: string, code: string }`

## Dependencies
- **Internal**: `services/*`, `middleware/auth`, `models/*`
- **External**: express, zod, jsonwebtoken

## Common Tasks
- **Add new endpoint**: Create handler in appropriate file, add route to router
- **Add new resource**: Create new file, export router, import in index.ts

## Important Notes
- All routes except `/auth/login` and `/auth/register` require authentication
- Rate limiting is applied globally in `middleware/rateLimit.ts`
- File upload endpoints use multer middleware
```
