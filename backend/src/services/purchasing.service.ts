import { Prisma, Status, StatusPay } from "@prisma/client";
import prisma from "../lib/prisma";
import { createCustomError } from "../utils/customError";
import { compileDetailPay } from "../helpers/compileRegistrationTemplate";
import { transporter } from "../helpers/transporter";
import { cloudinaryUplaod } from "../utils/cloudinary";

export async function getEventById(id: string) {
    try {
        const data = await prisma.event.findUnique({
            where: { event_id: id },
            include: {
                organizer: true
            }
        });

        return data
    } catch (error) {
        throw error
    }
}

export async function getPointsById(id: string) {
    const data = await prisma.pointTransactions.findMany({
        where: { 
            user_id: id,
            point_remaining: { gt: 0 },
            expiration_date: { gt: new Date() }
        }
    });

    // Sort yang mau expired duluan
    return data.sort((a, b) => {
        const dateA = new Date(a.expiration_date);
        const dateB = new Date(b.expiration_date);
        return dateA.getTime() - dateB.getTime();
    });
}

export async function getCouponByCode(code: string) {
    return await prisma.coupon.findUnique({
        where: { code: code },
        select: { discount_amount: true, coupon_id: true }
    });
}

export async function getVoucherByCode(code: string) {
    return await prisma.voucher.findUnique({
        where: { code: code },
        select: { discount_amount: true, voucher_id: true }
    });
}

export async function validateCoupon(eventId: string, codeCoupon?: string|null) {
    if (!codeCoupon) return { disc: 0, id: null }

    const coupon = await getCouponByCode(codeCoupon);
    if (!coupon) throw createCustomError(404, "Coupon not found");

    const event = await getEventById(eventId);
    if (!event) throw createCustomError(404, "Event not found");

    return {
        disc: Number(coupon.discount_amount),
        id: coupon.coupon_id
    };
}

export async function validateVoucher(eventId: string, codeVouche?: string|null) {
    if (!codeVouche) return { disc: 0, id: null };

    const voucher = await getVoucherByCode(codeVouche); 
    if (!voucher) throw createCustomError(404, "Voucher not found");

    const event = await getEventById(eventId);
    if (!event) throw createCustomError(404, "Event not found");

    return {
        disc: Number(voucher.discount_amount),
        id: voucher.voucher_id
    };
}

export async function createTransactionService(eventId: string, username:string, email:string, userId: string, pointsBalance: number, ticket: number, pointsToUse?: number, codeCoupon?: string, codeVouche?: string) {
    try {
        const event = await getEventById(eventId);
        if (!event) throw createCustomError(404, "Event not found");
        const available_seats = event.available_seats - ticket;
        if(available_seats <= 0) throw createCustomError(404, "This event is not available anymore")

        let eventPrice: number = Number(event.price) * ticket;
        const event_name = event.name
        
        const couponData = await validateCoupon(eventId, codeCoupon);
        const voucherData = await validateVoucher(eventId, codeVouche);

        let discCoupon = couponData.disc;
        if (discCoupon > 0) {
            eventPrice -= discCoupon;
            if (eventPrice < 0) eventPrice = 0;
        } else if (codeCoupon == null) {
            discCoupon = 0
        }

        let discVoucher = voucherData.disc;
        let voucherUsed = false;

        if (discVoucher > 0 && eventPrice > discVoucher) {
            eventPrice -= discVoucher;
            voucherUsed = true;
        } else {
            discVoucher = 0; 
        }

        const points = await getPointsById(userId);
        
        // const totalAvailablePoints = points.reduce((acc, curr) => acc + curr.point_remaining, 0);
        if(!pointsToUse) {
            pointsToUse = 0
        } 
        // else if (totalAvailablePoints < pointsToUse && pointsToUse !== null) {
        //     throw createCustomError(400, "Insufficient points balance"); 
        // }

        let totalPointUsed = 0;
        let sisaPointNeeded = pointsToUse;
        let pointsUpdates = [];
        let pointsUse = [];

        for (const p of points) {
            if (sisaPointNeeded <= 0) break;

            let currentBatchBalance = p.point_remaining;
            let amountToTakeFromBatch = 0;

            if (sisaPointNeeded >= currentBatchBalance) {
                amountToTakeFromBatch = currentBatchBalance;
                pointsUpdates.push({
                    id: p.point_history_id,
                    remaining: 0,
                    status: Status.Used
                });
                pointsUse.push({
                    amount_use: 10000
                })
            } else {
                amountToTakeFromBatch = sisaPointNeeded;
                pointsUpdates.push({
                    id: p.point_history_id,
                    remaining: currentBatchBalance - sisaPointNeeded,
                    status: Status.Available
                });
                pointsUse.push({
                    amount_use: sisaPointNeeded
                })
            }

            sisaPointNeeded -= amountToTakeFromBatch;
            totalPointUsed += amountToTakeFromBatch;
        }

        const finalTotalPay = eventPrice - totalPointUsed;
        const finalPointsBalance = pointsBalance - totalPointUsed;

        await prisma.$transaction(async (tx) => {
            if (couponData.disc > 0 && couponData.id) {
                await tx.coupon.update({
                    where: { coupon_id: couponData.id },
                    data: { used_at: new Date() }
                });
            }

            if (voucherUsed && voucherData.id) {
                await tx.voucher.update({
                    where: { voucher_id: voucherData.id },
                    data: { is_active: false }
                });
            }

            for (const update of pointsUpdates) {
                await tx.pointTransactions.update({
                    where: { point_history_id: update.id },
                    data: {
                        point_remaining: update.remaining,
                        status: update.status
                    }
                });
            }

            await tx.user.update({
                where: { user_id: userId },
                data: { points_balance: finalPointsBalance }
            });

            await tx.event.update({
                where: {event_id: eventId},
                data: {
                    available_seats: available_seats
                }
            });

            const exp = new Date();
            exp.setHours(exp.getHours() + 2)

            await tx.transaction.create({
                data: {
                    customer_id: userId,
                    event_id: eventId,
                    ticket_quantity: ticket,
                    total_price_paid: eventPrice,
                    points_used: totalPointUsed,
                    voucher_used_id: voucherData.id,
                    payment_proof_due_at: exp
                }
            });
        });

        const subtotal = Number(event.price);
        const total = finalTotalPay
        const html = await compileDetailPay(username, event_name, ticket, subtotal, total);

        await transporter.sendMail({
            to: email,
            subject: "Purchasing",
            html
        });

        
        return {
            messgae: "Berhasil melakukan pembelian. Silahkan cek email kamu!",
            totalPay: finalTotalPay,
            disc: totalPointUsed,
            discCoupon,
            discVoucher
        };

    } catch (error) {
        throw error;
    }
}

export async function getTransactionById(id:string) {
    try {
        const user = await prisma.transaction.findUnique({
            where: {transaction_id:id}
        });

        return user;
    } catch (error) {
        throw error;
    }
}

export async function uploadProofService(id:string, file:Express.Multer.File) {
    try {
        const transaction = await getTransactionById(id);
        if(!transaction) throw createCustomError(404, "Transaction not found");

        const image = await cloudinaryUplaod(file, "bukti");
        const secure_url = image.secure_url;

        const confirmPayment = new Date();
        confirmPayment.setDate(confirmPayment.getDate() + 3)

        const data = await prisma.transaction.update({
            where:{transaction_id: id},
            data: {
                proof_upload_at: new Date(),
                payment_proof_url: secure_url,
                statusPay: StatusPay.WaitingConfirm,
                organizer_confirmation_due_at: confirmPayment
            }
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function getTransactionByUserEmail(email:string) {
    try {
        const id = await prisma.user.findUnique({
            where: { email: email },
            select: {user_id: true}
        });
        if(!id) throw createCustomError(404, "User not found");


        const data = await prisma.transaction.findMany({
            where: { customer_id: id.user_id },
            include: {
                event: true
            }
        });

        return data
    } catch (error) {
        throw error;
    }
}

export async function cancelTransactionService(id:string) {
    try {
        await prisma.$transaction(async (tx:Prisma.TransactionClient) => {
            const transaction = await tx.transaction.findUnique({
                where: { transaction_id: id },
                include: { event: true, point: true, coupon: true }
            })

            await tx.transaction.update({
                where: { transaction_id: id },
                data: {
                    statusPay: StatusPay.Canceled,
                }
            });

            await tx.event.update({
                where: { event_id: transaction?.event_id },
                data: { available_seats: {
                    increment: transaction?.ticket_quantity
                }}
            })

            if(transaction?.point) {
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
            }
        });
    } catch (error) {
        throw error;
    }
}

export async function calculateDisc(idEvent:string, ticket:number, pointsToUse?: number, codeCoupon?: string, codeVouche?: string) {
    try {
        let discCoupon = 0
        let discVoucher = 0
        let pointUse = pointsToUse ?? 0
        if(!pointsToUse) pointsToUse = 0;
        if(!codeCoupon) discCoupon = 0;
        if(!codeVouche) discVoucher = 0;
        
        const eventInfo = await getEventById(idEvent);
        if(!eventInfo) throw createCustomError(404, "Event not found!");
        const eventPrice = Number(eventInfo.price) * ticket;
        
        if(codeCoupon) {
            const couponInfo = await getCouponByCode(codeCoupon)
            if(couponInfo) {
                discCoupon = Number(couponInfo?.discount_amount)
            }
        }

        if(codeVouche) {
            const voucherInfo = await getVoucherByCode(codeVouche)
            if(voucherInfo) {
                discVoucher = Number(voucherInfo?.discount_amount)
            }
        }

        let totalDis = pointUse + discCoupon + discVoucher;

        if(totalDis > eventPrice) {
            totalDis = eventPrice
        }

        return {
            totalDis
        }
    } catch (error) {
        throw error
    }
}