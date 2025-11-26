import { Request, Response, NextFunction } from "express";
import { createTransactionService, getEventById } from "../services/purchasing.service";

interface Token extends Request {
    user?: {
        id: string;
        email: string;
        username: string;
        role: string;
        avatar: string;
        referral_code: string;
        points_balance: number;
    }
}

export async function createTransactionController(req:Token, res:Response, next:NextFunction) {
    try {
        const user = req.user;
        if(!user) return next(new Error("Please login"));
        const { id, email, username, points_balance } = user

        const eventId = req.params.id;
        const { ticket, pointsToUse, codeCoupon, codeVouche } = req.body;

        const userId = id;
        const data = await createTransactionService(
            eventId,
            username,
            email,
            userId,
            points_balance,
            ticket,
            pointsToUse,
            codeCoupon,
            codeVouche,
        );

        res.status(201).json({
            messsage: "Berhasil membuat pesanan. Cek email kamu",
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function getEventByIdController(req:Request, res:Response, next:NextFunction) {
    try {
        const eventId = req.params.id;
        const user = await getEventById(eventId);
        if(!user) return next(new Error("Please login"));

        res.status(200).json({
            message: "Berhasil",
            user
        })
    } catch (error) {
        next(error);
    }
}