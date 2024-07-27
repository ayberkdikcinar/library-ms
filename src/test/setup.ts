import { Sequelize } from 'sequelize-typescript';
import BookEntity from '../database/models/Book';
import TransactionEntity from '../database/models/Transaction';
import UserEntity from '../database/models/User';
/* 
let mockedSequelize: Sequelize;

beforeEach(async () => {
  mockedSequelize = new Sequelize({
    database: 'dbname',
    dialect: 'postgres',
    username: 'root',
    password: 'root',
    validateOnly: true,
    host: 'localhost',
    port: 5432,
    models: [BookEntity, TransactionEntity, UserEntity],
  });

  await mockedSequelize.sync({ force: true });
});

afterEach(async () => {
  jest.clearAllMocks();
  if (mockedSequelize) {
    await mockedSequelize.close();
  }
});
 */
