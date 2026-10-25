/**
 * Unified content repository — MongoDB when configured, otherwise local JSON files.
 * Keeps admin CRUD working even without Atlas.
 */

import { connectToDatabase } from "@/lib/mongoose"
import {
  Service,
  Portfolio,
  BlogPost,
  Testimonial,
  TeamMember,
} from "@/lib/models"
import { fileStore, getStoreMode } from "@/lib/file-store"
import { slugify } from "@/lib/admin-api"
import { ensureResourceSeeded } from "@/lib/seed-content"

export type Resource =
  | "services"
  | "portfolio"
  | "blog"
  | "testimonials"
  | "team"

const MODEL_MAP = {
  services: Service,
  portfolio: Portfolio,
  blog: BlogPost,
  testimonials: Testimonial,
  team: TeamMember,
} as const

const listCache = new Map<string, { at: number; rows: any[] }>()
const LIST_TTL_MS = 5_000

function sortRows(resource: Resource, rows: any[]) {
  return [...rows].sort((a, b) => {
    const ao = a.order ?? 0
    const bo = b.order ?? 0
    if (ao !== bo) return ao - bo
    return String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
  })
}

function invalidateListCache(resource?: Resource) {
  if (!resource) {
    listCache.clear()
    return
  }
  listCache.delete(resource)
}

export async function listResource(resource: Resource, opts?: { bypassCache?: boolean }) {
  if (!opts?.bypassCache) {
    const hit = listCache.get(resource)
    if (hit && Date.now() - hit.at < LIST_TTL_MS) return hit.rows
  }

  await ensureResourceSeeded(resource)

  let rows: any[]
  if (getStoreMode() === "file") {
    rows = sortRows(resource, fileStore.list(resource))
  } else {
    try {
      await connectToDatabase()
      const Model = MODEL_MAP[resource]
      const docs = await Model.find().sort({ order: 1, createdAt: -1 }).lean()
      rows = docs.map((r: any) => ({ ...r, _id: String(r._id) }))
      // If Mongo is empty but local file has seeded data, prefer that (deploy mismatch)
      if (rows.length === 0 && fileStore.count(resource) > 0) {
        rows = sortRows(resource, fileStore.list(resource))
      }
    } catch (error) {
      console.error(`[content-repo] Mongo failed for ${resource}, using file store:`, error)
      rows = sortRows(resource, fileStore.list(resource))
    }
  }

  listCache.set(resource, { at: Date.now(), rows })
  return rows
}

export async function createResource(resource: Resource, data: Record<string, any>) {
  await ensureResourceSeeded(resource)
  const payload = { ...data }

  if (resource === "portfolio" || resource === "blog") {
    if (!payload.slug && payload.title) payload.slug = slugify(payload.title)
  }

  try {
    let created: any
    if (getStoreMode() === "file") {
      if (payload.slug) {
        const existing = fileStore.list(resource).find((r: any) => r.slug === payload.slug)
        if (existing) payload.slug = `${payload.slug}-${Date.now().toString(36)}`
      }
      created = fileStore.create(resource, payload)
    } else {
      try {
        await connectToDatabase()
        const Model = MODEL_MAP[resource]
        if (payload.slug) {
          const exists = await (Model as any).findOne({ slug: payload.slug })
          if (exists) payload.slug = `${payload.slug}-${Date.now().toString(36)}`
        }
        const doc = await (Model as any).create(payload)
        const obj = doc.toObject()
        created = { ...obj, _id: String(obj._id) }
      } catch (error) {
        console.error(`[content-repo] Mongo create failed, file fallback:`, error)
        created = fileStore.create(resource, payload)
      }
    }
    return created
  } finally {
    invalidateListCache(resource)
  }
}

export async function updateResource(
  resource: Resource,
  id: string,
  data: Record<string, any>
) {
  const { _id, createdAt, ...rest } = data as any

  try {
    if (getStoreMode() === "file") {
      return fileStore.update(resource, id, rest)
    }

    try {
      await connectToDatabase()
      const Model = MODEL_MAP[resource]
      const doc = await (Model as any).findByIdAndUpdate(
        id,
        { ...rest, updatedAt: new Date() },
        { new: true }
      ).lean()
      if (!doc) return null
      return { ...doc, _id: String(doc._id) }
    } catch (error) {
      console.error(`[content-repo] Mongo update failed, file fallback:`, error)
      return fileStore.update(resource, id, rest)
    }
  } finally {
    invalidateListCache(resource)
  }
}

export async function deleteResource(resource: Resource, id: string) {
  try {
    if (getStoreMode() === "file") {
      return fileStore.remove(resource, id)
    }

    try {
      await connectToDatabase()
      const Model = MODEL_MAP[resource]
      const doc = await (Model as any).findByIdAndDelete(id)
      return !!doc
    } catch (error) {
      console.error(`[content-repo] Mongo delete failed, file fallback:`, error)
      return fileStore.remove(resource, id)
    }
  } finally {
    invalidateListCache(resource)
  }
}

export function getActiveStoreInfo() {
  return {
    mode: getStoreMode(),
    message:
      getStoreMode() === "file"
        ? "Using local file database (.data/). Set a real MONGODB_URI to use MongoDB Atlas."
        : "Using MongoDB",
  }
}
