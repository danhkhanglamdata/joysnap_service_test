---
name: sepay
description: Vietnamese payment automation platform - VietQR, NAPAS QR, bank cards, bank transfers, virtual accounts. Use when integrating payments for Vietnamese market, generating QR codes, handling webhooks, or automating bank transaction verification.
---

# SePay

Vietnamese payment automation platform serving as intermediary between applications and banks.

## When to Use

- Integrating payments for Vietnamese market
- VietQR/NAPAS QR code generation
- Bank transfer verification
- Virtual account payments
- Real-time transaction webhooks

## Quick Start

### Authentication
```bash
Authorization: Bearer {API_TOKEN}
Content-Type: application/json
```

### Generate VietQR
```bash
POST https://qr.sepay.vn/img
{
  "bank": "VCB",
  "acc_no": "1234567890",
  "amount": 100000,
  "description": "Order #123"
}
```

## Payment Methods

| Method | Use Case |
|--------|----------|
| VietQR | QR code bank transfers (most common) |
| NAPAS QR | National payment gateway |
| Bank Cards | Visa/Mastercard/JCB |
| Virtual Accounts | Order-specific exact matching |

## Environments

| Environment | Endpoint |
|-------------|----------|
| Sandbox | `https://sandbox.pay.sepay.vn/v1/init` |
| Production | `https://pay.sepay.vn/v1/init` |

## References

- `references/overview.md` - Platform overview, authentication
- `references/api.md` - API endpoints, request/response
- `references/qr-codes.md` - QR generation patterns
- `references/webhooks.md` - Webhook setup, verification
- `references/sdk.md` - SDK integration
- `references/best-practices.md` - Security, error handling

## Resources

- Docs: https://developer.sepay.vn/en
- Dashboard: https://my.sepay.vn
