# Defense-in-Depth

## Description

Multi-layer validation strategy that makes bugs structurally impossible rather than merely fixed. After finding and fixing a bug's root cause, implement validation at every layer data passes through.

## When to Use

- After fixing any data-related bug
- Protecting critical data paths
- Preventing bug recurrence
- Building robust systems
- When single validation points have failed

---

## Core Concept

**"Validate at EVERY layer data passes through. Make the bug structurally impossible."**

Single validation points can be bypassed:
- Alternative code paths skip validation
- Refactoring accidentally removes checks
- Tests mock away the validation

Multiple layers create redundancy:
- Different layers catch different cases
- If one check fails, another catches it
- Bug becomes impossible, not just unlikely

---

## The Four-Layer Approach

### Layer 1: Entry Point Validation

Reject invalid input at API/system boundaries:

```typescript
// API endpoint - first line of defense
app.post('/orders', (req, res) => {
  // Type check
  if (typeof req.body.userId !== 'string') {
    return res.status(400).json({ error: 'userId must be a string' });
  }

  // Existence check
  if (!req.body.userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  // Format validation
  if (!isValidUUID(req.body.userId)) {
    return res.status(400).json({ error: 'userId must be a valid UUID' });
  }

  // Proceed with valid data
  orderService.createOrder(req.body);
});
```

### Layer 2: Business Logic Validation

Ensure data semantically makes sense for the operation:

```typescript
// Service layer - business rules
class OrderService {
  async createOrder(data: OrderData) {
    // Business validation
    const user = await this.userRepo.findById(data.userId);
    if (!user) {
      throw new BusinessError('User does not exist');
    }

    if (!user.canPlaceOrders) {
      throw new BusinessError('User is not allowed to place orders');
    }

    if (data.items.length === 0) {
      throw new BusinessError('Order must have at least one item');
    }

    // Proceed with valid business state
    return this.orderRepo.create(data);
  }
}
```

### Layer 3: Environment Guards

Add context-specific safeguards:

```typescript
// Repository layer - environment guards
class OrderRepository {
  async create(order: Order) {
    // Test environment guard
    if (process.env.NODE_ENV === 'test' && !process.env.ALLOW_DB_WRITES) {
      throw new Error('Database writes disabled in test environment');
    }

    // Production safety guard
    if (order.total > 100000 && !order.managerApproval) {
      throw new Error('Large orders require manager approval');
    }

    // Dangerous operation guard
    if (order.userId === SYSTEM_USER_ID) {
      throw new Error('Cannot create orders for system user');
    }

    return this.db.insert('orders', order);
  }
}
```

### Layer 4: Debug Instrumentation

Capture execution context for forensic analysis:

```typescript
// Logging layer - forensic evidence
class OrderRepository {
  async create(order: Order) {
    // Log entry for debugging
    this.logger.debug('Creating order', {
      orderId: order.id,
      userId: order.userId,
      itemCount: order.items.length,
      total: order.total,
      timestamp: new Date().toISOString(),
      requestId: context.requestId
    });

    try {
      const result = await this.db.insert('orders', order);

      this.logger.info('Order created successfully', {
        orderId: result.id,
        duration: Date.now() - start
      });

      return result;
    } catch (error) {
      this.logger.error('Order creation failed', {
        orderId: order.id,
        error: error.message,
        stack: error.stack,
        order: JSON.stringify(order)
      });
      throw error;
    }
  }
}
```

---

## Why Multiple Layers?

### Single Point Failure

```typescript
// Only one check - easily bypassed
function createOrder(data) {
  if (!data.userId) throw new Error('userId required');  // Single check
  // ...
}

// Direct repository call bypasses validation
orderRepository.create({ items: [] });  // No userId check!
```

### Multi-Layer Protection

```typescript
// Multiple checks - defense in depth
// Layer 1: API validates
// Layer 2: Service validates
// Layer 3: Repository validates

// Even if one is bypassed, others catch it
orderRepository.create({ items: [] });
// Repository throws: "userId is required"
```

---

## Implementation Strategy

When debugging, use this approach:

### 1. Trace the Data Flow

```markdown
User Input → API → Service → Repository → Database
```

### 2. Identify Checkpoints

```markdown
Where does this data pass through?
- API endpoint (Layer 1)
- Service method (Layer 2)
- Repository method (Layer 3)
- Database constraints (Layer 4)
```

### 3. Add Validation at Each

```markdown
For each checkpoint:
- What could be wrong at this point?
- What validation makes sense here?
- What error message helps debug?
```

### 4. Test Layer Independence

```markdown
Remove each layer one at a time:
- Does the bug still get caught?
- Which layer catches it?
- Is there a gap in coverage?
```

---

## Validation by Layer Type

| Layer | What to Validate | Example |
|-------|------------------|---------|
| Entry Point | Type, format, presence | `userId` is string, not empty |
| Business Logic | Semantic correctness | User exists, can place orders |
| Environment | Context-specific rules | Test mode restrictions |
| Data Access | Integrity constraints | Foreign keys, not null |

---

## Anti-Patterns

### Single Checkpoint Fallacy

```typescript
// BAD: One validation point
if (isValid(data)) {
  // Assume valid everywhere else
}
```

### Validation in Tests Only

```typescript
// BAD: Tests validate, production doesn't
beforeEach(() => {
  validateTestData(data);  // This doesn't help production
});
```

### Trust After First Check

```typescript
// BAD: Validated once, trusted forever
const validatedData = validate(input);
// ... many lines later ...
process(validatedData);  // Is it still valid?
```

---

## Checklist

After fixing any bug:

- [ ] Root cause identified
- [ ] Fix applied at source
- [ ] Layer 1 validation added (entry point)
- [ ] Layer 2 validation added (business logic)
- [ ] Layer 3 guards added (environment)
- [ ] Layer 4 logging added (instrumentation)
- [ ] Tested: removing any single layer still catches bug
- [ ] Bug is structurally impossible, not just fixed

---
