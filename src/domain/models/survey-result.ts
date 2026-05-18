import type { ObjectId } from 'mongodb';

export type SurveyResultModel = {
  id: string;
  surveyId: string | ObjectId;
  accountId: string | ObjectId;
  answer: string;
  date: Date;
};
