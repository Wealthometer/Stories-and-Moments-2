// lib/mongodb.ts
import { MongoClient, type Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();

  const db = client.db("blog");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const { db } = await connectToDatabase();
  return db;
}