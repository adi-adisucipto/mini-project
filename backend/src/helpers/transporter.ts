import nodemailer from "nodemailer";
import { GMAIL_APP_PASS, GMAIL_EMAIL } from "../configs/env.config";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: GMAIL_EMAIL,
        pass: GMAIL_APP_PASS
    }
});