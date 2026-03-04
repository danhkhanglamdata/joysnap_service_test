# /qa - Quality Assurance

## Purpose

Unified quality assurance command combining code review, security scanning, and test coverage analysis. Security is enabled by default.

## Default Mode

**This command uses `--mode=orchestration` by default** for coordinated multi-step execution. Orchestration mode emphasizes sequential coordination with parallel execution only when tasks are truly independent. Override with `--mode=default` for simpler tasks.

## Usage

```
/qa [target: file path | 'staged' | 'pr' | PR number]
```

## Arguments

- `$ARGUMENTS`:
  - File path: Review specific file(s)
  - `staged`: Review all staged changes
  - `pr`: Review current branch changes vs main
  - PR number: Review specific pull request

---

Run quality assurance for: **$ARGUMENTS**

## Default Behavior

By default, `/qa` runs all three analyses:
1. **Code Review** - Quality, clarity, consistency, complexity
2. **Security Scan** - OWASP vulnerabilities, secrets, injection attacks
3. **Test Coverage** - Missing tests, coverage gaps, test quality

## Workflow

### Phase 1: Identify Scope

1. **Determine What to Review**
   - Single file: Read the specified file
   - `staged`: Get staged changes with `git diff --staged`
   - `pr`: Get branch diff with `git diff main...HEAD`
   - PR number: Fetch PR details with `gh pr view`

2. **Gather Context**
   - Understand the purpose of changes
   - Check related tests
   - Review CLAUDE.md for project standards

### Phase 2: Code Review

Check each file for:

1. **Correctness** - Logic errors, edge cases, type safety
2. **Clarity** - Naming, structure, comments
3. **Consistency** - Project conventions, patterns
4. **Complexity** - Function length, nesting depth
5. **Performance** - Algorithmic efficiency, memory usage, N+1 queries

### Phase 3: Security Scan (Default: ON)

Check for security issues:

| Category | Checks |
|----------|--------|
| **Injection** | SQL injection, XSS, command injection |
| **Auth** | Authentication, authorization flaws |
| **Data** | Data protection, encryption |
| **Secrets** | Exposed API keys, passwords, tokens |
| **Dependencies** | Known vulnerabilities (`npm audit`, `pip-audit`) |

### Phase 4: Test Coverage Analysis in E2B Sandbox (Default)

Execute tests and analyze coverage via E2B SDK:

1. **Run Tests via E2B SDK**
   - Detect codebase language and use appropriate SDK:
     - Python codebase → `e2b_code_interpreter` Python SDK
     - TypeScript/JS codebase → `@e2b/code-interpreter` TypeScript SDK
   - Mixed codebase → Run both SDKs in parallel

2. **Analyze Coverage**
   - Coverage Gaps - Untested code paths
   - Test Quality - Assertions, edge cases, mocking
   - Missing Tests - New code without tests
   - Test Sync - Tests matching current implementation

### Phase 5: Optional Model Compatibility Regression Checklist

When command/workflow behavior has changed, optionally run the **Model Compatibility Regression Checklist** in `.claude/workflows/primary-workflow.md` during quality review to validate parsing, tool selection, fallback behavior, output schema, and reporting completeness.

## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--no-security` | Skip security scanning | `/qa --no-security src/` |
| `--no-tests` | Skip test coverage analysis | `/qa --no-tests staged` |
| `--security-only` | Run only security scan | `/qa --security-only` |
| `--tests-only` | Run only test coverage | `/qa --tests-only src/` |
| `--test-local` | Run tests locally instead of E2B sandbox | `--test-local` |
| `--mode=[mode]` | Use specific behavioral mode (default: orchestration) | `--mode=default` |
| `--persona=[type]` | Apply persona expertise | `--persona=security` |
| `--depth=[1-5]` | Analysis thoroughness level | `--depth=5` |
| `--format=[fmt]` | Output: concise/detailed/json | `--format=json` |
| `--save=[path]` | Save report to file | `--save=qa-report.md` |

## Output Format

```markdown
# QA Report: [target]

## Summary
| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Code Review | 0 | 0 | 0 | 0 |
| Security | 0 | 0 | 0 | 0 |
| Test Coverage | 0 | 0 | 0 | 0 |

## Code Review Findings
[Detailed findings]

## Security Findings
[Detailed findings]

## Test Coverage Findings
[Detailed findings]

## Recommendations
[Prioritized action items]
```

## Examples

```bash
# Full QA on staged changes (default)
/qa staged

# Review specific file without test analysis
/qa --no-tests src/auth/login.ts

# Security-only scan on entire codebase
/qa --security-only

# Deep review with security persona
/qa --depth=5 --persona=security pr

# Save report to file
/qa --save=reports/qa-report.md staged
```

