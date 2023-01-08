import { Request, Response } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (err: Error, req: Request, res: Response ) => {

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({errors: err.serializeErrors()});
  }

  res.status(500).send({
    errors: [{ massage: 'Something went wrong' }]
  });
}
