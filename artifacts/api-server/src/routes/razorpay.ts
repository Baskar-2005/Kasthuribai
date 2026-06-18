import { Router, type IRouter, type Request, type Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Get Razorpay credentials from environment variables
const getRazorpayCredentials = () => {
  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file."
    );
  }

  return { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET };
};

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = getRazorpayCredentials();
  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
};

interface CreateOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Create Razorpay order
router.post("/razorpay/create-order", async (req: Request, res: Response) => {
  try {
    const { amount, currency = "INR", receipt, notes }: CreateOrderRequest = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const razorpay = getRazorpayInstance();

    // Create order using Razorpay SDK
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    });

    logger.info({ orderId: order.id, amount }, "Razorpay order created");

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error creating Razorpay order");
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Verify Razorpay payment
router.post("/razorpay/verify-payment", async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }: VerifyPaymentRequest = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification fields",
      });
    }

    const { RAZORPAY_KEY_SECRET } = getRazorpayCredentials();

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      logger.warn({ razorpay_order_id }, "Invalid payment signature");
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const razorpay = getRazorpayInstance();

    // Fetch payment details from Razorpay to verify it exists
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured" && payment.status !== "authorized") {
      logger.warn({ razorpay_payment_id, status: payment.status }, "Payment not captured");
      return res.status(400).json({
        success: false,
        message: "Payment not captured",
      });
    }

    logger.info({ razorpay_order_id, razorpay_payment_id }, "Payment verified successfully");

    res.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    logger.error({ error }, "Error verifying payment");
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
});

// Get order details
router.get("/razorpay/order/:orderId", async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId as string;
    
    const razorpay = getRazorpayInstance();
    
    // Fetch order from Razorpay
    const order = await razorpay.orders.fetch(orderId);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error fetching order");
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
});

// Get Razorpay key ID (public key for frontend)
router.get("/razorpay/key", async (_req: Request, res: Response) => {
  try {
    const { RAZORPAY_KEY_ID } = getRazorpayCredentials();
    res.json({
      success: true,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    logger.error({ error }, "Error getting Razorpay key");
    res.status(500).json({
      success: false,
      message: "Failed to get Razorpay key",
    });
  }
});

export default router;
