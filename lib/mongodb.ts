import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || '';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export interface ContactMessage {
  _id?: ObjectId;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: Date;
  company?: string;
  phone?: string;
  projectType?: string;
  budget?: string;
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  const db = client.db('syntax_website');

  // Create indexes for better performance
  await db.collection<ContactMessage>('contact_messages').createIndex(
    { receivedAt: -1 },
    { name: 'received_at_index' }
  );
  
  await db.collection<ContactMessage>('contact_messages').createIndex(
    { email: 1 },
    { name: 'email_index' }
  );

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(name);
}

// Helper to generate unique ID
export function generateId(): string {
  return new ObjectId().toString();
}