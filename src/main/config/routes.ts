import { type Express, Router } from 'express';
import { readdirSync } from 'node:fs';
import path from 'node:path';

interface RouteModule {
  default: (router: Router) => void;
}

const isRouteModule = (module: unknown): module is RouteModule =>
  typeof module === 'object' &&
  module !== null &&
  'default' in module &&
  typeof (module as Record<string, unknown>).default === 'function';

export const setupRoutes = async (app: Express): Promise<void> => {
  const router = Router();
  app.use('/api', router);

  const routesPath = path.join(__dirname, '..', 'routes');

  await Promise.all(
    readdirSync(routesPath)
      .filter((file) => !file.includes('.test.'))
      .map(async (file) => {
        const filePath = path.join(routesPath, file);
        const module = await import(filePath);

        if (isRouteModule(module)) {
          module.default(router);
        }
      }),
  );
};
