import { Subjects } from "../nats-streaming/subjects";
export interface PostCreatedEvent {
    subject: Subjects.PostCreated;
    data: {
        id: string;
        userId: string;
        accept?: any;
        expiresAt?: string | null;
        stars?: number | null;
        totalApplied?: number | null;
        version: number;
    };
}
