import { connectToDatabase, ContactMessage, getCollection } from './mongodb';
import { ObjectId } from 'mongodb';

// Create a contact message
export async function createContactMessage(data: Omit<ContactMessage, '_id' | 'receivedAt'>): Promise<ContactMessage> {
  const collection = await getCollection<any>('contact_messages');
  
  const message: ContactMessage = {
    ...data,
    receivedAt: new Date(),
  };

  const result = await collection.insertOne(message as any);
  
  return {
    ...message,
    _id: result.insertedId,
  };
}

// Get all contact messages
export async function getContactMessages(): Promise<ContactMessage[]> {
  const collection = await getCollection<any>('contact_messages');
  
  const messages = await collection
    .find({})
    .sort({ receivedAt: -1 })
    .limit(100)
    .toArray();

  return messages.map(msg => ({
    ...msg,
    _id: msg._id instanceof ObjectId ? msg._id : new ObjectId(msg._id as any),
  }));
}

// Get a single contact message by ID
export async function getContactMessageById(id: string): Promise<ContactMessage | null> {
  const collection = await getCollection<any>('contact_messages');
  
  try {
    const message = await collection.findOne({
      _id: new ObjectId(id),
    });
    
    if (!message) return null;
    
    return {
      ...message,
      _id: message._id instanceof ObjectId ? message._id : new ObjectId(message._id as any),
    };
  } catch (error) {
    console.error('Error getting message by ID:', error);
    return null;
  }
}

// Delete a contact message
export async function deleteContactMessage(id: string): Promise<boolean> {
  const collection = await getCollection<any>('contact_messages');
  
  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });
    
    return result.deletedCount === 1;
  } catch (error) {
    console.error('Error deleting message:', error);
    return false;
  }
}

// Get message count
export async function getContactMessageCount(): Promise<number> {
  const collection = await getCollection<any>('contact_messages');
  return collection.countDocuments();
}

// Get messages by date range
export async function getMessagesByDateRange(startDate: Date, endDate: Date): Promise<ContactMessage[]> {
  const collection = await getCollection<any>('contact_messages');
  
  const messages = await collection
    .find({
      receivedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
    .sort({ receivedAt: -1 })
    .toArray();

  return messages.map(msg => ({
    ...msg,
    _id: msg._id instanceof ObjectId ? msg._id : new ObjectId(msg._id as any),
  }));
}

// Health check for database connection
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}