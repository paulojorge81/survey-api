import { type Express, Router } from 'express';
import fastglob from 'fast-glob';

interface RouteModule {
  default: (router: Router) => void;
}

const isRouteModule = (module: any): module is RouteModule => typeof module?.default === 'function';

export const setupRoutes = async (app: Express): Promise<void> => {
  const router = Router();
  app.use('/api', router);

  const files = fastglob.sync('**/src/main/routes/**routes.ts');

  await Promise.all(
    files.map(async (file) => {
      const module = await import(`../../../${file}`);

      if (!isRouteModule(module)) {
        throw new Error(`Invalid route module: ${file}`);
      }

      module.default(router);
    }),
  );
};
