import mongoose from "mongoose"

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

const globalCache = global.mongooseCache || { conn: null, promise: null }
global.mongooseCache = globalCache

function isPlaceholderUri(uri: string): boolean {
  // Real Atlas hosts look like cluster0.xxxxx.mongodb.net — bare cluster.mongodb.net is invalid
  return (
    !uri ||
    uri.includes("cluster.mongodb.net") && !/\.mongodb\.net/.test(uri.replace("cluster.mongodb.net", "X")) ||
    /^mongodb(\+srv)?:\/\/[^/]*cluster\.mongodb\.net(\/|$|\?)/i.test(uri)
  )
}

export async function connectToDatabase() {
  const MONGODB_URI = (process.env.MONGODB_URI || process.env.DATABASE_URL || "").trim()

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add a real MongoDB Atlas URI or use local: mongodb://127.0.0.1:27017/syntax"
    )
  }

  if (isPlaceholderUri(MONGODB_URI)) {
    throw new Error(
      "MONGODB_URI looks like a placeholder (cluster.mongodb.net). Use your real Atlas connection string, or local MongoDB: mongodb://127.0.0.1:27017/syntax"
    )
  }

  if (globalCache.conn) {
    return globalCache.conn
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
      })
      .then((m) => m)
      .catch((err) => {
        // Allow retries on next request after a failed attempt
        globalCache.promise = null
        globalCache.conn = null
        throw err
      })
  }

  try {
    globalCache.conn = await globalCache.promise
    return globalCache.conn
  } catch (error) {
    globalCache.promise = null
    globalCache.conn = null
    const msg = error instanceof Error ? error.message : "Unknown DB error"
    throw new Error(`Database connection failed: ${msg}`)
  }
}

/** Alias used by some API routes */
export const connectDB = connectToDatabase
