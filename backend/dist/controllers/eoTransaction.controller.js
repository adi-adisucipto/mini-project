"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEOTransactions = getEOTransactions;
exports.acceptEOTransaction = acceptEOTransaction;
exports.rejectEOTransaction = rejectEOTransaction;
const eoTransaction_service_1 = require("../services/eoTransaction.service");
const client_1 = require("@prisma/client");
async function getEOTransactions(req, res, next) {
    try {
        const organizerId = req.user?.user_id || req.user?.id;
        const status = req.query.status;
        const items = await (0, eoTransaction_service_1.listEOTransactions)(organizerId, status);
        res.json(items);
    }
    catch (err) {
        next(err);
    }
}
async function acceptEOTransaction(req, res, next) {
    try {
        const organizerId = req.user?.user_id || req.user?.id;
        const updated = await (0, eoTransaction_service_1.updateEOTransactionStatus)(req.params.id, organizerId, client_1.StatusPay.Done);
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
}
async function rejectEOTransaction(req, res, next) {
    try {
        const organizerId = req.user?.user_id || req.user?.id;
        const updated = await (0, eoTransaction_service_1.updateEOTransactionStatus)(req.params.id, organizerId, client_1.StatusPay.Rejected);
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
}
