# Systematic Debugging

## Description

Four-phase debugging methodology centered on finding root causes before implementing fixes. The foundational principle: **"NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST"**

## When to Use

- Bug reports with unclear cause
- Errors appearing in production
- Tests failing unexpectedly
- Intermittent/flaky issues
- Complex multi-component failures

---

## The Four Phases

### Phase 1: Root Cause Investigation

**Goal**: Understand what's happening before attempting to fix.

**Steps**:

1. **Read error messages carefully**
   ```markdown
   - What is the exact error message?
   - What is the stack trace?
   - What line numbers are mentioned?
   - What values are shown?
   ```

2. **Reproduce consistently**
   ```markdown
   - Can you trigger the bug reliably?
   - What exact steps reproduce it?
   - What environment is required?
   - Document the reproduction steps
   ```

3. **Track recent changes**
   ```markdown
   - What changed recently?
   - git log --oneline -20
   - When did it last work?
   - What was deployed?
   ```

4. **Gather evidence**
   ```markdown
   - Collect logs
   - Check monitoring/metrics
   - Review related code
   - Note any patterns
   ```

5. **Add instrumentation** (for multi-component systems)
   ```typescript
   // Add diagnostic logging at each boundary
   console.error('[DEBUG] Input received:', JSON.stringify(input));
   console.error('[DEBUG] After validation:', JSON.stringify(validated));
   console.error('[DEBUG] Before database call:', JSON.stringify(query));
   console.error('[DEBUG] Database result:', JSON.stringify(result));
   ```

---

### Phase 2: Pattern Analysis

**Goal**: Find comparable working code to identify differences.

**Steps**:

1. **Find working code**
   ```markdown
   - Is there similar functionality that works?
   - What did this code look like before?
   - Are there reference implementations?
   ```

2. **Study reference thoroughly**
   ```markdown
   - How does the working version handle this case?
   - What dependencies does it use?
   - What assumptions does it make?
   ```

3. **Identify differences**
   ```markdown
   - What's different between working and broken?
   - Configuration differences?
   - Data differences?
   - Environment differences?
   ```

4. **Understand dependencies**
   ```markdown
   - What does this code depend on?
   - What depends on this code?
   - Are dependencies behaving correctly?
   ```

---

### Phase 3: Hypothesis and Testing

**Goal**: Form and test a specific theory about the cause.

**Steps**:

1. **Form specific hypothesis**
   ```markdown
   Write it down explicitly:
   "The bug occurs because [X] causes [Y] when [Z]"

   Example:
   "The bug occurs because the cache returns stale data
    when the user's session expires during an active request"
   ```

2. **Test with minimal changes**
   ```markdown
   - Change ONE variable at a time
   - Don't combine multiple fixes
   - Verify results after each change
   ```

3. **Validate hypothesis**
   ```markdown
   - Does the fix address the hypothesis?
   - Can you explain WHY it works?
   - Does it make the bug impossible, not just unlikely?
   ```

---

### Phase 4: Implementation

**Goal**: Fix properly with verification.

**Steps**:

1. **Write failing test first**
   ```typescript
   it('should handle expired session during request', () => {
     // Reproduce the bug scenario
     const session = createExpiredSession();
     const result = processRequest(session);

     // This should fail before the fix
     expect(result.error).toBe('SESSION_EXPIRED');
   });
   ```

2. **Implement single targeted fix**
   ```typescript
   // Fix addresses root cause, not symptom
   function processRequest(session: Session) {
     if (session.isExpired()) {
       return { error: 'SESSION_EXPIRED' };
     }
     // ... rest of logic
   }
   ```

3. **Verify fix works**
   ```bash
   npm test -- --grep "expired session"
   # Should pass
   ```

4. **Verify no regressions**
   ```bash
   npm test
   # All tests should pass
   ```

---

## The Three-Fix Rule

**If three or more fixes fail consecutively, STOP.**

This signals an architectural problem, not a simple bug:

```markdown
Fix attempt 1: Failed
Fix attempt 2: Failed
Fix attempt 3: Failed

STOP: This is not a bug - this is a design problem.

Action: Discuss with user/team before proceeding
- Explain what's been tried
- Explain why it's not working
- Propose architectural changes
```

---

## Key Principles

### Never Skip Error Details

```markdown
BAD: "There's an error somewhere"
GOOD: "TypeError: Cannot read property 'id' of undefined
       at UserService.getUser (user-service.ts:42)"
```

### Reproduce Before Investigating

```markdown
BAD: "I think I know what's wrong" (starts coding)
GOOD: "Let me reproduce this first" (writes repro steps)
```

### Trace Backward to Origin

```markdown
BAD: Fix where error appears
GOOD: Trace data backward to find where it became invalid
```

### One Change Per Test

```markdown
BAD: "I changed A, B, and C - now it works!"
     (Which one fixed it? Are the others safe?)

GOOD: "I changed A - still broken.
       I reverted A and changed B - now it works.
       B was the fix."
```

---

## Debugging Checklist

Before attempting any fix:

- [ ] Error message fully read and understood
- [ ] Bug reproduced consistently
- [ ] Recent changes reviewed
- [ ] Evidence gathered (logs, traces)
- [ ] Hypothesis written down
- [ ] Similar working code identified
- [ ] Root cause identified (not just symptom)

Before declaring fixed:

- [ ] Failing test written
- [ ] Fix implemented
- [ ] Test passes
- [ ] No regressions (full test suite passes)
- [ ] Fix explained (can articulate why it works)

---
