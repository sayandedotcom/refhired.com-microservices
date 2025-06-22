import { ApplyCreatedEvent, Listener, Subjects } from "@refhiredcom/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import prisma from "../../client";

export class ApplyCreatedEventListener extends Listener<ApplyCreatedEvent> {
  readonly subject = Subjects.ApplyCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: ApplyCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id } = data;

    const post = await prisma.posts.update({
      where: { id },
      data: {
        totalApplied: {
          increment: 1,
        },
      },
    });

    console.log(post);

    msg.ack();
  }
}
