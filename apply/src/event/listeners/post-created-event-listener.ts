import { Listener, PostCreatedEvent, Subjects } from "@refhiredcom/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import prisma from "../../client";

export class PostCreatedEventListener extends Listener<PostCreatedEvent> {
  readonly subject = Subjects.PostCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: PostCreatedEvent["data"], msg: Message): Promise<void> {
    const { id, userId, accept, expiresAt, stars, totalApplied, version } =
      data;

    const post = await prisma.posts.create({
      data: {
        id,
        userId,
        accept,
        expiresAt,
        stars,
        totalApplied,
        version,
      },
    });

    console.log(post);

    msg.ack();
  }
}
