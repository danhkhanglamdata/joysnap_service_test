# Stripe Webhooks

Event-driven notifications for payment lifecycle.

## Setup

### 1. Create Endpoint
Dashboard → Developers → Webhooks → Add endpoint

### 2. Select Events
Essential events:
- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### 3. Get Webhook Secret
Copy `whsec_xxx` from endpoint details.

## Handler Implementation

### Next.js App Router
```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed');
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return new Response('Webhook handler failed', { status: 500 });
  }

  return new Response('OK', { status: 200 });
}
```

### Express
```typescript
import express from 'express';

app.post('/webhooks/stripe', 
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Handle event...
    
    res.json({ received: true });
  }
);
```

## Common Event Handlers

```typescript
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;
  const customerEmail = session.customer_details?.email;
  
  // Fulfill order
  await db.orders.update({
    where: { id: orderId },
    data: { status: 'paid', stripeSessionId: session.id },
  });
  
  // Send confirmation email
  await sendEmail(customerEmail, 'order-confirmation', { orderId });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Extend subscription access
  await db.users.update({
    where: { stripeCustomerId: customerId },
    data: { subscriptionStatus: 'active' },
  });
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Revoke access
  await db.users.update({
    where: { stripeCustomerId: customerId },
    data: { subscriptionStatus: 'canceled' },
  });
}
```

## Testing Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
```

## Best Practices

1. **Always verify signatures** - Prevents spoofed events
2. **Return 200 quickly** - Process async if needed
3. **Handle idempotency** - Events may be sent multiple times
4. **Log event IDs** - For debugging and audit
5. **Use metadata** - Link Stripe objects to your data
