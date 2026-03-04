# Repomix MCP Server

Repository packaging for AI analysis.

## Package

```bash
npx -y repomix --mcp
```

No environment variables required.

## Protocol Version

Compatible with MCP Protocol 2025-11-25

## Overview

Repomix packages codebases into AI-optimized formats for analysis, code review, documentation generation, and understanding large repositories. It consolidates code into a single file with security scanning and compression support.

## Tools

| Tool | Description |
|------|-------------|
| `pack_codebase` | Package a local directory into consolidated file |
| `pack_remote_repository` | Package a GitHub repository |
| `generate_skill` | Create Claude Agent Skills from codebases |
| `attach_packed_output` | Attach existing packed output for analysis |
| `read_repomix_output` | Read contents of packed output |
| `grep_repomix_output` | Search patterns in packed output |
| `file_system_read_file` | Read a file with security validation |
| `file_system_read_directory` | List directory contents |

## Usage Examples

### Pack Local Codebase
```
"Package the src directory for analysis"
→ pack_codebase directory="/path/to/project" includePatterns="src/**/*.ts"
```

### Pack GitHub Repository
```
"Analyze the React repository"
→ pack_remote_repository remote="facebook/react" includePatterns="packages/react/**/*.js"
```

### Generate Skill
```
"Create a skill from this codebase"
→ generate_skill directory="/path/to/project" skillName="my-project-reference"
```

### Search Packed Output
```
"Find all API endpoints"
→ grep_repomix_output outputId="abc123" pattern="@(Get|Post|Put|Delete)"
```

## Output Formats

| Format | Description |
|--------|-------------|
| `xml` | Structured with `<file>` tags (default) |
| `markdown` | Human-readable with code blocks |
| `json` | Machine-readable key-value pairs |
| `plain` | Simple text with separators |

## Compression

Enable Tree-sitter compression to reduce token usage by ~70%:
- Extracts essential code signatures
- Removes implementation details
- Preserves semantic meaning

```
pack_codebase directory="/path" compress=true
```

## When to Use

| Scenario | Use Repomix? |
|----------|--------------|
| Code review | Yes |
| Documentation generation | Yes |
| Bug investigation | Yes |
| Understanding large codebases | Yes |
| GitHub repo analysis | Yes |
| Creating reference skills | Yes |
| Real-time file editing | No - Use Read/Edit tools |

## Best Practices

1. **Use include patterns**: Focus on relevant files only
2. **Enable compression**: For large repos, use `compress=true`
3. **Use rg for search**: More efficient than reading entire output
4. **Generate skills**: Create reusable reference documentation

## Resources

- [Repomix GitHub](https://github.com/yamadashy/repomix)
- [Repomix Documentation](https://repomix.com/)
