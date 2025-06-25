"use client";

import { client } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function ClientPage() {
  const { data } = useQuery({
    queryKey: ["client"],
    queryFn: () => {
      return client.get("/api/users/currentuser");
    },
  });

  console.log("ClientPage data 1:", data);

  console.log("ClientPage data:", data?.data?.data);

  return <div>ClientPage {data?.data?.currentUser.email}</div>;
}
