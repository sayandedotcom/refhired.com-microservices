import { Request, Response, Router } from "express";
import prisma from "../client";

import { expirationTime } from "../utils/expiration-time";

const router = Router();

router.post(
  "/api/posts/expiration",
  async (req: Request, res: Response): Promise<Response> => {
    if (req.headers["x-cron-token"] !== process.env.EXPIRATION_CRONJOB_TOKEN) {
      return res.status(401).send("Unauthorized");
    }

    const cutoff = expirationTime();

    const { count } = await prisma.posts.deleteMany({
      where: { expiresAt: { lt: cutoff } },
    });

    return res.status(200).send(count);
  }
);

export { router as expirationRouter };
