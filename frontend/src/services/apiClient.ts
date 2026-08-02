/**
 * Core HTTP client for communicating with the ClinicOS backend API.
 * Encapsulates tenant scoping, authorization token headers, and standard error parsing.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

interface RequestOptions extends RequestInit {
  tenantId?: string
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('clinicos_token')
  const savedTenantId = localStorage.getItem('clinicos_tenant_id')
  const headers = new Headers(options.headers)

  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  // Set X-Tenant-ID either from explicit options or fallback to localStorage
  const activeTenantId = options.tenantId || savedTenantId
  if (activeTenantId) {
    headers.set('X-Tenant-ID', activeTenantId)
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorPayload: { error?: { message?: string }; message?: string }
    try {
      errorPayload = await response.json()
    } catch {
      errorPayload = { error: { message: 'An unexpected connection error occurred.' } }
    }
    const message = errorPayload.error?.message || errorPayload.message || 'API transaction failed.'
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}

