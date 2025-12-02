"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
const node_cron_1 = __importDefault(require("node-cron"));
async function rollbackExpiredPoints() {
    console.log(new Date());
    const expiredTransaction = await prisma_1.default.transaction.findMany({
        where: {
            statusPay: client_1.StatusPay.WaitingPay,
            payment_proof_due_at: {
                lt: new Date()
            }
        },
        include: {
            point: true,
            coupon: true,
            event: true
        }
    });
    for (const transaction of expiredTransaction) {
        try {
            await prisma_1.default.$transaction(async (tx) => {
                for (const pointUsage of transaction.point) {
                    await tx.pointTransactions.update({
                        where: { point_history_id: pointUsage.point_id },
                        data: {
                            status: client_1.Status.Available,
                            point_remaining: {
                                increment: Number(pointUsage.amount_used)
                            }
                        }
                    });
                    await tx.pointUse.delete({
                        where: { id: pointUsage.id }
                    });
                }
                if (transaction.coupon_use_id) {
                    await tx.coupon.update({
                        where: { coupon_id: transaction.coupon_use_id },
                        data: {
                            is_used: false
                        }
                    });
                }
                await tx.event.update({
                    where: { event_id: transaction.event_id },
                    data: {
                        available_seats: {
                            increment: transaction.ticket_quantity
                        }
                    }
                });
                await tx.transaction.update({
                    where: { transaction_id: transaction.transaction_id },
                    data: {
                        statusPay: client_1.StatusPay.Expired
                    }
                });
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    console.log("Rollback transaksi berhasil");
}
node_cron_1.default.schedule("*/10 * * * *", rollbackExpiredPoints);
rollbackExpiredPoints();
