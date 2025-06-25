"use client";

import { ApplyDialog } from "@/components/apply-dialog";
import Navbar from "@/components/navbar";
import { PostCard } from "@/components/post-card";
import { client } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | Array<JsonValue>;

export type SinglePost = {
  id: string | number;
  userId: string;
  createdAt?: string;
  description: string;
  accept: {
    message?: boolean;
    pdfs: string[];
    links: string[];
  };
  expiresAt: Date;
  stars: number | null;
  totalApplied?: number | null;
  version?: number;
  user: {
    id: string;
    userName: string;
  };
};

export type TPost = {
  data: SinglePost[];
};

export default function HomePage() {
  const { data } = useQuery<TPost>({
    queryKey: ["client"],
    queryFn: () => {
      return client.get("/api/posts");
    },
  });

  return (
    <>
      <div className="mx-56">
        {data?.data?.map((data) => (
          <PostCard key={data.id}>
            <PostCard.Image src={"/images/avatar/avatar.png"} />
            <PostCard.Content>
              <PostCard.Header
                userName={data.user?.userName}
                time={new Date(data.expiresAt).toLocaleDateString()}
              />
              <PostCard.Description showMore={true}>
                {data.description}
              </PostCard.Description>
              <PostCard.Footer>
                <ApplyDialog
                  userId={data.userId}
                  myObject={data.accept}
                  postId={data.id}
                  stars={data.stars}
                />
              </PostCard.Footer>
            </PostCard.Content>
          </PostCard>
        ))}
      </div>
    </>
  );
}
