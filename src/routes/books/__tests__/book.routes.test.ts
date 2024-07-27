import request from 'supertest';
import { app } from '../../../app';
import BookEntity from '../../../database/models/Book';

jest.mock('../../../database/models/Book', () => {
  return {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };
});

describe('Book routes', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  test('Get all books', async () => {
    (BookEntity.findAll as jest.Mock).mockResolvedValueOnce([
      {
        name: 'test-book',
      },
    ]);
    const res = await request(app).get('/books');

    expect(res.body).toEqual([
      {
        name: 'test-book',
      },
    ]);
  });

  test('Get book by Id should return 404 and error if the book is not exists.', async () => {
    (BookEntity.findOne as jest.Mock).mockResolvedValueOnce(null);

    const res = await request(app).get('/books/123');

    expect(res.body).toEqual({ errors: [{ message: 'Book is not exist.' }] });
    expect(res.status).toBe(404);
  });

  test('Get book by Id should return 200 and book object', async () => {
    const mockData = { name: 'test-name', id: '123' };
    (BookEntity.findOne as jest.Mock).mockResolvedValueOnce({ name: 'test-name', id: '123' });
    const res = await request(app).get('/books/123');

    expect(res.body).toEqual(mockData);
    expect(res.status).toBe(200);
  });

  test('Create book without name in the request body should return 400 and validation error', async () => {
    const newBook = { name: 'new-book', average_rating: 8 };
    (BookEntity.create as jest.Mock).mockResolvedValue(newBook);
    const res = await request(app).post('/books');

    expect(res.body).toEqual({ errors: [{ message: 'name must be provided', path: 'name' }] });
    expect(res.status).toBe(400);
  });

  test('Create book should return 201 and created book', async () => {
    const newBook = { name: 'new-book', average_rating: 8 };
    (BookEntity.create as jest.Mock).mockResolvedValue(newBook);
    const res = await request(app).post('/books').send(newBook);

    expect(res.body).toEqual(newBook);
    expect(res.status).toBe(201);
  });
});
