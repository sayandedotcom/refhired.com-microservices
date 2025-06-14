import { Publisher, Subjects, UserCreatedEvent } from "@refhiredcom/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
}
