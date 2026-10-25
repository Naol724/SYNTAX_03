/**
 * Admin fetch helper — uses NextAuth session cookies (credentials: include).
 * Replaces Express JWT client for admin CRUD.
 */

export class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
    this.name = "AdminApiError"
  }
}

export async function adminFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login"
    }
    throw new AdminApiError("Unauthorized", 401)
  }

  if (res.status === 204) {
    if (typeof window !== "undefined" && options.method && options.method !== "GET") {
      const { invalidatePublicContentCache } = await import("@/lib/use-public-content")
      invalidatePublicContentCache("/api/public")
    }
    return null as T
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new AdminApiError(
      data?.error || data?.message || `Request failed (${res.status})`,
      res.status
    )
  }

  // Keep public pages in sync after admin create/update/delete
  if (
    typeof window !== "undefined" &&
    options.method &&
    options.method !== "GET" &&
    /^\/api\/(services|portfolio|blog|testimonials|team)/.test(path)
  ) {
    const { invalidatePublicContentCache } = await import("@/lib/use-public-content")
    invalidatePublicContentCache("/api/public")
  }

  return data as T
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
