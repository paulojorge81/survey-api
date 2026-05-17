import { loginPath, signUpPath, surveyPath, surveyResultPath } from '@/main/docs/paths/index';

export const paths = {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyResultPath,
};
