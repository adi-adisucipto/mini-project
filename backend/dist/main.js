"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const routes_1 = __importDefault(require("./routes"));
const event_router_1 = __importDefault(require("./routes/event.router"));
require("./services/cleanup");
require("./services/cleanupExpiredTransaction");
require("./services/cleanupRejectedTransaction");
require("./services/cleanupConfirmExpiresTransaction");
require("./services/cleanupConfirmExpiresTransaction");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use("/api", routes_1.default);
app.use(error_middleware_1.default);
app.use("/api/events", event_router_1.default); //buat link events
//check this pindah ke index *
app.listen(8000, () => {
    console.log("Server is running");
});
