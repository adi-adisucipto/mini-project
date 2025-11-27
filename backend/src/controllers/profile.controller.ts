import { Request, Response, NextFunction } from "express";
import { getUserByIdService } from "../services/profile.service";

export async function getUserByIdController(req:Request, res:Response, next:NextFunction) {
    try {
        const {email} = req.body
        const user = await getUserByIdService(email);

        res.status(200).json({
            message: "Data berhasil diambil",
            user
        });
    } catch (error) {
        next(error);
    }
}