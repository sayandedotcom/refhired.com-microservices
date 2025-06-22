import { Response, Router } from "express";
import prisma from "../client";

const router = Router();

router.get("/api/posts", async (_, res: Response) => {
  const posts = await prisma.posts.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(201).send(posts);
});

export { router as allPostsRouter };
