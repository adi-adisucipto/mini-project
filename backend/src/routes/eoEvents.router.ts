import { Router } from "express";
import { authMiddleware, organizerOnly } from "../middlewares/auth.middleware";
import prisma from "../lib/prisma";

const router = Router();

//buat list events dr eo nya yang buat
router.get("/", authMiddleware, organizerOnly, async (req: any, res, next) => {
  try {
    const organizerId = req.user?.user_id || req.user?.id;
    const events = await prisma.event.findMany({
      where: { organizer_id: organizerId },
      orderBy: { created_at: "desc" },
    });
    res.json(events);
  } catch (err) { next(err); }
});

//ini for updating nya
router.patch("/:id", authMiddleware, organizerOnly, async (req: any, res, next) => {
  try {
    const organizerId = req.user?.user_id || req.user?.id;
    const event = await prisma.event.findUnique({
      where: { event_id: req.params.id },
      select: { organizer_id: true },
    });
    if (!event || event.organizer_id !== organizerId) return res.status(404).json({ message: "Not found" });

    const { name, description, price, total_seats, available_seats, start_date, end_date, category, location, is_paid } = req.body;
    const updated = await prisma.event.update({
      where: { event_id: req.params.id },
      data: { //learn this yang dr stackoverflow itu
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
  } catch (err) { next(err); }
});

export default router;
