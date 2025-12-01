import { Router } from "express";
import authRouter from "./auth.router";
import purchasingAuth from "./purchasing.router";
import eoTransactionRouter from "./eoTransaction.router";// routes/index.ts
import eoEventsRouter from "./eoEvents.router";


const router = Router();

router.use("/auth", authRouter);
router.use("/transaction", purchasingAuth);
router.use("/eo/transactions", eoTransactionRouter);
router.use("/eo/events", eoEventsRouter);

export default router;