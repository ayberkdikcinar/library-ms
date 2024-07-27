import express from 'express';
import { getBook, getBooks, createBook } from './bookController';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/books', getBooks);
router.get('/books/:id', getBook);
router.post('/books', [body('name').not().isEmpty().withMessage('name must be provided')], validateRequest, createBook);

export { router as bookRouter };
