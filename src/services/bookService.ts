import BookEntity from '../database/models/Book';
import BorrowEntity from '../database/models/Transaction';
import { NotFoundError } from '../errors/notFoundError';
import { Book, CreateBookAttributes } from '../interfaces/Book';

async function getBooks(): Promise<Book[]> {
  return await BookEntity.findAll();
}

async function getBookById(bookId: string): Promise<Book | null> {
  const book = await BookEntity.findOne({ where: { id: bookId } });
  if (!book) {
    throw new NotFoundError('Book is not exist.');
  }
  return book;
}

async function createBook(book: CreateBookAttributes): Promise<Book> {
  return await BookEntity.create(book);
}

export const service = { getBooks, getBookById, createBook };
