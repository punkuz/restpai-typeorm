import express, {Request, Response, NextFunction} from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import userRouter from "./routes/user-routes";
import tourRouter from "./routes/tour-routes";
import NodeError, { ErrorHandler } from "./extra/node-error";
import { StatusCodes } from "./constants/status-codes";

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
app.use("/api/v1/tours", tourRouter);

app.all("*", (req, res, next) => {
  next(new NodeError("The page you are looking, doesn't exist", StatusCodes.NOT_FOUND));
});

app.use(ErrorHandler)

export default app;
