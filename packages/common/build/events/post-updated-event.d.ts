import { Subjects } from "../nats-streaming/subjects";
export interface PostUpdatedEvent {
    subject: Subjects.PostUpdated;
    data: {
        id: string;
        description?: string | null;
        accept?: any;
        expiresAt?: string | null;
        stars?: number | null;
        version: number;
    };
}
