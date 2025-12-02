"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const profileRouter = (0, express_1.Router)();
profileRouter.post("/profile", profile_controller_1.getUserByIdController);
exports.default = profileRouter;
