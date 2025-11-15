import express from "express";
import cors from "cors";
import helmet from "helmet";
import errorMiddleware from "./middlewares/error.middleware";
import router from "./routes";
import { PORT } from "./configs/env.config";

const port = PORT

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use("/api", router);

app.use(errorMiddleware)

app.listen(port, () => {
    console.log("Server is running on port " + port);
})