import { Subjects } from "../nats-streaming/subjects";

export interface PostDeletedEvent {
  subject: Subjects.PostDeleted;
  data: {
    id: string;
    version: number;
  };
}
