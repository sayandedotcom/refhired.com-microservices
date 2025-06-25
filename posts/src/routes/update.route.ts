import {
  NotAuthorizedError,
  requireAuth,
  validateRequest,
} from "@refhiredcom/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { PostUpdatedPublisher } from "../events/publisher/post-updated-publisher";
import { natsWrapper } from "../nats-wrapper";
import prisma from "../client";

const router = Router();

interface UpdatePostRequestBody {
  description: string;
  accept?: any;
  expiresAt?: string | null;
  stars?: number | null;
  version: number;
}

router.put(
  "/api/posts/:id",
  requireAuth,
  [body("description").not().isEmpty().withMessage("Description is required")],
  validateRequest,
  async (
    req: Request<{ id: string }, {}, UpdatePostRequestBody>,
    res: Response
  ) => {
    const { description, accept, expiresAt, stars, version } = req.body;
    const { id } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const post = await prisma.posts.findUnique({
        where: { id: id, version },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }

      const { count } = await tx.posts.updateMany({
        where: { id, version: post.version }, // OCC guard
        data: {
          description,
          accept,
          expiresAt,
          stars,
          version: { increment: 1 },
        },
      });

      if (count === 0) {
        throw new Error("Version conflict – please reload and try again");
      }

      return tx.posts.findUnique({ where: { id } });
    });

    await new PostUpdatedPublisher(natsWrapper.client).publish({
      id: result!.id,
      description: result!.description,
      version: result!.version,
    });

    res.status(200).send(result);
  }
);

export { router as updatePostRouter };
