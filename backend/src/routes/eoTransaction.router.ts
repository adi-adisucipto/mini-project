import { Router } from "express";
import { authMiddleware, organizerOnly } from "../middlewares/auth.middleware";
import { getEOTransactions, acceptEOTransaction, rejectEOTransaction } from "../controllers/eoTransaction.controller";

const router = Router();
router.get("/", authMiddleware, organizerOnly, getEOTransactions);
router.patch("/:id/accept", authMiddleware, organizerOnly, acceptEOTransaction);
router.patch("/:id/reject", authMiddleware, organizerOnly, rejectEOTransaction);
export default router;
