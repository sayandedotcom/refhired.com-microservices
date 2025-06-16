import { Subjects } from "../nats-streaming/subjects";
export interface PostCreatedEvent {
    subject: Subjects.PostCreated;
    data: {
        id: string;
        postType?: string | undefined;
        description?: string | undefined;
        accept?: any[] | undefined;
        acceptLimit?: number | undefined;
        companyName?: string | undefined;
        expiresAt?: string | undefined;
        jobCode?: string | undefined;
        jobCompensation?: string | undefined;
        jobExperience?: number | undefined;
        jobLocationType?: string | undefined;
        jobLocation?: string | undefined;
        jobRole?: string | undefined;
        jobType?: string | undefined;
        jobURL?: string | undefined;
        tags?: string[] | undefined;
        stars?: number | undefined;
        userId: string;
        version: number;
        createdAt: string;
        updatedAt: string;
    };
}
