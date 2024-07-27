import request from 'supertest';
import { app } from '../../../app';
import UserEntity from '../../../database/models/User';
import { UserResponseWithBorrows } from '../../../interfaces/User';
import TransactionEntity from '../../../database/models/Transaction';
import BookEntity from '../../../database/models/Book';

jest.mock('../../../database/models/User', () => {
  return {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  };
});

jest.mock('../../../database/models/Book', () => {
  return {
    findByPk: jest.fn(),
    update: jest.fn(),
  };
});

jest.mock('../../../database/models/Transaction', () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
  };
});

describe('User routes', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  test('Get all users', async () => {
    (UserEntity.findAll as jest.Mock).mockResolvedValueOnce([
      {
        name: 'test-user',
      },
    ]);
    const res = await request(app).get('/users');

    expect(res.body).toEqual([
      {
        name: 'test-user',
      },
    ]);
    expect(res.status).toBe(200);
  });

  test('Get user by Id should return 404 and error if the user is not exists.', async () => {
    (UserEntity.findOne as jest.Mock).mockResolvedValueOnce(null);

    const res = await request(app).get('/users/123');

    expect(res.body).toEqual({ errors: [{ message: 'User is not exist.' }] });
    expect(res.status).toBe(404);
  });
});

describe('Transaction tests', () => {
  const mockData = {
    id: 'user123',
    name: 'John Doe',
    transactions: [
      {
        id: 'transaction1',
        score: null,
        is_returned: false,
        book: {
          id: 'book1',
          name: 'Test Book 1',
        },
      },
      {
        id: 'transaction2',
        score: 9,
        is_returned: true,
        book: {
          id: 'book2',
          name: 'Test Book 2',
        },
      },
    ],
  };

  beforeAll(() => {
    (UserEntity.findOne as jest.Mock).mockResolvedValue(mockData);
  });

  test('Get user by Id should return 200 and user object with borrow info', async () => {
    const res = await request(app).get('/users/123');

    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('borrowed_in_the_past');
    expect(res.body).toHaveProperty('currently_borrowed_books');
    expect(res.status).toBe(200);
  });

  test('Get user by Id should return 200 and transactions should be placed correctly', async () => {
    const res = await request(app).get('/users/123');

    const body = res.body as UserResponseWithBorrows;
    const pastBorrowed = body.borrowed_in_the_past?.find((t) => t.book.id === 'book2');
    const currentlyBorrowed = body.currently_borrowed_books?.find((t) => t.id === 'book1');

    expect(pastBorrowed).toBeDefined();
    expect(currentlyBorrowed).toBeDefined();
    expect(res.status).toBe(200);
  });

  test('Borrow book should return 200 if the book & user exists and the book can be borrowed.', async () => {
    const mockBook = { name: 'book1', id: '222', average_rating: 5 };
    const mockUser = { name: 'user1', id: '123' };

    (BookEntity.findByPk as jest.Mock).mockResolvedValueOnce(mockBook);
    (UserEntity.findByPk as jest.Mock).mockResolvedValueOnce(mockUser);
    (TransactionEntity.findOne as jest.Mock).mockResolvedValueOnce(null);
    (TransactionEntity.create as jest.Mock).mockResolvedValueOnce({});

    const res = await request(app).post('/users/123/borrow/222');

    expect(res.status).toBe(200);
  });

  test('Borrow book should return 400 if the book is not exists.', async () => {
    (BookEntity.findByPk as jest.Mock).mockResolvedValueOnce(null);
    const res = await request(app).post('/users/123/borrow/222');

    expect(res.body).toEqual({ errors: [{ message: 'Book is not exists with given id.' }] });
    expect(res.status).toBe(400);
  });

  test('Borrow book should return 400 if the user is not exists.', async () => {
    (BookEntity.findByPk as jest.Mock).mockResolvedValueOnce({});
    (UserEntity.findByPk as jest.Mock).mockResolvedValueOnce(null);
    const res = await request(app).post('/users/123/borrow/222');

    expect(res.body).toEqual({ errors: [{ message: 'User is not exists with given id.' }] });
    expect(res.status).toBe(400);
  });

  test('Borrow book should return 400 if the book is already borrowed.', async () => {
    const mockBook = { name: 'book1', id: '222', average_rating: 5 };
    const mockUser = { name: 'user1', id: '123' };

    (BookEntity.findByPk as jest.Mock).mockResolvedValueOnce(mockBook);
    (UserEntity.findByPk as jest.Mock).mockResolvedValueOnce(mockUser);
    (TransactionEntity.findOne as jest.Mock).mockResolvedValueOnce(mockBook);
    const res = await request(app).post('/users/123/borrow/222');

    expect(res.body).toEqual({ errors: [{ message: 'Book is already borrowed.' }] });
    expect(res.status).toBe(400);
  });

  describe('Book Transactions', () => {
    beforeEach(() => {
      (TransactionEntity.update as jest.Mock).mockResolvedValueOnce([1]);
      (TransactionEntity.findAll as jest.Mock).mockResolvedValueOnce([]);
      (BookEntity.update as jest.Mock).mockResolvedValueOnce({});
    });

    test('Return book should return 200 if the book is borrowed, score is in body and not returned yet.', async () => {
      const mockTransaction = { id: '222', is_returned: false, score: null };
      (TransactionEntity.findOne as jest.Mock).mockResolvedValueOnce(mockTransaction);
      const res = await request(app).post('/users/123/return/222').send({ score: 6 });

      expect(res.body).toEqual({ message: 'Book successfully returned.' });
      expect(res.status).toBe(200);
    });

    test('Return book should return 400 if the book is already returned means no active transaction.', async () => {
      (TransactionEntity.findOne as jest.Mock).mockResolvedValueOnce(null);
      const res = await request(app).post('/users/123/return/222').send({ score: 6 });

      expect(res.body).toEqual({ errors: [{ message: 'Book is already returned.' }] });
      expect(res.status).toBe(400);
    });
  });
});
