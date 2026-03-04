# /docs - Documentation Generation

## Purpose

Create or update documentation including API docs, README files, code comments, and technical specifications.

## Default Mode

**This command uses `--mode=review` by default** for critical analysis of documentation quality. Override with `--mode=default` for standard behavior.

## Usage

```
/docs [target | 'api' | 'readme' | 'changelog']
```

## Arguments

- `$ARGUMENTS`:
  - File/function path: Document specific code
  - `api`: Generate API documentation
  - `readme`: Update README file
  - `changelog`: Generate changelog from commits

---

Generate documentation for: **$ARGUMENTS**

## Setup
- If saving to `agent-includes/` directory and it doesn't exist, create it first:
  ```bash
  mkdir -p agent-includes/specs agent-includes/plans
  ```

## Workflow

+### Step 0: Detect Repo Type

Classify the repository before generating docs:
- **Spec-only repo**: `.claude/` present **and** no app/runtime roots (e.g., no `src/`, `app/`, `api/`, `lib/`, `services/`, `package.json`, `pyproject.toml`, `requirements.txt` at repo root).
- **Runtime repo**: any app/runtime root present (e.g., `src/`, `app/`, `api/`, `lib/`, `services/`) or language manifests in repo root.

Apply the rules below based on repo type.

### For Code Documentation

1. **Analyze Code**
   - Read the code thoroughly
   - Understand purpose and behavior
   - Identify inputs and outputs
   - Note side effects

2. **Generate Documentation**
   - **Spec-only repo**:
     - Add docstrings/JSDoc only when explicitly requested
     - Update existing docs (README, ARCHITECTURE) instead of creating new files
     - Document edge cases only when required
     - Add type annotations only when part of the requested change
   - **Runtime repo**:
     - Add docstrings/JSDoc where code lacks basic documentation
     - Create new docs only when the user asks for them or a command flag requires it
     - Include edge cases for public APIs and external interfaces
     - Add type annotations only when it improves clarity and matches existing style

### For API Documentation

1. **Find All Endpoints**
   - Scan route definitions
   - Identify HTTP methods
   - Note authentication requirements

2. **Document Each Endpoint**
   - Request format
   - Response format
   - Error responses
   - Examples

### For README

1. **Analyze Project**
   - Purpose and features
   - Installation steps
   - Usage examples
   - Configuration

2. **Generate/Update**
   - Clear structure
   - Working examples
   - Up-to-date info
   - **Spec-only repo**: Prefer small, targeted edits over full rewrites
   - **Runtime repo**: Update sections that are stale or incomplete; avoid full rewrites unless explicitly requested

### For Changelog

1. **Analyze Commits**
   ```bash
   git log --oneline --since="last release"
   ```

2. **Categorize Changes**
   - Added
   - Changed
   - Fixed
   - Removed
   - **Spec-only repo**: Avoid generating a new changelog file unless explicitly requested
   - **Runtime repo**: Generate or update changelog only when the user asks for it (or uses `changelog` target)

## Templates

### Python Docstring
```python
def calculate_discount(price: float, percentage: float) -> float:
    """
    Calculate discounted price.

    Args:
        price: Original price in dollars.
        percentage: Discount percentage (0-100).

    Returns:
        The discounted price.

    Raises:
        ValueError: If percentage is not between 0 and 100.

    Example:
        >>> calculate_discount(100.0, 20)
        80.0
    """
```

### TypeScript JSDoc
```typescript
/**
 * Calculate discounted price.
 *
 * @param price - Original price in dollars
 * @param percentage - Discount percentage (0-100)
 * @returns The discounted price
 * @throws {RangeError} If percentage is not between 0 and 100
 *
 * @example
 * calculateDiscount(100, 20); // returns 80
 */
```

### API Endpoint
```markdown
## POST /api/orders

Create a new order.

### Authentication
Requires Bearer token.

### Request Body
```json
{
  "items": [
    { "productId": "123", "quantity": 2 }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  }
}
```

### Response (201 Created)
```json
{
  "id": "order_456",
  "status": "pending",
  "total": 99.99,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Errors
| Status | Code | Description |
|--------|------|-------------|
| 400 | INVALID_ITEMS | Items array is empty |
| 401 | UNAUTHORIZED | Invalid or missing token |
| 422 | OUT_OF_STOCK | Item not available |
```

### README Section
```markdown
## Installation

```bash
npm install my-package
```

## Quick Start

```typescript
import { Client } from 'my-package';

const client = new Client({ apiKey: 'your-key' });
const result = await client.fetch();
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | required | Your API key |
| `timeout` | number | 5000 | Request timeout in ms |
```

### Changelog Entry
```markdown
## [1.2.0] - 2024-01-15

### Added
- Password reset functionality (#123)
- Email verification for new accounts

### Changed
- Improved error messages for validation failures
- Updated dependencies to latest versions

### Fixed
- Race condition in session handling (#456)
- Incorrect timezone in date displays
```

## Output

### Documentation Report

```markdown
## Documentation Updated

### Files Modified
- `src/services/auth.ts` - Added JSDoc comments
- `agent-includes/specs/api/auth.md` - New API documentation
- `README.md` - Updated configuration section

### Documentation Added

#### Code Comments
- `AuthService.login()` - Full JSDoc with examples
- `AuthService.logout()` - Parameter documentation
- `validateToken()` - Return type and exceptions

#### API Documentation
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh

### Coverage
- Functions documented: 15/18 (83%)
- Endpoints documented: 12/12 (100%)

### Next Steps
1. Add examples to remaining functions
2. Create getting started guide
3. Add architecture diagram
```

<!-- CUSTOMIZATION POINT -->
## Variations

Modify behavior via CLAUDE.md:
- Documentation format
- Required sections
- Example requirements
- API documentation tool

## Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--mode=[mode]` | Use specific behavioral mode | `--mode=implementation` |
| `--format=[fmt]` | Output format (concise/detailed) | `--format=detailed` |
| `--type=[type]` | Documentation type | `--type=api` |
| `--save=[path]` | Save documentation to file | `--save=agent-includes/specs/API.md` |
| `--depth=[1-5]` | Documentation thoroughness | `--depth=3` |
