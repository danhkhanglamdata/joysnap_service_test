# /spike - Technology Research

## Purpose

Research technologies, libraries, or methodologies with comprehensive analysis. Spike is an Agile term for research/experimentation before implementation.

## Default Mode

**This command uses `--mode=deep-research` by default** for thorough analysis. Override with `--mode=default` for standard behavior.

## Usage

```
/spike [topic or technology]
```

## Arguments

- `$ARGUMENTS`: Topic, technology, library, or methodology to research

---

Research: **$ARGUMENTS**

## Setup
- If saving to `agent-includes/` directory and it doesn't exist, create it first:
  ```bash
  mkdir -p agent-includes/specs agent-includes/plans agent-includes/spikes
  ```

## Workflow

1. **Gather Information**
   - Official documentation
   - Community resources
   - Comparisons

2. **Analyze**
   - Pros and cons
   - Best practices
   - Alternatives

3. **Recommend**
   - Summary
   - Recommendation
   - Next steps

4. **Save Output**
   - Default location: `agent-includes/spikes/YYMMDD-[topic-slug].md`
   - If within active plan: `agent-includes/plans/[plan-name]/reports/YYMMDD-spike-[topic].md`
   - Override with `--save=[path]` flag

## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--mode=[mode]` | Use specific behavioral mode (default: deep-research) | `--mode=default` |
| `--depth=[1-5]` | Research thoroughness level | `--depth=5` |
| `--format=[fmt]` | Output format (concise/detailed/json) | `--format=detailed` |
| `--save=[path]` | Save research to custom path | `--save=agent-includes/spikes/custom.md` |
| `--no-save` | Output to conversation only, don't save | `--no-save` |
| `--compare` | Focus on comparing alternatives | `--compare` |
| `--sequential` | Use sequential thinking methodology | `--sequential` |

### Depth Levels

| Level | Behavior |
|-------|----------|
| 1 | Quick overview, key points only |
| 2 | Standard analysis |
| 3 | Thorough with examples |
| 4 | Comprehensive with trade-offs |
| 5 | Exhaustive with citations |

## Output

```markdown
## Research: [Topic]

### Summary
[Overview]

### Pros
- [Pro 1]
- [Pro 2]

### Cons
- [Con 1]

### Alternatives
[Comparison table]

### Recommendation
[Clear recommendation]
```
