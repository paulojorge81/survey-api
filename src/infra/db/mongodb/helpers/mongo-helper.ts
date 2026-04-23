import { type Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  connection: null as MongoClient | null,
  uri: null as string | null,
  async connect(uri: string) {
    this.uri = uri;
    this.connection = await MongoClient.connect(uri, {});
  },
  async disconnect() {
    await this.connection?.close()
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
    return this.connection.db().collection(name)
  }
}
