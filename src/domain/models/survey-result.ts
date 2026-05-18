import type { ObjectId } from 'mongodb';

export type SurveyResultModel = {
  surveyId: string | ObjectId;
  question: string;
  answers: SurveyResultAnswerModel[];
  date: Date;
};

export type SurveyResultAnswerModel = {
  image?: string;
  answer: string;
  count: number;
  percent: number;
};
