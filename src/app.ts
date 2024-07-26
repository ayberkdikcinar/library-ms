import express from 'express';
import { json } from 'body-parser';
const app = express();

app.use(json());

app.all('*', () => {
  throw new Error('Route not found.');
});

export { app };
