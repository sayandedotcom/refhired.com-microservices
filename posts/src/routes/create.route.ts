import { requireAuth, validateRequest } from "@refhiredcom/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { PostCreatedPublisher } from "../events/publisher/post-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import prisma from "../client";
import type { Posts, Prisma } from "@prisma/client";

const router = Router();

interface PostReferralPostBody {
  description: Posts["description"];
  accept: Posts["accept"];
  expiresAt: Posts["expiresAt"];
  stars: Posts["stars"];
  totalApplied: Posts["totalApplied"];
  version: Posts["version"];
}

router.post(
  "/api/posts",
  requireAuth,
  [
    body("description")
      .isString()
      .withMessage("description must be a string")
      .trim()
      .notEmpty()
      .withMessage("description is required")
      .isLength({ max: 1_000 })
      .withMessage("description max length is 1000"),

    // ---- Expiry / limits ----
    body("expiresAt")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("expiresAt must be an ISO‑8601 date"),

    // ---- Accept JSON blob ----
    body("accept").optional(), // narrow if you know shape
    // .custom(/* add deeper validation here */),

    body("stars")
      .optional()
      .isInt({ min: 0 })
      .withMessage("stars must be a non‑negative integer"),
  ],
  validateRequest,
  async (req: Request<{}, {}, PostReferralPostBody>, res: Response) => {
    const request = req.body;
    const { id } = req.currentUser!;

    const post = await prisma.posts.create({
      data: {
        userId: id,
        description: request.description,
        accept: request.accept as Prisma.InputJsonValue, // Adjust type if needed
        expiresAt: request.expiresAt,
        stars: request.stars,
        totalApplied: request.totalApplied,
      },
    });

    await new PostCreatedPublisher(natsWrapper.client).publish({
      id: post.id,
      userId: post.userId,
      accept: post.accept,
      expiresAt: post.expiresAt ? post.expiresAt.toISOString() : null,
      stars: post.stars,
      version: post.version,
      totalApplied: post.totalApplied,
    });

    res.status(201).send(post);
  }
);

export { router as newPostRouter };
