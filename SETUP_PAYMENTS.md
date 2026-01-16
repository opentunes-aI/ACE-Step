# 💰 Setting Up Payments (Stripe)

Opentunes Studio uses **Stripe** to handle credit purchases. Follow this guide to configure the payment system.

## 1. Get API Keys
1.  Go to [Stripe Dashboard](https://dashboard.stripe.com/).
2.  Switch to **Test Mode** (toggle in top right).
3.  Go to **Developers > API keys**.
4.  Copy the **Secret Key** (`sk_test_...`).

## 2. Configure Environment
Add the following to your `.env` (or `.env.local` for Studio):

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URL (for redirecting back after payment)
NEXT_PUBLIC_APP_URL=http://localhost:7865
```

## 3. Create Products (Price IDs)
The frontend (`CreditDialog.tsx`) expects specific Price IDs. You must create these **Products** in your Stripe Dashboard matching these IDs (or update the code to match your Stripe IDs):

| Plan Name | Credits | Price | ID (Code Expectation) |
| :--- | :--- | :--- | :--- |
| **Starter** | 500 | $5.00 | `price_basic` |
| **Creator** | 1200 | $10.00 | `price_creator` |
| **Studio** | 3000 | $20.00 | `price_studio` |

*Note: In Stripe, create a Product named "Starter Pack", add a Price of $5.00, and copy the resulting `price_12345` ID. Then map it in `CreditDialog.tsx` or use the Lookup Keys feature.*

## 4. Testing Webhooks (Local Development)
To test if credits are actually added after payment, you need to forward Stripe webhooks to your local API.

1.  **Install Stripe CLI**: [Instructions](https://docs.stripe.com/stripe-cli)
2.  **Login**: `stripe login`
3.  **Listen**: Forward events to your backend API:
    ```bash
    stripe listen --forward-to localhost:7866/billing/webhook
    ```
4.  **Get Webhook Secret**: The CLI will output a webhook secret (`whsec_...`). Copy this to your `.env` as `STRIPE_WEBHOOK_SECRET`.

## 5. Verification
1.  Restart the Backend API: `run_api.bat`.
2.  Open Studio -> Click Credit Balance (+).
3.  Select a Pack.
4.  Complete payment using Stripe Test Card (`4242 4242...`).
5.  Watch the `stripe listen` terminal for `200 OK`.
6.  Refresh Studio to see your new balance!
