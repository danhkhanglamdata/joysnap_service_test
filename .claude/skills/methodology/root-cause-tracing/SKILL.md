# Root Cause Tracing

## Description

Debugging technique for bugs that manifest deep in execution stacks. Systematically trace backward through the call chain to identify the original trigger, rather than fixing symptoms at the point of failure.

## When to Use

- Errors occur far from entry points
- Data corruption with unclear source
- Need to identify which code path triggers failures
- Stack traces show multiple levels of indirection
- "It was already wrong by the time it got here"

---

## Core Principle

**"Trace backward through the call chain until you find the original trigger, then fix at the source."**

The error location is rarely the bug location:

```
User Input → Validation → Service → Repository → Database
    ^                                    ^
    |                                    |
 Bug HERE                         Error appears HERE
 (bad input allowed)              (constraint violation)
```

Fixing at the database layer treats the symptom. Fixing at validation prevents the bug.

---

## The Tracing Methodology

### Step 1: Identify Observable Error

Document exactly what you see:

```markdown
Error: "Cannot insert NULL into column 'user_id'"
Location: database-repository.ts:156
Stack trace: [full trace]
```

### Step 2: Locate Immediate Cause

Find the code directly responsible:

```typescript
// database-repository.ts:156
async function insertOrder(order: Order) {
  await db.insert('orders', {
    user_id: order.userId,  // <- This is NULL
    // ...
  });
}
```

### Step 3: Trace One Level Up

Who called this function? What did they pass?

```typescript
// order-service.ts:89
async function createOrder(orderData: OrderData) {
  const order = new Order(orderData);
  await repository.insertOrder(order);  // <- Called from here
}
```

### Step 4: Continue Tracing

Keep going up the call chain:

```typescript
// order-controller.ts:45
async function handleCreateOrder(req: Request) {
  const orderData = req.body;  // <- userId might be missing here
  await orderService.createOrder(orderData);
}
```

### Step 5: Find Original Source

Reach the entry point where the problem originated:

```typescript
// The real bug: No validation at entry point
// req.body.userId was never validated
```

---

## Instrumentation Techniques

When manual analysis fails, add diagnostic logging:

### Strategic Console.error

```typescript
// Add before suspicious operations
console.error('[TRACE] order-service.createOrder input:', {
  orderData,
  hasUserId: !!orderData.userId,
  stack: new Error().stack
});
```

### Stack Trace Capture

```typescript
// Capture where a value came from
function setUserId(id: string | null) {
  if (id === null) {
    console.error('[TRACE] userId set to null from:', new Error().stack);
  }
  this.userId = id;
}
```

### Boundary Logging

```typescript
// Log at every system boundary
async function callExternalApi(params) {
  console.error('[TRACE] API request:', params);
  const response = await fetch(url, params);
  console.error('[TRACE] API response:', response.status, await response.text());
  return response;
}
```

### Environment/Context Logging

```typescript
console.error('[TRACE] Context:', {
  env: process.env.NODE_ENV,
  timestamp: new Date().toISOString(),
  requestId: context.requestId,
  userId: context.user?.id
});
```

---

## Finding the Instrumentation Output

After adding logging:

```bash
# Run tests and rg for traces
npm test 2>&1 | rg "\[TRACE\]"

# Or run specific test
npm test -- --grep "failing test" 2>&1 | rg "\[TRACE\]"
```

---

## Common Root Cause Locations

| Where Error Appears | Where Bug Often Is |
|--------------------|--------------------|
| Database constraint | Input validation |
| Type error in service | Data transformation |
| Null reference | Optional field handling |
| API timeout | Connection pool config |
| Memory error | Resource cleanup |

---

## Defense-in-Depth Integration

After finding root cause, add validation at multiple layers:

```typescript
// Layer 1: Entry point
function handleRequest(req) {
  if (!req.body.userId) {
    throw new ValidationError('userId required');
  }
}

// Layer 2: Service
function createOrder(data) {
  assert(data.userId, 'userId must be provided to createOrder');
}

// Layer 3: Repository
function insertOrder(order) {
  assert(order.userId, 'Cannot insert order without userId');
}
```

See `defense-in-depth` skill for comprehensive approach.

---

## Critical Warning

**"NEVER fix just where the error appears."**

Fixing at the error location:
- Treats symptom, not cause
- Leaves bug available to trigger from other paths
- Creates false confidence
- Guarantees the bug will return

Fixing at the source:
- Prevents the bug entirely
- Protects all code paths
- Creates robust system
- Actually solves the problem

---

## Tracing Checklist

- [ ] Error message and location documented
- [ ] Immediate cause identified
- [ ] Call chain traced backward
- [ ] Original source found
- [ ] Instrumentation added if needed
- [ ] Fix applied at source (not symptom)
- [ ] Defense-in-depth validation added
- [ ] Test proves fix works

---
