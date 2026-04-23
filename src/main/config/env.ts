/* eslint-disable @typescript-eslint/no-magic-numbers */
export const env = {
  MONGO_URL: process.env.MONGO_URL ?? 'mongodb://admin:secretpassword@localhost:27017/suvery-api?authSource=admin',
  PORT: process.env.PORT ?? 5050
}
