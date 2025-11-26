import { Router } from "express";
import { getEventsController, createEventController } from "../controllers/event.controller";
import { authMiddleware, organizerOnly } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getEventsController);
router.post("/", authMiddleware, organizerOnly, createEventController);

export default router;
