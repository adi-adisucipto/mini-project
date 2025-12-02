"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByIdController = getUserByIdController;
const profile_service_1 = require("../services/profile.service");
async function getUserByIdController(req, res, next) {
    try {
        const { email } = req.body;
        const user = await (0, profile_service_1.getUserByIdService)(email);
        res.status(200).json({
            message: "Data berhasil diambil",
            user
        });
    }
    catch (error) {
        next(error);
    }
}
