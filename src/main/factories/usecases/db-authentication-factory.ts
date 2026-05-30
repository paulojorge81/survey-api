import type { Authentication } from '@/domain/usecases/authentication';

import { DbAuthentication } from '@/data/usecases';
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography';
import { AccountMongoRepository } from '@/infra/db';
import { env } from '@/main/config/env';

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET);
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository);
};
