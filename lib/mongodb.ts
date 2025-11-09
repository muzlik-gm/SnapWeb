import { MongoClient, Db, Collection } from 'mongodb';
import type { User, Screenshot, Payment, ContactMessage } from '@/types';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Get database instance
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('snapweb');
}

// Get collections
export async function getUsersCollection(): Promise<Collection<User>> {
  const db = await getDatabase();
  return db.collection<User>('users');
}

export async function getScreenshotsCollection(): Promise<Collection<Screenshot>> {
  const db = await getDatabase();
  return db.collection<Screenshot>('screenshots');
}

export async function getPaymentsCollection(): Promise<Collection<Payment>> {
  const db = await getDatabase();
  return db.collection<Payment>('payments');
}

export async function getContactMessagesCollection(): Promise<Collection<ContactMessage>> {
  const db = await getDatabase();
  return db.collection<ContactMessage>('contact_messages');
}

// Helper functions for common operations
export const createUser = async (userData: Partial<User>): Promise<User> => {
  const users = await getUsersCollection();
  const user = {
    ...userData,
    created_at: new Date(),
    updated_at: new Date(),
  } as User;
  
  const result = await users.insertOne(user as any);
  return { ...user, id: result.insertedId.toString() };
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const users = await getUsersCollection();
  const user = await users.findOne({ email });
  if (!user) return null;
  return { ...user, id: (user as any)._id.toString() };
};

export const getUserById = async (id: string): Promise<User | null> => {
  const users = await getUsersCollection();
  const { ObjectId } = require('mongodb');
  const user = await users.findOne({ _id: new ObjectId(id) } as any);
  if (!user) return null;
  return { ...user, id: (user as any)._id.toString() };
};

export const getUserByApiKey = async (apiKey: string): Promise<User | null> => {
  const users = await getUsersCollection();
  const user = await users.findOne({ api_key: apiKey });
  if (!user) return null;
  return { ...user, id: (user as any)._id.toString() };
};

export const createScreenshot = async (screenshotData: Partial<Screenshot>): Promise<Screenshot> => {
  const screenshots = await getScreenshotsCollection();
  const screenshot = {
    ...screenshotData,
    created_at: new Date(),
    updated_at: new Date(),
  } as Screenshot;
  
  const result = await screenshots.insertOne(screenshot as any);
  return { ...screenshot, id: result.insertedId.toString() };
};

export const getUserScreenshots = async (userId: string, limit = 10): Promise<Screenshot[]> => {
  const screenshots = await getScreenshotsCollection();
  const results = await screenshots
    .find({ user_id: userId })
    .sort({ created_at: -1 })
    .limit(limit)
    .toArray();
  
  return results.map(s => ({ ...s, id: (s as any)._id.toString() }));
};

export const updateUserCredits = async (userId: string, credits: number): Promise<User> => {
  const users = await getUsersCollection();
  const { ObjectId } = require('mongodb');
  
  const result = await users.findOneAndUpdate(
    { _id: new ObjectId(userId) } as any,
    { $set: { credits, updated_at: new Date() } },
    { returnDocument: 'after' }
  );
  
  if (!result) throw new Error('User not found');
  return { ...result, id: (result as any)._id.toString() };
};

export const decrementUserCredits = async (userId: string): Promise<User> => {
  const users = await getUsersCollection();
  const { ObjectId } = require('mongodb');
  
  const result = await users.findOneAndUpdate(
    { _id: new ObjectId(userId) } as any,
    { 
      $inc: { credits: -1, total_screenshots: 1 },
      $set: { updated_at: new Date() }
    },
    { returnDocument: 'after' }
  );
  
  if (!result) throw new Error('User not found');
  return { ...result, id: (result as any)._id.toString() };
};

export const createPayment = async (paymentData: Partial<Payment>): Promise<Payment> => {
  const payments = await getPaymentsCollection();
  const payment = {
    ...paymentData,
    created_at: new Date(),
    updated_at: new Date(),
  } as Payment;
  
  const result = await payments.insertOne(payment as any);
  return { ...payment, id: result.insertedId.toString() };
};

export const createContactMessage = async (messageData: Partial<ContactMessage>): Promise<ContactMessage> => {
  const messages = await getContactMessagesCollection();
  const message = {
    ...messageData,
    created_at: new Date(),
    updated_at: new Date(),
  } as ContactMessage;
  
  const result = await messages.insertOne(message as any);
  return { ...message, id: result.insertedId.toString() };
};

export const getScreenshotById = async (id: string): Promise<Screenshot | null> => {
  const screenshots = await getScreenshotsCollection();
  const { ObjectId } = require('mongodb');
  const screenshot = await screenshots.findOne({ _id: new ObjectId(id) } as any);
  if (!screenshot) return null;
  return { ...screenshot, id: (screenshot as any)._id.toString() };
};

export const deleteScreenshot = async (id: string, userId?: string): Promise<void> => {
  const screenshots = await getScreenshotsCollection();
  const { ObjectId } = require('mongodb');
  
  const filter: any = { _id: new ObjectId(id) };
  if (userId) {
    filter.user_id = userId;
  }
  
  await screenshots.deleteOne(filter);
};

export const updateScreenshotDownloads = async (id: string): Promise<void> => {
  const screenshots = await getScreenshotsCollection();
  const { ObjectId } = require('mongodb');
  
  await screenshots.updateOne(
    { _id: new ObjectId(id) } as any,
    { $inc: { downloads: 1 } }
  );
};

// Additional collections for logging and monitoring
export async function getLogsCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection('logs');
}

export async function getSecurityEventsCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection('security_events');
}

export async function getPerformanceMetricsCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection('performance_metrics');
}

export async function getUsageEventsCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection('usage_events');
}

export async function getApiUsageCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection('api_usage');
}
