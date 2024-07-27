import { NextFunction, Request, Response } from 'express';
import { service } from '../../services/bookService';

async function getBooks(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await service.getBooks();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function getBook(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await service.getBookById(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function createBook(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await service.createBook(req.body);
    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export { getBooks, getBook, createBook };
