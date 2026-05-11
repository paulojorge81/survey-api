import type { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express/express-routes-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory';
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory';
import { adaptMiddleware } from '../adapters/express/express-middleware-adapter';

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
};
