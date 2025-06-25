import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from "@refhiredcom/common";
import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { ApplyCreatedPublisher } from "../event/publishers/apply-created-event-publisher";
import prisma from "../client";

const router = Router();

interface CreateApplyRequestBody {
  applyInfo: any; // Json Value
  // postId: string;
}

router.post(
  "/api/apply/:postId",
  requireAuth,
  [
    body("applyInfo").not().isEmpty().withMessage("Content is required"),
    param("postId").notEmpty().withMessage("Post ID must be provided"),
  ],
  validateRequest,
  async (
    req: Request<{ postId: string }, {}, CreateApplyRequestBody>,
    res: Response
  ) => {
    const { applyInfo } = req.body;
    const { postId } = req.params; // ✅ Get postId from params

    const currentUserId = req.currentUser!.id;

    console.log(
      "Creating apply for post:",
      postId,
      "by user:",
      currentUserId,
      applyInfo
    );

    if (!currentUserId || !postId || !applyInfo) {
      throw new BadRequestError("Invalid request");
    }

    const apply = await prisma.applied.create({
      data: {
        applyInfo,
        postId,
        userId: currentUserId,
      },
    });

    console.log("Apply created:", apply);

    if (!apply) {
      throw new BadRequestError("Failed to create apply");
    }

    await prisma.posts.update({
      where: { id: postId },
      data: {
        totalApplied: {
          increment: 1,
        },
      },
    });

    await new ApplyCreatedPublisher(natsWrapper.client).publish({
      id: apply.id,
      applyInfo: apply.applyInfo,
      postId: apply.postId,
      userId: apply.userId,
    });

    res.status(201).send(apply);
  }
);

export { router as createApplyRouter };
