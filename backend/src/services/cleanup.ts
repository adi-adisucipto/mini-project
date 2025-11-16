import prisma from "../lib/prisma";
import cron from "node-cron";

async function deleteExpiredTokens() {
    const now = new Date();

    try {
        const result = await prisma.token.deleteMany({
            where: {
                expires_at: {
                    lt: now
                }
            }
        });

        console.log("Berhasil menghapus token");
        return result;
    } catch (error) {
        console.log("Gagal menghapus token. Error: " + error);
    }
}

cron.schedule("*/10 * * * *", deleteExpiredTokens);
deleteExpiredTokens();