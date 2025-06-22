import { Publisher, PostCreatedEvent, Subjects } from "@refhiredcom/common";

export class PostCreatedPublisher extends Publisher<PostCreatedEvent> {
  readonly subject = Subjects.PostCreated;
}
