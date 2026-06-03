const DEFAULT_BASE_URL = '/api/v1';

const envBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

export const API_BASE_URL =
  envBase && envBase.length > 0 ? envBase.replace(/\/$/, '') : DEFAULT_BASE_URL;

export const API_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  status: number;
  detail: unknown;
  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  formData?: FormData;
  skipAuth?: boolean;
};

let tokenGetter: () => string | null = () => null;
let onUnauthorized: () => void = () => undefined;

export function configureApi(opts: { getToken: () => string | null; onUnauthorized: () => void }) {
  tokenGetter = opts.getToken;
  onUnauthorized = opts.onUnauthorized;
}

// All keys the app writes to localStorage that should be wiped on logout
// or a 401 from the backend.  Listing them in one place means the next
// person who adds a key can't forget to add it here.
export const SESSION_STORAGE_KEYS = [
  'mindmirror_user',
  'mindmirror_token',
  'mindmirror_local_users',
  'mindmirror_local_secret',
  'assessmentHistory',
] as const;

export function clearLocalSession() {
  for (const key of SESSION_STORAGE_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore — storage might be disabled in private mode etc.
    }
  }
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const base = API_BASE_URL.endsWith('/api/v1') || path.startsWith('http') ? '' : API_BASE_URL;
  const url = base + (path.startsWith('/') ? path : `/${path}`);
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    params.append(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, query, headers = {}, signal, formData, skipAuth = false } = options;

  const url = buildUrl(path, query);
  const finalHeaders: Record<string, string> = { Accept: 'application/json', ...headers };

  let payload: BodyInit | undefined;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  if (!skipAuth) {
    const token = tokenGetter();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: payload,
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);

    if (res.status === 204) {
      return undefined as T;
    }

    const text = await res.text();
    const data = text ? safeJsonParse(text) : null;

    if (!res.ok) {
      if (res.status === 401) onUnauthorized();
      const detail = (data && (data as { detail?: unknown }).detail) ?? data ?? res.statusText;
      const message = typeof detail === 'string' ? detail : res.statusText || 'Request failed';
      throw new ApiError(message, res.status, detail);
    }

    return data as T;
  } catch (err) {
    window.clearTimeout(timeoutId);
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timeout', 0);
    }
    const message = err instanceof Error ? err.message : 'Network error';
    throw new ApiError(message, 0);
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
