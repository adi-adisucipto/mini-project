"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByIdService = getUserByIdService;
const prisma_1 = __importDefault(require("../lib/prisma"));
const customError_1 = require("../utils/customError");
async function getUserByIdService(email) {
    try {
        const user = await prisma_1.default.user.findFirst({
            where: {
                email: email
            }
        });
        console.log(email);
        if (!user)
            throw (0, customError_1.createCustomError)(404, "User not found");
        return user;
    }
    catch (error) {
        throw error;
    }
}
