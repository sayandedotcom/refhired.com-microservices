import { Listener, PostUpdatedEvent, Subjects } from "@refhiredcom/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import prisma from "../../client";

export class PostUpdatedEventListener extends Listener<PostUpdatedEvent> {
  readonly subject = Subjects.PostUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: PostUpdatedEvent["data"], msg: Message): Promise<void> {
    const { id, accept, expiresAt, stars, version } = data;

    const post = await prisma.posts.update({
      where: { id },
      data: {
        id,
        accept,
        expiresAt,
        stars,
        version,
      },
    });

    console.log(post);

    msg.ack();
  }
}
