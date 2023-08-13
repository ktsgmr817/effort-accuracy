import serverlessExpress from "@vendia/serverless-express";
import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";

import taskRouter from "./router/taskRouter";
const app = express();
app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.status(200).send("ok");
});

app.use("/task", taskRouter);

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    console.error("Error:", err);
    // sendSlackNotification(err.message);
    res.status(500).send(err.message);
  }
);

export const handler = serverlessExpress({ app });
