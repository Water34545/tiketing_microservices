import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {validateRequest} from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/users/singin',
  [
    body('email')
      .isEmail()
      .withMessage('Provide a valid E-mail!'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply the password!')
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    res.send('Hi there');
  }
);

export { router as singInRouter };
