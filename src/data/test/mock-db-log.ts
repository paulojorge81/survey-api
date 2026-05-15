import type { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';

export const mockLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      await Promise.resolve();
    }
  }

  return new LogErrorRepositoryStub();
};
