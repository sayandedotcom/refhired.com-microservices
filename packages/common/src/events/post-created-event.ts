import { Subjects } from "../nats-streaming/subjects";

export interface PostCreatedEvent {
  subject: Subjects.PostCreated;
  data: {
    id: string;
    postType?: string | null; // "POST" | "REFERRAL", depending on enum
    description?: string | null;
    accept?: any; // JSON array of any structure
    acceptLimit?: number | null;
    companyName?: string | null;
    expiresAt?: string | null;
    jobCode?: string | null;
    jobCompensation?: string | null;
    jobExperience?: number | null;
    jobLocationType?: string | null;
    jobLocation?: string | null;
    jobRole?: string | null;
    jobType?: string | null;
    jobURL?: string | null;
    tags?: string[] | null;
    stars?: number | null;
    userId: string;
    version: number;
    createdAt: string;
    updatedAt: string;
  };
}
