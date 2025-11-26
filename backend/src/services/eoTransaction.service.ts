import prisma from "../lib/prisma";
import { StatusPay } from "@prisma/client";

export async function listEOTransactions(organizerId: string, status?: StatusPay) {
  return prisma.transaction.findMany({
    where: {
      event: { organizer_id: organizerId },
      ...(status ? { statusPay: status } : {}),
    },
    include: {
      customer: { select: { username: true, email: true } },
      event: { select: { name: true } },
    },
    orderBy: { created_at: "desc" },
  });
}

export async function updateEOTransactionStatus(id: string, organizerId: string, status: StatusPay) {
  // pastiin ini punya organizer
  const tx = await prisma.transaction.findUnique({
    where: { transaction_id: id },
    include: { event: { select: { organizer_id: true } } },
  });
  if (!tx || tx.event.organizer_id !== organizerId) {
    throw new Error("Not found or not yours");
  }
  return prisma.transaction.update({
    where: { transaction_id: id },
    data: { statusPay: status },
  });
}