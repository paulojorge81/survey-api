import { hash } from 'bcrypt';
import type { Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { HttpStatusCode } from '@/presentation/http/http-status-code';
import { app } from '@/main/config/app';

// eslint-disable-next-line @typescript-eslint/init-declarations
let accountCollection!: Collection;

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
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany();
  });

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      const route = '/api/signup';
      await request(app)
        .post(route)
        .send({
          name: 'Paulo',
          email: 'paulo@mail.com',
          password: '123',
          passwordConfirmation: '123',
        })
        .expect(HttpStatusCode.SUCCESS);
    });
  });

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const salt = 12;
      const password = await hash('123', salt);
      const accountData = {
        name: 'Paulo',
        email: 'paulo@mail.com',
        password,
      };
      await accountCollection.insertOne(accountData);
      const route = '/api/login';
      await request(app)
        .post(route)
        .send({
          email: 'paulo@mail.com',
          password: '123',
        })
        .expect(HttpStatusCode.SUCCESS);
    });

    test('Should return 401 on login', async () => {
      const route = '/api/login';
      await request(app)
        .post(route)
        .send({
          email: 'paulo@mail.com',
          password: '123',
        })
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });
});
