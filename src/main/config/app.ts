import express, { type Express } from 'express';

import { setupApolloServer } from '@/main/config/apollo-server';
import { setupMiddlewares } from '@/main/config/middlewares';
import { setupRoutes } from '@/main/config/routes';
import { setupStaticFiles } from '@/main/config/static-files';
import { setupSwagger } from '@/main/config/swagger';

export const makeApp = async (): Promise<Express> => {
  const app = express();

  setupStaticFiles(app);
  setupSwagger(app);
  setupMiddlewares(app);

  await setupApolloServer(app);
  await setupRoutes(app);

  return app;
};
