# /simplify - Code Simplification

## Purpose

Simplify code for clarity, consistency, and maintainability while preserving all functionality. Uses the `code-simplifier` plugin.

## Default Mode

**This command uses `--mode=implementation` by default** for code-focused, minimal prose output. Override with `--mode=default` for standard behavior.

## Usage

```
/simplify [file, directory, or 'recent']
```

## Arguments

- `$ARGUMENTS`:
  - File path: Simplify specific file
  - Directory path: Simplify all files in directory
  - `recent`: Simplify recently modified files (default if no argument)

---

Simplify code: **$ARGUMENTS**

## Workflow

### Step 1: Identify Target Code

1. **Determine Scope**
   - If file specified: Target that file
   - If directory specified: Target all code files in directory
   - If `recent` or no argument: Target recently modified files (git diff)

2. **Verify Tests Exist**
   - Check for existing tests covering the target code
   - Warn if no tests found (simplification may introduce regressions)

### Step 2: Run Code Simplifier

1. **Invoke code-simplifier Plugin**
   - Use Task tool to launch `code-simplifier` plugin
   - Agent analyzes code for simplification opportunities

2. **Simplification Focus Areas**
   - Reduce unnecessary complexity and nesting
   - Eliminate redundant code and abstractions
   - Improve readability through clear naming
   - Consolidate related logic
   - Remove unnecessary comments
   - Avoid nested ternary operators (prefer switch/if-else)
   - Choose clarity over brevity

### Step 3: Review Changes

1. **Show Before/After Comparison**
   - Display significant changes with context
   - Highlight what was simplified and why

2. **Verify Functionality Preserved**
   - Run tests to ensure no regressions
   - Confirm behavior unchanged

### Step 4: Apply Changes

1. **Stage Simplified Code**
   - Apply approved simplifications
   - Keep original functionality intact

2. **Final Verification**
   - Run tests one more time
   - Confirm all tests pass

## Output

```markdown
## Simplification Complete

### Files Simplified
- `src/auth/login.ts` - Reduced nesting, improved naming
- `src/utils/helpers.ts` - Consolidated related logic

### Changes Summary
| File | Before | After | Reduction |
|------|--------|-------|-----------|
| login.ts | 150 lines | 120 lines | 20% |
| helpers.ts | 80 lines | 65 lines | 19% |

### Key Improvements
- Replaced nested ternaries with switch statements
- Extracted repeated validation logic
- Improved variable naming for clarity

### Tests
All passing ✓
```

## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--mode=[mode]` | Use specific behavioral mode | `--mode=default` |
| `--dry-run` | Show changes without applying | `--dry-run` |
| `--aggressive` | Apply more aggressive simplifications | `--aggressive` |
| `--skip-tests` | Skip test verification | `--skip-tests` |
| `--format=[fmt]` | Output format (concise/detailed) | `--format=concise` |

## What Code-Simplifier Does

### Preserves
- All original functionality
- API contracts and interfaces
- Test coverage
- Error handling behavior

### Improves
- Code clarity and readability
- Naming conventions
- Code structure and organization
- Consistency with project standards

### Avoids
- Over-simplification that reduces clarity
- Overly clever solutions
- Combining too many concerns
- Removing helpful abstractions
- Prioritizing "fewer lines" over readability

## Examples

```bash
# Simplify recently modified files
/simplify recent

# Simplify specific file
/simplify src/auth/middleware.ts

# Simplify entire directory
/simplify src/utils/

# Preview changes without applying
/simplify src/api/ --dry-run

# Aggressive simplification
/simplify src/legacy/ --aggressive
```

## Integration

This command relies on a `code-simplifier` capability. Ensure your runtime has it installed or enabled.

**Claude Code example:**

```bash
claude plugin install code-simplifier
```

For other runtimes, use the equivalent plugin/extension installation workflow.

The same simplification logic is automatically applied in:
- `/do` - After implementation phase
- `/refactor` - As final polish step
- `/ship` - Before code review phase
