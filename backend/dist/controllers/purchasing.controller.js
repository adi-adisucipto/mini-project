"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionController = createTransactionController;
exports.getEventByIdController = getEventByIdController;
exports.uploadProofController = uploadProofController;
exports.getTransactionByUserIdController = getTransactionByUserIdController;
exports.cancelTransactionController = cancelTransactionController;
exports.calculateDiscController = calculateDiscController;
const purchasing_service_1 = require("../services/purchasing.service");
const customError_1 = require("../utils/customError");
async function createTransactionController(req, res, next) {
    try {
        const user = req.user;
        if (!user)
            return next(new Error("Please login"));
        const { id, email, username, points_balance } = user;
        const eventId = req.params.id;
        const { ticket, pointsToUse, codeCoupon, codeVouche } = req.body;
        const userId = id;
        const data = await (0, purchasing_service_1.createTransactionService)(eventId, username, email, userId, points_balance, ticket, pointsToUse, codeCoupon, codeVouche);
        res.status(201).json({
            messsage: "Berhasil membuat pesanan. Cek email kamu",
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function getEventByIdController(req, res, next) {
    try {
        const eventId = req.params.id;
        const user = await (0, purchasing_service_1.getEventById)(eventId);
        if (!user)
            return next(new Error("Please login"));
        res.status(200).json({
            message: "Berhasil",
            user
        });
    }
    catch (error) {
        next(error);
    }
}
async function uploadProofController(req, res, next) {
    try {
        const transactionId = req.params.id;
        const file = req.file;
        if (!file)
            throw (0, customError_1.createCustomError)(400, "File bukti pembayaran tidak ditemukan");
        const data = await (0, purchasing_service_1.uploadProofService)(transactionId, file);
        res.status(200).json({
            message: "Berhasil upload!",
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function getTransactionByUserIdController(req, res, next) {
    try {
        const { email } = req.body;
        const data = await (0, purchasing_service_1.getTransactionByUserEmail)(email);
        console.log(data);
        res.status(200).json({
            data
        });
    }
    catch (error) {
        next(error);
    }
}
async function cancelTransactionController(req, res, next) {
    try {
        const { id } = req.body;
        console.log(id);
        const data = await (0, purchasing_service_1.cancelTransactionService)(id);
        res.status(200).json({
            message: "Berhasil membatalkan pembelian"
        });
    }
    catch (error) {
        next(error);
    }
}
async function calculateDiscController(req, res, next) {
    try {
        const { idEvent, ticket, pointsToUse, codeCoupon, codeVouche } = req.body;
        const disc = await (0, purchasing_service_1.calculateDisc)(idEvent, ticket, pointsToUse, codeCoupon, codeVouche);
        res.status(200).json({
            disc
        });
    }
    catch (error) {
        next(error);
    }
}
