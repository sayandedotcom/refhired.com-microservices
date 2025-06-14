import { Subjects } from "../nats-streaming/subjects";
export interface PostUpdatedEvent {
    subject: Subjects.PostUpdated;
    data: {
        id: string;
        caption: string;
        version: number;
    };
}
