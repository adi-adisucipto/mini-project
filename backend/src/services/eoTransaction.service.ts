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
  if (tx.statusPay === status) return tx;

  return prisma.$transaction(async (trx) => {
    const updated = await trx.transaction.update({
      where: { transaction_id: id },
      data: { statusPay: status },
    });

    // kalo di reject, ini balik in seat nya
    if (status === StatusPay.Rejected) {
      await trx.event.update({
        where: { event_id: tx.event_id },
        data: { available_seats: { increment: tx.ticket_quantity } },
      });
    }

    return updated;
  });
}
