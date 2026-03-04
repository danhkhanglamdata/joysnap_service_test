# /mode-save-money - Token-Efficient Mode

Switch to token-efficient mode - concise, compressed output, 30-70% cost reduction.

---

Activate mode: **token-efficient**

## Description

Cost-optimized mode producing concise, compressed output while maintaining accuracy. Reduces token usage by 30-70% depending on task type.

## When to Use

- High-volume work sessions
- Simple tasks
- When cost is a concern
- Repetitive similar operations
- Rapid iteration

## Behavior

### Communication
- Minimal explanations
- No conversational filler
- Direct answers only
- Skip obvious context

### Problem Solving
- Jump straight to solution
- Assume user competence
- Skip basic explanations
- Reference docs instead of explaining

### Output Format
- Code without surrounding text
- Abbreviated comments
- Concise commit messages
- Bullet points instead of paragraphs

## Comparison

**Standard:**
```
I'll help you fix this bug. First, let me explain what's happening.
The issue is in the user service where we're not properly validating email format
before saving to the database. Here's the fix:

[code block]

This change adds email validation using a regex pattern...
```

**Token-efficient:**
```
Fix: Add email validation

[code block]
```

## Savings Levels

| Technique | Savings |
|-----------|---------|
| Skip preambles | 20-30% |
| Code-only responses | 40-50% |
| Abbreviated comments | 10-15% |
| Reference instead of explain | 30-40% |

## When NOT to Use

- Complex architecture decisions
- Code reviews (need thorough analysis)
- Documentation tasks
- Teaching/explanation requests
- Debugging complex issues
