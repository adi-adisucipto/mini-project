import { Router } from "express";
import { createTransactionController, getEventByIdController, uploadProofController, getTransactionByUserIdController, cancelTransactionController, calculateDiscController } from "../controllers/purchasing.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import uploader from "../utils/uploader";

const purchasingAuth = Router();

purchasingAuth.post("/purchase/:id", authMiddleware, createTransactionController);
purchasingAuth.get("/event/:id", getEventByIdController);
purchasingAuth.post("/upload/:id", authMiddleware, uploader().single("bukti"), uploadProofController);
purchasingAuth.post("/tickets", getTransactionByUserIdController);
purchasingAuth.post("/cancel", cancelTransactionController);
purchasingAuth.post("/disc", calculateDiscController);

export default purchasingAuth