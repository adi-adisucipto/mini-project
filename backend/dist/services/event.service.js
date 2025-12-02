"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvents = listEvents;
exports.createEvent = createEvent;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function listEvents(params) {
    const { search, location } = params;
    const where = {};
    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }
    if (location)
        where.location = { equals: location, mode: "insensitive" };
    return prisma_1.default.event.findMany({
        where: Object.keys(where).length ? where : undefined,
        orderBy: { start_date: "asc" },
    });
}
async function createEvent(data) {
    return prisma_1.default.event.create({
        data: {
            ...data,
            available_seats: data.total_seats,
        },
    });
}
