import { IBase } from './Base';
import { Transaction } from './Transaction';

interface Book extends IBase {
  name: string;
  average_rating: number;
  transactions: Transaction[];
}

interface CreateBookAttributes {
  name: string;
}

export { CreateBookAttributes, Book };
