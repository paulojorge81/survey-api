import request from 'supertest';

import { makeApp } from '@/main/config/app';

describe('Content Type Middlewares', () => {
  test('Should return default content type as json', async () => {
    const app = await makeApp();
    const route = '/test_content_type';
    app.get(route, (req, res) => {
      res.send('');
    });
    await request(app)
      .get(route)
      // eslint-disable-next-line require-unicode-regexp
      .expect('Content-Type', /json/);
  });

  test('Should return xml content type when forced', async () => {
    const app = await makeApp();
    const route = '/test_content_type_xml';
    app.get(route, (req, res) => {
      res.type('xml');
      res.send('');
    });
    await request(app)
      .get(route)
      // eslint-disable-next-line require-unicode-regexp
      .expect('Content-Type', /xml/);
  });
});
