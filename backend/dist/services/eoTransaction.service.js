"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEOTransactions = listEOTransactions;
exports.updateEOTransactionStatus = updateEOTransactionStatus;
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
async function listEOTransactions(organizerId, status) {
    return prisma_1.default.transaction.findMany({
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
async function updateEOTransactionStatus(id, organizerId, status) {
    // pastiin ini punya organizer
    const tx = await prisma_1.default.transaction.findUnique({
        where: { transaction_id: id },
        include: { event: { select: { organizer_id: true } } },
    });
    if (!tx || tx.event.organizer_id !== organizerId) {
        throw new Error("Not found or not yours");
    }
    if (tx.statusPay === status)
        return tx;
    return prisma_1.default.$transaction(async (trx) => {
        const updated = await trx.transaction.update({
            where: { transaction_id: id },
            data: { statusPay: status },
        });
        // kalo di reject, ini balik in seat nya
        if (status === client_1.StatusPay.Rejected) {
            await trx.event.update({
                where: { event_id: tx.event_id },
                data: { available_seats: { increment: tx.ticket_quantity } },
            });
        }
        return updated;
    });
}
