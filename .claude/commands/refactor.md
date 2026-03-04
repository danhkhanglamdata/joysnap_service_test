# /refactor - Code Refactoring

## Purpose

Improve code structure, readability, or performance without changing behavior.

## Default Mode

**This command uses `--mode=orchestration` by default** for coordinated multi-step execution. Orchestration mode emphasizes sequential coordination with parallel execution only when tasks are truly independent. Override with `--mode=default` for simpler tasks.

## Usage

```
/refactor [file or function] [goal: clean | extract | simplify | optimize]
```

## Arguments

- `$ARGUMENTS`:
  - File or function path: Target code to refactor
  - Goal (optional):
    - `clean`: Remove dead code, improve formatting
    - `extract`: Pull out reusable functions/modules
    - `simplify`: Reduce complexity, flatten nesting
    - `optimize`: Improve performance without changing behavior

---

Refactor: **$ARGUMENTS**

## Workflow

### Step 1: Understand Current Code

1. Read the code thoroughly
2. Identify what it does
3. Note existing tests

### Step 2: Plan Refactoring

1. Identify improvement opportunities
2. Ensure tests exist
3. Plan incremental changes

### Step 3: Execute

1. Make small, focused changes
2. Run tests via E2B SDK after each change:
   - Python codebase → `e2b_code_interpreter` Python SDK
   - TypeScript/JS codebase → `@e2b/code-interpreter` TypeScript SDK
3. Commit incrementally

### Step 4: Final Simplification

1. **Run Code Simplifier**
   - Invoke `code-simplifier` plugin on refactored code
   - Apply final polish to refactored code
   - Ensure clarity and maintainability
   - Verify tests still pass

## Refactoring Types

- **Extract**: Pull out reusable functions
- **Simplify**: Reduce complexity
- **Rename**: Improve clarity
- **Clean**: Remove dead code

## Structured Output Contract
### Parsed Goal
- Restate `$ARGUMENTS` as refactor target, constraints, and success criteria.
### Plan
- Provide incremental refactor steps and validation checkpoints.
### Actions Taken
- List structural changes, renames/extractions, and files modified.
### Verification
- Report behavior parity checks and test execution results.
### Next Step
- State the immediate follow-up (`/qa`, further cleanup, or approval).

## Output

```markdown
## Refactoring Complete

### Changes Made
- Extracted `validateInput()` function
- Simplified conditional logic
- Renamed `x` to `userCount`

### Before/After
[Code comparison]

### Tests
All passing
```


## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--mode=[mode]` | Use specific behavioral mode (default: orchestration) | `--mode=default` |
| `--depth=[1-5]` | Refactoring thoroughness | `--depth=3` |
| `--format=[fmt]` | Output format (concise/detailed) | `--format=concise` |
| `--checkpoint` | Create checkpoint before refactoring | `--checkpoint` |
| `--test-local` | Run tests locally instead of E2B sandbox | `--test-local` |
| `--review` | Prompt for code review after completion | `--review` |

---

## Post-Completion Review (if --review flag)

When `--review` flag is present, after refactoring completion show:

```
✓ /refactor completed
  Changed: [list of changed files]

Quality options:
  1) Full codebase QA
  2) Changed files only
  3) Skip QA
```

Based on user selection:
- **Option 1**: Execute `/qa`
- **Option 2**: Execute `/qa [changed files]`
- **Option 3**: Skip and complete
