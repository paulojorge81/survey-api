/* eslint-disable @typescript-eslint/no-unsafe-return */
import { adaptResolver } from '@/main/adapters/graphql';
import { makeLoginController } from '@/main/factories/controllers';

export const loginResolver = {
  Query: {
    login: async (parent: any, args: any) => await adaptResolver(makeLoginController(), args),
  },
};
