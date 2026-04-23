import request from 'supertest';
import { app } from '../config/app';
import { HttpStatusCode } from '../../presentation/http/http-status-code';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

describe('SignUp Routes', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL not defined');
    }
    await MongoHelper.connect(process.env.MONGO_URL)
  });

  afterAll(async () => {
    await MongoHelper.disconnect()
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany()
  })


  test('Should return an account on success', async () => {
    const route = '/api/signup'
    await request(app).post(route).send({
      name: 'Paulo',
      email: 'paulo@mail.com',
      password: '123',
      passwordConfirmation: '123'
    }).expect(HttpStatusCode.SUCCESS)
  });
});
