import type { Express } from 'express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import resolvers from '@/main/graphql/resolvers';
import typeDefs from '@/main/graphql/type-defs';

export const setupApolloServer = async (app: Express): Promise<void> => {
  const server = new ApolloServer({ resolvers, typeDefs });
  await server.start();
  app.use('/graphql', expressMiddleware(server));
};
