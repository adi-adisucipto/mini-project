"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
//buat list events dr eo nya yang buat
router.get("/", auth_middleware_1.authMiddleware, auth_middleware_1.organizerOnly, async (req, res, next) => {
    try {
        const organizerId = req.user?.user_id || req.user?.id;
        const events = await prisma_1.default.event.findMany({
            where: { organizer_id: organizerId },
            orderBy: { created_at: "desc" },
        });
        res.json(events);
    }
    catch (err) {
        next(err);
    }
});
//ini for updating nya
router.patch("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.organizerOnly, async (req, res, next) => {
    try {
        const organizerId = req.user?.user_id || req.user?.id;
        const event = await prisma_1.default.event.findUnique({
            where: { event_id: req.params.id },
            select: { organizer_id: true },
        });
        if (!event || event.organizer_id !== organizerId)
            return res.status(404).json({ message: "Not found" });
        const { name, description, price, total_seats, available_seats, start_date, end_date, category, location, is_paid } = req.body;
        const updated = await prisma_1.default.event.update({
            where: { event_id: req.params.id },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(price !== undefined && { price: Number(price) }),
                ...(total_seats !== undefined && { total_seats: Number(total_seats) }),
                ...(available_seats !== undefined && { available_seats: Number(available_seats) }),
                ...(start_date && { start_date: new Date(start_date) }),
                ...(end_date && { end_date: new Date(end_date) }),
                ...(category !== undefined && { category }),
                ...(location !== undefined && { location }),
                ...(is_paid !== undefined && { is_paid: Boolean(is_paid) }),
            },
        });
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
