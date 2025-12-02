"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsController = getEventsController;
exports.createEventController = createEventController;
const event_service_1 = require("../services/event.service");
const customError_1 = require("../utils/customError");
async function getEventsController(req, res, next) {
    try {
        const search = req.query.search || "";
        const location = req.query.location || "";
        const events = await (0, event_service_1.listEvents)({ search, location });
        res.json(events);
    }
    catch (err) {
        next(err);
    }
}
async function createEventController(req, res, next) {
    try {
        const organizer_id = req.user?.id || req.user?.id || req.body.organizer_id;
        if (!organizer_id)
            throw (0, customError_1.createCustomError)(401, "Organizer is required");
        const { name, description, price, start_date, end_date, total_seats, category, location, is_paid = true, } = req.body;
        if (!name || !description || !start_date || !end_date || !total_seats || !category || !location) {
            throw (0, customError_1.createCustomError)(400, "Missing required fields");
        }
        const start = new Date(start_date);
        const end = new Date(end_date);
        if (isNaN(start.getTime()) || isNaN(end.getTime()))
            throw (0, customError_1.createCustomError)(400, "Invalid dates");
        if (end <= start)
            throw (0, customError_1.createCustomError)(400, "end_date must be after start_date");
        const total = Number(total_seats);
        if (!Number.isFinite(total) || total <= 0)
            throw (0, customError_1.createCustomError)(400, "total_seats must be > 0");
        const event = await (0, event_service_1.createEvent)({
            organizer_id,
            name,
            description,
            price: Number(price) || 0,
            start_date: start,
            end_date: end,
            total_seats: total,
            category,
            location,
            is_paid: Boolean(is_paid),
        });
        res.status(201).json(event);
    }
    catch (err) {
        next(err);
    }
}
