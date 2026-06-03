/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { GraphQLError } from 'graphql';

import { makeAuthMiddleware } from '@/main/factories/middlewares';

export const authenticated: any =
  (resolver: any) =>
  async (parent: any, args: any, context: any, info: any): Promise<any> => {
    const request = {
      accessToken: context.req.headers['x-access-token'],
    };

    const httpResponse = await makeAuthMiddleware().handle(request);

    if (httpResponse.statusCode !== 200) {
      throw new GraphQLError(httpResponse.body.message, {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
    }

    Object.assign(context.req, httpResponse.body);

    return resolver(parent, args, context, info);
  };
