"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", event_controller_1.getEventsController);
router.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.organizerOnly, event_controller_1.createEventController);
exports.default = router;
