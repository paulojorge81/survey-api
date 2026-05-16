import { loginPath } from '@/main/docs/paths';
import { loginParamsSchema, accountSchema } from '@/main/docs/schemas';

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'Survey API para enquetes',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  tags: [
    {
      name: 'Login',
    },
  ],
  paths: {
    '/login': loginPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
  },
};
