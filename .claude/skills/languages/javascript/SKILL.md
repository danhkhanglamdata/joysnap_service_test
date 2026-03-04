# JavaScript

## Description

Modern JavaScript (ES6+) patterns and best practices for Node.js and browser environments.

## When to Use

- Working with JavaScript files (.js, .mjs)
- Browser scripting
- Node.js applications without TypeScript

---

## Core Patterns

### Modern Syntax

```javascript
// Destructuring
const { name, email } = user;
const [first, ...rest] = items;

// Spread operator
const merged = { ...defaults, ...options };
const combined = [...array1, ...array2];

// Template literals
const message = `Hello, ${name}!`;

// Optional chaining and nullish coalescing
const city = user?.address?.city ?? 'Unknown';
```

### Async Patterns

```javascript
// Async/await
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Fetch failed');
  return response.json();
}

// Promise.all for parallel
const results = await Promise.all([
  fetchData(url1),
  fetchData(url2),
]);

// Error handling
try {
  const data = await fetchData(url);
} catch (error) {
  console.error('Failed:', error.message);
}
```

### Array Methods

```javascript
// Map, filter, reduce
const names = users.map(u => u.name);
const active = users.filter(u => u.active);
const total = items.reduce((sum, i) => sum + i.price, 0);

// Find and includes
const user = users.find(u => u.id === id);
const hasAdmin = users.some(u => u.role === 'admin');
```

### Classes

```javascript
class UserService {
  #db; // Private field

  constructor(database) {
    this.#db = database;
  }

  async findById(id) {
    return this.#db.users.find(u => u.id === id);
  }
}
```

## Best Practices

1. Use `const` by default, `let` when needed
2. Avoid `var` - use block-scoped declarations
3. Use arrow functions for callbacks
4. Handle all promise rejections
5. Use ESLint for consistent style

## Common Pitfalls

- **Implicit type coercion**: Use `===` instead of `==`
- **Callback hell**: Use async/await
- **Mutating objects**: Create new objects with spread
- **Not handling errors**: Always catch promise rejections
