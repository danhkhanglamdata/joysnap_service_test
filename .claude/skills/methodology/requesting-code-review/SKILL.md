# Requesting Code Review

## Description

Workflow for initiating code reviews with clear scope, context, and expectations. Ensures reviewers have everything needed for effective feedback.

## When to Use

- After completing a task (before proceeding to next)
- After implementing a feature
- Before merging to main branch
- When unsure about implementation approach
- After fixing critical bugs

---

## Review Request Components

### 1. Scope Definition

Clearly state what should be reviewed:

```markdown
## Review Scope

**Files changed**:
- src/services/user-service.ts (modified)
- src/services/user-service.test.ts (added)
- src/types/user.ts (modified)

**Lines changed**: ~150 additions, ~20 deletions

**Not in scope** (don't review):
- package.json changes (unrelated dependency update)
- Generated files in dist/
```

### 2. Context

Explain why these changes were made:

```markdown
## Context

**Task**: Implement user email verification

**Requirements**:
- Users must verify email before accessing features
- Verification link expires after 24 hours
- Users can request new verification email

**Design decisions**:
- Used JWT for verification token (stateless)
- Stored verification status in existing User table
```

### 3. Areas of Concern

Highlight where you want focused attention:

```markdown
## Areas of Concern

1. **Security**: Is the token generation secure enough?
2. **Error handling**: Are all edge cases covered?
3. **Performance**: Will the verification lookup be efficient?
```

### 4. Test Coverage

Show what's tested:

```markdown
## Test Coverage

- Unit tests: 8 new tests in user-service.test.ts
- Integration: Manual testing of full flow
- Edge cases: Expired token, invalid token, already verified

**Not tested** (known gaps):
- Load testing with many concurrent verifications
```

---

## Review Request Template

```markdown
## Code Review Request

### Summary
[1-2 sentence description of changes]

### Files Changed
- `path/to/file1.ts` - [Brief description]
- `path/to/file2.ts` - [Brief description]

### Context
[Why these changes were needed]

### Implementation Notes
[Key decisions made and why]

### Areas for Focus
1. [Specific concern 1]
2. [Specific concern 2]

### Testing
- [x] Unit tests added/updated
- [x] Integration tests pass
- [ ] E2E tests (not applicable)

### Checklist
- [x] Code follows project conventions
- [x] No security vulnerabilities introduced
- [x] Documentation updated if needed
```

---

## What to Include

### Always Include

- List of changed files
- Summary of what changed
- Why the change was needed
- Test status

### Include When Relevant

- Design alternatives considered
- Performance implications
- Security considerations
- Breaking changes

### Never Include

- Unrelated changes
- Formatting-only commits
- Debug code
- TODO comments (resolve first)

---

## Review Types

### Quick Review

For small, low-risk changes:

```markdown
## Quick Review: Fix typo in error message

**File**: src/errors.ts
**Change**: Fixed "recieved" → "received" in error message
**Risk**: None
```

### Standard Review

For typical feature work:

```markdown
## Review: Add user preferences

**Files**: 3 files, ~200 lines
**Context**: Users can now save display preferences
**Focus**: Data validation, storage approach
```

### Critical Review

For high-risk changes:

```markdown
## CRITICAL REVIEW: Authentication refactor

**Files**: 12 files, ~800 lines
**Risk**: HIGH - Authentication system changes
**Required reviewers**: Security team
**Focus**: Token handling, session management, encryption
```

---

## Best Practices

### Keep Reviews Focused

```markdown
BAD: "Review my last week of work"
GOOD: "Review the user verification feature (3 files)"
```

### Provide Runnable Context

```markdown
## To test locally
1. git checkout feature/email-verification
2. npm install
3. npm test -- --grep "email verification"
```

### Be Specific About Concerns

```markdown
BAD: "Let me know if anything looks wrong"
GOOD: "I'm unsure about the error handling in lines 45-60"
```

### Include Relevant Links

```markdown
Related:
- Ticket: PROJ-123
- Design doc: [link]
- Previous discussion: [link]
```

---

## After Submitting

### What to Expect

```markdown
Reviewer will return:
- Critical issues (must fix)
- Important issues (should fix)
- Minor issues (optional)
- Approval/rejection status
```

### How to Handle Feedback

See `receiving-code-review` skill for detailed guidance.

---
