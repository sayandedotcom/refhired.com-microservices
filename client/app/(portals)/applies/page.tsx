"use client";

import { PostCard } from "@/components/post-card";
import { useCurrentUser } from "@/hooks";
import { client } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type Apply = {
  id: string;
  appliedAt: string; // or Date if parsed
  userId: string;
  postId: string;
  applyInfo: {
    pdfs: { [key: string]: string }[]; // e.g. [{ resume: "url" }]
    links: { [key: string]: string }[]; // e.g. [{ linkedin: "..." }, { github: "..." }]
    message: string;
  };
  status: "Pending" | "Accepted" | "Rejected"; // adjust as needed
  reply: string | null;
};

export default function AppliesPage() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["currentuser"],
    queryFn: () =>
      client.get("/api/users/currentuser").then((res) => res.data.currentUser),
  });

  const userId = user?.id;

  const { data, isLoading } = useQuery<Apply[]>({
    queryKey: ["applies", userId],
    queryFn: async () => {
      const res = await client.get(`/api/apply/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  if (userLoading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div>No posts available</div>;
  }
  return (
    <div className="mx-56">
      {data?.map((apply) => (
        <PostCard key={apply.id}>
          <PostCard.Image src={"/images/avatar/avatar.png"} />
          <PostCard.Content>
            <PostCard.Header
              userName={user?.email}
              time={new Date(apply.appliedAt).toLocaleDateString()}
            />
            <PostCard.Description showMore={true}>
              {apply.applyInfo.message}
            </PostCard.Description>

            <PostCard.Footer>
              <div className="flex flex-col gap-1 text-right text-xs md:text-sm">
                <span className="text-muted-foreground">
                  Post ID:{" "}
                  <span className="text-foreground font-medium">
                    {apply.postId}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  Status:{" "}
                  <span className="capitalize text-[--primary] font-semibold">
                    {apply.status}
                  </span>
                </span>
                <div className="flex flex-wrap gap-2 pt-2">
                  {apply.applyInfo.pdfs.map((pdf, i) => (
                    <a
                      key={i}
                      href={Object.values(pdf)[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded bg-[--accent] px-2 py-1 text-[--accent-foreground] hover:underline"
                    >
                      PDF {i + 1}
                    </a>
                  ))}
                  {apply.applyInfo.links.map((link, i) => (
                    <a
                      key={i}
                      href={Object.values(link)[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded bg-[--secondary] px-2 py-1 text-[--secondary-foreground] hover:underline"
                    >
                      {Object.keys(link)[0]}
                    </a>
                  ))}
                </div>
              </div>
            </PostCard.Footer>
          </PostCard.Content>
        </PostCard>
      ))}
    </div>
  );
}
