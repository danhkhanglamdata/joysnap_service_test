---
name: polar
description: Payment & billing platform for software monetization - subscriptions, one-time purchases, usage-based billing, Merchant of Record (global tax compliance). Use when selling digital products, managing subscriptions, handling global payments, or integrating with Next.js/React apps.
---

# Polar

Comprehensive payment & billing platform for software monetization with Merchant of Record services.

## When to Use

- Selling digital products (SaaS, downloads, licenses)
- Subscription management
- Global payments with tax compliance
- Usage-based billing
- Customer portal integration

## Quick Start

### Installation
```bash
npm install @polar-sh/sdk
# or
npx polar-init  # Next.js quickstart
```

### Basic Setup
```typescript
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "production" // or "sandbox"
});

// Create checkout
const checkout = await polar.checkouts.create({
  productId: "prod_xxx",
  successUrl: "https://myapp.com/success"
});
```

## Features

| Feature | Description |
|---------|-------------|
| Merchant of Record | Global tax compliance (VAT, GST, sales tax) |
| Subscriptions | Recurring billing with lifecycle management |
| One-time | Single purchases, digital downloads |
| Usage-based | Metered billing |
| Benefits | License keys, file downloads, custom |

## Environments

| Environment | API | Dashboard |
|-------------|-----|-----------|
| Production | `https://api.polar.sh/v1/` | `https://polar.sh` |
| Sandbox | `https://sandbox-api.polar.sh/v1/` | `https://sandbox.polar.sh` |

## Test Cards (Sandbox)

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## References

- `references/overview.md` - Platform overview, authentication
- `references/products.md` - Product configuration
- `references/checkouts.md` - Checkout flow
- `references/subscriptions.md` - Subscription management
- `references/webhooks.md` - Event handling
- `references/benefits.md` - Benefit distribution
- `references/sdk.md` - SDK patterns
- `references/best-practices.md` - Security, error handling

## Framework Adapters

- Next.js: `@polar-sh/nextjs`
- BetterAuth: `@polar-sh/better-auth`
- Laravel, Remix, Astro, SvelteKit, etc.

## Resources

- Docs: https://polar.sh/docs
- API Reference: https://polar.sh/docs/api-reference
