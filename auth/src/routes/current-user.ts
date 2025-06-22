import { currentUser } from "@refhiredcom/common";
import { Request, Response, Router } from "express";

const router = Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  async (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
