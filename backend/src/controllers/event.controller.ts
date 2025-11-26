import { Request, Response, NextFunction } from "express";
import { listEvents, createEvent } from "../services/event.service";
import { createCustomError } from "../utils/customError";
import { Token } from "../middlewares/auth.middleware";
type AuthedRequest = Request & { user?: Token };


export async function getEventsController(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const search = (req.query.search as string) || "";
    const location = (req.query.location as string) || "";
    const events = await listEvents({ search, location });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

export async function createEventController(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const organizer_id = req.user?.id || req.user?.id || req.body.organizer_id;
    if (!organizer_id) throw createCustomError(401, "Organizer is required");

    const {
      name,
      description,
      price,
      start_date,
      end_date,
      total_seats,
      category,
      location,
      is_paid = true,
    } = req.body;

    if (!name || !description || !start_date || !end_date || !total_seats || !category || !location) {
      throw createCustomError(400, "Missing required fields");
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) throw createCustomError(400, "Invalid dates");
    if (end <= start) throw createCustomError(400, "end_date must be after start_date");

    const total = Number(total_seats);
    if (!Number.isFinite(total) || total <= 0) throw createCustomError(400, "total_seats must be > 0");

    const event = await createEvent({
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
  } catch (err) {
    next(err);
  }
}
