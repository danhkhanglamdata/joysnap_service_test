# Stripe Subscriptions

Recurring billing with automatic invoicing.

## Create Subscription

### Via Checkout (Recommended)
```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{
    price: 'price_monthly_xxx',
    quantity: 1,
  }],
  success_url: 'https://myapp.com/success',
  cancel_url: 'https://myapp.com/cancel',
});
```

### Via API (Custom UI)
```typescript
// 1. Create customer
const customer = await stripe.customers.create({
  email: 'user@example.com',
  payment_method: 'pm_xxx',
  invoice_settings: {
    default_payment_method: 'pm_xxx',
  },
});

// 2. Create subscription
const subscription = await stripe.subscriptions.create({
  customer: customer.id,
  items: [{ price: 'price_monthly_xxx' }],
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
});
```

## Subscription Lifecycle

```
created → active → past_due → canceled/unpaid
                 ↓
              trialing (if trial)
```

## Update Subscription

### Change Plan
```typescript
const subscription = await stripe.subscriptions.retrieve('sub_xxx');

await stripe.subscriptions.update('sub_xxx', {
  items: [{
    id: subscription.items.data[0].id,
    price: 'price_new_plan_xxx',
  }],
  proration_behavior: 'create_prorations', // or 'none'
});
```

### Cancel
```typescript
// Cancel at period end
await stripe.subscriptions.update('sub_xxx', {
  cancel_at_period_end: true,
});

// Cancel immediately
await stripe.subscriptions.cancel('sub_xxx');
```

## Webhook Events

```typescript
switch (event.type) {
  case 'customer.subscription.created':
    // New subscription
    break;
  case 'customer.subscription.updated':
    // Plan changed, status changed
    break;
  case 'customer.subscription.deleted':
    // Subscription ended
    break;
  case 'invoice.paid':
    // Successful renewal
    break;
  case 'invoice.payment_failed':
    // Payment failed - notify user
    break;
}
```

## Customer Portal

```typescript
// Create portal session for self-service
const portalSession = await stripe.billingPortal.sessions.create({
  customer: 'cus_xxx',
  return_url: 'https://myapp.com/account',
});

// Redirect to portalSession.url
```

## Trials

```typescript
const subscription = await stripe.subscriptions.create({
  customer: 'cus_xxx',
  items: [{ price: 'price_xxx' }],
  trial_period_days: 14,
  // or trial_end: Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60,
});
```

## Metered Billing

```typescript
// Report usage
await stripe.subscriptionItems.createUsageRecord('si_xxx', {
  quantity: 100,
  timestamp: Math.floor(Date.now() / 1000),
  action: 'increment', // or 'set'
});
```
