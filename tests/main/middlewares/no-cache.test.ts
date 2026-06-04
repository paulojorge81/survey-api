import request from 'supertest';

import { makeApp } from '@/main/config/app';
import { noCache } from '@/main/middlewares/no-cache';

describe('NoCache Middlewares', () => {
  test('Should disable cache', async () => {
    const app = await makeApp();
    const route = '/test_no_cache';
    app.get(route, noCache, (req, res) => {
      res.send();
    });
    await request(app)
      .get(route)
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store');
  });
});
