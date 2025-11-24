import express from "express";
import cors from "cors";
import helmet from "helmet";
import errorMiddleware from "./middlewares/error.middleware";
import router from "./routes";
import eventsRouter from "./routes/events"
import "./services/cleanup"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use("/api", router);

app.use(errorMiddleware)

app.use("/api/events", eventsRouter); //buat link events


app.listen(8000, () => {
    console.log("Server is running");
})