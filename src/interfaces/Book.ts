import { IBase } from './Base';
import { Transaction } from './Transaction';

interface Book extends IBase {
  name: string;
  average_rating: number;
}

interface CreateBookAttributes {
  name: string;
}

export { CreateBookAttributes, Book };
