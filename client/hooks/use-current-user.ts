import { client } from "@/lib/axios";
import { useUserStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

type User = {
  id: string;
  email: string;
};

export function useCurrentUser(): User | null {
  const setId = useUserStore((s) => s.setId);

  const { data: user } = useQuery({
    queryKey: ["currentuser"],
    queryFn: () =>
      client.get("/api/users/currentuser").then((res) => res.data.currentUser),
  });

  useEffect(() => {
    if (user?.id) setId(user.id);
  }, [user?.id]);

  return user;
}
