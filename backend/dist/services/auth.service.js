"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = getUserByEmail;
exports.getRegisterToken = getRegisterToken;
exports.verificationLinkService = verificationLinkService;
exports.getUserByReferral = getUserByReferral;
exports.createPointTransaction = createPointTransaction;
exports.createCoupon = createCoupon;
exports.verifyService = verifyService;
exports.createRefreshTokens = createRefreshTokens;
exports.loginService = loginService;
exports.refreshTokenService = refreshTokenService;
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = __importDefault(require("../lib/prisma"));
const customError_1 = require("../utils/customError");
const transporter_1 = require("../helpers/transporter");
const compileRegistrationTemplate_1 = require("../helpers/compileRegistrationTemplate");
const env_config_1 = require("../configs/env.config");
const bcrypt_1 = require("bcrypt");
const cloudinary_1 = require("../utils/cloudinary");
async function getUserByEmail(email) {
    const user = await prisma_1.default.user.findUnique({
        where: {
            email: email
        }
    });
    return user;
}
async function getRegisterToken(token) {
    try {
        const user = await prisma_1.default.token.findUnique({
            where: { token: token }
        });
        return user;
    }
    catch (error) {
        throw error;
    }
}
async function verificationLinkService(email) {
    try {
        const user = await getUserByEmail(email);
        if (user)
            throw (0, customError_1.createCustomError)(401, "User already exists");
        const payload = {
            email: email
        };
        const token = (0, jsonwebtoken_1.sign)(payload, env_config_1.SECRET_KEY, { expiresIn: "10m" });
        await prisma_1.default.$transaction(async (tx) => {
            await tx.token.create({
                data: {
                    token: token,
                    expires_at: new Date(Date.now() + 10 * 60 * 1000)
                }
            });
            const html = await (0, compileRegistrationTemplate_1.compileRegistrationTemplate)(token);
            await transporter_1.transporter.sendMail({
                to: email,
                subject: "Registration",
                html
            });
        });
    }
    catch (error) {
        throw error;
    }
}
async function getUserByReferral(referrerCode) {
    try {
        const user = await prisma_1.default.user.findFirst({
            where: { referral_code: referrerCode },
            select: { user_id: true }
        });
        return user;
    }
    catch (error) {
        throw error;
    }
}
async function createPointTransaction(user_id) {
    try {
        const now = new Date();
        const expiration_date = new Date(now);
        expiration_date.setMonth(now.getMonth() + 3);
        await prisma_1.default.$transaction(async (tx) => {
            await tx.pointTransactions.create({
                data: {
                    user_id: user_id,
                    amount_change: 10000,
                    point_remaining: 10000,
                    expiration_date: expiration_date
                }
            });
            await tx.user.update({
                where: { user_id },
                data: {
                    points_balance: {
                        increment: 10000
                    }
                }
            });
        });
    }
    catch (error) {
        throw error;
    }
}
async function createCoupon(user_id, username) {
    try {
        const code = () => {
            const rand = Math.floor(Math.random() * 1000000);
            return rand;
        };
        const now = new Date();
        const expiration_date = new Date(now);
        expiration_date.setMonth(now.getMonth() + 3);
        await prisma_1.default.coupon.create({
            data: {
                user_id: user_id,
                code: username + code(),
                discount_amount: 20000,
                expiration_date: expiration_date,
            }
        });
    }
    catch (error) {
        throw error;
    }
}
async function verifyService(token, params, file, referrerCode) {
    let secure_url = null;
    let public_id = null;
    if (file) {
        const image = await (0, cloudinary_1.cloudinaryUplaod)(file, "avatar");
        secure_url = image.secure_url;
        public_id = image.public_id;
    }
    try {
        const tokenExist = await getRegisterToken(token);
        if (!tokenExist)
            throw (0, customError_1.createCustomError)(403, "Invalid token");
        let userReferrerId = null;
        if (referrerCode) {
            const isRefExist = await getUserByReferral(referrerCode);
            if (!isRefExist)
                throw new Error("Referral code invalid!");
            userReferrerId = isRefExist.user_id;
        }
        const salt = (0, bcrypt_1.genSaltSync)(10);
        const hashedPass = (0, bcrypt_1.hashSync)(params.password, salt);
        await prisma_1.default.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    ...params,
                    password: hashedPass,
                    avatar: secure_url,
                    avatar_id: public_id,
                    referrerId: userReferrerId
                }
            });
            if (referrerCode && userReferrerId) {
                await createCoupon(userReferrerId, newUser.username);
                await createPointTransaction(userReferrerId);
            }
        });
    }
    catch (error) {
        if (public_id) {
            await (0, cloudinary_1.cloudinaryRemove)(public_id);
        }
        throw error;
    }
}
async function createRefreshTokens(email) {
    try {
        const user = await getUserByEmail(email);
        if (!user)
            throw new Error("Invalid email or password.");
        const payload = {
            id: user.user_id,
            email: user.email,
            username: user.username,
            role: user.role,
            avatar: user.avatar,
            referral_code: user.referral_code,
            points_balance: user.points_balance
        };
        const accessToken = (0, jsonwebtoken_1.sign)(payload, env_config_1.SECRET_ACCESS_KEY, { expiresIn: "10m" });
        const refreshToken = (0, jsonwebtoken_1.sign)(payload, env_config_1.SECRET_REFRESH_KEY, { expiresIn: "30d" });
        return {
            user,
            accessToken,
            refreshToken
        };
    }
    catch (error) {
        throw error;
    }
}
async function loginService(email, password) {
    try {
        const user = await getUserByEmail(email);
        if (!user)
            throw new Error("Invalid email or password.");
        const passValid = (0, bcrypt_1.compareSync)(password, user.password);
        if (!passValid)
            throw new Error("Invalid email or password.");
        const data = await createRefreshTokens(email);
        const exp = new Date();
        exp.setDate(exp.getDate() + 30);
        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;
        await prisma_1.default.$transaction(async (tx) => {
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
        };
    }
    catch (error) {
        throw error;
    }
}
async function refreshTokenService(token) {
    try {
        const findToken = await prisma_1.default.refreshToken.findFirst({
            where: { token: token },
            select: { user_id: true }
        });
        if (!findToken)
            throw (0, customError_1.createCustomError)(404, "Token tidak ditemukan");
        const findEmail = await prisma_1.default.user.findFirst({
            where: { user_id: findToken?.user_id },
            select: { email: true }
        });
        if (!findEmail)
            throw (0, customError_1.createCustomError)(404, "User not found!");
        const tokens = await createRefreshTokens(findEmail?.email);
        await prisma_1.default.refreshToken.deleteMany({
            where: { token: token },
        });
        const exp = new Date();
        exp.setDate(exp.getDate() + 30);
        await prisma_1.default.refreshToken.create({
            data: {
                token: tokens.refreshToken,
                expires_at: exp,
                user_id: findToken.user_id
            }
        });
        return {
            message: "OK",
            tokens
        };
    }
    catch (error) {
        throw error;
    }
}
