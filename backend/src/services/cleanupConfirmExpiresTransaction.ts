import { Prisma, PrismaClient, StatusPay, Status } from "@prisma/client";
import prisma from "../lib/prisma";
import cron from "node-cron";

async function rollbackExpiredPoints() {
    console.log(new Date())
    const expiredConfirmTransaction = await prisma.transaction.findMany({
        where: {
            statusPay: StatusPay.WaitingConfirm,
            organizer_confirmation_due_at: {
                lt: new Date()
            }
        },
        include: {
            point: true,
            coupon: true
        }
    });

    for(const transaction of expiredConfirmTransaction) {
        try {
            await prisma.$transaction(async (tx:Prisma.TransactionClient) => {
                for(const pointUsage of transaction.point){
                    await tx.pointTransactions.update({
                        where: {point_history_id: pointUsage.point_id},
                        data: {
                            status: Status.Available,
                            point_remaining: {
                                increment: Number(pointUsage.amount_used)
                            }
                        }
                    });

                    await tx.pointUse.delete({
                        where: {id: pointUsage.id}
                    });
                }
                if(transaction.coupon_use_id) {
                    await tx.coupon.update({
                        where: {coupon_id: transaction.coupon_use_id},
                        data: {
                            is_used: false
                        }
                    })
                }

                await tx.event.update({
                    where: { event_id: transaction.event_id },
                    data: {
                        available_seats: {
                            increment: transaction.ticket_quantity
                        }
                    }
                })

                await tx.transaction.update({
                    where: {transaction_id: transaction.transaction_id},
                    data: {
                        statusPay: StatusPay.Rejected
                    }
                });
            });
        } catch (error) {
            console.log(error)
        }
    }

    console.log("Rollback transaksi berhasil")
}

cron.schedule("*/10 * * * *", rollbackExpiredPoints)
rollbackExpiredPoints()