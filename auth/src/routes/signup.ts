import { BadRequestError, validateRequest } from "@refhiredcom/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { UserCreatedPublisher } from "../events/publishers/user-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

interface SignupRequestBody {
  email: string;
  password: string;
}

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request<{}, {}, SignupRequestBody>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError(
        "Email or password or username was not provided"
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = await User.build({ email, password }).save();

    const userJWT = User.createJWT(user);

    req.session = {
      jwt: userJWT,
    };

    await new UserCreatedPublisher(natsWrapper.client).publish({
      id: user.id,
      email,
    });

    res.status(201).send(user);
  }
);

export { router as signupRouter };
