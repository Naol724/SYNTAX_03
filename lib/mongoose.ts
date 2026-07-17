import mongoose from "mongoose"

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

const globalCache = global.mongooseCache || { conn: null, promise: null }
global.mongooseCache = globalCache

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || ""

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables")
  }

  if (globalCache.conn) {
    return globalCache.conn
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    })
  }

  globalCache.conn = await globalCache.promise
  return globalCache.conn
}

/** Alias used by some API routes */
export const connectDB = connectToDatabase
