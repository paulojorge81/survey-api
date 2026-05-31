/* eslint-disable @typescript-eslint/no-unsafe-return */
import { adaptResolver } from '@/main/adapters/graphql';
import { makeLoginController, makeSignUpController } from '@/main/factories/controllers';

export const authResolver = {
  Query: {
    login: async (parent: any, args: any) => await adaptResolver(makeLoginController(), args),
  },
  Mutation: {
    signUp: async (parent: any, args: any) => await adaptResolver(makeSignUpController(), args),
  },
};
