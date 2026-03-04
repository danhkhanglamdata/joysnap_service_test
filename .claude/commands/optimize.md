# /optimize - Performance Optimization

## Purpose

Analyze and optimize code performance.

## Default Mode

**This command uses `--mode=orchestration` by default** for coordinated multi-step execution. Orchestration mode emphasizes sequential coordination with parallel execution only when tasks are truly independent. Override with `--mode=default` for simpler tasks.

## Usage

```
/optimize [file or function]
```

## Arguments

- `$ARGUMENTS`:
  - File path: Optimize entire file
  - Function name: Optimize specific function
  - Module path: Optimize entire module

---

Optimize: **$ARGUMENTS**

## Workflow

1. **Analyze Current Performance**
   - Identify bottlenecks
   - Check complexity
   - Profile if possible

2. **Identify Opportunities**
   - Algorithm improvements
   - Caching opportunities
   - Async optimizations

3. **Implement Optimizations**
   - Make targeted changes
   - Verify improvements
   - Ensure correctness

## Output

```markdown
## Optimization Report

### Before
- Time complexity: O(n²)
- Estimated time: 500ms

### After
- Time complexity: O(n log n)
- Estimated time: 50ms

### Changes Made
- [Description of optimizations]
```


## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--mode=[mode]` | Use specific behavioral mode (default: orchestration) | `--mode=default` |
| `--depth=[1-5]` | Analysis thoroughness | `--depth=4` |
| `--format=[fmt]` | Output format (concise/detailed) | `--format=detailed` |
| `--persona=[type]` | Apply persona expertise | `--persona=performance` |
