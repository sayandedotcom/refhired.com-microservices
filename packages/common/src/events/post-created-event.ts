import { Subjects } from "../nats-streaming/subjects";

export interface PostCreatedEvent {
  subject: Subjects.PostCreated;
  data: {
    id: string;
    userId: string;
    accept?: any; // JSON array of any structure
    expiresAt?: string | null;
    stars?: number | null;
    totalApplied?: number | null;
    version: number;
  };
}
