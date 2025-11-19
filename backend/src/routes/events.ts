// src/routes/events.ts
import { Router } from "express";
import prisma from "../lib/prisma"; // note: default import depending on your project

const router = Router();

router.get("/", async (req, res) => {
  const search = (req.query.search as string) || "";
//   const city = (req.query.city as string) || "";

  try {
    const events = await prisma.event.findMany({
      where: {
        AND: [
          search
            ? { name: { contains: search, mode: "insensitive" } }
            : {}
        ],
      },
      orderBy: { start_date: "asc" },
    });

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

export default router;
