import { badRequest, forbidden, notFound, serverError, unauthorized } from '@/main/docs/components';
import { loginPath } from '@/main/docs/paths';
import {
  loginParamsSchema,
  accountSchema,
  errorSchema,
  surveysSchema,
  surveySchema,
  surveyAnswerSchema,
  apiKeyAuthSchema,
} from '@/main/docs/schemas';

import { surveyPath } from './paths/surveys-path';

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
    {
      name: 'Enquetes',
    },
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema,
    },
    badRequest,
    unauthorized,
    serverError,
    notFound,
    forbidden,
  },
};
