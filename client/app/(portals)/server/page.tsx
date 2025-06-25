export const dynamic = "force-dynamic";

import { client } from "@/lib/axios";

async function fetchPosts() {
  const response = await client.get("/api/likes/server");
  return response.data;
}

export default async function ServerPage() {
  const data = await fetchPosts();

  return <div>ServerPage {data?.data}</div>;
}
