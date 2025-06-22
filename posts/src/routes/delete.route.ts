import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@refhiredcom/common";
import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { PostDeletedPublisher } from "../events/publisher/post-deleted-publisher";
import { natsWrapper } from "../nats-wrapper";
import prisma from "../client";

const router = Router();

router.delete(
  "/api/posts/:postId",
  requireAuth,
  [param("postId").notEmpty().withMessage("Post ID must be provided")],
  validateRequest,
  async (req: Request<{ postId: string }>, res: Response) => {
    const { postId } = req.params;
    const { id } = req.currentUser!;

    const post = await prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundError();
    }

    if (post.userId !== id) {
      throw new NotAuthorizedError();
    }

    await prisma.posts.delete({
      where: { id: postId },
    });

    await new PostDeletedPublisher(natsWrapper.client).publish({
      id: post.id,
      version: post.version,
    });

    res.status(204).send(post);
  }
);

export { router as deletePostRouter };
