import { Router } from "express";
import { verificationLinkController, verifyController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import uploader from "../utils/uploader";

const authRouter = Router();

authRouter.post("/verification-link", verificationLinkController);
authRouter.post("/verify/:token", uploader().single("avatar"), verifyController);

export default authRouter;