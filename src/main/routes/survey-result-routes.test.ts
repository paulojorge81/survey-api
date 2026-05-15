/* eslint-disable @typescript-eslint/init-declarations */
import { sign } from 'jsonwebtoken';
import { ObjectId, type Collection } from 'mongodb';
import request from 'supertest';

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { app } from '@/main/config/app';
import { env } from '@/main/config/env';
import { HttpStatusCode } from '@/presentation/http/http-status-code';

let surveyCollection!: Collection;
let accountCollection!: Collection;

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Paulo',
    email: 'paulo@mail.com',
    password: '123',
    role: 'admin',
  });
  const id = res.insertedId.toHexString();
  const accessToken = sign({ id }, env.JWT_SECRET);
  await accountCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: { accessToken },
    },
  );
  return accessToken;
};

describe('Survey Results Routes', () => {
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
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany();
  });

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

    test('Should return 200 on save survey result with accessToken', async () => {
      const accessToken = await makeAccessToken();
      const res = await surveyCollection.insertOne({
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
        date: new Date(),
      });

      const route = `/api/surveys/${res.insertedId.toHexString()}/results`;

      await request(app)
        .put(route)
        .set('x-access-token', accessToken)
        .send({
          answer: 'answer 1',
        })
        .expect(HttpStatusCode.SUCCESS);
    });
  });
});
