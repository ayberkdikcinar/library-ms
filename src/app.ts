import express from 'express';
import { json } from 'body-parser';
import { bookRouter } from './routes/books/bookRouter';
import { userRouter } from './routes/users/userRouter';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/notFoundError';

const app = express();

app.use(json());

app.use(userRouter);
app.use(bookRouter);

app.all('*', () => {
  throw new NotFoundError('Route Not Found.');
});

app.use(errorHandler);

export { app };
