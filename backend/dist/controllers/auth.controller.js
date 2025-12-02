"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationLinkController = verificationLinkController;
exports.verifyController = verifyController;
exports.loginController = loginController;
exports.refreshTokenController = refreshTokenController;
const auth_service_1 = require("../services/auth.service");
const generateReferralCode_1 = require("../utils/generateReferralCode");
const jsonwebtoken_1 = require("jsonwebtoken");
const env_config_1 = require("../configs/env.config");
const customError_1 = require("../utils/customError");
async function verificationLinkController(req, res, next) {
    try {
        const { email } = req.body;
        await (0, auth_service_1.verificationLinkService)(email);
        res.json({
            message: "Email sent successfully"
        });
    }
    catch (error) {
        throw error;
    }
}
async function verifyController(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw (0, customError_1.createCustomError)(401, "Unauthorize");
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jsonwebtoken_1.verify)(token, env_config_1.SECRET_KEY);
        const email = decoded.email;
        const file = req.file;
        const { username, password, referrerCode, role } = req.body;
        const referral_code = (0, generateReferralCode_1.generateReferralCode)();
        await (0, auth_service_1.verifyService)(token, { email, username, password, role, referral_code }, file, referrerCode);
        res.status(200).json({
            message: "User registered successfully"
        });
    }
    catch (error) {
        next(error);
    }
}
async function loginController(req, res, next) {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await (0, auth_service_1.loginService)(email, password);
        res.status(200).json({
            message: "Login success",
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        next(error);
    }
}
async function refreshTokenController(req, res, next) {
    try {
        const refreshToken = req.body.refreshToken;
        const data = await (0, auth_service_1.refreshTokenService)(refreshToken);
        res.json({
            accessToken: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken
        });
    }
    catch (error) {
        next(error);
    }
}
