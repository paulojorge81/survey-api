import { GraphQLError } from 'graphql';

import type { Controller } from '@/presentation/protocols';

import { HttpStatusCode } from '@/presentation/http';

export const adaptResolver = async (controller: Controller, args?: any): Promise<any> => {
  const request = { ...(args ?? {}) };
  const httpResponse = await controller.handle(request);
  switch (httpResponse.statusCode) {
    case HttpStatusCode.SUCCESS:
    case HttpStatusCode.NO_CONTENT:
      return httpResponse.body;
    case HttpStatusCode.BAD_REQUEST:
      throw makeGraphQLError(httpResponse.body.message, 'BAD_USER_INPUT');
    case HttpStatusCode.UNAUTHORIZED:
      throw makeGraphQLError(httpResponse.body.message, 'UNAUTHENTICATED');
    case HttpStatusCode.FORBIDDEN:
      throw makeGraphQLError(httpResponse.body.message, 'FORBIDDEN');
    default:
      throw makeGraphQLError(httpResponse.body.message, 'INTERNAL_SERVER_ERROR');
  }
};

const makeGraphQLError = (message: string, code: string): Error =>
  new GraphQLError(message, {
    extensions: { code },
  });
