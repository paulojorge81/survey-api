/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/prefer-destructuring */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Express } from 'express';

import { ApolloServer, type ApolloServerPlugin } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import resolvers from '@/main/graphql/resolvers';
import typeDefs from '@/main/graphql/type-defs';
import { HttpStatusCode } from '@/presentation/http';

export const setupApolloServer = async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [statusCodePlugin],
  });
  await server.start();
  app.use('/graphql', expressMiddleware(server));
};

const statusCodePlugin: ApolloServerPlugin = {
  async requestDidStart({ request }) {
    return {
      async willSendResponse({ response, errors }: any) {
        const code = errors?.[0]?.extensions?.code;

        if (!code) {
          return;
        }
        switch (code) {
          case 'BAD_USER_INPUT':
            response.http.status = HttpStatusCode.BAD_REQUEST;
            break;
          case 'UNAUTHENTICATED':
            response.http.status = HttpStatusCode.UNAUTHORIZED;
            break;
          case 'FORBIDDEN':
            response.http.status = HttpStatusCode.FORBIDDEN;
            break;
          default:
            response.http.status = HttpStatusCode.SERVER_ERROR;
            break;
        }
      },
    };
  },
};
