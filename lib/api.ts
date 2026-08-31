/**
 * API Client
 * Centralized HTTP client that talks to our Express backend.
 * Handles auth tokens, error parsing, and type safety.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

// ─── Token helpers (browser-only) ────────────────────
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('syntax_access_token');
}

function setToken(token: string): void {
  localStorage.setItem('syntax_access_token', token);
  // Also set a plain cookie so middleware can gate /admin routes
  document.cookie = 'syntax_authed=1; path=/; max-age=86400; SameSite=Lax';
}

function setRefreshToken(token: string): void {
  localStorage.setItem('syntax_refresh_token', token);
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('syntax_refresh_token');
}

function clearTokens(): void {
  localStorage.removeItem('syntax_access_token');
  localStorage.removeItem('syntax_refresh_token');
  // Clear auth cookie
  document.cookie = 'syntax_authed=; path=/; max-age=0';
}

export { setToken, setRefreshToken, clearTokens, getToken };

// ─── Core request function ────────────────────────────
async function request<T = any>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  // Auto-refresh on 401
  if (res.status === 401 && auth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getToken()}`;
      const retried = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });
      if (!retried.ok) {
        clearTokens();
        window.location.href = '/admin/login';
        throw new Error('Session expired');
      }
      const retryData = await retried.json();
      return retryData.data ?? retryData;
    } else {
      clearTokens();
      if (typeof window !== 'undefined') window.location.href = '/admin/login';
      throw new Error('Unauthorized');
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body?.error?.message ?? `Request failed: ${res.status}`,
      res.status,
      body?.error?.code ?? 'REQUEST_FAILED'
    );
  }

  // 204 No Content
  if (res.status === 204) return null as T;

  const json = await res.json();
  return json.data ?? json;
}

async function tryRefresh(): Promise<boolean> {
  try {
    const rt = getRefreshToken();
    if (!rt) return false;
    const res = await fetch(`${API_BASE}/admin/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setToken(data.data?.accessToken ?? data.accessToken);
    return true;
  } catch {
    return false;
  }
}

// ─── Custom error class ────────────────────────────────
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── API namespace ────────────────────────────────────
export const api = {
  // AUTH
  auth: {
    login: (email: string, password: string) =>
      request('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }), auth: false }),
    logout: () => {
      const rt = getRefreshToken();
      return request('/admin/logout', { method: 'POST', body: JSON.stringify({ refreshToken: rt }) });
    },
    me: () => request('/admin/me'),
    registerUser: (data: { email: string; full_name: string; phone_number?: string; company_name?: string }) =>
      request('/users/register', { method: 'POST', body: JSON.stringify(data), auth: false }),
  },

  // DASHBOARD
  dashboard: {
    getStats: () => request('/admin/dashboard'),
  },

  // SERVICES
  services: {
    getAll: (params?: Record<string, string>) =>
      request(`/admin/services?${new URLSearchParams(params)}`),
    getPublic: () => request('/services', { auth: false }),
    getById: (id: string) => request(`/admin/services/${id}`),
    create: (data: any) =>
      request('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request(`/admin/services/${id}`, { method: 'DELETE' }),
  },

  // PORTFOLIO
  portfolio: {
    getAll: (params?: Record<string, string>) =>
      request(`/admin/portfolio?${new URLSearchParams(params)}`),
    getPublic: (params?: Record<string, string>) =>
      request(`/portfolio?${new URLSearchParams(params)}`, { auth: false }),
    getFeatured: () => request('/portfolio/featured', { auth: false }),
    getById: (id: string) => request(`/admin/portfolio/${id}`),
    create: (data: any) =>
      request('/admin/portfolio', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request(`/admin/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request(`/admin/portfolio/${id}`, { method: 'DELETE' }),
  },

  // BLOG
  blog: {
    getAll: (params?: Record<string, string>) =>
      request(`/admin/blog?${new URLSearchParams(params)}`),
    getPublic: (params?: Record<string, string>) =>
      request(`/blog?${new URLSearchParams(params)}`, { auth: false }),
    getFeatured: () => request('/blog/featured', { auth: false }),
    getCategories: () => request('/blog/categories', { auth: false }),
    getBySlug: (slug: string) => request(`/blog/${slug}`, { auth: false }),
    getById: (id: string) => request(`/admin/blog/${id}`),
    create: (data: any) =>
      request('/admin/blog', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request(`/admin/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    publish: (id: string) =>
      request(`/admin/blog/${id}/publish`, { method: 'PATCH' }),
    unpublish: (id: string) =>
      request(`/admin/blog/${id}/unpublish`, { method: 'PATCH' }),
    delete: (id: string) =>
      request(`/admin/blog/${id}`, { method: 'DELETE' }),
  },

  // TESTIMONIALS
  testimonials: {
    getAll: (params?: Record<string, string>) =>
      request(`/admin/testimonials?${new URLSearchParams(params)}`),
    getPublic: () => request('/testimonials', { auth: false }),
    getFeatured: () => request('/testimonials/featured', { auth: false }),
    create: (data: any) =>
      request('/admin/testimonials', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request(`/admin/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    approve: (id: string) =>
      request(`/admin/testimonials/${id}/approve`, { method: 'PATCH' }),
    delete: (id: string) =>
      request(`/admin/testimonials/${id}`, { method: 'DELETE' }),
  },

  // DEVELOPERS
  developers: {
    getAll: (params?: Record<string, string>) =>
      request(`/admin/developers?${new URLSearchParams(params)}`),
    getPublic: () => request('/developers', { auth: false }),
    getById: (id: string) => request(`/admin/developers/${id}`),
    create: (data: any) =>
      request('/admin/developers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request(`/admin/developers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request(`/admin/developers/${id}`, { method: 'DELETE' }),
  },

  // MESSAGES
  messages: {
    getAll: (params?: Record<string, string>) =>
      request(`/admin/messages?${new URLSearchParams(params)}`),
    getStats: () => request('/admin/messages/stats'),
    getById: (id: string) => request(`/admin/messages/${id}`),
    send: (data: { sender_name: string; sender_email: string; subject: string; message: string; sender_phone?: string }) =>
      request('/messages', { method: 'POST', body: JSON.stringify(data), auth: false }),
    update: (id: string, data: any) =>
      request(`/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    archive: (id: string) =>
      request(`/admin/messages/${id}/archive`, { method: 'PATCH' }),
    delete: (id: string) =>
      request(`/admin/messages/${id}`, { method: 'DELETE' }),
  },

  // AI CHAT
  chat: {
    send: (message: string, sessionId?: string) =>
      request('/chat', {
        method: 'POST',
        body: JSON.stringify({ message, session_id: sessionId }),
        auth: false,
      }),
    getHistory: (sessionId: string) =>
      request(`/chat/history/${sessionId}`, { auth: false }),
    clearSession: (sessionId: string) =>
      request(`/chat/session/${sessionId}`, { method: 'DELETE', auth: false }),
    feedback: (chatId: string, was_helpful: boolean, feedback?: string) =>
      request(`/chat/${chatId}/feedback`, {
        method: 'PATCH',
        body: JSON.stringify({ was_helpful, feedback }),
        auth: false,
      }),
  },
};

export default api;
