import { Router } from "express";
import authRouter from "./auth.router";
import purchasingAuth from "./purchasing.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/transaction", purchasingAuth);

export default router;