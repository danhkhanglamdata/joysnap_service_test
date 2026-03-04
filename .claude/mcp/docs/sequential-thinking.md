# Sequential Thinking MCP Server

Multi-step reasoning for complex problem-solving.

## Package

```bash
npx -y @modelcontextprotocol/server-sequential-thinking
```

## Protocol Version

Compatible with MCP Protocol 2025-11-25

## Overview

Sequential Thinking provides a structured approach to dynamic and reflective problem-solving through thought sequences. It enables breaking down complex problems, planning with revision capability, and maintaining context over multiple steps.

## Tools

| Tool | Description |
|------|-------------|
| `sequentialthinking` | Dynamic problem-solving through thought sequences |

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `thought` | string | Yes | Current thinking step |
| `thoughtNumber` | integer | Yes | Current thought number (1, 2, 3...) |
| `totalThoughts` | integer | Yes | Estimated total thoughts needed |
| `nextThoughtNeeded` | boolean | Yes | Whether another step is needed |
| `isRevision` | boolean | No | Whether this revises previous thinking |
| `revisesThought` | integer | No | Which thought is being reconsidered |
| `branchFromThought` | integer | No | Branching point thought number |
| `branchId` | string | No | Branch identifier |
| `needsMoreThoughts` | boolean | No | If more thoughts are needed |

## Key Features

- **Adjustable estimates**: Modify `totalThoughts` as understanding deepens
- **Revision support**: Question or revise previous thoughts with `isRevision`
- **Branching**: Explore alternative approaches with `branchFromThought`
- **Hypothesis generation**: Generate and verify solution hypotheses
- **Context maintenance**: Track thought history across steps

## When to Use

- Breaking down complex problems into steps
- Planning and design with room for revision
- Analysis that might need course correction
- Problems where full scope isn't clear initially
- Multi-step solutions requiring context
- Debugging complex issues
- Architecture decisions
- Research and investigation

## Usage Patterns

### Basic Problem Solving

```json
// Step 1: Initial analysis
{
  "thought": "Analyzing the authentication bug. The error occurs when...",
  "thoughtNumber": 1,
  "totalThoughts": 4,
  "nextThoughtNeeded": true
}

// Step 2: Identify root cause
{
  "thought": "The root cause appears to be the token expiration logic...",
  "thoughtNumber": 2,
  "totalThoughts": 4,
  "nextThoughtNeeded": true
}

// Step 3: Propose solution
{
  "thought": "Solution: Implement token refresh mechanism...",
  "thoughtNumber": 3,
  "totalThoughts": 4,
  "nextThoughtNeeded": true
}

// Step 4: Verify and conclude
{
  "thought": "Verified solution addresses the issue. Implementation steps...",
  "thoughtNumber": 4,
  "totalThoughts": 4,
  "nextThoughtNeeded": false
}
```

### With Revision

```json
// Revising previous thought
{
  "thought": "Reconsidering step 2 - the actual cause is not token expiration but...",
  "thoughtNumber": 5,
  "totalThoughts": 6,
  "nextThoughtNeeded": true,
  "isRevision": true,
  "revisesThought": 2
}
```

### With Branching

```json
// Exploring alternative approach
{
  "thought": "Alternative approach: Instead of token refresh, consider...",
  "thoughtNumber": 4,
  "totalThoughts": 6,
  "nextThoughtNeeded": true,
  "branchFromThought": 2,
  "branchId": "alternative-auth"
}
```

### Extending Analysis

```json
// Realizing more analysis needed
{
  "thought": "Need to investigate database connection pooling as well...",
  "thoughtNumber": 4,
  "totalThoughts": 6,  // Increased from 4
  "nextThoughtNeeded": true,
  "needsMoreThoughts": true
}
```

## Best Practices

1. **Start with estimate**: Begin with initial `totalThoughts` estimate, adjust as needed
2. **Be specific**: Each thought should be focused and actionable
3. **Revise freely**: Don't hesitate to question or revise previous thoughts
4. **Branch when needed**: Explore alternatives without losing main thread
5. **Mark completion**: Only set `nextThoughtNeeded: false` when truly done
6. **Filter noise**: Ignore irrelevant information in each step
7. **Verify hypotheses**: Generate and verify solution hypotheses
8. **Document reasoning**: Make thought process explicit for review

## Integration with Modes

| Mode | Usage |
|------|-------|
| `brainstorm` | Explore design options systematically |
| `deep-research` | Thorough technical investigation |
| `orchestration` | Complex multi-step parallel work |
| `implementation` | Step-by-step coding decisions |
| `review` | Systematic code analysis |

## Integration with Skills

- Combine with `debugging` skill for systematic bug analysis
- Use with `planning` skill for project decomposition
- Pair with `problem-solving` skill for complex issues
- Works well with `research` skill for investigation

## Example Scenarios

### Debugging
```
"Debug the authentication failure"
→ Sequential analysis of auth flow, token handling, session management
```

### Architecture Decision
```
"Design the microservices architecture"
→ Step-by-step evaluation of service boundaries, communication patterns, data flow
```

### Code Review
```
"Review this PR for security issues"
→ Systematic analysis of input validation, auth, data handling, dependencies
```

### Research
```
"Evaluate state management options for React"
→ Compare Redux, Zustand, Jotai with pros/cons and recommendations
```

## Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [Sequential Thinking Patterns](https://modelcontextprotocol.io/docs/tools/sequential-thinking)
