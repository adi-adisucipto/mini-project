import { Request, Response, NextFunction } from "express";

import { verificationLinkService } from "../services/auth.service";

export async function verificationLinkController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { email } = req.body;
        console.log(req.body)
        await verificationLinkService(email);

        res.json({
            message: "Email sent successfully"
        });
    } catch (error) {
        throw error
    }
}