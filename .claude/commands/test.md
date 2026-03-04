# /test - Test Generation and Execution

## Purpose

Generate tests for code and execute them in isolated E2B cloud sandboxes. Supports parallel execution of Python (pytest) and JavaScript/TypeScript (vitest) tests.

## Usage

```
/test [target] [options]
```

## Arguments

- `$ARGUMENTS`: Target code to test (file path, function name, module, or description)

---

Execute test workflow for: **$ARGUMENTS**

## Supported Test Types

| Type | Framework | E2B Support |
|------|-----------|-------------|
| Unit Tests | pytest, vitest | ✅ |
| Integration Tests | pytest, vitest | ✅ |
| API Tests | pytest, requests, supertest | ✅ |
| Component Tests | vitest, React Testing Library | ✅ |
| Snapshot Tests | vitest, Jest | ✅ |
| E2E Tests | Playwright | ❌ Excluded |

## Workflow

### Phase 1: Analysis

1. **Read Target Code**
   - Identify the code to test
   - Understand function signatures, types, and behavior
   - Find existing test patterns in the codebase

2. **Determine Test Strategy**
   - Identify test framework (pytest for Python, vitest for TypeScript/JavaScript)
   - Plan test cases: happy path, edge cases, error handling
   - Check for existing tests to follow patterns

3. **Use task list tools** to track test cases to implement

### Phase 2: Write Tests to Files

**Rule: ALWAYS write tests to files before execution**

1. **Create Test File**
   - Follow project naming conventions
   - Python: `test_[module].py` or `[module]_test.py`
   - TypeScript: `[module].test.ts` or `[module].spec.ts`

2. **Write Test Code**
   ```python
   # Python example
   import pytest
   from module import function_to_test

   class TestFunctionName:
       def test_happy_path(self):
           result = function_to_test(valid_input)
           assert result == expected_output

       def test_edge_case_empty_input(self):
           result = function_to_test("")
           assert result == ""

       def test_error_case_invalid_input(self):
           with pytest.raises(ValueError):
               function_to_test(invalid_input)
   ```

   ```typescript
   // TypeScript example
   import { describe, it, expect } from 'vitest';
   import { functionToTest } from './module';

   describe('functionToTest', () => {
     it('should handle valid input', () => {
       expect(functionToTest(validInput)).toBe(expectedOutput);
     });

     it('should handle empty input', () => {
       expect(functionToTest('')).toBe('');
     });

     it('should throw on invalid input', () => {
       expect(() => functionToTest(invalidInput)).toThrow();
     });
   });
   ```

3. **Save Test Files**
   - Write to appropriate test directory
   - Ensure imports are correct

### Phase 3: Execute on E2B Sandbox

**Use E2B SDK based on codebase language:**
- Python codebase → `e2b_code_interpreter` Python SDK
- TypeScript/JS codebase → `@e2b/code-interpreter` TypeScript SDK

1. **Detect Codebase Language**
   - Check for `package.json` → TypeScript/JavaScript codebase
   - Check for `pyproject.toml`, `requirements.txt`, `setup.py` → Python codebase
   - Mixed codebase → Use both SDKs in parallel

2. **Create E2B Runner Script**
   - Generate temporary script using appropriate SDK
   - Script uploads test files, installs deps, runs tests

3. **Execute via Bash**
   ```bash
   # Python codebase
   python scripts/e2b_run_tests.py --test-file tests/test_example.py

   # TypeScript codebase
   npx ts-node scripts/e2b-run-tests.ts --test-file tests/example.test.ts
   ```

4. **Parallel Execution** (for mixed codebases)
   - Run Python SDK script and TypeScript SDK script simultaneously
   - Collect results from both sandboxes

### Phase 4: Report Results

1. **Parse Test Output**
   - Count passed/failed/skipped tests
   - Extract failure messages and stack traces

2. **Generate Report**
   ```
   ## Test Results

   **Target**: `path/to/module.ts`
   **Test File**: `path/to/module.test.ts`
   **Framework**: vitest

   ### Summary
   - ✅ Passed: 8
   - ❌ Failed: 2
   - ⏭️ Skipped: 0

   ### Failed Tests
   1. `test_edge_case_null_input`
      - Expected: null
      - Received: undefined

   2. `test_error_handling`
      - Error: Expected function to throw
   ```

3. **Suggest Fixes** (if tests fail)
   - Analyze failure reasons
   - Propose code fixes or test adjustments

## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--framework=[fw]` | Force specific framework | `--framework=pytest` |
| `--parallel` | Run Python and JS tests in parallel sandboxes | `--parallel` |
| `--coverage` | Include coverage report | `--coverage` |
| `--watch` | Re-run on file changes (local only) | `--watch` |
| `--only=[type]` | Run only specific test type | `--only=unit` |
| `--skip-write` | Skip writing tests, run existing | `--skip-write` |
| `--verbose` | Detailed test output | `--verbose` |
| `--mode=[mode]` | Behavioral mode | `--mode=implementation` |

## Parallel Sandbox Execution

When `--parallel` flag is used or multiple test types detected:

```
┌─────────────────────────────────────────────────┐
│ Parallel E2B Sandbox Execution                  │
├─────────────────────────────────────────────────┤
│ Sandbox A (Python)     │ Sandbox B (JS/TS)      │
│ ├─ pytest test_*.py    │ ├─ vitest *.test.ts   │
│ └─ Coverage report     │ └─ Coverage report     │
├─────────────────────────────────────────────────┤
│ Results collected and merged                    │
└─────────────────────────────────────────────────┘
```

## E2B SDK Execution Patterns

### Python SDK (for Python codebases)

```python
# e2b_run_tests.py - Run tests in E2B sandbox
from e2b_code_interpreter import Sandbox
import sys

def run_tests_in_sandbox(test_files: list[str], source_files: list[str]):
    """Execute tests in E2B sandbox using Python SDK."""
    with Sandbox() as sandbox:
        # Upload source files
        for file_path in source_files:
            with open(file_path, 'r') as f:
                content = f.read()
            sandbox.files.write(f'/home/user/{file_path}', content)

        # Upload test files
        for test_file in test_files:
            with open(test_file, 'r') as f:
                content = f.read()
            sandbox.files.write(f'/home/user/{test_file}', content)

        # Install dependencies and run tests
        sandbox.run_code('!pip install pytest pytest-cov')
        result = sandbox.run_code(f'''
import subprocess
result = subprocess.run(
    ['pytest', '-v', '--tb=short'] + {[f'/home/user/{f}' for f in test_files]},
    capture_output=True, text=True
)
print(result.stdout)
print(result.stderr)
result.returncode
''')
        print(result.text)
        return result

if __name__ == '__main__':
    test_files = sys.argv[1:]
    run_tests_in_sandbox(test_files, [])
```

### TypeScript SDK (for TypeScript/JS codebases)

```typescript
// e2b-run-tests.ts - Run tests in E2B sandbox
import { Sandbox } from '@e2b/code-interpreter';
import * as fs from 'fs';

async function runTestsInSandbox(testFiles: string[], sourceFiles: string[]) {
  const sandbox = await Sandbox.create();

  try {
    // Upload source files
    for (const filePath of sourceFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      await sandbox.files.write(`/home/user/${filePath}`, content);
    }

    // Upload test files
    for (const testFile of testFiles) {
      const content = fs.readFileSync(testFile, 'utf-8');
      await sandbox.files.write(`/home/user/${testFile}`, content);
    }

    // Install dependencies
    await sandbox.commands.run('npm init -y');
    await sandbox.commands.run('npm install vitest');

    // Run tests
    const result = await sandbox.commands.run(
      `npx vitest run ${testFiles.map(f => `/home/user/${f}`).join(' ')}`,
      {
        onStdout: (data) => console.log(data),
        onStderr: (data) => console.error(data),
      }
    );

    return result;
  } finally {
    await sandbox.kill();
  }
}

// CLI entry point
const testFiles = process.argv.slice(2);
runTestsInSandbox(testFiles, []).catch(console.error);
```

### Parallel Execution (Mixed Codebases)

```bash
# Run both Python and TypeScript tests in parallel
python scripts/e2b_run_tests.py tests/test_*.py &
npx ts-node scripts/e2b-run-tests.ts tests/*.test.ts &
wait  # Wait for both to complete
```

## Integration with Tester Agent

This command delegates to the `tester` agent for complex test generation:

```
Task tool → tester agent → writes tests → E2B sandbox execution
```

## Skills Reference

- **pytest**: `.claude/skills/testing/pytest/SKILL.md`
- **vitest**: `.claude/skills/testing/vitest/SKILL.md`
- **E2B Sandbox**: `.claude/skills/e2b-sandbox/SKILL.md`

## Examples

```bash
# Test a specific function
/test src/utils/calculate.ts

# Test with coverage
/test src/api/auth.py --coverage

# Parallel execution for mixed codebase
/test src/ --parallel

# Only unit tests
/test src/services/ --only=unit

# Run existing tests without writing new ones
/test tests/ --skip-write
```
