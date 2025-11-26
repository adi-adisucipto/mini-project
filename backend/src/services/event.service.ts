import prisma from "../lib/prisma";

export async function listEvents(params: { search?: string; location?: string }) {
  const { search, location } = params;
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (location) where.location = { equals: location, mode: "insensitive" };

  return prisma.event.findMany({
    where: Object.keys(where).length ? where : undefined,
    orderBy: { start_date: "asc" },
  });
}

export async function createEvent(data: {
  organizer_id: string;
  name: string;
  description: string;
  price: number;
  start_date: Date;
  end_date: Date;
  total_seats: number;
  category: string;
  location: string;
  is_paid: boolean;
}) {
  return prisma.event.create({
    data: {
      ...data,
      available_seats: data.total_seats,
    },
  });
}
