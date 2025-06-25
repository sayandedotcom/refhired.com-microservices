import "express-async-errors";

import { NotFoundError, currentUser, errorHandler } from "@refhiredcom/common";
import cookieSession from "cookie-session";
import express from "express";
import { createApplyRouter } from "./routes/create.route";
import { deleteApplyRouter } from "./routes/delete.route";
import { allAppliesRouter } from "./routes/all-applies.route";
import { allPostsRouter } from "./routes/all.route";

import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.set("trust proxy", true);

app.use(express.json());

app.use(cors());

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);
app.use(createApplyRouter);
app.use(deleteApplyRouter);
app.use(allAppliesRouter);
app.use(allPostsRouter);

app.all("*", async (_req, _res, _next) => {
  throw new NotFoundError();
}); //catch all route handler not defined above

app.use(errorHandler);

export { app };
