// src/routes/events.ts
import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  const search = (req.query.search as string) || "";
  //   const city = (req.query.city as string) || "";
  const location = (req.query.location as string) || "";
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (location) {
    where.location = { equals: location, mode: "insensitive" };
  }

  try {
    const events = await prisma.event.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { start_date: "asc" },
    });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

export default router;
