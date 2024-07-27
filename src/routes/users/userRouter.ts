import express from 'express';
import { body } from 'express-validator';
import { getUsers, createUser, borrowBook, getUser, returnBook } from './userController';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/users', getUsers);
router.post('/users', [body('name').not().isEmpty().withMessage('name must be provided')], validateRequest, createUser);
router.get('/users/:id', getUser);
router.post('/users/:userId/borrow/:bookId', borrowBook);
router.post(
  '/users/:userId/return/:bookId',
  [body('score').isNumeric().withMessage('score must be provided and it must be in numeric type')],
  validateRequest,
  returnBook
);

export { router as userRouter };
