import { CreateUserAttributes, User, UserResponseWithBorrows } from '../interfaces/User';
import UserEntity from '../database/models/User';
import TransactionEntity from '../database/models/Transaction';
import { CreateTransactionAttributes, UpdateTransactionAttributes } from '../interfaces/Transaction';
import BookEntity from '../database/models/Book';
import { BadRequestError } from '../errors/badRequestError';
import { Book } from '../interfaces/Book';
import { NotFoundError } from '../errors/notFoundError';
async function getUsers(): Promise<User[]> {
  const users = await UserEntity.findAll();
  return users;
}

async function getUserById(userId: string): Promise<UserResponseWithBorrows | null> {
  const userWithTransaction: User | null = await UserEntity.findOne({
    where: { id: userId },
    include: [{ model: TransactionEntity, include: [BookEntity] }],
  });

  if (!userWithTransaction) {
    throw new NotFoundError('User not found');
  }

  const { borrowed_in_the_past, currently_borrowed_books } = userWithTransaction.transactions.reduce(
    (acc, transaction) => {
      if (transaction.is_returned === true) {
        acc.borrowed_in_the_past.push(transaction?.book);
      } else {
        acc.currently_borrowed_books.push(transaction?.book);
      }
      return acc;
    },
    { borrowed_in_the_past: [] as Book[], currently_borrowed_books: [] as Book[] }
  );

  const userWithBorrowInfo: UserResponseWithBorrows = {
    name: userWithTransaction.name,
    borrowed_in_the_past,
    currently_borrowed_books,
  };

  return userWithBorrowInfo;
}

async function createUser(user: CreateUserAttributes): Promise<User> {
  const userAdded: User = await UserEntity.create(user);
  return userAdded;
}

async function borrowBook(transaction: CreateTransactionAttributes) {
  const isBookAlreadyBorrowed = await TransactionEntity.findOne({
    where: { book_id: transaction.book_id, is_returned: false },
  });
  if (isBookAlreadyBorrowed) {
    throw new BadRequestError('Book is already borrowed.');
  }
  return await TransactionEntity.create(transaction);
}

async function returnBook(data: UpdateTransactionAttributes) {
  const { user_id, book_id, is_returned, score } = data;
  return await TransactionEntity.update({ is_returned, score }, { where: { book_id: book_id, user_id: user_id } });
}

export const service = { getUsers, getUserById, createUser, borrowBook, returnBook };