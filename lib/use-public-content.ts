"use client"

import { useCallback, useEffect, useState } from "react"

type CacheEntry = {
  data: Record<string, any>
  at: number
  promise?: Promise<Record<string, any>>
}

const CACHE_TTL_MS = 30_000
const cache = new Map<string, CacheEntry>()

async function fetchJsonCached(url: string): Promise<Record<string, any>> {
  const now = Date.now()
  const hit = cache.get(url)
  if (hit && now - hit.at < CACHE_TTL_MS && hit.data) {
    return hit.data
  }
  if (hit?.promise) return hit.promise

  const promise = (async () => {
    try {
      const res = await fetch(url, {
        // Allow browser/CDN to reuse; still fresh enough for admin edits
        cache: "default",
        next: { revalidate: 15 } as any,
      })
      if (!res.ok) return {}
      const data = (await res.json()) as Record<string, any>
      cache.set(url, { data, at: Date.now() })
      return data
    } catch {
      return hit?.data || {}
    } finally {
      const entry = cache.get(url)
      if (entry) delete entry.promise
    }
  })()

  cache.set(url, { data: hit?.data || {}, at: hit?.at || 0, promise })
  return promise
}

/** Clear client cache after admin mutations so public pages refresh. */
export function invalidatePublicContentCache(urlPrefix?: string) {
  if (!urlPrefix) {
    cache.clear()
    return
  }
  for (const key of cache.keys()) {
    if (key.startsWith(urlPrefix)) cache.delete(key)
  }
}

export function usePublicList<T>(
  url: string,
  key: string,
  deps: unknown[] = []
) {
  const cached = cache.get(url)
  const initial =
    cached && Date.now() - cached.at < CACHE_TTL_MS
      ? ((cached.data[key] || []) as T[])
      : []

  const [items, setItems] = useState<T[]>(initial)
  const [loading, setLoading] = useState(initial.length === 0)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const hasStale = items.length > 0
    if (!hasStale) setLoading(true)
    setError(null)
    try {
      const data = await fetchJsonCached(url)
      const list = (data[key] || []) as T[]
      setItems(Array.isArray(list) ? list : [])
    } catch (e: any) {
      setError(e?.message || "Failed to load")
      if (!hasStale) setItems([])
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, key, ...deps])

  useEffect(() => {
    load()
  }, [load])

  return { items, loading, error, reload: load }
}

export function initialsFromName(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "?"
}
