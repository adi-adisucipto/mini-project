import { Router } from "express";
import authRouter from "./auth.router";
import purchasingAuth from "./purchasing.router";
import eoTransactionRouter from "./eoTransaction.router";
import profileRouter from "./profile.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/transaction", purchasingAuth);
router.use("/eo/transactions", eoTransactionRouter);
router.use("/user", profileRouter);

export default router;