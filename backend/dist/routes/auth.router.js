"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploader_1 = __importDefault(require("../utils/uploader"));
const auth_controller_1 = require("../controllers/auth.controller");
const authRouter = (0, express_1.Router)();
authRouter.post("/verification-link", auth_controller_1.verificationLinkController);
authRouter.post("/verify", (0, uploader_1.default)().single("avatar"), auth_controller_1.verifyController);
authRouter.post("/login", auth_controller_1.loginController);
authRouter.post("/refresh", auth_controller_1.refreshTokenController);
exports.default = authRouter;
