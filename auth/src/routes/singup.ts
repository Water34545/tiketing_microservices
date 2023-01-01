import express, { Request, Response } from 'express';
import { body, validationResult } from  'express-validator';
import { DatabaseConnectionError } from '../errors/databaseConnectionError';
import { RequestValidationError } from  '../errors/requestValidationError';

const router = express.Router();

router.post('/api/users/singup', [
  body('email')
    .isEmail()
    .withMessage('Provide a valid E-mail!'),
  body('password')
    .trim()
    .isLength({ min: 6, max: 20})
    .withMessage('Password must been between 4 and 20 characters!')
], (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const { email, password } = req.body;

  console.log('Creating user...');
  throw new DatabaseConnectionError();

  // res.send('Hi there');
});

export { router as singUpRouter };