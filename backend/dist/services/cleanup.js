"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
const node_cron_1 = __importDefault(require("node-cron"));
async function deleteExpiredTokens() {
    const now = new Date();
    try {
        const result = await prisma_1.default.token.deleteMany({
            where: {
                expires_at: {
                    lt: now
                }
            }
        });
        console.log("Berhasil menghapus token");
        return result;
    }
    catch (error) {
        console.log("Gagal menghapus token. Error: " + error);
    }
}
node_cron_1.default.schedule("*/10 * * * *", deleteExpiredTokens);
deleteExpiredTokens();
