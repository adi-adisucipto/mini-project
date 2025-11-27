import { Router } from "express";
import { getUserByIdController } from "../controllers/profile.controller";

const profileRouter = Router();

profileRouter.post("/profile", getUserByIdController);

export default profileRouter