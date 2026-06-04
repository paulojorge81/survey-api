/* eslint-disable no-console */
import { MongoHelper } from '@/infra/db';
import { makeApp } from '@/main/config/app';
import { env } from '@/main/config/env';

const port = 5050;

MongoHelper.connect(env.MONGO_URL)
  .then(async () => {
    const app = await makeApp();
    app.listen(port, () => {
      console.log(`Server running at port: ${port}`);
    });
  })
  .catch(console.error);
