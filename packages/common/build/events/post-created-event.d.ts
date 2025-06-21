import { Subjects } from "../nats-streaming/subjects";
export interface PostCreatedEvent {
  subject: Subjects.PostCreated;
  data: {
    id: string;
    userId: string;
    description?: string | null;
    accept?: any;
    createdAt: string;
    expiresAt?: string | null;
    stars?: number | null;
    version: number;
    totalApplied?: number | null;
  };
}
