# /parallel - Run Parallel Tasks (Deprecated)

> **DEPRECATED**: This command's functionality is now fully integrated into **orchestration mode**. Use `/mode-orchestration` or `--mode=orchestration` instead.

## Migration

The `/parallel` command has been replaced by orchestration mode's built-in background task management:

| Old `/parallel` Usage | New Orchestration Equivalent |
|-----------------------|------------------------------|
| `/parallel "task"` | `background_task.start("task")` |
| `/parallel --list` | `background_task.list()` |
| `/parallel --collect` | `background_task.collect(task_id)` |
| `/parallel --cancel [id]` | `background_task.cancel(task_id)` |

Exact API names vary by runtime; use the equivalent background-task primitives in your environment.

## How to Use Orchestration Mode Instead

```bash
# Activate orchestration mode globally
/mode-orchestration

# Or use with specific commands
/do --mode=orchestration "implement feature with parallel research"
/fix --mode=orchestration "debug issue with parallel analysis"
```

Orchestration mode automatically:
- Identifies parallelizable tasks
- Spawns background agents via Task tool
- Tracks task IDs internally
- Collects and synthesizes results
- Manages dependencies between tasks

See `.claude/modes/orchestration.md` for full documentation.

---

## Legacy Usage (Still Supported)

For backwards compatibility, this command still works but internally uses orchestration mode logic.

## Purpose

Launch background tasks for parallel execution. Enables concurrent work on independent tasks with result aggregation capability.

## Usage

```
/parallel [task description | --list | --collect | --cancel [id]]
```

## Arguments

- `$ARGUMENTS`: Task description to run in parallel, or management flags (--list, --collect, --cancel)

---

Launch background task or manage running tasks.

## Parallel Operations

### Launch Task

Start a new background task:

```bash
/parallel "[task description]"
```

**Process:**
1. Analyze task for parallelizability
2. Launch a background worker/agent via the runtime task API
3. Return task ID for tracking
4. Continue main conversation

### List Tasks

Show running and completed tasks:

```bash
/parallel --list
```

### Collect Results

Collect results from completed tasks:

```bash
/parallel --collect
```

### Cancel Task

Stop a running task:

```bash
/parallel --cancel [id]
```

## Task Types

| Type | Best For | Agent Used |
|------|----------|------------|
| Research | Information gathering | general-purpose |
| Analysis | Code analysis | Explore |
| Review | Code review | general-purpose |
| Test | Test generation | general-purpose |
| Scan | Security scanning | general-purpose |

## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--list` | Show all tasks | `--list` |
| `--collect` | Gather completed results | `--collect` |
| `--cancel [id]` | Cancel running task | `--cancel task-123` |
| `--wait` | Wait for all tasks to complete | `--wait` |
| `--agent=[type]` | Specify agent type | `--agent=Explore` |
| `--priority=[high\|normal]` | Task priority | `--priority=high` |

## Usage Examples

```bash
/parallel "Research OAuth2 best practices"
/parallel "Analyze user service for performance issues"
/parallel "Security review of auth module" --agent=general-purpose
/parallel --list
/parallel --collect
/parallel --wait                    # Wait for all to complete
```
