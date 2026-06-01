/* eslint-disable @typescript-eslint/no-unsafe-return */
import { adaptResolver } from '@/main/adapters/graphql';
import { makeLoadSurveyController } from '@/main/factories/controllers';

export const surveyResolver = {
  Query: {
    surveys: async () => await adaptResolver(makeLoadSurveyController()),
  },
};
