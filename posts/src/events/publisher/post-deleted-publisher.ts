import { Publisher, PostDeletedEvent, Subjects } from "@refhiredcom/common";

export class PostDeletedPublisher extends Publisher<PostDeletedEvent> {
  readonly subject = Subjects.PostDeleted;
}
