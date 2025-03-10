import express, {Request, Response, NextFunction} from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import userRouter from "./routes/user-routes";

//create express app
const app = express();

app.set("trust proxy", true);

// 1) MIDDLEWARES
let corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
//Set Cors
app.use(cors(corsOptions));

//sanitization

//Set security HTTP headers
app.use(helmet());
//prevent parameter pollution
app.use(hpp());

//Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//middleware
app.use(express.json());

app.use("/api/v1/users", userRouter);

export default app;
