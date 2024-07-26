import { app } from './app';

function startServer() {
  //TODO: DB Connection
  app.listen(3000, () => {
    console.log('Server started on port:3000');
  });
}

startServer();
