import { CustomError } from './customError';

export class ServerError extends CustomError {
  statusCode = 500;

  constructor() {
    super('Server Error Occured');
    Object.setPrototypeOf(this, ServerError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
