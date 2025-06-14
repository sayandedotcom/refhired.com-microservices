import { Subjects } from "../nats-streaming/subjects";
export interface ApplyDeletedEvent {
    subject: Subjects.ApplyDeleted;
    data: {
        id: string;
    };
}
