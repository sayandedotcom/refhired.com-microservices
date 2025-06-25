"use client";

import Link from "next/link";
import { DropdownMenuNavbar } from "./navbar-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function Navbar() {
  return (
    <div className="bg-muted flex h-16 items-center justify-between px-4">
      <Link href={"/home"}>
        <h4>Microservice app !</h4>
      </Link>
      <Link href={"/post"}>Post !</Link>
      <Link href={"/posts"}>See your all posts</Link>
      <Link href={"/applies"}>See your all applies</Link>
      <DropdownMenuNavbar>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuNavbar>
    </div>
  );
}

export default Navbar;
