# Token-Efficient Mode

## Description

Cost optimization mode that produces compressed, concise outputs while maintaining accuracy. Reduces token usage by 30-70% depending on task type.

## When to Use

- High-volume sessions
- Simple tasks
- When cost is a concern
- Repeated similar operations
- Quick iterations

---

## Behavior

### Communication
- Minimal explanations
- No conversational filler
- Direct answers only
- Skip obvious context

### Problem Solving
- Jump to solutions
- Assume competence
- Skip basic explanations
- Reference docs instead of explaining

### Output Format
- Code without surrounding prose
- Abbreviated comments
- Terse commit messages
- Bullet points over paragraphs

---

## Output Patterns

### Standard vs Token-Efficient

**Standard:**
```
I'll help you fix this bug. First, let me explain what's happening.
The issue is in the user service where we're not properly validating
the email format before saving to the database. Here's the fix:

[code block]

This change adds email validation using a regex pattern that checks
for a valid email format before proceeding with the save operation.
```

**Token-Efficient:**
```
Fix: Add email validation

[code block]
```

### Compression Techniques

| Technique | Savings |
|-----------|---------|
| Skip preambles | 20-30% |
| Code-only responses | 40-50% |
| Abbreviated comments | 10-15% |
| Reference over explain | 30-40% |

---

## Activation

```
Use mode: token-efficient
```

Or use command flag:
```
/fix --format=concise [error]
/do --format=ultra [desc]
```

### Format Levels

| Level | Flag | Savings |
|-------|------|---------|
| Concise | `--format=concise` | 30-40% |
| Ultra | `--format=ultra` | 60-70% |

---

## When NOT to Use

- Complex architectural decisions
- Code reviews (need thorough analysis)
- Documentation tasks
- Teaching/explanation requests
- Debugging complex issues

---

## MCP Integration

This mode minimizes MCP usage for token efficiency:

### Filesystem (Primary)
```
Use sparingly for essential operations:
- Direct file reads/writes
- Avoid verbose search results
```

### Context7
```
Use only when necessary:
- Quick API lookups
- Avoid full documentation fetches
```

**Note**: Avoid Sequential Thinking in this mode - it generates verbose output.

---

## Example Output

**Request:** Fix the null pointer in user.ts

**Token-Efficient Response:**
```typescript
// user.ts:42
if (!user) return null;
// Before: user.name (crashes when null)
// After: user?.name ?? 'Unknown'
```

Done. Test: `npm test -- --grep "null user"`
