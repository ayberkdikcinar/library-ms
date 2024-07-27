import express from 'express';
import { body } from 'express-validator';
import { getUsers, createUser, borrowBook, getUser, returnBook } from './userController';
import { validateRequest } from '../../middlewares/validate-request';

const router = express.Router();

router.get('/users', getUsers);
router.post('/users', [body('name').isString().notEmpty()], validateRequest, createUser);
router.get('/users/:id', getUser);
router.post('/users/:userId/borrow/:bookId', borrowBook);
router.post('/users/:userId/return/:bookId', returnBook);

export { router as userRouter };
