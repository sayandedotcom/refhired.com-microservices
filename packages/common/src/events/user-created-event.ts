import { Subjects } from "../nats-streaming/subjects";

export interface UserCreatedEvent {
  subject: Subjects.UserCreated;
  data: {
    id: string;
    email: string;
  };
}
