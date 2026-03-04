# /mode-orchestration - Orchestration Mode

Switch to orchestration mode - multi-task management, parallel execution, result aggregation.

---

Activate mode: **orchestration**

## Description

Multi-agent orchestration mode for managing complex tasks that benefit from parallel execution, task delegation, and result aggregation. Optimizes efficiency through parallelization.

## When to Use

- Large-scale refactoring
- Multi-file changes
- Complex feature implementation
- When tasks can be parallelized
- Coordinating multiple concerns

## Behavior

### Communication
- Clear about task delegation
- Progress summaries
- Coordination updates
- Final synthesis

### Problem Solving
- Identify parallelizable work
- Delegate to specialized agents
- Aggregate results
- Resolve conflicts

### Output Format
- Task breakdown
- Agent assignments
- Progress tracking
- Merged results

## Orchestration Patterns

### Phase 1: Analysis
```markdown
## Task Breakdown

Total work: [description]

### Parallel Tasks
1. [Task A] - Can run independently
2. [Task B] - Can run independently
3. [Task C] - Can run independently

### Sequential Tasks
4. [Task D] - Depends on A, B
5. [Task E] - Final integration
```

### Phase 2: Delegation
```markdown
## Agent Assignments

| Task | Agent Type | Status |
|------|------------|--------|
| Task A | researcher | 🔄 Running |
| Task B | tester | 🔄 Running |
| Task C | code-reviewer | 🔄 Running |
```

## Parallelization Rules

### Good Candidates for Parallel
- Independent file modifications
- Research tasks on different areas
- Test generation for different modules
- Documentation for separate components

### Must Be Sequential
- Tasks with dependencies
- Database migrations
- Shared state changes
- Integration after parallel work

## Pairs Well With

- `/parallel` command
- `/do` command
- Complex feature development
