import { CustomError } from './customError';
import { ValidationError } from 'express-validator';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters.');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      if (error.type === 'field') {
        return {
          message: error.msg,
          path: error.path,
        };
      }
      return {
        message: error.msg,
        path: 'unknown',
      };
    });
  }
}
