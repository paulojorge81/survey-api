import type { ObjectId } from 'mongodb';

import type { SurveyResultModel } from '@/domain/models/survey-result';

export type SaveSurveyResultParams = {
  surveyId: string | ObjectId;
  accountId: string | ObjectId;
  answer: string;
  date: Date;
};

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel | null>;
}
