import { AuthMiddleware } from '@/presentation/middleware/auth/auth-middleware';
import type { Middleware } from '@/presentation/protocols';
import { makeDbLoadAccountByToken } from '../usecases/account/load-account-by-token/db-load-account-by-token-factory';

export const makeAuthMiddleware = (role?: string): Middleware => new AuthMiddleware(makeDbLoadAccountByToken(), role);
