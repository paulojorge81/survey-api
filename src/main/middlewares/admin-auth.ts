import { adaptMiddleware } from '@/main/adapters/express';
import { makeAuthMiddleware } from '@/main/factories/middlewares';

export const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
