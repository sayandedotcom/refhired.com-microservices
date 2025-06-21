import { Subjects } from "../nats-streaming/subjects";
import { ApplyStatus } from "./types/apply-status";

export interface ApplyReplyEvent {
  subject: Subjects.ApplyCreated;
  data: {
    id: string;
    userId: string;
    postId: string;
    status: ApplyStatus;
    reply: String;
  };
}
