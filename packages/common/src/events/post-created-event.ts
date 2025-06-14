import { Subjects } from "../nats-streaming/subjects";

export interface PostCreatedEvent {
  subject: Subjects.PostCreated;
  data: {
    id: string;
    imageUrl: string;
    caption?: string | undefined;
    userId: string;
    username: string;
    avatarUrl?: string | undefined;
    version: number;
    createdAt: string;
    updatedAt: string;
  };
}
