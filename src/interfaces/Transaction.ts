import { IBase } from './Base';
import { Book } from './Book';
import { User } from './User';

interface Transaction extends IBase {
  book_id: string;
  user_id: string;
  is_returned: boolean;
  score: number | null;
  book: Book;
  user: User;
}

interface CreateTransactionAttributes {
  book_id: string;
  user_id: string;
}

interface UpdateTransactionAttributes {
  book_id: string;
  user_id: string;
  is_returned: boolean;
  score: number;
}

export { Transaction, CreateTransactionAttributes, UpdateTransactionAttributes };
