import express from "express";
import cors from "cors";
import helmet from "helmet";
import errorMiddleware from "./middlewares/error.middleware";
import router from "./routes";
import "./services/cleanup"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use("/api", router);

app.use(errorMiddleware)

app.listen(8000, () => {
    console.log("Server is running");
})