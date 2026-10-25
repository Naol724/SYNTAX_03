/**
 * Local JSON file store — used when MongoDB Atlas is unavailable / placeholder.
 * Data lives in `.data/*.json` (gitignored).
 */

import fs from "fs"
import path from "path"
import { randomBytes } from "crypto"

const DATA_DIR = path.join(process.cwd(), ".data")

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function filePath(collection: string) {
  return path.join(DATA_DIR, `${collection}.json`)
}

function readAll<T = any>(collection: string): T[] {
  ensureDir()
  const fp = filePath(collection)
  if (!fs.existsSync(fp)) return []
  try {
    return JSON.parse(fs.readFileSync(fp, "utf8")) as T[]
  } catch {
    return []
  }
}

function writeAll(collection: string, rows: any[]) {
  ensureDir()
  fs.writeFileSync(filePath(collection), JSON.stringify(rows, null, 2), "utf8")
}

function newId() {
  return randomBytes(12).toString("hex")
}

export const fileStore = {
  list<T = any>(collection: string): T[] {
    return readAll<T>(collection)
  },

  findById<T extends { _id: string }>(collection: string, id: string): T | null {
    return (readAll<T>(collection).find((r) => r._id === id) as T) || null
  },

  create<T extends Record<string, any>>(collection: string, data: T): T & { _id: string } {
    const rows = readAll(collection)
    const row = {
      ...data,
      _id: newId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    rows.unshift(row)
    writeAll(collection, rows)
    return row as T & { _id: string }
  },

  update<T extends { _id: string }>(
    collection: string,
    id: string,
    data: Partial<T>
  ): T | null {
    const rows = readAll<T>(collection)
    const idx = rows.findIndex((r) => r._id === id)
    if (idx < 0) return null
    rows[idx] = {
      ...rows[idx],
      ...data,
      _id: id,
      updatedAt: new Date().toISOString(),
    }
    writeAll(collection, rows)
    return rows[idx]
  },

  remove(collection: string, id: string): boolean {
    const rows = readAll(collection)
    const next = rows.filter((r: any) => r._id !== id)
    if (next.length === rows.length) return false
    writeAll(collection, next)
    return true
  },

  clear(collection: string) {
    writeAll(collection, [])
  },

  count(collection: string) {
    return readAll(collection).length
  },
}

export type ContentStoreMode = "mongo" | "file"

let cachedMode: ContentStoreMode | null = null

export function getStoreMode(): ContentStoreMode {
  if (cachedMode) return cachedMode
  const uri = (process.env.MONGODB_URI || process.env.DATABASE_URL || "").trim()
  const forceFile = process.env.USE_FILE_DB === "true"
  // Real Atlas hosts look like cluster0.abc12.mongodb.net — bare "cluster.mongodb.net" is a placeholder.
  const host = (uri.match(/@([^/?]+)/) || [])[1] || ""
  const isPlaceholder =
    !uri ||
    host === "cluster.mongodb.net" ||
    /^mongodb(\+srv)?:\/\/cluster\.mongodb\.net(\/|$|\?)/i.test(uri) ||
    /your[_-]?mongo|changeme|example\.com/i.test(uri)

  cachedMode = forceFile || isPlaceholder ? "file" : "mongo"
  return cachedMode
}

export function resetStoreModeCache() {
  cachedMode = null
}
