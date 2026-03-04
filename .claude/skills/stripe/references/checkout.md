# Stripe Checkout

Hosted payment page - fastest integration path.

## Create Checkout Session

### One-time Payment
```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'T-shirt',
        images: ['https://example.com/shirt.png'],
      },
      unit_amount: 2000, // $20.00 in cents
    },
    quantity: 1,
  }],
  success_url: 'https://myapp.com/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://myapp.com/cancel',
});
```

### With Existing Price
```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{
    price: 'price_xxx', // Created in Dashboard or API
    quantity: 1,
  }],
  success_url: 'https://myapp.com/success',
  cancel_url: 'https://myapp.com/cancel',
});
```

### Subscription
```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{
    price: 'price_monthly_xxx',
    quantity: 1,
  }],
  success_url: 'https://myapp.com/success',
  cancel_url: 'https://myapp.com/cancel',
  customer: 'cus_xxx', // Optional: existing customer
});
```

## Metadata & Custom Fields

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  metadata: {
    order_id: '12345',
    user_id: 'user_abc',
  },
  custom_fields: [{
    key: 'notes',
    label: { type: 'custom', custom: 'Order notes' },
    type: 'text',
    optional: true,
  }],
  success_url: 'https://myapp.com/success',
  cancel_url: 'https://myapp.com/cancel',
});
```

## Retrieve Session After Payment

```typescript
// In success page or webhook
const session = await stripe.checkout.sessions.retrieve(sessionId, {
  expand: ['line_items', 'customer'],
});

const customerEmail = session.customer_details?.email;
const amountTotal = session.amount_total;
```

## Client Redirect

```typescript
// React/Next.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

async function handleCheckout() {
  const response = await fetch('/api/checkout', { method: 'POST' });
  const { sessionId } = await response.json();
  
  const stripe = await stripePromise;
  await stripe.redirectToCheckout({ sessionId });
}
```

## Webhook Handling

```typescript
// POST /api/webhooks/stripe
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Fulfill order using session.metadata
    await fulfillOrder(session.metadata.order_id);
  }
  
  return new Response('OK');
}
```
