import { BorrowedInThePast, CreateUserAttributes, User, UserResponseWithBorrows } from '../interfaces/User';
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
    throw new NotFoundError('User is not exist.');
  }

  const { borrowed_in_the_past, currently_borrowed_books } = userWithTransaction.transactions.reduce(
    (acc, transaction) => {
      if (transaction.is_returned === true) {
        acc.borrowed_in_the_past.push({ score_given: Number(transaction.score), book: transaction?.book });
      } else {
        acc.currently_borrowed_books.push(transaction?.book);
      }
      return acc;
    },
    { borrowed_in_the_past: [] as BorrowedInThePast[], currently_borrowed_books: [] as Book[] }
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
  const isBookExist = await BookEntity.findByPk(transaction.book_id);

  if (!isBookExist) {
    throw new BadRequestError('Book is not exists with given id.');
  }

  const isUserExist = await UserEntity.findByPk(transaction.user_id);

  if (!isUserExist) {
    throw new BadRequestError('User is not exists with given id.');
  }

  const isBookAlreadyBorrowed = await TransactionEntity.findOne({
    where: { book_id: transaction.book_id, is_returned: false },
  });
  if (isBookAlreadyBorrowed) {
    throw new BadRequestError('Book is already borrowed.');
  }

  return await TransactionEntity.create(transaction);
}

async function returnBook(data: UpdateTransactionAttributes): Promise<number> {
  const { user_id, book_id, is_returned, score } = data;

  const transaction = await TransactionEntity.findOne({
    where: { book_id, user_id, is_returned: false },
  });

  if (!transaction) {
    throw new BadRequestError('No book found to return.');
  }

  const [affectedCount] = await TransactionEntity.update(
    { is_returned, score },
    { where: { book_id: book_id, user_id: user_id } }
  );

  const transactions = await TransactionEntity.findAll({
    where: { book_id, is_returned: true },
  });

  const totalScore = transactions.reduce((sum, transaction) => sum + transaction.score!, 0);
  const averageRating = transactions.length ? totalScore / transactions.length : 0;

  await BookEntity.update({ average_rating: averageRating }, { where: { id: book_id } });

  return affectedCount;
}

export const service = { getUsers, getUserById, createUser, borrowBook, returnBook };
