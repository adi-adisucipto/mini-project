import { Router } from "express";
import { createTransactionController, getEventByIdController, uploadProofController, getTransactionByUserIdController } from "../controllers/purchasing.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import uploader from "../utils/uploader";

const purchasingAuth = Router();

purchasingAuth.post("/purchase/:id", authMiddleware, createTransactionController);
purchasingAuth.get("/event/:id", getEventByIdController);
purchasingAuth.post("/upload/:id", authMiddleware, uploader().single("bukti"), uploadProofController);
purchasingAuth.post("/tickets", getTransactionByUserIdController);

export default purchasingAuth