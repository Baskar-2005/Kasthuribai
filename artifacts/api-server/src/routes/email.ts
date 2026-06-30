import { Router, type IRouter, type Request, type Response } from "express";
import { sendOrderConfirmationEmail, type OrderEmailData } from "../lib/email.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

router.post("/email/order-confirmation", async (req: Request, res: Response) => {
  const data: OrderEmailData = req.body;

  if (!data.customerEmail || !data.orderId) {
    return res.status(400).json({ success: false, message: "customerEmail and orderId are required" });
  }

  logger.info({ orderId: data.orderId, to: data.customerEmail }, "Sending order confirmation email");

  const sent = await sendOrderConfirmationEmail(data);

  res.json({ success: true, sent });
});

export default router;
