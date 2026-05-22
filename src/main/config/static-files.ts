import express, { type Express } from 'express';
import { resolve } from 'node:path';

export const setupStaticFiles = (app: Express): void => {
  app.use('/static', express.static(resolve(__dirname, '../../static')));
};
