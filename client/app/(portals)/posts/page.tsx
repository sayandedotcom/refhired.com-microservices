"use client";

import { PostCard } from "@/components/post-card";
import { useCurrentUser } from "@/hooks";
import { client } from "@/lib/axios";
import { useUserStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

type Post = {
  id: string;
  userId: string;
  createdAt: string; // or Date, if you parse it
  description: string;
  accept: {
    pdfs: string[];
    links: string[];
    message: boolean;
  };
  expiresAt: string; // or Date
  stars: number;
  totalApplied: number;
  version: number;
};

type GetPostsResponse = {
  data: Post[];
};

export default function PostsPage() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["currentuser"],
    queryFn: () =>
      client.get("/api/users/currentuser").then((res) => res.data.currentUser),
  });

  const userId = user?.id;

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["posts", userId],
    queryFn: async () => {
      const res = await client.get(`/api/posts/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  if (userLoading || postsLoading) {
    return <div>Loading...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div className="mx-56">
      {posts?.map((data) => (
        <PostCard key={data.id}>
          <PostCard.Image src={"/images/avatar/avatar.png"} />
          <PostCard.Content>
            <PostCard.Header
              userName={user?.email}
              time={new Date(data.expiresAt).toLocaleDateString()}
            />
            <PostCard.Description showMore={true}>
              {data.description}
            </PostCard.Description>
          </PostCard.Content>
        </PostCard>
      ))}
    </div>
  );
}
