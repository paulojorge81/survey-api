import { MongoClient, type Collection, type ObjectId, type Document } from 'mongodb';
import type { SurveyAnswerModel } from '@/domain/models/surveys';

export type AccountMongoModel = {
  name: string;
  email: string;
  password: string;
} & MongoModel;

export type SurveyMongoModel = {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
} & MongoModel;

export type SurveyResultMongoModel = {
  surveyId: string;
  accountId: string;
  answer: string;
  date: Date;
} & MongoModel;

type MongoModel = {
  _id: ObjectId;
};

type Model<T> = Omit<T, '_id'> & {
  id: string;
};

export const MongoHelper = {
  connection: null as MongoClient | null,
  uri: null as string | null,
  async connect(uri: string) {
    this.uri = uri;
    this.connection = await MongoClient.connect(uri, {});
  },
  async disconnect() {
    await this.connection?.close();
    this.connection = null;
  },
  async getCollection<T extends Document = Document>(name: string): Promise<Collection<T>> {
    if (!this.connection) {
      if (!this.uri) {
        throw new Error('MongoHelper not initialized with URI');
      }

      await this.connect(this.uri);
    }
    if (!this.connection) {
      throw new Error('MongoHelper connection failed');
    }
    return this.connection.db().collection<T>(name);
  },
  mapModel<T extends MongoModel>(data: T): Model<T> {
    const { _id, ...rest } = data;

    return {
      id: _id.toHexString(),
      ...rest,
    };
  },
  mapCollection<T extends MongoModel>(collection: T[]): Array<Model<T>> {
    return collection.map((c) => MongoHelper.mapModel(c));
  },
};
