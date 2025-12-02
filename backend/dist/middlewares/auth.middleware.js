"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.organizerOnly = organizerOnly;
const jsonwebtoken_1 = require("jsonwebtoken");
const customError_1 = require("../utils/customError");
const env_config_1 = require("../configs/env.config");
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw (0, customError_1.createCustomError)(401, "Unauthorized!");
        }
        const token = authHeader.split(" ")[1];
        console.log(token);
        const decode = (0, jsonwebtoken_1.verify)(token, env_config_1.SECRET_ACCESS_KEY);
        req.user = decode;
        next();
    }
    catch (error) {
        next(error);
    }
}
function organizerOnly(req, res, next) {
    if (!req.user || (req.user.role !== "ORGANIZER" && req.user.role !== "ADMIN")) {
        return next((0, customError_1.createCustomError)(403, "Organizer only")); // inget the forum where you got this and learn again
    }
    next();
}
