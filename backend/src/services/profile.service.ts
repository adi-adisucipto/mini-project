import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { createCustomError } from "../utils/customError";

export async function getUserByIdService(email:string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        console.log(email)

        if(!user) throw createCustomError(404, "User not found");
        return user;
    } catch (error) {
        throw error;
    }
}