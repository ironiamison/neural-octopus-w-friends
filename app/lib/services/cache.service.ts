import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

interface CacheItem {
  key: string;
  value: any;
  expiresAt: Date;
}

export class CacheService {
  private static COLLECTION_NAME = 'cache';
  private static DB_NAME = 'papermemes';

  static async set(key: string, value: any, expirationMinutes: number = 60): Promise<void> {
    const client = await clientPromise;
    const collection = client.db(this.DB_NAME).collection<CacheItem>(this.COLLECTION_NAME);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

    await collection.updateOne(
      { key },
      {
        $set: {
          key,
          value,
          expiresAt
        }
      },
      { upsert: true }
    );
  }

  static async get<T>(key: string): Promise<T | null> {
    const client = await clientPromise;
    const collection = client.db(this.DB_NAME).collection<CacheItem>(this.COLLECTION_NAME);

    const item = await collection.findOne({
      key,
      expiresAt: { $gt: new Date() }
    });

    return item ? item.value as T : null;
  }

  static async delete(key: string): Promise<void> {
    const client = await clientPromise;
    const collection = client.db(this.DB_NAME).collection(this.COLLECTION_NAME);

    await collection.deleteOne({ key });
  }

  static async cleanup(): Promise<void> {
    const client = await clientPromise;
    const collection = client.db(this.DB_NAME).collection(this.COLLECTION_NAME);

    await collection.deleteMany({
      expiresAt: { $lte: new Date() }
    });
  }
} 