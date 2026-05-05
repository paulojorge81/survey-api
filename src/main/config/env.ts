/* eslint-disable @typescript-eslint/no-magic-numbers */
export const env = {
  MONGO_URL: process.env.MONGO_URL ?? 'mongodb://admin:secretpassword@mongodb:27017/suvery-api?authSource=admin',
  PORT: process.env.PORT ?? 5050,
  JWT_SECRET: process.env.JWT_SECRET ?? 'IeHoh8Kieweibu8a',
};
