import { type Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  connection: null as MongoClient | null,
  async connect(uri: string) {
    this.connection = await MongoClient.connect(uri, {});
  },
  async disconnect() {
    await this.connection?.close()
  },
  getCollection(name: string): Collection {
    if (!this.connection) {
      throw new Error('MongoHelper not connected');
    }
    return this.connection.db().collection(name)
  }
}
