import { Publisher, ApplyDeletedEvent, Subjects } from "@refhiredcom/common";

export class ApplyDeletedPublisher extends Publisher<ApplyDeletedEvent> {
  subject: Subjects.ApplyDeleted = Subjects.ApplyDeleted;
}
