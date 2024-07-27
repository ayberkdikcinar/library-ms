import { NextFunction, Request, Response } from 'express';
import { CreateUserAttributes, User } from '../../interfaces/User';
import { service } from '../../services/userService';
import { CreateTransactionAttributes, UpdateTransactionAttributes } from '../../interfaces/Transaction';
async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await service.getUsers();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await service.getUserById(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const newUser: CreateUserAttributes = req.body;
    const response = await service.createUser(newUser);
    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

async function borrowBook(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, bookId } = req.params;
    const newTransaction: CreateTransactionAttributes = { user_id: userId, book_id: bookId };
    const response = await service.borrowBook(newTransaction);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function returnBook(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, bookId } = req.params;
    const { score } = req.body;
    const newReturn: UpdateTransactionAttributes = {
      user_id: userId,
      book_id: bookId,
      score: score,
      is_returned: true,
    };
    const response = await service.returnBook(newReturn);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export { getUsers, getUser, createUser, borrowBook, returnBook };
