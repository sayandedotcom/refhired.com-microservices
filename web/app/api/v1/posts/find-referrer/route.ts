import { type NextRequest, NextResponse } from "next/server";

import prisma from "@referrer/prisma";

import { auth } from "@/lib/auth";

import { TFindReferralPost } from "@/types/types";

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/, "");

  if (!token) {
    return NextResponse.json(
      { message: "You are not authenticated" },
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const response: TFindReferralPost = await request.json();
  const session = await auth();

  // const key = `RATE_LIMIT:POST:${info.userId}`;
  // const currentCount = await redis.incr(key);

  // if (currentCount === 1) {
  //   // If the key was just created, set its expiration time
  //   await redis.expire(key, rateLimitTimeInSeconds);
  // }

  // if (currentCount > rateLimitMaxActionsAllowed) {
  //   // If the user has exceeded the maximum allowed posts, return false
  //   throw new RateLimitError("Please Wait");
  // }

  // const rateLimitFlag = await redis.get(`RATE_LIMIT:POST:${info.userId}`);
  // if (rateLimitFlag) throw new RateLimitError("Please Wait");
  const data = await prisma.posts.create({
    data: {
      userId: session.user.id,
      description: response.description,
      jobCode: response.jobCode,
      postType: "FINDREFERRER",
      companyName: response.companyName,
    },
  });

  //   // await redis.set(`RATE_LIMIT:POST:${info.userId}`, 1, "EX", rateLimitTimeInSeconds);
  //   // await redis.del("ALL_POSTS");

  return NextResponse.json(
    { data: data, message: "Sucessfully created the Post" },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
