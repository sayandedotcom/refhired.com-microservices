import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from "@refhiredcom/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { ApplyCreatedPublisher } from "../event/publishers/apply-created-event-publisher";
import prisma from "../client";

const router = Router();

interface CreateApplyRequestBody {
  applyInfo: any; // Json Value
  postId: string;
}

router.post(
  "/api/apply",
  requireAuth,
  [
    body("applyInfo").not().isEmpty().withMessage("Content is required"),
    body("postId").isMongoId().withMessage("PostId must be provided"),
  ],
  validateRequest,
  async (req: Request<{}, {}, CreateApplyRequestBody>, res: Response) => {
    const { applyInfo, postId } = req.body;
    const currentUserId = req.currentUser!.id;

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
    if (!apply) {
      throw new BadRequestError("Failed to create apply");
    }

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
