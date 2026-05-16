import { badRequest, notFound, serverError, unauthorized } from '@/main/docs/components';
import { loginPath } from '@/main/docs/paths';
import { loginParamsSchema, accountSchema, errorSchema } from '@/main/docs/schemas';

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'Survey API para enquetes',
    version: '1.0.0',
  },
  licence: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licences/GPL-3.0-or-later.html',
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
    error: errorSchema,
  },
  components: {
    badRequest,
    unauthorized,
    serverError,
    notFound,
  },
};
