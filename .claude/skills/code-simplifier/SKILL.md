# Code Simplifier Skill

## Overview

The code-simplifier skill provides code simplification capabilities that enhance clarity, consistency, and maintainability while preserving all functionality.

## When to Use

- After completing a coding task or feature implementation
- Before shipping/committing code (`/ship` command)
- During refactoring sessions (`/refactor` command)
- When code feels "messy" or overly complex
- To clean up large or complex PRs
- After bug fixes that added conditional logic

## Plugin Requirement

This skill requires a `code-simplifier` capability in your runtime.

**Claude Code example:**

```bash
claude plugin install code-simplifier
```

For other runtimes, use the equivalent plugin/extension installation workflow.

## Invocation

### Via Command

```bash
# Simplify recently modified files
/simplify recent

# Simplify specific file
/simplify src/auth/middleware.ts

# Simplify directory
/simplify src/utils/

# Preview without applying
/simplify src/api/ --dry-run
```

### Via Task Tool

```
Use Task tool to invoke code-simplifier plugin
```

## What It Does

### Preserves (Never Changes)
- All original functionality and behavior
- API contracts and interfaces
- Test coverage and assertions
- Error handling behavior
- External dependencies

### Improves
- Code clarity and readability
- Variable and function naming
- Code structure and organization
- Consistency with project standards (CLAUDE.md)
- Reduction of unnecessary complexity

### Avoids
- Over-simplification that reduces clarity
- Overly clever solutions hard to understand
- Combining too many concerns into single functions
- Removing helpful abstractions
- Prioritizing "fewer lines" over readability
- Nested ternary operators (prefers switch/if-else)

## Simplification Patterns

### Pattern 1: Reduce Nesting

**Before:**
```typescript
function processUser(user: User) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        return doSomething(user);
      }
    }
  }
  return null;
}
```

**After:**
```typescript
function processUser(user: User) {
  if (!user || !user.isActive || !user.hasPermission) {
    return null;
  }
  return doSomething(user);
}
```

### Pattern 2: Replace Nested Ternaries

**Before:**
```typescript
const status = isLoading ? 'loading' : hasError ? 'error' : isSuccess ? 'success' : 'idle';
```

**After:**
```typescript
function getStatus(): string {
  if (isLoading) return 'loading';
  if (hasError) return 'error';
  if (isSuccess) return 'success';
  return 'idle';
}
```

### Pattern 3: Consolidate Related Logic

**Before:**
```typescript
const firstName = user.firstName.trim();
const lastName = user.lastName.trim();
const email = user.email.trim().toLowerCase();
const phone = user.phone?.trim();
```

**After:**
```typescript
const sanitizedUser = {
  firstName: user.firstName.trim(),
  lastName: user.lastName.trim(),
  email: user.email.trim().toLowerCase(),
  phone: user.phone?.trim(),
};
```

### Pattern 4: Improve Naming

**Before:**
```typescript
const d = new Date();
const x = users.filter(u => u.a);
const temp = calculate(x);
```

**After:**
```typescript
const currentDate = new Date();
const activeUsers = users.filter(user => user.isActive);
const totalScore = calculate(activeUsers);
```

## Integration Points

The code-simplifier is automatically invoked in these workflows:

| Workflow | Phase | Behavior |
|----------|-------|----------|
| `/do` | Phase 4 (Implementation) | After refactoring, before checkpoint |
| `/refactor` | Step 4 (Final Simplification) | Final polish pass |
| `/ship` | Phase 2 (Code Simplification) | Before code review |

## Best Practices

1. **Run after tests pass** - Never simplify before verifying functionality
2. **Review suggestions** - Don't blindly accept all simplifications
3. **Verify tests still pass** - Re-run tests after simplification
4. **Focus on recent changes** - Don't simplify entire codebase at once
5. **Use with code review** - Combine with `code-reviewer` agent for best results

## Configuration

The code-simplifier follows project standards defined in `CLAUDE.md`:

- ES modules with proper import sorting
- Prefer `function` keyword over arrow functions
- Explicit return type annotations
- Proper React component patterns
- Consistent naming conventions

## Related Skills

- `code-review/` - Code review patterns
- `debugging/` - Systematic debugging
- `methodology/` - TDD and development practices

## Related Commands

- `/simplify` - On-demand code simplification
- `/refactor` - Code refactoring workflow
- `/ship` - Commit and PR workflow (includes simplification)
- `/do` - Feature development (includes simplification)
