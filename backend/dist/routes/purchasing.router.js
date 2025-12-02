"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchasing_controller_1 = require("../controllers/purchasing.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const uploader_1 = __importDefault(require("../utils/uploader"));
const purchasingAuth = (0, express_1.Router)();
purchasingAuth.post("/purchase/:id", auth_middleware_1.authMiddleware, purchasing_controller_1.createTransactionController);
purchasingAuth.get("/event/:id", purchasing_controller_1.getEventByIdController);
purchasingAuth.post("/upload/:id", auth_middleware_1.authMiddleware, (0, uploader_1.default)().single("bukti"), purchasing_controller_1.uploadProofController);
purchasingAuth.post("/tickets", purchasing_controller_1.getTransactionByUserIdController);
purchasingAuth.post("/cancel", purchasing_controller_1.cancelTransactionController);
purchasingAuth.post("/disc", purchasing_controller_1.calculateDiscController);
exports.default = purchasingAuth;
