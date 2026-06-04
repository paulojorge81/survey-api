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

describe('Survey GraphQL', () => {
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

  describe('Surveys Query', () => {
    test('Should return Surveys', async () => {
      const now = new Date();
      const accessToken = await makeAccessToken();
      await surveyCollection.insertOne({
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
              surveys {
                  id
                  question
                  answers {
                      image
                      answer
                  }
                  didAnswer
                  date
              }
            }
          `,
        })
        .expect(HttpStatusCode.SUCCESS);

      expect(data.surveys.length).toBe(1);
      expect(data.surveys[0].id).toBeTruthy();
      expect(data.surveys[0].question).toBe('Question');
      expect(data.surveys[0].date).toBe(now.toISOString());
      expect(data.surveys[0].didAnswer).toBe(false);
      expect(data.surveys[0].answers).toEqual([
        {
          image: 'http://image-name.com',
          answer: 'answer 1',
        },
        {
          image: null,
          answer: 'answer 2',
        },
      ]);
    });
  });
});
