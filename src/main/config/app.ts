import express from 'express';

import { setupApolloServer } from '@/main/config/apollo-server';
import { setupMiddlewares } from '@/main/config/middlewares';
import { setupRoutes } from '@/main/config/routes';
import { setupStaticFiles } from '@/main/config/static-files';
import { setupSwagger } from '@/main/config/swagger';

const app = express();

const start = async (): Promise<void> => {
  setupStaticFiles(app);
  setupSwagger(app);
  setupMiddlewares(app);
  await setupApolloServer(app);
  await setupRoutes(app);
};

start().catch((error: unknown) => {
  const EXIT = 1;
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(EXIT);
});

export { app };
