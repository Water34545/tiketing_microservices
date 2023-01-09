import express, { Request, Response } from 'express';
import { body } from  'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@water-ticketing/common';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/singup',
  [
    body('email')
      .isEmail()
      .withMessage('Provide a valid E-mail!'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 20})
      .withMessage('Password must been between 4 and 20 characters!')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email already in use!');
    }

    const user = User.build({email, password});
    await user.save();

    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);

    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);
  }
);

export { router as singUpRouter };
