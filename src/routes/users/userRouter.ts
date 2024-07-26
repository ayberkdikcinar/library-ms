import express from 'express';
import { getUsers, createUser, borrowBook, getUser, returnBook } from './userController';

const router = express.Router();

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:id', getUser);
router.post('/users/:userId/borrow/:bookId', borrowBook);
router.post('/users/:userId/return/:bookId', returnBook);

export { router as userRouter };
