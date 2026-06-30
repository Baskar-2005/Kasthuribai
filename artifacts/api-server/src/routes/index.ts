import { Router, type IRouter } from "express";
import healthRouter from "./health";
import razorpayRouter from "./razorpay";
import githubRouter from "./github";

const router: IRouter = Router();

router.use(healthRouter);
router.use(razorpayRouter);
router.use(githubRouter);

export default router;
