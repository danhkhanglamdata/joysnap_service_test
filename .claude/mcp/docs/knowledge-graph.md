# Knowledge Graph MCP Server

Local codebase analysis and symbol search.

## Connection

```json
{
  "type": "sse",
  "url": "http://localhost:27495/mcp/sse"
}
```

Requires local knowledge-graph server running on port 27495.

## Protocol Version

Compatible with MCP Protocol 2025-11-25

## Overview

Knowledge Graph MCP provides powerful codebase analysis capabilities including symbol search, reference finding, and code structure mapping. It indexes your codebase and enables fast navigation and understanding of code relationships.

## Tools

| Tool | Description |
|------|-------------|
| `search_codebase_definitions` | Find functions, classes, methods, constants |
| `get_references` | Find all usages of a symbol |
| `read_definitions` | Read complete definition bodies |
| `repo_map` | Generate API-style map of repository |
| `import_usage` | Analyze import usages across project |
| `get_definition` | Go to definition for callable symbols |
| `list_projects` | List indexed projects |
| `index_project` | Rebuild index for a project |

## Usage Examples

### Search Definitions
```
"Find the handleSubmit function"
→ search_codebase_definitions search_terms=["handleSubmit"] project_absolute_path="/path/to/project"
```

### Find References
```
"Where is calculateTotal used?"
→ get_references definition_name="calculateTotal" absolute_file_path="/path/to/file.ts"
```

### Read Definition Body
```
"Show me the UserService class"
→ read_definitions definitions=[{names: ["UserService"], file_path: "/path/to/user.ts"}]
```

### Generate Repo Map
```
"Map the src/components directory"
→ repo_map project_absolute_path="/path/to/project" relative_paths=["src/components"]
```

### Analyze Imports
```
"Where is React used?"
→ import_usage project_absolute_path="/path/to/project" packages=[{import_path: "react"}]
```

## Supported Languages

- TypeScript
- JavaScript
- Python
- Java
- Go
- Rust
- And more...

## When to Use

| Scenario | Use Knowledge Graph? |
|----------|---------------------|
| Find function definitions | Yes |
| Find all references | Yes |
| Understand code structure | Yes |
| Impact analysis | Yes |
| Refactoring preparation | Yes |
| Real-time file content | No - Use Read tool |
| Web documentation | No - Use Context7 |

## Workflow

1. **Index**: Ensure project is indexed (`index_project`)
2. **Search**: Find definitions with `search_codebase_definitions`
3. **Read**: Get full code with `read_definitions`
4. **References**: Find usages with `get_references`
5. **Map**: Understand structure with `repo_map`

## Best Practices

1. **Re-index after changes**: Run `index_project` after major changes
2. **Use search first**: Find definitions before reading
3. **Check references**: Understand impact before refactoring
4. **Use repo_map**: Get overview of unfamiliar directories

## Setup

The knowledge-graph server must be running locally:

```bash
# Start the server (check specific installation instructions)
knowledge-graph-server --port 27495
```

## Resources

- Knowledge Graph Server documentation
- SSE transport specification
