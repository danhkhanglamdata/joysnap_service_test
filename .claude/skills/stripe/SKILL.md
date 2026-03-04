---
name: stripe
description: Global payment processing platform - subscriptions, one-time payments, invoicing, Connect (marketplaces), Checkout, Elements, webhooks. Use when integrating payments, managing subscriptions, building marketplaces, or handling global transactions.
---

# Stripe

Global payment processing platform for internet businesses.

## API Version

Stripe API 2025-11-15

## When to Use

- One-time payments (Checkout, Payment Intents)
- Subscription billing
- Marketplace payments (Connect)
- Invoicing
- Payment Elements (custom UI)

## Quick Start

### Installation
```bash
npm install stripe @stripe/stripe-js
```

### Server Setup (Node.js)
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
const session = await stripe.checkout.sessions.create({
  mode: 'payment', // or 'subscription'
  line_items: [{
    price: 'price_xxx',
    quantity: 1,
  }],
  success_url: 'https://myapp.com/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://myapp.com/cancel',
});
```

### Client Setup (React)
```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Redirect to Checkout
const stripe = await stripePromise;
await stripe.redirectToCheckout({ sessionId });
```

## Core Concepts

| Concept | Description |
|---------|-------------|
| Checkout | Hosted payment page |
| Payment Intent | Server-side payment flow |
| Setup Intent | Save payment method for later |
| Subscription | Recurring billing |
| Customer | Saved payment methods, history |
| Price | Pricing configuration |
| Product | What you're selling |

## Payment Flows

### Checkout (Simplest)
```
Client → Server (create session) → Redirect to Stripe → Webhook → Success
```

### Payment Intent (Custom UI)
```
Server (create intent) → Client (confirm with Elements) → Webhook → Success
```

### Subscription
```
Create Customer → Create Subscription → Handle lifecycle via webhooks
```

## Webhooks

```typescript
// Verify webhook signature
const event = stripe.webhooks.constructEvent(
  body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);

switch (event.type) {
  case 'checkout.session.completed':
    // Fulfill order
    break;
  case 'invoice.paid':
    // Subscription renewed
    break;
  case 'customer.subscription.deleted':
    // Subscription cancelled
    break;
}
```

## Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Decline |
| `4000 0025 0000 3155` | 3D Secure required |
| `4000 0000 0000 9995` | Insufficient funds |

## Environment Variables

```env
STRIPE_SECRET_KEY=sk_test_xxx        # Server-side
STRIPE_PUBLISHABLE_KEY=pk_test_xxx   # Client-side
STRIPE_WEBHOOK_SECRET=whsec_xxx      # Webhook verification
```

## References

- `references/checkout.md` - Checkout Sessions
- `references/subscriptions.md` - Subscription billing
- `references/payment-intents.md` - Custom payment flows
- `references/webhooks.md` - Event handling
- `references/connect.md` - Marketplace payments

## Best Practices

1. **Always verify webhooks** - Use `constructEvent` with signature
2. **Idempotency keys** - Prevent duplicate charges
3. **Test mode first** - Use `sk_test_` keys
4. **Handle failures** - Implement retry logic
5. **PCI compliance** - Never log card numbers

## Resources

- Docs: https://stripe.com/docs
- API Reference: https://stripe.com/docs/api
- Dashboard: https://dashboard.stripe.com
