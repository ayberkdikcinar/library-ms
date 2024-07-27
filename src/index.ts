import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import sequelize from './database/init';

async function startServer() {
  if (!process.env.DB_NAME) {
    console.error('db name must be provided.');
  }
  if (!process.env.DB_USERNAME) {
    console.error('db username must be provided.');
  }
  if (!process.env.DB_PASSWORD) {
    console.error('db password must be provided');
  }
  try {
    await sequelize.authenticate({ retry: { max: 3, timeout: 5000 } });
    await sequelize.sync({ alter: true });
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
