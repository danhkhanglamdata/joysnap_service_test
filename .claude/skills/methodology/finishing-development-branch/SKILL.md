# Finishing a Development Branch

## Description

Structured 5-step workflow for completing development branches. Ensures tests pass, presents completion options, and handles cleanup.

## When to Use

- After implementing a feature
- After all tests pass
- Ready to merge or create PR
- Cleaning up after development

---

## The 5-Step Workflow

### Step 1: Verify Tests

Run the project's test suite:

```bash
npm test
# or
pytest
# or
go test ./...
```

**Decision point**:
- Tests PASS → Continue to Step 2
- Tests FAIL → STOP. Cannot proceed with failing tests.

```markdown
⚠️ STOP: Tests failing

Cannot proceed with merge/PR until tests pass.
Fix failing tests first, then restart this workflow.
```

### Step 2: Determine Base Branch

Identify which branch this feature branch originated from:

```bash
# Check tracking branch
git branch -vv

# Or check common bases
git merge-base main feature-branch
git merge-base develop feature-branch
```

Common base branches:
- `main` or `master` - Production
- `develop` - Development
- `release/*` - Release branches

### Step 3: Present Options

Offer exactly four choices:

```markdown
## Branch Completion Options

Your feature branch `feature/email-verification` is ready.
All tests pass (42/42).

Choose how to proceed:

1. **Merge locally** - Merge into [base] on your machine
2. **Create Pull Request** - Push and open PR for review
3. **Keep as-is** - Leave branch for later work
4. **Discard** - Delete this branch and all changes

Enter your choice (1-4):
```

### Step 4: Execute Choice

#### Option 1: Merge Locally

```bash
# Switch to base branch
git checkout main

# Pull latest
git pull origin main

# Merge feature branch
git merge feature/email-verification

# Verify tests still pass
npm test

# Delete feature branch
git branch -d feature/email-verification
```

#### Option 2: Create Pull Request

```bash
# Push branch to remote
git push -u origin feature/email-verification

# Create PR (using gh CLI)
gh pr create \
  --title "Add email verification" \
  --body "## Summary
- Implements email verification flow
- Adds verification token generation
- Includes tests for all scenarios

## Test Plan
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing complete"
```

#### Option 3: Keep As-Is

```markdown
Branch preserved: feature/email-verification

Note: Remember to return to this branch later.
Current state: All tests passing, ready for merge.
```

#### Option 4: Discard

```markdown
⚠️ WARNING: This will delete all work on this branch.

Type "discard" to confirm: _______
```

If confirmed:
```bash
# Switch away from branch
git checkout main

# Force delete branch
git branch -D feature/email-verification

# If pushed to remote, delete there too
git push origin --delete feature/email-verification
```

### Step 5: Cleanup Worktree (if applicable)

For options 1, 2, and 4, cleanup the worktree environment:

```bash
# Remove worktree
git worktree remove ../feature-email-verification

# Or if worktree is in special location
git worktree remove /path/to/worktree
```

For option 3 (keep), preserve the worktree.

---

## Decision Flow

```
┌─────────────────────────┐
│     Tests Passing?      │
└───────────┬─────────────┘
            │
       ┌────┴────┐
       │   NO    │──────► STOP: Fix tests first
       └─────────┘
            │
           YES
            │
            ▼
┌─────────────────────────┐
│   Present 4 Options     │
└───────────┬─────────────┘
            │
    ┌───────┼───────┬───────┐
    │       │       │       │
    ▼       ▼       ▼       ▼
 Merge    PR     Keep   Discard
    │       │       │       │
    ▼       ▼       │       ▼
 Cleanup Cleanup    │    Confirm
    │       │       │       │
    ▼       ▼       │       ▼
  Done    Done   Done   Cleanup
                          │
                          ▼
                        Done
```

---

## Pull Request Template

When choosing Option 2:

```markdown
## Summary

[Brief description of changes]

## Changes

- [Change 1]
- [Change 2]
- [Change 3]

## Test Plan

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing scenarios:
  - [ ] Scenario 1
  - [ ] Scenario 2

## Screenshots (if applicable)

[Add screenshots here]

## Related Issues

Closes #[issue number]
```

---

## Verification Before Each Option

### Before Merge

```markdown
- [ ] Tests pass on feature branch
- [ ] Base branch is up to date
- [ ] No merge conflicts
- [ ] Tests pass after merge
```

### Before PR

```markdown
- [ ] Tests pass
- [ ] Branch pushed to remote
- [ ] PR description complete
- [ ] Reviewers assigned (if required)
```

### Before Discard

```markdown
- [ ] Confirmed with user (typed "discard")
- [ ] No valuable uncommitted changes
- [ ] Branch deleted locally
- [ ] Branch deleted from remote (if pushed)
```

---

## Core Principle

**"Verify tests → Present options → Execute choice → Clean up"**

Never:
- Merge with failing tests
- Delete work without confirmation
- Skip the verification step
- Leave orphaned worktrees

---
