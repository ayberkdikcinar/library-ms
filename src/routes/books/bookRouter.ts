import express from 'express';
import { getBook, getBooks, createBook } from './bookController';
const router = express.Router();

router.get('/books', getBooks);
router.get('/books/:id', getBook);
router.post('/books', createBook);

export { router as bookRouter };
