import { MongoClient, type Collection, type ObjectId } from 'mongodb';
import type { SurveyAnswerModel } from '@/domain/models/surveys';

export interface AccountMongoModel {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
}

export interface SurveyMongoModel {
  _id: ObjectId;
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}

interface MongoModel {
  _id: ObjectId;
}

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
  async getCollection(name: string): Promise<Collection> {
    if (!this.connection) {
      if (!this.uri) {
        throw new Error('MongoHelper not initialized with URI');
      }

      await this.connect(this.uri);
    }
    if (!this.connection) {
      throw new Error('MongoHelper connection failed');
    }
    return this.connection.db().collection(name);
  },
  mapModel<T extends MongoModel>(data: T): Model<T> {
    const { _id, ...rest } = data;

    return {
      id: _id.toHexString(),
      ...rest,
    };
  },
};
