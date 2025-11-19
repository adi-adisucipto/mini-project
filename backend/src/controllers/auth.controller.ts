import { Request, Response, NextFunction } from "express";
import { Token } from "../middlewares/auth.middleware";
import { verificationLinkService, verifyService } from "../services/auth.service";
import { generateReferralCode } from "../utils/generateReferralCode";
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "../configs/env.config";

export async function verificationLinkController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { email } = req.body;
        await verificationLinkService(email);

        res.json({
            message: "Email sent successfully"
        });
    } catch (error) {
        throw error
    }
}

export async function verifyController(req:Request, res:Response, next:NextFunction) {
    try {
        const token = req.params.token
        console.log(token)

        const decoded = verify(token, SECRET_KEY) as { email: string };
        const { email } = decoded;
        const file = req.file;
        const { username, password, referrerCode, role } = req.body;

        const referral_code = generateReferralCode();

        await verifyService(token, {email, username, password, role, referral_code}, file, referrerCode);

        res.status(200).json({
            message: "User registered successfully"
        });
    } catch (error) {
        next(error);
    }
}