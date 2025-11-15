import { Prisma, PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { sign } from "jsonwebtoken";

import prisma from "../lib/prisma";
import { BASE_WEB_API } from "../configs/env.config";
import { createCustomError } from "../utils/customError";
import { transporter } from "../helpers/transporter";
import { compileRegistrationTemplate } from "../helpers/compileRegistrationTemplate";
import { SECRET_KEY } from "../configs/env.config";

export async function getUserByEmail(email:string) {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    return user;
}

export async function verificationLinkService(email:string) {
    try {
        const user = await getUserByEmail(email);
        if(user) throw createCustomError(401, "User already exists");

        const payload = {
            email: email
        }
        const token = sign(payload, SECRET_KEY, { expiresIn: "10m"})

        await prisma.$transaction(async (tx:Prisma.TransactionClient) => {
            await tx.token.create({
                data: {
                    token: token,
                }
            });

            const html = await compileRegistrationTemplate(token);

            await transporter.sendMail({
                to: email,
                subject: "Registration",
                html
            });
        });
    } catch (error) {
        throw error
    }
}