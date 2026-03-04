# /do - Feature Development Workflow

## Purpose

End-to-end feature development workflow, coordinating planning, implementation guidance, testing, and code review.

## Default Mode

**This command uses `--mode=orchestration` by default** for coordinated multi-step execution. Orchestration mode emphasizes sequential coordination with parallel execution only when tasks are truly independent. Override with `--mode=default` for simpler tasks.

## Usage

```
/do [feature description or issue reference]
```

## Arguments

- `$ARGUMENTS`: Feature description, issue number, or requirement specification

---

Implement a complete feature development workflow for: **$ARGUMENTS**

## Auto-Checkpoint

**Checkpoints are created automatically** at key points using git:

| When | Checkpoint Name |
|------|-----------------|
| Before starting | `checkpoint/feature-start-[timestamp]` |
| After tests written | `checkpoint/tests-written-[timestamp]` |
| After implementation | `checkpoint/impl-done-[timestamp]` |

To restore: `git stash list` → `git stash apply stash@{n}`

## Workflow

### Phase 0: Create Initial Checkpoint

```bash
git stash push -m "checkpoint/feature-start-$(date +%Y%m%d-%H%M%S)"
```

### Phase 1: Planning

First, analyze the feature request and create an implementation plan:

1. **Understand Requirements**
   - Parse the feature description thoroughly
   - Identify acceptance criteria
   - List assumptions that need validation
   - Clarify any ambiguous requirements with the user

2. **Explore Codebase**
   - Find related existing implementations
   - Identify patterns and conventions to follow
   - Locate integration points
   - Note dependencies

3. **Create Task Breakdown**
   - Decompose into atomic, verifiable tasks
   - Order tasks by dependencies
   - Include testing requirements
   - Estimate complexity (S/M/L)

4. **Use task list tools** to track all tasks


### Phase 2: Research (If Needed)

If the feature involves unfamiliar technology:

1. Research best practices and patterns
2. Find examples in the codebase or documentation
3. Identify potential pitfalls
4. Document key decisions

### Phase 3: Write Tests First (TDD)

**Rule: NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST**

For each implementation task:

1. **Write Failing Tests**
   - Unit tests for expected behavior
   - Edge case tests
   - Integration tests for workflows

2. **Run Tests in E2B Sandbox (Default)**
   - Detect codebase language (Python vs TypeScript/JS)
   - Use appropriate E2B SDK:
     - Python codebase → `e2b_code_interpreter` Python SDK
     - TypeScript/JS codebase → `@e2b/code-interpreter` TypeScript SDK
   - Execute tests in isolated cloud sandbox

3. **Verify Tests Are Correct**
   - Tests should fail for the right reason
   - Tests should be specific and focused

4. **Checkpoint: Tests Written**
   ```bash
   git add -A
   git stash push -m "checkpoint/tests-written-$(date +%Y%m%d-%H%M%S)"
   git stash pop
   ```

### Phase 4: Implementation

Make tests pass with minimal code:

1. **Identify Target Files**
   - Existing files to modify
   - New files to create

2. **Implement Minimal Code**
   - Just enough to pass tests
   - Follow patterns and conventions
   - Handle edge cases

3. **Run Tests in E2B Sandbox (Default)**
   - Detect codebase language and use appropriate E2B SDK
   - Python codebase → `e2b_code_interpreter` Python SDK
   - TypeScript/JS codebase → `@e2b/code-interpreter` TypeScript SDK
   - Mixed codebase → Run both SDKs in parallel
   - Collect and verify all tests pass

4. **Refactor if Needed**
   - Clean up implementation
   - Remove duplication
   - Ensure tests still pass

5. **Code Simplification**
   - Invoke `code-simplifier` plugin on modified files
   - Simplify recently modified code for clarity and maintainability
   - Preserve all functionality while improving readability
   - Re-run tests to verify no regressions

6. **Checkpoint: Implementation Done**
   ```bash
   git add -A
   git stash push -m "checkpoint/impl-done-$(date +%Y%m%d-%H%M%S)"
   git stash pop
   ```

### Phase 5: Code Review

Before completion:

1. **Self-Review Checklist**
   - [ ] Code follows project conventions
   - [ ] No security vulnerabilities
   - [ ] Error handling is complete
   - [ ] Documentation updated
   - [ ] Tests are passing

2. **Review Staged Changes**
   ```bash
   git diff --staged
   ```

### Phase 6: Completion

1. **Verify All Tasks Complete**
   - All task list items done
   - All tests passing
   - Documentation updated

2. **Prepare for Commit**
   - Stage appropriate files
   - Generate commit message
   - Create PR if requested

## Structured Output Contract
### Parsed Goal
- Restate `$ARGUMENTS` as a concrete feature outcome and scope.
### Plan
- Provide an ordered task list with dependencies and checkpoints.
### Actions Taken
- List implemented changes, files touched, and key decisions.
### Verification
- Report test execution, results, and any unresolved risk.
### Next Step
- State the immediate follow-up (`/qa`, commit, or user decision).

## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--mode=[mode]` | Use specific behavioral mode (default: orchestration) | `--mode=default` |
| `--depth=[1-5]` | Planning thoroughness level | `--depth=3` |
| `--no-checkpoint` | Disable auto-checkpoints | `--no-checkpoint` |
| `--skip-tests` | Skip test generation phase | `--skip-tests` |
| `--skip-review` | Skip code review phase | `--skip-review` |
| `--test-local` | Run tests locally instead of E2B sandbox | `--test-local` |
| `--format=[fmt]` | Output format (concise/detailed) | `--format=concise` |
| `--review` | Prompt for code review after completion | `--review` |

---

## Post-Completion Review (if --review flag)

When `--review` flag is present, after task completion show:

```
✓ /do completed
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
