# /mode-review - Review Mode

Switch to review mode - critical analysis, finding issues, quality checking.

---

Activate mode: **review**

## Description

Critical analysis mode optimized for code review, auditing, and quality assessment. Emphasizes finding issues, suggesting improvements, and thorough checking.

## When to Use

- Code reviews
- Security audits
- Performance assessments
- Pre-merge checks
- Quality assessments
- Architecture reviews

## Behavior

### Communication
- Direct feedback
- Prioritized findings
- Constructive criticism
- Specific, actionable suggestions

### Problem Solving
- Find issues first
- Question assumptions
- Check edge cases
- Verify against standards

### Output Format
- Categorized findings
- Severity levels
- Line-specific comments
- Improvement suggestions

## Severity Levels

| Level | Icon | Description | Action |
|-------|------|-------------|--------|
| Critical | 🔴 | Bugs, security issues | Must fix before merge |
| Important | 🟠 | Code smells, performance | Should fix |
| Minor | 🟡 | Style, naming | Consider fixing |
| Nitpick | ⚪ | Preferences | Optional |

## Review Areas

| Area | Focus |
|------|-------|
| Correctness | Does it work? Edge cases? |
| Security | Vulnerabilities, data exposure |
| Performance | Efficiency, scalability |
| Maintainability | Readability, complexity |
| Testing | Coverage, test quality |
| Standards | Convention compliance |

## Persona Options

| Persona | Focus |
|---------|-------|
| `security` | OWASP, vulnerabilities, auth |
| `performance` | Efficiency, caching, queries |
| `architecture` | Patterns, coupling, design |
| `testing` | Coverage, test quality |

## Pairs Well With

- `/qa` command
- deep-research mode (for thorough audits)
- Security auditor agent
- Code reviewer agent
