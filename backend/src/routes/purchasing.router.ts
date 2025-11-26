import { Router } from "express";
import { createTransactionController, getEventByIdController } from "../controllers/purchasing.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const purchasingAuth = Router();

purchasingAuth.post("/purchase/:id", authMiddleware, createTransactionController);
purchasingAuth.get("/event/:id", getEventByIdController);

export default purchasingAuth