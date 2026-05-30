import type { Router } from 'express';

import { adaptRoute } from '@/main/adapters/express';
import { makeAddSurveyController, makeLoadSurveyController } from '@/main/factories/controllers';
import { adminAuth, auth } from '@/main/middlewares';

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()));
};
