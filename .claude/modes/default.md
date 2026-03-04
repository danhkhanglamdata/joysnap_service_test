# Default Mode

## Description

Standard balanced mode for general development tasks. This is the baseline behavior that provides a good mix of thoroughness and efficiency.

## When Active

This mode is active by default unless another mode is explicitly specified.

---

## Behavior

### Communication
- Clear, concise responses
- Balance between explanation and action
- Standard code comments where helpful

### Problem Solving
- Balanced analysis depth
- Standard verification steps
- Normal iteration cycles

### Output Format
- Full code blocks with context
- Explanations where helpful
- Standard documentation level

---

## Activation

This mode is active by default. No activation needed.

To switch to another mode:
```
Use mode: [mode-name]
```

Or use command flags:
```
/command --mode=default
```

---

## MCP Integration

This mode uses MCP servers as needed based on task requirements:

### Context7
```
For library documentation lookup:
- Fetch current API documentation
- Get accurate patterns and examples
```

### Sequential Thinking
```
For complex problem-solving:
- Break down multi-step problems
- Track reasoning chains
```

### Filesystem
```
For file operations:
- Read and write files securely
- Search codebase patterns
```

---

## Compatible With

All commands and workflows. This mode provides baseline behavior that other modes modify.
