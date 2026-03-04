# Toonify MCP Server

Image toonification and cartoon-style transformation.

## Package

```bash
toonify-mcp
```

Requires `toonify-mcp` binary installed locally.

## Protocol Version

Compatible with MCP Protocol 2025-11-25

## Overview

Toonify MCP provides image transformation capabilities to convert photos and images into cartoon-style artwork. Useful for creative projects, avatar generation, and artistic image processing.

## Tools

| Tool | Description |
|------|-------------|
| `toonify` | Transform an image into cartoon style |

## Tool Parameters

### toonify

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image_path` | string | Yes | Path to the input image file |
| `style` | string | No | Cartoon style to apply |
| `output_path` | string | No | Path for the output image |

## Usage Examples

### Basic Toonification
```
"Convert this photo to cartoon style"
→ toonify with image_path="/path/to/photo.jpg"
```

### With Custom Output
```
"Toonify my avatar and save it as cartoon-avatar.png"
→ toonify with image_path="avatar.jpg", output_path="cartoon-avatar.png"
```

## Best Practices

1. **Use high-quality input images**: Better input produces better cartoon output
2. **Specify output path**: Avoid overwriting original images
3. **Check supported formats**: Ensure input image format is supported

## Integration with Skills

- Works well with `media-processing` skill for image workflows
- Combine with `frontend-design` skill for avatar generation

## When to Use

| Scenario | Use Toonify? |
|----------|--------------|
| Avatar generation | Yes |
| Creative image processing | Yes |
| Cartoon-style artwork | Yes |
| Photo editing | Depends on use case |
| Document processing | No |

## Resources

- Toonify MCP documentation (local installation)
