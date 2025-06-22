import { Subjects } from "../nats-streaming/subjects";
export interface ApplyCreatedEvent {
    subject: Subjects.ApplyCreated;
    data: {
        id: string;
        userId: string;
        postId: string;
        applyInfo: any;
    };
}
