/* eslint-disable @typescript-eslint/no-unsafe-return */
import { adaptResolver } from '@/main/adapters/graphql';
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories/controllers';
import { authenticated } from '@/main/graphql/helpers/authenticated-helper';

export const surveyResultResolver = {
  Query: {
    surveyResult: authenticated(
      async (parent: any, args: any, context: any) =>
        await adaptResolver(makeLoadSurveyResultController(), args, context),
    ),
  },
  Mutation: {
    saveSurveyResult: authenticated(
      async (parent: any, args: any, context: any) =>
        await adaptResolver(makeSaveSurveyResultController(), args, context),
    ),
  },
};
