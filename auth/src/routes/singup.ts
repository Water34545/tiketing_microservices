import express, { Request, Response } from 'express';
import { body, validationResult } from  'express-validator';
import { User } from '../models/user';
import { RequestValidationError } from  '../errors/requestValidationError';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/singup', [
  body('email')
    .isEmail()
    .withMessage('Provide a valid E-mail!'),
  body('password')
    .trim()
    .isLength({ min: 6, max: 20})
    .withMessage('Password must been between 4 and 20 characters!')
], async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('Email already in use!');
  }

  const user = User.build({email, password});
  await user.save();

  res.status(201).send(user);
});

export { router as singUpRouter };
