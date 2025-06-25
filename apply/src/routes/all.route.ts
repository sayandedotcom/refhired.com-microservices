import { Response, Router } from "express";
import prisma from "../client";
import { requireAuth } from "@refhiredcom/common";

const router = Router();

router.get("/api/apply/temp/posts", async (_, res: Response) => {
  const posts = await prisma.posts.findMany({});

  res.status(201).send(posts);
});

router.get("/api/apply/temp/applied", async (_, res: Response) => {
  const posts = await prisma.applied.findMany({});

  res.status(201).send(posts);
});

router.get("/api/apply/temp/all", requireAuth, async (_, res: Response) => {
  const posts = await prisma.posts.findMany({
    include: {
      Applied: true,
    },
  });

  res.status(201).send(posts);
});

export { router as allPostsRouter };
