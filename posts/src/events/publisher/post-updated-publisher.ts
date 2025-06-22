import { PostUpdatedEvent, Publisher, Subjects } from "@refhiredcom/common";

export class PostUpdatedPublisher extends Publisher<PostUpdatedEvent> {
  readonly subject = Subjects.PostUpdated;
}
