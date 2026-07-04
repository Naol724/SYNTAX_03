import mongoose from "mongoose"

let cached: typeof mongoose | null = null

export async function connectToDatabase() {
  if (cached) {
    return cached
  }

  const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || ""

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables")
  }

  await mongoose.connect(MONGODB_URI)
  cached = mongoose

  return mongoose
}
