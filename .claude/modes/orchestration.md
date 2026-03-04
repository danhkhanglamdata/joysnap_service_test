# Orchestration Mode

## Description

Multi-agent coordination mode for managing complex tasks that benefit from parallel execution, task delegation, and result aggregation. **This mode handles all parallel execution internally** using background-task primitives.

## When to Use

- Large-scale refactoring across 5+ files
- Complex feature implementation with distinct, independent modules
- Coordinating multiple concerns that are truly isolated
- **Only when parallel execution provides clear benefit over sequential**

## When NOT to Use (Prefer Sequential)

- Tasks with fewer than 3 independent problem domains
- Changes that touch shared code or state
- Investigation/debugging requiring iterative discovery
- When coordination between changes is critical
- Simple tasks that can be done directly without delegation

---

## Behavior

### Communication
- Task delegation clarity
- Progress aggregation
- Coordination updates
- Final synthesis

### Problem Solving
- Identify parallelizable work
- **Spawn background workers via runtime task API**
- **Track task IDs internally**
- Aggregate results
- Resolve conflicts

### Output Format
- Task breakdown
- Agent assignments with task IDs
- Progress tracking
- Consolidated results

---

## Runtime Adapter Contract (Core Logic)

**Orchestration mode manages parallel execution through a runtime adapter layer.**

All runtimes should expose these normalized primitives:
- `start(task)` → start work and return `task_id`
- `status(task_id)` → get non-blocking progress/state
- `collect(task_id)` → collect result payload (blocking or non-blocking by runtime)
- `cancel(task_id)` → request cancellation

Use runtime-specific equivalents (for example, `background_task.start(...)`) behind this contract.

### Fallback Behavior (Required)

When a runtime cannot provide full background-task support:
- If `status(task_id)` is unavailable, use **sequential polling via repeated `collect(task_id)` checks** or the runtime's blocking collect equivalent.
- If `collect(task_id)` is only blocking, treat collection as **sequential blocking collect**.
- If background tasks are unsupported entirely, **enforce sequential execution** (no parallel spawning).
- Always include any adapter limitation in the final orchestration summary.

### Capability Decision Table

| Runtime Capability | Orchestration Behavior |
|--------------------|------------------------|
| `start` + `status` + `collect` + `cancel` | Full parallel orchestration |
| `start` + `collect` (no `status`) | Parallel start, sequential polling/collect fallback |
| `start` unsupported | Sequential-only execution |
| `cancel` unsupported | Continue without cancellation; document limitation |

### Spawning Background Workers

Use your runtime adapter with non-blocking execution when supported:

```python
# Spawn parallel workers directly
task_auth = runtime_adapter.start(
    task={
        "description": "Research authentication patterns",
        "worker_type": "general-purpose",
    }
)  # Returns task_id: "task-abc123"

task_security = runtime_adapter.start(
    task={
        "description": "Analyze current security",
        "worker_type": "general-purpose",
    }
)  # Returns task_id: "task-def456"
```

### Task ID Management

Track all spawned tasks in a registry:

```markdown
## Active Task Registry

| Task ID | Description | Agent Type | Status |
|---------|-------------|------------|--------|
| task-abc123 | Research auth patterns | general-purpose | 🔄 Running |
| task-def456 | Analyze security | general-purpose | 🔄 Running |
| task-ghi789 | Review competitors | Explore | ✅ Complete |
```

### Monitoring and Collecting Results

Use adapter status checks and result collection primitives:

```python
# Non-blocking status check (if available)
runtime_adapter.status(task_id="task-abc123")

# Collect result (blocking or non-blocking by runtime)
runtime_adapter.collect(task_id="task-abc123")
```
---

## Orchestration Pattern

### Phase 1: Analysis & Decomposition
```markdown
## Task Decomposition

Total work: [description]

### Parallelizable Tasks (spawn in parallel)
1. [Task A] - Can run independently → spawn background agent
2. [Task B] - Can run independently → spawn background agent
3. [Task C] - Can run independently → spawn background agent

### Sequential Tasks (wait for dependencies)
4. [Task D] - Depends on A, B → wait, then execute
5. [Task E] - Final integration → execute last
```

### Phase 2: Spawn & Track
```markdown
## Agent Spawning

Launching parallel agents via runtime background task API:

| Task | Agent Type | Task ID | Status |
|------|------------|---------|--------|
| Research auth | general-purpose | task-abc123 | 🔄 Running |
| Analyze security | Explore | task-def456 | 🔄 Running |
| Review code | general-purpose | task-ghi789 | 🔄 Running |

All independent tasks spawned in parallel.
```

### Phase 3: Monitor & Collect
```markdown
## Progress Monitoring

Checking task status via `runtime_adapter.status(task_id)`:

| Task ID | Status | Progress |
|---------|--------|----------|
| task-abc123 | 🔄 Running | 60% |
| task-def456 | ✅ Complete | 100% |
| task-ghi789 | 🔄 Running | 40% |

Collecting completed results...
```

### Phase 4: Aggregation & Synthesis
```markdown
## Results

### Task A (task-abc123): Complete ✅
- Findings: [summary from collected task result]

### Task B (task-def456): Complete ✅
- Results: [summary from collected task result]

### Task C (task-ghi789): Complete ✅
- Findings: [summary from collected task result]

### Synthesis
[Combined conclusions and next steps]
```

---

## Activation

```
Use mode: orchestration
```

Or use command flag:
```
/do --mode=orchestration [desc]
/do --mode=orchestration [task]
```

---

## Task Parallelization Rules

### Coordination-First Principle

**Sequential execution is the default.** Parallel execution is an optimization, not a starting point.

Before considering parallel execution, ask:
1. Will parallel execution actually save time?
2. Can results be cleanly integrated?
3. Is the coordination overhead worth it?

### Prerequisites for Parallel Execution

All conditions must be met:
- [ ] 3+ truly independent problem domains
- [ ] No shared files between any tasks
- [ ] No shared state or dependencies
- [ ] Clear, non-overlapping scope boundaries
- [ ] Low conflict potential (assessed explicitly)
- [ ] Integration strategy defined upfront

### Good Candidates for Parallel
- Independent file modifications in separate directories
- Research tasks across completely different areas
- Test generation for isolated, unrelated modules
- Documentation for separate, standalone components

### Must Be Sequential
- Tasks with any dependencies
- Database migrations
- Changes to shared state or utilities
- Integration after parallel work
- Debugging/investigation (requires iterative discovery)
- Changes that might affect each other

### Decision Matrix

| Condition | Parallelize? |
|-----------|--------------|
| No shared files | ✅ Yes |
| Independent modules | ✅ Yes |
| Shared dependencies | ❌ No |
| Order matters | ❌ No |
| Can merge results | ✅ Yes |

---

## Quality Gates

Between parallel phases:
1. Verify all agents completed
2. Check for conflicts
3. Review combined results
4. Run integration tests
5. Proceed to next phase

```markdown
## Quality Gate: Phase 1 → Phase 2

### Completion Check
- [x] Agent A: Complete
- [x] Agent B: Complete
- [x] Agent C: Complete

### Conflict Check
- [x] No file conflicts
- [x] No logical conflicts
- [x] Results consistent

### Proceeding to Phase 2...
```

---

## MCP Integration

This mode leverages MCP servers for coordinated multi-agent work:

### Sequential Thinking (Primary)
```
ALWAYS use Sequential Thinking in orchestration mode:
- Plan task decomposition systematically
- Track parallel execution progress
- Coordinate agent handoffs
- Synthesize results from multiple agents
```

### Filesystem
```
For coordinated file operations:
- Track file ownership across agents
- Prevent conflicts in parallel execution
- Verify integration results
```

### Memory (Mem0)
```
For cross-agent context:
- Store task assignments and status
- Share findings between agents
- Persist orchestration state
```

---

## Combines Well With

- `/do` command (uses orchestration by default)
- `/fix` command with `--mode=orchestration`
- Complex feature development
- Multi-file refactoring

---

## Worker Types (Runtime-Specific)

When spawning background workers, map runtime-specific worker types to your environment:

| Example Worker Type | Best For |
|---------------------|----------|
| `general-purpose` | Multi-step tasks, research, implementation |
| `Explore` | Codebase exploration, finding files |
| `Bash` | Command execution, git operations |
| `Plan` | Architecture planning, design decisions |

### Example: Full Orchestration Flow

```python
# Phase 1: Spawn parallel research workers
task1 = background_task.start(
    description="Research OAuth2 best practices for our stack",
    worker_type="general-purpose"
)

task2 = background_task.start(
    description="Explore current auth implementation in src/auth/",
    worker_type="Explore"
)

task3 = background_task.start(
    description="Find security vulnerabilities in auth module",
    worker_type="general-purpose"
)

# Phase 2: Collect results
result1 = background_task.collect(task_id=task1.id)
result2 = background_task.collect(task_id=task2.id)
result3 = background_task.collect(task_id=task3.id)

# Phase 3: Synthesize and implement (sequential)
# ... implementation based on collected results
```

---

## Migration from /parallel

The `/parallel` command functionality is now **fully integrated** into orchestration mode:

| Old `/parallel` Usage | New Orchestration Equivalent |
|-----------------------|------------------------------|
| `/parallel "task"` | `background_task.start(description="task")` |
| `/parallel --list` | `background_task.list()` *(or runtime equivalent)* |
| `/parallel --collect` | `background_task.collect(task_id)` |
| `/parallel --cancel [id]` | `background_task.cancel(task_id)` |

**Benefits of integrated approach:**
- Single mode handles all parallel execution
- Automatic dependency management
- Built-in quality gates
- Unified task tracking
