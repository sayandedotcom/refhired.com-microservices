import { Publisher, ApplyCreatedEvent, Subjects } from "@refhiredcom/common";

export class ApplyCreatedPublisher extends Publisher<ApplyCreatedEvent> {
  subject: Subjects.ApplyCreated = Subjects.ApplyCreated;
}
