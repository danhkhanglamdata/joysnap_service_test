# Sequential Thinking

## Description

Step-by-step reasoning methodology with explicit evidence collection and confidence tracking. Use for complex problems requiring careful analysis and documented decision-making.

## When to Use

- Complex debugging
- Architecture decisions
- Security analysis
- Performance investigation
- Any problem with multiple possible causes
- When decisions need documentation

---

## The Sequential Process

### Step 1: Define the Question
Clearly state what you're trying to determine.

```markdown
## Question
What is causing the authentication timeout for users with special characters in passwords?
```

### Step 2: Gather Evidence
Collect all relevant information systematically.

```markdown
## Evidence Collection

### Evidence 1: Error Logs
- Source: `logs/auth-service.log`
- Finding: Timeout occurs at password encoding step
- Confidence: High (direct observation)

### Evidence 2: Code Review
- Source: `src/auth/password.ts:42`
- Finding: URL encoding applied to password
- Confidence: High (code inspection)

### Evidence 3: Test Results
- Source: Manual testing
- Finding: Works with alphanumeric, fails with `@#$`
- Confidence: High (reproducible)
```

### Step 3: Form Hypotheses
Generate possible explanations.

```markdown
## Hypotheses

### Hypothesis A: URL Encoding Issue
- Evidence supporting: E1, E2, E3
- Evidence against: None
- Probability: 80%

### Hypothesis B: Character Set Mismatch
- Evidence supporting: E3
- Evidence against: E2 (UTF-8 used)
- Probability: 15%

### Hypothesis C: Database Encoding
- Evidence supporting: None directly
- Evidence against: E1 (fails before DB)
- Probability: 5%
```

### Step 4: Test Hypotheses
Verify the most likely explanation.

```markdown
## Testing

### Test for Hypothesis A
Action: Remove URL encoding, use base64 instead
Result: Password `test@123` now works
Conclusion: Hypothesis A confirmed
```

### Step 5: Document Conclusion
State the final answer with confidence.

```markdown
## Conclusion

**Root Cause**: URL encoding in password.ts:42 mangles special characters

**Confidence**: 9/10

**Evidence Chain**:
1. Timeout at encoding step (logs)
2. URL encoding in code (review)
3. Special char passwords fail (testing)
4. Removing encoding fixes issue (verification)

**Fix**: Replace URL encoding with base64 at line 42
```

---

## Output Template

```markdown
# Sequential Analysis: [Problem Description]

## Question
[Clear statement of what we're investigating]

## Evidence

### Evidence 1: [Title]
- Source: [where found]
- Finding: [what it shows]
- Confidence: [High/Medium/Low]

### Evidence 2: [Title]
...

## Hypotheses

### Hypothesis A: [Name]
- Supporting evidence: [list]
- Contradicting evidence: [list]
- Probability: [X%]

### Hypothesis B: [Name]
...

## Testing

### Test 1: [What tested]
- Action: [what was done]
- Expected: [what should happen if hypothesis true]
- Actual: [what happened]
- Result: [confirms/refutes hypothesis]

## Conclusion

**Answer**: [clear statement]
**Confidence**: [X/10]
**Key Evidence**: [most important findings]
**Recommended Action**: [what to do next]
```

---

## Confidence Scoring

| Score | Meaning | Evidence Required |
|-------|---------|-------------------|
| 9-10 | Certain | Multiple independent confirmations |
| 7-8 | High | Strong evidence, tested hypothesis |
| 5-6 | Medium | Good evidence, some uncertainty |
| 3-4 | Low | Limited evidence, multiple possibilities |
| 1-2 | Guess | Insufficient evidence |

---

## Anti-Patterns

### Jumping to Conclusions
```markdown
❌ "The bug is probably in the database"
✅ "Let me gather evidence before hypothesizing"
```

### Confirmation Bias
```markdown
❌ Only looking for evidence supporting first guess
✅ Actively seeking contradicting evidence
```

### Skipping Documentation
```markdown
❌ Fixing without recording reasoning
✅ Document even simple analysis for future reference
```

---

## Activation

### Via Mode
```
Use mode: deep-research
```

### Via Command
```
Apply sequential thinking to analyze [problem]
```

### Via Skill Reference
```
Use skill: sequential-thinking
```

---

## MCP Integration

This skill is powered by the Sequential Thinking MCP server:

### Using the MCP Tool
```
The Sequential Thinking MCP server provides the `sequentialthinking` tool.
Use it for:
- Breaking complex problems into thought sequences
- Tracking confidence and revising conclusions
- Building evidence chains with explicit reasoning
- Maintaining state across multiple reasoning steps
```

### Tool Parameters
```
thought: Your current thinking step
thoughtNumber: Current step number
totalThoughts: Estimated total steps needed
nextThoughtNeeded: Whether more steps are needed
isRevision: If revising previous thinking
needsMoreThoughts: If more analysis needed
```

### Integration Pattern
```
1. Start with initial thought defining the question
2. Gather evidence in subsequent thoughts
3. Form hypotheses with probability estimates
4. Test and verify in later thoughts
5. Conclude with confidence score
```

## Combines Well With

- Deep research mode
- Systematic debugging skill
- Root cause tracing skill
- Security audits
- Performance investigations

---
