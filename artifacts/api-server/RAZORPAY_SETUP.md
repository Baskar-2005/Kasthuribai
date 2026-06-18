# Razorpay Integration Setup

## Overview
This API server includes real Razorpay payment integration for the Kasthuribai e-commerce application using the official Razorpay Node.js SDK.

## Setup Instructions

### 1. Get Razorpay Credentials
1. Sign up/login at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Create an app/mode (Test mode for development)
3. Copy **Key ID** (public) and **Key Secret** (secret)

### 2. Environment Variables
Create `.env` files:

**Backend (`artifacts/api-server/.env`):**
```
cp .env.example .env
```
Edit with your real keys:
```
PORT=8080
NODE_ENV=development
RAZORPAY_KEY_ID=rzp_test_SY9uQiNhsalWml
RAZORPAY_KEY_SECRET=K6wzlJmzosLlbh6Uxk6Yv4FT
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

**Frontend (`artifacts/kasthuribai/.env`):**
```
cp .env.example .env
```
```
VITE_API_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

### 3. Install Backend Dependencies
```bash
cd artifacts/api-server
pnpm install
```

### 4. Start Servers

**Backend:**
```bash
cd artifacts/api-server
pnpm run dev
```
Server starts at `http://localhost:8080`

**Frontend:**
```bash
cd artifacts/kasthuribai
pnpm run dev
```

## API Endpoints

### Create Order
```
POST /api/razorpay/create-order
```
Uses real `razorpay.orders.create()`

**Request Body:**
```json
{
  "amount": 898,
  "currency": "INR",
  "receipt": "receipt_123",
  "notes": { "customerName": "John Doe" }
}
```

### Verify Payment
```
POST /api/razorpay/verify-payment
```
Manual webhook signature verification.

### Get Order Details
```
GET /api/razorpay/order/:orderId
```
Fetches from Razorpay.

### Get Public Key
```
GET /api/razorpay/key
```

## Testing

**Test Cards:**
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`

**Test UPI:**
- Success: `success@razorpay`

## Production Deployment

1. Use live keys (`rzp_live_*`)
2. Update CORS_ORIGIN and VITE_API_URL
3. HTTPS everywhere
4. Database for order persistence
5. Razorpay webhooks for status updates
6. `@types/razorpay` if TS types needed (not installed yet)

## Troubleshooting

- **Missing env vars:** Server exits on startup
- **Invalid signature:** Check key secret
- **CORS errors:** Update CORS_ORIGIN
- **TS error in backend:** Run `pnpm install` after adding razorpay
