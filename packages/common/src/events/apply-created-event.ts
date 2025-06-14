import { Subjects } from "../nats-streaming/subjects";

export interface ApplyCreateddEvent {
  subject: Subjects.ApplyCreated;
  data: {
    id: string;
    userId: string;
    postId: string;
    content: string;
    username: string;
  };
}
