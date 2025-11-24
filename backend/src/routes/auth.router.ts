import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import uploader from "../utils/uploader";
import {
    verificationLinkController,
    verifyController,
    loginController,
    refreshTokenController
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/verification-link", verificationLinkController);
authRouter.post("/verify", uploader().single("avatar"), verifyController);
authRouter.post("/login", loginController);
authRouter.post("/refresh", refreshTokenController);

export default authRouter;