import request from 'supertest';
import { HttpStatusCode } from '@/presentation/http/http-status-code';
import { app } from '@/main/config/app';

describe('Survey Results Routes', () => {
  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save surveys without accessToken', async () => {
      const route = '/api/surveys/any_id/results';
      await request(app)
        .put(route)
        .send({
          answer: 'any_answer',
        })
        .expect(HttpStatusCode.FORBIDDEN);
    });
  });
});
