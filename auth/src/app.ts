import { NotFoundError, errorHandler } from "@refhiredcom/common";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";

import { currentUserRouter } from "./routes/current-user.router";
import { signinRouter } from "./routes/signin.router";
import { signoutRouter } from "./routes/signout.router";
import { signupRouter } from "./routes/signup.router";

const app = express();

app.set("trust proxy", true); //traffic is being proxied to our app through ingress-nginx

app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(currentUserRouter);

app.all("*", async (_req, _res, _next) => {
  throw new NotFoundError();
}); //catch all route handler not defined above

app.use(errorHandler); //error handler middleware

export { app };
