# /fix - Bug Fixing Workflow (Socratic Method)

## Purpose

Debug and fix issues using the Socratic method - guiding through questions to deeply understand the problem before fixing.

## Default Mode

**This command uses `--mode=orchestration` by default** for coordinated multi-step execution. Orchestration mode emphasizes sequential coordination with parallel execution only when tasks are truly independent. Override with `--mode=default` for simpler tasks.

## Usage

```
/fix [error message, bug description, or issue reference]
```

## Arguments

- `$ARGUMENTS`: Error message, stack trace, bug description, or issue number

---

Analyze and fix the following issue: **$ARGUMENTS**

## Philosophy: Socratic Debugging

**Don't jump to solutions. Ask questions first.**

The goal is to understand the problem deeply through dialogue:
1. Ask clarifying questions
2. Challenge assumptions
3. Guide user to articulate the real issue
4. Only then propose solutions

## Workflow

### Phase 1: Understand the Problem (Socratic Dialogue)

**Ask ONE question at a time. Wait for response.**

1. **Clarify the Symptom**
   - "What exactly is happening vs what you expected?"
   - "When did this start occurring?"
   - "Is it reproducible? Every time or intermittent?"

2. **Understand the Context**
   - "What were you doing when this happened?"
   - "Did anything change recently? (code, config, dependencies)"
   - "Does it happen in all environments or just one?"

3. **Narrow Down the Scope**
   - "Does it affect all users or specific cases?"
   - "Have you tried [specific test]?"
   - "What have you already tried?"

### Phase 2: Analyze (After Understanding)

1. **Parse Error Information**
   - Extract error type and message
   - Parse stack trace if available
   - Identify the failing location

2. **Form Hypotheses**
   - List possible causes ranked by likelihood
   - Present to user: "Based on what you've told me, I think it could be:
     a) [Most likely cause]
     b) [Second possibility]
     c) [Third possibility]
     Which seems most relevant to your situation?"

3. **Validate Hypothesis**
   - Test the most likely cause first
   - Confirm root cause before fixing

### Phase 3: Investigate Code

1. **Trace Execution**
   - Follow the code path to the error
   - Identify state at each step
   - Find where expectations diverge

2. **Search Related Code**
   - Find similar patterns
   - Check if same bug exists elsewhere
   - Review recent changes:
   ```bash
   git log --oneline -20
   git blame [file]
   ```

### Phase 4: Propose Fix (With Options)

**Present options, don't dictate:**

"I see two approaches to fix this:

**Option A**: [Quick fix]
- Pros: Fast, minimal changes
- Cons: Might not address root cause

**Option B**: [Thorough fix]
- Pros: Addresses root cause
- Cons: More changes required

Which approach would you prefer?"

### Phase 5: Implement Fix

1. **Develop Minimal Fix**
   - Fix the root cause, not symptoms
   - Keep changes minimal and focused
   - Consider edge cases

2. **Add Defensive Code** (if appropriate)
   - Input validation
   - Null checks
   - Error handling

### Phase 6: Verification

1. **Test the Fix in E2B Sandbox (Default)**
   - Detect codebase language and use appropriate E2B SDK:
     - Python codebase → `e2b_code_interpreter` Python SDK
     - TypeScript/JS codebase → `@e2b/code-interpreter` TypeScript SDK
   - Execute tests in isolated cloud sandbox
   - Verify original error is resolved
   - Check related functionality

2. **Add Regression Test**
   - Write test that would have caught this bug
   - Include edge cases discovered
   - Ensure test fails without fix
   - Run in E2B sandbox to verify

## Socratic Question Patterns

| Situation | Questions |
|-----------|-----------|
| Vague error | "Can you show me the exact error message?" |
| Works sometimes | "What's different when it works vs fails?" |
| Recent breakage | "What changed between when it worked and now?" |
| Performance issue | "How are you measuring the slowness?" |
| Data issue | "Can you show me an example of bad data?" |

## Structured Output Contract
### Parsed Goal
- Restate `$ARGUMENTS` as the observed bug and expected behavior.
### Plan
- Outline investigation hypotheses and the selected fix approach.
### Actions Taken
- List code/path analysis, implemented fix, and files changed.
### Verification
- Report reproduction status, test outcomes, and regression coverage.
### Next Step
- State the immediate follow-up (`/qa`, monitoring, or user confirmation).

## Output Format

```markdown
## Fix Report

### Problem Understanding
[Summary of what we learned through dialogue]

### Root Cause
[Explanation of why this happened]

### Fix Applied
[Code changes made]

### Regression Test
[Test added to prevent recurrence]

### Prevention
[Recommendations to avoid similar issues]
```

## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--mode=[mode]` | Use specific behavioral mode (default: orchestration) | `--mode=default` |
| `--persona=[type]` | Apply persona expertise | `--persona=security` |
| `--depth=[1-5]` | Investigation thoroughness | `--depth=4` |
| `--format=[fmt]` | Output format (concise/detailed) | `--format=concise` |
| `--skip-regression` | Skip regression test creation | `--skip-regression` |
| `--quick` | Skip Socratic dialogue, fix directly | `--quick` |
| `--test-local` | Run tests locally instead of E2B sandbox | `--test-local` |
| `--review` | Prompt for code review after completion | `--review` |

---

## Post-Completion Review (if --review flag)

When `--review` flag is present, after fix completion show:

```
✓ /fix completed
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
