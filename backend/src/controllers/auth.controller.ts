import { Request, Response, NextFunction } from "express";
import { Token } from "../middlewares/auth.middleware";
import { verificationLinkService, verify } from "../services/auth.service";
import { generateReferralCode } from "../utils/generateReferralCode";

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

export async function verifyController(req:Request, res:Response, next:NextFunction) {
    try {
        const authHeader = req.headers.authorization as string;
        const token = authHeader.split(" ")[1];

        const { email } = req.user as Token;
        const file = req.file;
        const { username, password, referrerCode, role } = req.body;

        const referral_code = generateReferralCode();

        await verify(token, {email, username, password, role, referral_code}, file, referrerCode);

        res.json({
            message: "User registered successfully"
        })
    } catch (error) {
        next(error);
    }
}