import "express-async-errors";

import { NotFoundError, currentUser, errorHandler } from "@refhiredcom/common";
import cookieSession from "cookie-session";
import express from "express";
import { newPostRouter } from "./routes/create.route";
import { deletePostRouter } from "./routes/delete.route";
import { updatePostRouter } from "./routes/update.route";
import { expirationRouter } from "./routes/expiration.route";
import { allPostsRouter } from "./routes/all.route";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.set("trust proxy", true);

app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);
app.use(newPostRouter);
app.use(deletePostRouter);
app.use(updatePostRouter);
app.use(expirationRouter);
app.use(allPostsRouter);

app.all("*", async (_req, _res, _next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
