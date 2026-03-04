# Dispatching Parallel Agents

## Description

Pattern for handling multiple independent failures by dispatching concurrent agents. Use when 3+ independent problems exist across different domains that can be solved in parallel.

**IMPORTANT: This is an optimization pattern, not a default approach. Sequential execution with close coordination is preferred in most cases.**

## When to Use

- Multiple subsystems broken independently (3+ distinct domains)
- No shared state between failures
- Each fix is self-contained
- Parallel work won't create conflicts
- Clear time/efficiency benefit over sequential
- Integration strategy is defined upfront

## When NOT to Use (Prefer Sequential)

- Fewer than 3 independent problem domains
- Related failures (fixing one may solve or affect others)
- Exploratory debugging (need full context)
- Problems require shared understanding
- Sequential dependencies exist
- Changes touch shared code or utilities
- Coordination between changes is critical
- Investigation requires iterative discovery

---

## Core Principle

**"Coordination first. Parallel only when clearly beneficial."**

Sequential execution is the default because it provides:
- Better context sharing between tasks
- Easier conflict detection and resolution
- Simpler integration of results
- Clearer accountability and debugging

### When Parallel Makes Sense

- Faster resolution (3 problems in time of 1)
- Focused context per agent
- No context pollution between fixes
- Easy to integrate results
- **All independence criteria verified**

### Why Not Always Parallel?

- Related problems need shared context
- Exploration requires system-wide view
- Conflicting changes cause merge issues
- Some fixes depend on others
- Coordination overhead may exceed time savings

---

## Identification Pattern

### Step 1: Group Failures by Domain

```markdown
Test failures:
- src/auth/login.test.ts (3 failures) → Auth domain
- src/cart/checkout.test.ts (2 failures) → Cart domain
- src/user/profile.test.ts (1 failure) → User domain

Each is independent - fixing one doesn't affect others.
```

### Step 2: Verify Independence

```markdown
Ask for each group:
- Does it share state with other groups? NO
- Does fixing it require changes to other groups? NO
- Could fixes conflict with each other? NO

If all NO → Parallel is safe
If any YES → Sequential or combined approach
```

---

## Task Creation Pattern

Each agent receives:

### 1. Specific Scope

```markdown
BAD: "Fix all the tests"
GOOD: "Fix auth/login.test.ts - 3 failing tests"
```

### 2. Clear Goal

```markdown
BAD: "Make it work"
GOOD: "Make all tests in auth/login.test.ts pass"
```

### 3. Constraints

```markdown
- Only modify files in src/auth/
- Don't change the test expectations
- Don't modify shared utilities
```

### 4. Expected Output

```markdown
Return:
- Files modified
- Tests now passing
- Summary of changes
- Any concerns
```

---

## Execution Pattern

### Dispatch Agents Concurrently

```markdown
Agent 1: Fix auth/login.test.ts
Agent 2: Fix cart/checkout.test.ts
Agent 3: Fix user/profile.test.ts

All three run simultaneously.
```

### Monitor Progress

```markdown
While agents working:
- Check for early failures
- Watch for scope violations
- Ready to pause if conflicts detected
```

---

## Integration Pattern

### Step 1: Collect Results

```markdown
Agent 1 returned:
- Modified: src/auth/login-service.ts
- Tests: 3/3 passing
- Summary: Fixed token validation edge case

Agent 2 returned:
- Modified: src/cart/checkout-service.ts
- Tests: 2/2 passing
- Summary: Fixed price calculation rounding

Agent 3 returned:
- Modified: src/user/profile-service.ts
- Tests: 1/1 passing
- Summary: Fixed null handling in profile update
```

### Step 2: Verify No Conflicts

```markdown
Check:
- No overlapping file modifications
- No conflicting changes to shared types
- No incompatible API changes
```

### Step 3: Run Full Test Suite

```bash
npm test
# All tests should pass including:
# - The 6 originally failing tests
# - All other tests (no regressions)
```

### Step 4: Integrate Changes

```bash
# If all agents used branches
git merge agent-1-auth-fixes
git merge agent-2-cart-fixes
git merge agent-3-user-fixes
```

---

## Example Prompts

### Agent Task Prompt Template

```markdown
## Task: Fix [specific test file]

**Scope**: Only modify files in [directory]

**Failing tests**:
1. [test name 1]
2. [test name 2]

**Constraints**:
- Do not modify test expectations
- Do not change shared utilities in src/utils/
- Do not modify types in src/types/

**Goal**: Make all tests in [file] pass

**Return**:
- List of files modified
- Summary of changes made
- Number of tests now passing
- Any concerns about the changes
```

### Result Collection Prompt

```markdown
## Parallel Agent Results

**Agent 1 (Auth)**:
[Paste agent 1 results]

**Agent 2 (Cart)**:
[Paste agent 2 results]

**Agent 3 (User)**:
[Paste agent 3 results]

## Integration Checklist
- [ ] No file conflicts
- [ ] Full test suite passes
- [ ] Changes are isolated to domains
- [ ] Ready to merge
```

---

## Conflict Resolution

If conflicts detected:

```markdown
1. STOP parallel execution
2. Identify conflicting changes
3. Decide which takes priority
4. Continue sequentially from conflict point
5. Learn: Update domain boundaries
```

---

## Checklist

Before parallel dispatch:
- [ ] 3+ independent failures identified
- [ ] Failures grouped by domain
- [ ] Independence verified (no shared state)
- [ ] Scope boundaries clear
- [ ] Conflict potential assessed

After parallel completion:
- [ ] All agent results collected
- [ ] No file conflicts detected
- [ ] Full test suite passes
- [ ] Changes integrated successfully

---
