import type { Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { HttpStatusCode } from '@/presentation/http/http-status-code';
import { app } from '@/main/config/app';

// eslint-disable-next-line @typescript-eslint/init-declarations
let surveyCollection!: Collection;

describe('Login Routes', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL not defined');
    }
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany();
  });

  describe('POST /surveys', () => {
    test('Should return 403 on add surveys without accessToken', async () => {
      const route = '/api/surveys';
      await request(app)
        .post(route)
        .send({
          question: 'Question',
          answers: [
            {
              image: 'http://image-name.com',
              answer: 'answer 1',
            },
            {
              answer: 'answer 2',
            },
          ],
        })
        .expect(HttpStatusCode.FORBIDDEN);
    });
  });
});
