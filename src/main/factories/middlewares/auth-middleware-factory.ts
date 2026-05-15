import type { Middleware } from '@/presentation/protocols';

import { makeDbLoadAccountByToken } from '@/main/factories/usecases/account/load-account-by-token/db-load-account-by-token-factory';
import { AuthMiddleware } from '@/presentation/middleware/auth/auth-middleware';

export const makeAuthMiddleware = (role?: string): Middleware => new AuthMiddleware(makeDbLoadAccountByToken(), role);
