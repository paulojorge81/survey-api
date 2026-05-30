import type { LogErrorRepository } from '@/data/protocols';

import { MongoHelper } from '@/infra/db';

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorColletion = await MongoHelper.getCollection('errors');
    await errorColletion.insertOne({
      stack,
      date: new Date(),
    });
  }
}
