# Orchestration Protocol

## Core Principle: Coordination Over Parallelism

**Sequential execution with close coordination is the default.** Parallel execution is an optimization to be used sparingly and only when clearly beneficial.

## Shared State Document

**All multi-agent tasks MUST use `MULTI_AGENT_PLAN.md`** in the project root as the central coordination point.

### Before Starting
1. Read `MULTI_AGENT_PLAN.md` to understand current state
2. Update the **Current Mission** section with the goal
3. Register yourself in the **Agent Registry**
4. **Assess whether parallel execution is truly needed** (see criteria below)

### During Execution
1. Update task status in **Task Queue** as you progress
2. Record key decisions in **Shared Context**
3. Log any blockers in **Blockers & Issues**
4. **Maintain close coordination** - check for conflicts frequently

### On Handoff
1. Add entry to **Handoff Log** with context for next agent
2. Update your section in **Agent Outputs**
3. Update **Agent Registry** status to Idle

---

## Execution Mode Selection

### Default: Sequential Chaining (Preferred)

Chain subagents when tasks have dependencies or require outputs from previous steps:
- **Planning → Implementation → Testing → Review**: Use for feature development
- **Research → Design → Code → Documentation**: Use for new system components
- Each agent completes fully before the next begins
- Pass context and outputs between agents via `MULTI_AGENT_PLAN.md`

**Benefits of sequential:**
- Better context sharing between tasks
- Easier conflict detection and resolution
- Simpler integration of results
- Clearer accountability and debugging

### Parallel Execution (Use Sparingly)

**Only spawn parallel agents when ALL conditions are met:**
1. 3+ truly independent problem domains exist
2. No shared files between any tasks
3. No shared state or dependencies
4. Clear, non-overlapping scope boundaries
5. Low conflict potential (explicitly assessed)
6. Integration strategy defined upfront
7. Clear time/efficiency benefit over sequential

**Parallel execution requirements:**
- **Careful Coordination**: Ensure no file conflicts or shared resource contention
- **Merge Strategy**: Plan integration points before parallel execution begins
- **State Sync**: All parallel agents read/write to `MULTI_AGENT_PLAN.md`
- **Conflict Monitoring**: Check for conflicts after each parallel phase

---

## Runtime Adapter Contract

Use a runtime-neutral adapter for orchestration primitives:
- `start(task)`
- `status(task_id)`
- `collect(task_id)`
- `cancel(task_id)`

Adapter implementations may map these to runtime-specific APIs, but orchestration logic should depend on these normalized names.

### Fallback Rules

If runtime capabilities are incomplete:
1. If `status(task_id)` is unavailable, use sequential polling via repeated `collect(task_id)` checks or blocking collect equivalent.
2. If `collect(task_id)` is blocking-only, use sequential blocking collection.
3. If background tasks are unsupported, enforce sequential execution (no parallel agents).
4. If `cancel(task_id)` is unavailable, skip cancellation and record limitation.
5. Always surface adapter limitations in the final summary.

### Capability Decision Table

| Available capability | Required behavior |
|----------------------|-------------------|
| `start/status/collect/cancel` | Full parallel orchestration |
| `start/collect` only | Start in parallel, monitor via sequential collect polling |
| no background task start | Sequential execution only |
| no cancel | Continue without cancellation + note limitation |

---

## Handoff Protocol

When passing work to another agent:

```markdown
## Handoff: [from-agent] → [to-agent]

**Completed**:
- [What was done]

**Next Steps**:
- [What the receiving agent should do]

**Context**:
- [Important information for the next agent]

**Files**:
- `path/to/file` - [Description]
```

Record this in the **Handoff Log** section of `MULTI_AGENT_PLAN.md`.

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| 🔵 | Active - Currently working |
| 🟡 | Waiting - Blocked on dependency |
| ⚪ | Idle - Available for work |
| 🔴 | Blocked - Has unresolved issue |
| 🟢 | Complete - Task finished |
