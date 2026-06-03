/* eslint-disable @typescript-eslint/no-unsafe-return */
import { adaptResolver } from '@/main/adapters/graphql';
import { makeLoadSurveyController } from '@/main/factories/controllers';
import { authenticated } from '@/main/graphql/helpers/authenticated-helper';

export const surveyResolver = {
  Query: {
    surveys: authenticated(async (parent: any, args: any) => await adaptResolver(makeLoadSurveyController(), args)),
  },
};
