import { BadRequestError, requireAuth } from "@refhiredcom/common";
import { Request, Response, Router } from "express";
import { param } from "express-validator";
import prisma from "../client";

const router = Router();

router.get(
  "/api/apply/:userId",
  requireAuth,
  [param("userId").notEmpty().withMessage("Post ID must be provided")],
  async (req: Request<{ userId: string }, {}>, res: Response) => {
    const { userId } = req.params;

    const currentUserId = req.currentUser!.id;

    console.log("All applies--------------", userId);

    if (!currentUserId || !userId) {
      throw new BadRequestError("Invalid request");
    }

    const apply = await prisma.applied.findMany({
      where: {
        userId: userId,
      },
    });

    console.log("All Apply-------------------", apply);

    res.status(201).send(apply);
  }
);

export { router as allAppliesRouter };
