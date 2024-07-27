import { IBase } from './Base';
import { Book } from './Book';
import { Transaction } from './Transaction';

interface User extends IBase {
  name: string;
  transactions: Transaction[];
}

interface CreateUserAttributes {
  name: string;
}

interface UserResponseWithBorrows {
  name: string;
  currently_borrowed_books?: Book[];
  borrowed_in_the_past?: BorrowedInThePast[];
}

interface BorrowedInThePast {
  score_given: number;
  book: Book;
}

export { User, CreateUserAttributes, UserResponseWithBorrows, BorrowedInThePast };
