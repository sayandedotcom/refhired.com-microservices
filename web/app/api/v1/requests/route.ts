import { NextRequest, NextResponse } from "next/server";

import prisma from "@referrer/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("userId");

  // const { user } = await getServerAuthSession();

  // const cachedAllRequests = await redis.get(`USER:REQUESTS:${userId}`);
  // if (cachedAllRequests) return JSON.parse(cachedAllRequests);
  const data = await prisma.user.findFirst({
    skip: 0,
    take: 10,
    where: {
      id: id,
    },
    select: {
      posts: {
        select: {
          id: true,
          description: true,
          stars: true,
          applied: {
            orderBy: {
              appliedAt: "desc",
            },
            select: {
              applyInfo: true,
              appliedAt: true,
              visibility: true,
              status: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // await redis.set(`USER:REQUESTS:${userId}`, JSON.stringify(requests), "EX", cacheTime);

  return NextResponse.json(
    { data },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
