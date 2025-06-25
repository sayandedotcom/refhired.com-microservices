"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export const PostCard = ({ children }: { children: any }) => {
  return (
    <div className="border-border mx-auto my-2 flex gap-2 rounded-lg border-2 p-1 md:w-11/12 md:gap-3 md:p-4">
      {children}
    </div>
  );
};

function ProfileImage({ src }: { src: string }) {
  return (
    <div className="w-[12%]">
      <Image
        id="profile-picture"
        alt="img"
        src={src}
        width={64}
        height={64}
        className="mx-auto cursor-pointer rounded-full"
      />
    </div>
  );
}

PostCard.Image = ProfileImage;

function PostCardContent({ children }: { children: any }) {
  return (
    <div className="flex w-[88%] flex-col gap-2 md:w-full">{children}</div>
  );
}

PostCard.Content = PostCardContent;

function PostCardHeader({ userName, time }: { userName: string; time?: any }) {
  return (
    <div className="font-heading flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm md:text-base">
        <span
          id="post-username"
          className="dark:text-foreground cursor-pointer hover:underline"
        >
          @{userName}
        </span>
        <span className="text-muted-foreground text-sm" id="post-uploaded">
          {time}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Badge className="cursor-pointer capitalize">Referral Post</Badge>
      </div>
    </div>
  );
}

PostCard.Header = PostCardHeader;

function PostCardDescription({
  children,
  showMore,
}: {
  children: string;
  showMore?: Boolean;
}) {
  return (
    <>
      <span
        id="post-content"
        className={cn(
          "font-heading cursor-pointer text-xs md:text-base",
          showMore && "line-clamp-3"
        )}
      >
        {children}
      </span>
      {showMore && children.length > 300 && (
        <span className="float-right text-xs md:text-sm">....Show more</span>
      )}
    </>
  );
}

PostCard.Description = PostCardDescription;

function PostCardFooter({ children }: { children: any }) {
  return (
    <div className="font-heading mt-2 flex items-center justify-end">
      {children}
    </div>
  );
}

PostCard.Footer = PostCardFooter;
