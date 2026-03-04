# Executing Plans

## Description

Subagent-driven development pattern for executing detailed implementation plans with quality gates. Uses fresh agents per task and mandatory code review between tasks.

## When to Use

- Executing plans created with `writing-plans` skill
- Staying in current session with independent tasks
- Wanting quality gates without human delays
- Systematic implementation with verification

## When NOT to Use

- Plan needs review first (use brainstorming)
- Tasks are tightly coupled and need shared context
- Plan requires revision during execution

---

## Core Pattern

**"Fresh subagent per task + review between tasks = high quality, fast iteration"**

### Why Fresh Agents?

- Prevents context pollution between tasks
- Each task gets focused attention
- Failures don't cascade
- Easier to retry individual tasks

### Why Code Review Between Tasks?

- Catches issues early
- Ensures code matches intent
- Prevents technical debt accumulation
- Creates natural checkpoints

---

## Execution Workflow

### Step 1: Load Plan

```markdown
1. Read the plan file
2. Verify plan is complete and approved
3. Create task list with all tasks from plan (TaskCreate)
4. Set first task to in_progress (TaskUpdate)
```

### Step 2: Execute Task

For each task:

```markdown
1. Dispatch fresh subagent with task details
2. Subagent implements following TDD cycle:
   - Write failing test
   - Verify test fails
   - Implement minimally
   - Verify test passes
   - Commit
3. Subagent returns completion summary
```

### Step 3: Code Review

After each task:

```markdown
1. Dispatch code-reviewer subagent
2. Review scope: only changes from current task
3. Reviewer returns findings:
   - Critical: Must fix before proceeding
   - Important: Should fix before proceeding
   - Minor: Can fix later
```

### Step 4: Handle Review Findings

```markdown
IF Critical or Important issues found:
  1. Dispatch fix subagent for each issue
  2. Re-request code review
  3. Repeat until no Critical/Important issues

IF only Minor issues:
  1. Note for later cleanup
  2. Proceed to next task
```

### Step 5: Mark Complete

```markdown
1. Update task status - mark task completed (TaskUpdate)
2. Move to next task
3. Repeat from Step 2
```

### Step 6: Final Review

After all tasks complete:

```markdown
1. Dispatch comprehensive code review
2. Review entire implementation against plan
3. Verify all success criteria met
4. Run full test suite
5. Use `finishing-development-branch` skill
```

---

## Critical Rules

### Never Skip Code Reviews

Every task must be reviewed before proceeding. No exceptions.

### Never Proceed with Critical Issues

Critical issues must be fixed. The pattern is:
```
implement → review → fix critical → re-review → proceed
```

### Never Run Parallel Implementation

Tasks run sequentially:
```
WRONG: Run Task 1, 2, 3 simultaneously
RIGHT: Run Task 1 → Review → Task 2 → Review → Task 3 → Review
```

### Always Read Plan Before Implementing

```
WRONG: Start coding based on memory of plan
RIGHT: Read plan file, extract task details, then implement
```

---

## Subagent Communication

### Implementation Subagent Prompt

```markdown
## Task: [Task Name]

**Context**: Executing plan for [Feature Name]

**Files to modify**:
- [File paths from plan]

**Steps**:
[Exact steps from plan]

**Requirements**:
- Follow TDD: test first, then implement
- Commit after completion
- Return summary of what was done

**Output expected**:
- Files modified
- Tests added
- Commit hash
- Any issues encountered
```

### Code Review Subagent Prompt

```markdown
## Code Review Request

**Scope**: Changes from Task [N]

**Files changed**:
- [List of files]

**Review against**:
- Plan requirements for this task
- Code quality standards
- Security best practices
- Test coverage

**Return**:
- Critical issues (must fix)
- Important issues (should fix)
- Minor issues (can defer)
- Approval status
```

---

## Task List Tools Integration

Maintain task status throughout:

```markdown
| Task | Status |
|------|--------|
| Task 1: Create model | completed |
| Task 2: Add validation | completed |
| Task 3: Create endpoint | in_progress |
| Task 4: Add tests | pending |
| Task 5: Documentation | pending |
```

Update status in real-time:
- `pending` → `in_progress` when starting (TaskUpdate)
- `in_progress` → `completed` when reviewed and approved (TaskUpdate)

---

## Error Handling

### Task Fails

```markdown
1. Capture error details
2. Attempt fix (max 2 retries)
3. If still failing, pause execution
4. Report to user with:
   - Which task failed
   - Error details
   - Suggested resolution
5. Wait for user decision
```

### Review Finds Major Issues

```markdown
1. List all Critical/Important issues
2. Dispatch fix subagent for each
3. Re-run code review
4. If issues persist after 2 cycles:
   - Pause execution
   - Report to user
   - May need plan revision
```

---

## Completion Checklist

Before declaring plan execution complete:

- [ ] All tasks marked completed
- [ ] All code reviews passed
- [ ] Full test suite passes
- [ ] No Critical issues outstanding
- [ ] No Important issues outstanding
- [ ] Final comprehensive review done
- [ ] Ready for `finishing-development-branch`

---
