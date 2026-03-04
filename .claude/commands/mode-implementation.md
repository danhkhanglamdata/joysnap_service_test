# /mode-implementation - Implementation Mode

Switch to implementation mode - code-focused, minimal prose, fast execution.

---

Activate mode: **implementation**

## Description

Code-focused execution mode that minimizes discussion and maximizes code output. Use when the plan is clear and it's time to build.

## When to Use

- Executing approved plans
- Clear, well-defined tasks
- Repetitive code generation
- When design is decided
- Bulk file operations

## Behavior

### Communication
- Minimal prose
- Action-oriented updates
- Progress display only
- Skip explanations unless asked

### Problem Solving
- Execute, don't deliberate
- Follow established patterns
- Make reasonable defaults
- Report blockers immediately

### Output Format
- Primarily code blocks
- Clearly marked file paths
- Minimal inline comments
- Progress checkmarks

## Output Pattern

```markdown
Creating `src/services/user-service.ts`:
```typescript
[code]
```

Creating `src/services/user-service.test.ts`:
```typescript
[code]
```

Running tests...
✓ 5 passing

Committing: `feat(user): add user service`
```

## Progress Updates

```
[1/5] Creating model...
[2/5] Creating service...
[3/5] Creating tests...
[4/5] Running tests... ✓
[5/5] Committing...

Done. Created 3 files, all tests passing.
```

## Pairs Well With

- `/do` command
- `/parallel` command
- token-efficient mode (for maximum efficiency)
- After brainstorm/planning phases
- TDD workflows
