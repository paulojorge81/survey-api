import express from 'express';
import { setupMiddlewares } from './middlewares';
import { setupRoutes } from './routes';

const app = express();

const start = async (): Promise<void> => {
  setupMiddlewares(app);
  await setupRoutes(app);
};

start().catch((error: unknown) => {
  const EXIT = 1;
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(EXIT);
});

export { app };
