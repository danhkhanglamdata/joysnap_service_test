# /ship - Commit and Create Pull Request

## Purpose

Complete workflow to commit changes, run reviews, execute tests, and create merge-ready pull requests.

## Default Mode

**This command uses `--mode=implementation` by default** for code-focused, minimal prose output. Override with `--mode=default` for standard behavior.

## Usage

```
/ship [commit message or 'quick']
```

## Arguments

- `$ARGUMENTS`:
  - Commit message: Use as commit subject
  - `quick`: Auto-generate message, skip review

---

Ship the current changes with: **$ARGUMENTS**

## Workflow

### Phase 1: Pre-Ship Checks

1. **Check Repository Status**
   ```bash
   git status
   git diff --staged
   ```

2. **Identify Changes**
   - Files modified
   - Files added
   - Files deleted

3. **Quick Validation**
   - No secrets in changes
   - No debug statements
   - No commented-out code

### Phase 2: Code Simplification (unless 'quick' or '--skip-simplify')

1. **Run Code Simplifier**
   - Invoke `code-simplifier` plugin on staged changes
   - Simplify code for clarity, consistency, and maintainability
   - Preserve all functionality while improving readability

2. **Review Simplifications**
   - Show before/after comparison for significant changes
   - Apply approved simplifications
   - Re-run tests if changes were made

### Phase 3: Code Review (unless 'quick')

1. **Run Self-Review**
   - Check code quality
   - Verify style compliance
   - Identify security issues

2. **Address Critical Issues**
   - Fix any critical problems
   - Note recommendations

### Phase 4: Run Tests in E2B Sandbox (Default)

1. **Execute Test Suite via E2B SDK**
   - Detect codebase language and use appropriate SDK:
     - Python codebase → `e2b_code_interpreter` Python SDK
     - TypeScript/JS codebase → `@e2b/code-interpreter` TypeScript SDK
   - Mixed codebase → Run both SDKs in parallel

2. **Verify All Pass**
   - No failing tests
   - No new warnings
   - Collect results from sandbox execution

### Phase 5: Create Commit

1. **Stage Changes**
   ```bash
   git add -A
   ```

2. **Generate Commit Message**
   - Follow conventional commit format
   - Reference issues if applicable

### Phase 6: Push and Create PR

1. **Push to Remote**
   ```bash
   git push -u origin [branch-name]
   ```

2. **Create Pull Request**
   ```bash
   gh pr create --title "type(scope): description"
   ```

## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--mode=[mode]` | Use specific behavioral mode | `--mode=review` |
| `--skip-simplify` | Skip code simplification phase | `--skip-simplify` |
| `--skip-review` | Skip code review phase | `--skip-review` |
| `--skip-tests` | Skip test execution | `--skip-tests` |
| `--test-local` | Run tests locally instead of E2B sandbox | `--test-local` |
| `--no-pr` | Commit only, don't create PR | `--no-pr` |
| `--draft` | Create draft PR | `--draft` |
| `--format=[fmt]` | Output format (concise/detailed) | `--format=concise` |
| `--deploy=[platform]` | Deploy after PR (netlify, vercel) | `--deploy=netlify` |
| `--netlify` | Deploy to Netlify after commit | `--netlify` |

## Netlify Deployment

When `--netlify` or `--deploy=netlify` flag is used:

### Prerequisites
- Netlify CLI installed (`npm install -g netlify-cli`)
- Site linked (`netlify link`) or initialized (`netlify init`)
- `netlify.toml` configured (optional but recommended)

### Deployment Workflow

After successful commit/PR:

1. **Check Netlify Configuration**
   ```bash
   netlify status
   ```

2. **Deploy to Netlify**
   ```bash
   # Production deploy
   netlify deploy --prod

   # Or preview deploy (for PRs)
   netlify deploy
   ```

3. **Verify Deployment**
   - Check deploy URL
   - Verify site is live

### Example Usage

```bash
# Ship and deploy to Netlify production
/ship "feat: add new feature" --netlify

# Ship with preview deploy (for PRs)
/ship "feat: add new feature" --deploy=netlify --draft

# Quick ship with Netlify deploy
/ship quick --netlify
```

### Netlify Configuration (netlify.toml)

Ensure your project has a `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

See `.claude/skills/netlify/` for complete Netlify configuration reference.
