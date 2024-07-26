import express from 'express';
import { json } from 'body-parser';
import { bookRouter } from './routes/books/bookRouter';
import { userRouter } from './routes/users/userRouter';

const app = express();

app.use(json());

app.use(userRouter);
app.use(bookRouter);

app.all('*', () => {
  throw new Error('Route not found.');
});

export { app };
