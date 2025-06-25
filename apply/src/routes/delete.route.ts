import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@refhiredcom/common";
import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { ApplyDeletedPublisher } from "../event/publishers/apply-deleted-event-publisher";
import prisma from "../client";

const router = Router();

interface DeleteApplyRequestBody {
  postId: string;
}

router.delete(
  "/api/apply:postId",
  requireAuth,
  [param("postId").notEmpty().withMessage("Post ID must be provided")],
  validateRequest,
  async (req: Request<{}, {}, DeleteApplyRequestBody>, res: Response) => {
    const { postId } = req.body;
    const currentUserId = req.currentUser!.id;

    const apply = await prisma.applied.findUnique({
      where: {
        userId_postId: {
          userId: currentUserId,
          postId: postId,
        },
      },
    });

    if (!apply) {
      throw new NotFoundError();
    }

    await prisma.applied.delete({
      where: {
        id: apply.id,
      },
    });

    await new ApplyDeletedPublisher(natsWrapper.client).publish({
      id: apply.id,
    });

    res.status(200).send(apply);
  }
);

export { router as deleteApplyRouter };
