import { Listener, Subjects, UserCreatedEvent } from "@refhiredcom/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import prisma from "../../client";

export class UserCreatedEventListener extends Listener<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: UserCreatedEvent["data"], msg: Message): Promise<void> {
    const { id, email } = data;

    const post = await prisma.user.create({
      data: {
        id,
        email,
        userName: email.split("@")[0], // Example logic to create a username
      },
    });

    console.log(post);

    msg.ack();
  }
}
