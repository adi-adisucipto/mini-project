import { Prisma } from "@prisma/client";
import { sign } from "jsonwebtoken";

import prisma from "../lib/prisma";
import { createCustomError } from "../utils/customError";
import { transporter } from "../helpers/transporter";
import { compileRegistrationTemplate } from "../helpers/compileRegistrationTemplate";
import { SECRET_KEY, SECRET_ACCESS_KEY, SECRET_REFRESH_KEY } from "../configs/env.config";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import { cloudinaryUplaod, cloudinaryRemove } from "../utils/cloudinary";

export async function getUserByEmail(email:string) {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    return user;
}

export async function getRegisterToken(token:string) {
    try {
        const user = await prisma.token.findUnique({
            where: {token:token}
        });
        return user;
    } catch (error) {
        throw error;
    }
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
                    expires_at: new Date(Date.now() + 10 * 60 * 1000)
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

export async function getUserByReferral(referrerCode:string) {
    try {
        const user = await prisma.user.findFirst({
            where: { referral_code: referrerCode },
            select: { user_id: true }
        });

        return user;
    } catch (error) {
        throw error;
    }
}

export async function createPointTransaction(user_id:string) {
    try {
        const now = new Date();
        const expiration_date = new Date(now);
        expiration_date.setMonth(now.getMonth() + 3);

        await prisma.$transaction(async (tx:Prisma.TransactionClient) => {
            await tx.pointTransactions.create({
                data: {
                    user_id: user_id,
                    amount_change: 10000,
                    point_remaining: 10000,
                    expiration_date: expiration_date
                }
            });

            await tx.user.update({
                where: {user_id},
                data: {
                    points_balance: {
                        increment: 10000
                    }
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

export async function createCoupon(user_id:string, username:string) {
    try {
        const code = () => {
            const rand = Math.floor(Math.random() * 1000000);
            return rand;
        }

        const now = new Date();
        const expiration_date = new Date(now);
        expiration_date.setMonth(now.getMonth() + 3);

        await prisma.coupon.create({
            data: {
                user_id: user_id,
                code: username + code(),
                discount_amount: 20000,
                expiration_date,
                is_used: false,
                used_at: expiration_date
            }
        })
    } catch (error) {
        throw error;
    }
}

export async function verifyService(token:string, params:Prisma.UserUncheckedCreateInput, file?:Express.Multer.File, referrerCode?:string) {
    let secure_url: string | null = null;
    let public_id: string | null = null;

    if(file) {
        const image = await cloudinaryUplaod(file, "avatar");
        secure_url = image.secure_url;
        public_id = image.public_id;          
    }

    try {
        const tokenExist = await getRegisterToken(token);
        if(!tokenExist) throw createCustomError(403, "Invalid token");
        console.log(token)

        let userReferrerId: string | null = null;

        if(referrerCode) {
            const isRefExist = await getUserByReferral(referrerCode);
            if(!isRefExist) throw new Error("Referral code invalid!");
            userReferrerId = isRefExist.user_id;
        }

        const salt = genSaltSync(10);
        const hashedPass = hashSync(params.password, salt);

        await prisma.$transaction(async (tx:Prisma.TransactionClient) => {
            const newUser = await tx.user.create({
                data: {
                    ...params,
                    password: hashedPass,
                    avatar: secure_url,
                    avatar_id: public_id,
                    referrerId:userReferrerId
                }
            });
            
            if(referrerCode && userReferrerId) {
                await createCoupon(newUser.user_id, newUser.username);
                await createPointTransaction(userReferrerId);
            }
        })
    } catch (error) {
        if(public_id) {
            await cloudinaryRemove(public_id)
        }
        throw error
    }
}

export async function createRefreshTokens(email:string) {
    try {
        const user = await getUserByEmail(email);
        if(!user) throw new Error("Invalid email or password.");

        const payload = {
            id: user.user_id,
            email: user.email,
            username: user.username,
            role: user.role,
            avatar:user.avatar,
            referral_code:user.referral_code,
            points_balance:user.points_balance
        };

        const accessToken = sign(payload, SECRET_ACCESS_KEY, { expiresIn: "10m" });
        const refreshToken = sign(payload, SECRET_REFRESH_KEY, { expiresIn: "30d" });

        return {
            user,
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw error
    }
}

export async function loginService(email:string, password:string) {
    try {
        const user = await getUserByEmail(email);
        if(!user) throw new Error("Invalid email or password.");
        const passValid = compareSync(password, user.password);
        if(!passValid) throw new Error("Invalid email or password.");

        const data = await createRefreshTokens(email);

        const exp = new Date();
        exp.setDate(exp.getDate() + 30);

        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;

        await prisma.$transaction(async (tx:Prisma.TransactionClient) => {
            await tx.refreshToken.deleteMany({
                where: { token: refreshToken }
            });

            await tx.refreshToken.create({
                data: {
                    user_id: data.user.user_id,
                    token: data.refreshToken,
                    expires_at: exp
                }
            });
        });

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw error;
    }
}

export async function refreshTokenService(token:string) {
    try {
        const findToken = await prisma.refreshToken.findFirst({
            where: { token: token },
            select: { user_id: true }
        });

        if(!findToken) throw createCustomError(404, "Token tidak ditemukan")

        const findEmail = await prisma.user.findFirst({
            where: { user_id: findToken?.user_id },
            select: {email: true}
        });
        if(!findEmail) throw createCustomError(404, "User not found!")

        const tokens = await createRefreshTokens(findEmail?.email);

        await prisma.refreshToken.deleteMany({
            where: {token: token},
        });

        const exp = new Date();
        exp.setDate(exp.getDate() + 30)

        await prisma.refreshToken.create({
            data: {
                token: tokens.refreshToken,
                expires_at: exp,
                user_id: findToken.user_id
            }
        })

        return {
            message: "OK",
            tokens
        }
    } catch (error) {
        throw error
    }
}