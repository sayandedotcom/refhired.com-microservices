import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import prisma from "./client";
import { ApplyCreatedEventListener } from "./events/listner/apply-created-listner";
import { UserCreatedEventListener } from "./events/listner/user-created-listner";

const bootstrap = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be defined");
  }

  if (!process.env.NATS_URI) {
    throw new Error("NATS_URI must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  try {
    await prisma.$connect();
    console.log("Connected to the database!");

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new ApplyCreatedEventListener(natsWrapper.client).listen();
    new UserCreatedEventListener(natsWrapper.client).listen();
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

bootstrap();
