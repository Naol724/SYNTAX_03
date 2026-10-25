import { ObjectId } from "mongodb"
import { getStoreMode, fileStore } from "./file-store"
import type { ContactMessage } from "./mongodb"

const COLLECTION = "contact_messages"

async function mongoCollection() {
  const { getCollection } = await import("./mongodb")
  return getCollection<any>(COLLECTION)
}

export async function createContactMessage(
  data: Omit<ContactMessage, "_id" | "receivedAt">
): Promise<ContactMessage> {
  if (getStoreMode() === "file") {
    const row = fileStore.create(COLLECTION, {
      ...data,
      receivedAt: new Date().toISOString(),
    })
    return {
      ...(row as any),
      _id: row._id as any,
      receivedAt: new Date(row.receivedAt as string),
    }
  }

  const collection = await mongoCollection()
  const message: ContactMessage = {
    ...data,
    receivedAt: new Date(),
  }
  const result = await collection.insertOne(message as any)
  return { ...message, _id: result.insertedId }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (getStoreMode() === "file") {
    return fileStore.list(COLLECTION).map((msg: any) => ({
      ...msg,
      _id: msg._id,
      receivedAt: msg.receivedAt ? new Date(msg.receivedAt) : new Date(),
    })) as any
  }

  const collection = await mongoCollection()
  const messages = await collection.find({}).sort({ receivedAt: -1 }).limit(100).toArray()
  return messages.map((msg) => ({
    ...msg,
    _id: msg._id instanceof ObjectId ? msg._id : new ObjectId(msg._id as any),
  }))
}

export async function getContactMessageById(id: string): Promise<ContactMessage | null> {
  if (getStoreMode() === "file") {
    const msg = fileStore.findById(COLLECTION, id)
    if (!msg) return null
    return {
      ...(msg as any),
      receivedAt: (msg as any).receivedAt
        ? new Date((msg as any).receivedAt)
        : new Date(),
    }
  }

  const collection = await mongoCollection()
  try {
    const message = await collection.findOne({ _id: new ObjectId(id) })
    if (!message) return null
    return {
      ...message,
      _id: message._id instanceof ObjectId ? message._id : new ObjectId(message._id as any),
    }
  } catch (error) {
    console.error("Error getting message by ID:", error)
    return null
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  if (getStoreMode() === "file") {
    return fileStore.remove(COLLECTION, id)
  }

  const collection = await mongoCollection()
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  } catch (error) {
    console.error("Error deleting message:", error)
    return false
  }
}

export async function getContactMessageCount(): Promise<number> {
  if (getStoreMode() === "file") {
    return fileStore.count(COLLECTION)
  }
  const collection = await mongoCollection()
  return collection.countDocuments()
}

export async function getMessagesByDateRange(
  startDate: Date,
  endDate: Date
): Promise<ContactMessage[]> {
  const messages = await getContactMessages()
  return messages.filter((msg) => {
    const d = msg.receivedAt instanceof Date ? msg.receivedAt : new Date(msg.receivedAt as any)
    return d >= startDate && d <= endDate
  })
}

export async function checkDatabaseHealth(): Promise<boolean> {
  if (getStoreMode() === "file") return true
  try {
    const { connectToDatabase } = await import("./mongodb")
    const { db } = await connectToDatabase()
    await db.command({ ping: 1 })
    return true
  } catch (error) {
    console.error("Database health check failed:", error)
    return false
  }
}
