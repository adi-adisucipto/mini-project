import { Router } from "express";
import { verificationLinkController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/verification-link", verificationLinkController)

export default authRouter