import BookEntity from '../database/models/Book';
import BorrowEntity from '../database/models/Transaction';
import { Book, CreateBookAttributes } from '../interfaces/Book';

async function getBooks(): Promise<Book[]> {
  return await BookEntity.findAll();
}

async function getBookById(bookId: string): Promise<Book | null> {
  return await BookEntity.findOne({ where: { id: bookId }, include: [BorrowEntity] });
}

async function createBook(book: CreateBookAttributes): Promise<Book> {
  return await BookEntity.create(book);
}

export const service = { getBooks, getBookById, createBook };
