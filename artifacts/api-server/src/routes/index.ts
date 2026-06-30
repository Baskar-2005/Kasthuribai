import { Router, type IRouter } from "express";
import healthRouter from "./health";
import razorpayRouter from "./razorpay";
import githubRouter from "./github";
import emailRouter from "./email";

const router: IRouter = Router();

router.use(healthRouter);
router.use(razorpayRouter);
router.use(githubRouter);
router.use(emailRouter);

export default router;
