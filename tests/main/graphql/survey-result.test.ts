/* eslint-disable @typescript-eslint/no-magic-numbers */

/* eslint-disable @typescript-eslint/init-declarations */

import { sign } from 'jsonwebtoken';
import { ObjectId, type Collection } from 'mongodb';
import request from 'supertest';

import { MongoHelper } from '@/infra/db/mongodb/mongo-helper';
import { makeApp } from '@/main/config/app';
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

describe('SurveyResult GraphQL', () => {
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

  describe('SurveyResult Query', () => {
    test('Should return SurveyResult', async () => {
      const now = new Date();
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
        date: now,
      });
      const app = await makeApp();
      const {
        body: { data },
      } = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({
          query: `
            query {
              surveyResult (surveyId: "${res.insertedId.toHexString()}") {
                  question
                  answers {
                      answer
                      count
                      percent
                      isCurrentAccountAnswer
                  }
                  date
              }
            }
          `,
        })
        .expect(HttpStatusCode.SUCCESS);

      expect(data.surveyResult.question).toBe('Question');
      expect(data.surveyResult.date).toBe(now.toISOString());
      expect(data.surveyResult.answers).toEqual([
        {
          answer: 'answer 1',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        },
        {
          answer: 'answer 2',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        },
      ]);
    });
  });
});
