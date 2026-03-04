# Writing Plans

## Description

Generate comprehensive implementation plans with bite-sized tasks for engineers with minimal codebase familiarity. This skill bridges design completion and engineering execution with detailed, actionable steps.

## When to Use

- After brainstorming/design is complete
- Before starting implementation
- When handing off work to another developer
- For complex features requiring structured approach

---

## Plan Document Format

### Header Section

```markdown
# Plan: [Feature Name]

**Required Skill**: executing-plans

## Goal
[One sentence describing what will be built]

## Architecture Overview
[2-3 sentences describing the approach]

## Tech Stack
- [Technology 1]
- [Technology 2]
```

### Task Structure

Each numbered task contains:

```markdown
## Task [N]: [Task Name]

**Files**:
- Create: `path/to/new-file.ts`
- Modify: `path/to/existing-file.ts`
- Test: `path/to/test-file.test.ts`

**Steps**:

1. Write failing test
   ```typescript
   // Exact test code
   ```

2. Verify test fails
   ```bash
   npm test -- --grep "test name"
   # Expected: 1 failing
   ```

3. Implement minimally
   ```typescript
   // Exact implementation code
   ```

4. Verify test passes
   ```bash
   npm test -- --grep "test name"
   # Expected: 1 passing
   ```

5. Commit
   ```bash
   git add .
   git commit -m "feat: add [feature]"
   ```
```

---

## Task Granularity

### Bite-Sized Principle

Each task should be **2-5 minutes** of focused work:
- Write one test
- Implement one function
- Add one validation

### Why Small Tasks?

- Easier to verify correctness
- Natural commit points
- Reduces context switching
- Enables parallel work
- Clearer progress tracking

### Bad vs Good Task Breakdown

```
BAD: "Implement user authentication"

GOOD:
- Task 1: Create User model with email field
- Task 2: Add password hashing to User model
- Task 3: Create login endpoint
- Task 4: Add JWT token generation
- Task 5: Create auth middleware
- Task 6: Add token refresh endpoint
```

---

## Core Requirements

### Exact File Paths Always

Never use vague references:
```
BAD: "Update the user service"
GOOD: "Modify `src/services/user-service.ts`"
```

### Complete Code Samples

Include exact code, not descriptions:
```
BAD: "Add a function that validates email"

GOOD:
```typescript
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```
```

### Expected Output Specifications

Always specify expected command results:
```bash
npm test
# Expected output:
# PASS src/services/user.test.ts
#   User validation
#     ✓ validates correct email format (3ms)
#     ✓ rejects invalid email format (1ms)
# 2 passing
```

---

## Guiding Principles

### DRY (Don't Repeat Yourself)

- Identify patterns before implementation
- Plan for reusable components
- Note shared utilities needed

### YAGNI (You Aren't Gonna Need It)

- Only plan what's required now
- Remove speculative features
- Add complexity when justified

### TDD (Test-Driven Development)

Every task follows:
1. Write failing test
2. Verify it fails
3. Implement minimally
4. Verify it passes
5. Refactor if needed
6. Commit

### Frequent Commits

- Commit after each task
- Clear, descriptive messages
- Atomic changes only

---

## Execution Handoff

After plan is complete, offer two implementation pathways:

### Option 1: Subagent-Driven (Current Session)
```
Use the `executing-plans` skill for automated execution with:
- Fresh agent per task
- Code review between tasks
- Quality gates
```

### Option 2: Parallel Session (Separate Worktree)
```
Developer executes in separate environment:
- Read plan file
- Follow tasks sequentially
- Commit after each task
```

---

## Example Plan Snippet

```markdown
# Plan: Add Email Verification

**Required Skill**: executing-plans

## Goal
Add email verification to user registration flow.

## Architecture Overview
Send verification email on registration, validate token on click,
mark user as verified in database.

## Tech Stack
- Node.js, TypeScript
- PostgreSQL
- SendGrid for email

---

## Task 1: Add verified flag to User model

**Files**:
- Modify: `src/models/user.ts`
- Create: `src/migrations/add-verified-flag.ts`
- Test: `src/models/user.test.ts`

**Steps**:

1. Write failing test
   ```typescript
   describe('User model', () => {
     it('should have verified flag defaulting to false', () => {
       const user = new User({ email: 'test@example.com' });
       expect(user.verified).toBe(false);
     });
   });
   ```

2. Verify test fails
   ```bash
   npm test -- --grep "verified flag"
   # Expected: 1 failing (verified is undefined)
   ```

3. Add verified field to User model
   ```typescript
   // src/models/user.ts
   export class User {
     email: string;
     verified: boolean = false;  // Add this line
     // ...
   }
   ```

4. Verify test passes
   ```bash
   npm test -- --grep "verified flag"
   # Expected: 1 passing
   ```

5. Commit
   ```bash
   git add src/models/user.ts src/models/user.test.ts
   git commit -m "feat(user): add verified flag with false default"
   ```
```

---
