import { badRequest, forbidden, notFound, serverError, unauthorized } from '@/main/docs/components/index';
import { apiKeyAuthSchema } from '@/main/docs/schemas/index';

export const components = {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema,
  },
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden,
};
