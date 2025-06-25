import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks";
import { client } from "@/lib/axios";
import { useUserStore } from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function DropdownMenuNavbar({
  children,
}: {
  children?: React.ReactNode;
}) {
  const user = useCurrentUser();

  const { mutate } = useMutation({
    mutationFn: () => {
      return client.post("/api/users/signout");
    },
    onSuccess: () => {
      window.location.href = "/signin"; // Redirect to sign-in page after logout
    },
    onError: (error: any) => {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {user?.email}
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => mutate()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
