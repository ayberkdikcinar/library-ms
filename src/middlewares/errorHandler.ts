import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/customError';
import { DatabaseError } from 'sequelize';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }
  if (err instanceof DatabaseError) {
    return res.status(500).send({
      errors: [{ message: err.message }],
    });
  }
  return res.status(500).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
