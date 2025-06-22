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
    const { description } = req.body;
    const { id } = req.params;

    const post = await prisma.posts.findUnique({
      where: { id: id },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await prisma.posts.update({
      where: { id: id },
      data: {
        description: description,
        version: { increment: 1 },
      },
    });

    await new PostUpdatedPublisher(natsWrapper.client).publish({
      id: post.id,
      description: post.description,
      version: post.version,
    });

    res.status(200).send(post);
  }
);

export { router as updatePostRouter };
