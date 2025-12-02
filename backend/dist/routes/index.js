"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./auth.router"));
const purchasing_router_1 = __importDefault(require("./purchasing.router"));
const eoTransaction_router_1 = __importDefault(require("./eoTransaction.router")); // routes/index.ts
const eoEvents_router_1 = __importDefault(require("./eoEvents.router"));
const profile_router_1 = __importDefault(require("./profile.router"));
const router = (0, express_1.Router)();
router.use("/auth", auth_router_1.default);
router.use("/transaction", purchasing_router_1.default);
router.use("/eo/transactions", eoTransaction_router_1.default);
router.use("/eo/events", eoEvents_router_1.default);
router.use("/profile", profile_router_1.default);
exports.default = router;
