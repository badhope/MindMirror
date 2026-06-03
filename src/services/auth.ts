import type {
  User,
  AuthCredentials,
  RegisterData,
  AuthResponse,
  ValidationError,
} from '../types/auth';
import {
  apiRequest,
  configureApi,
  ApiError,
  API_BASE_URL,
  clearLocalSession,
} from '../lib/apiClient';

const STORAGE_KEY_USER = 'mindmirror_user';
const STORAGE_KEY_TOKEN = 'mindmirror_token';
const STORAGE_KEY_LOCAL_USERS = 'mindmirror_local_users';
// One persistent secret per browser; used to HMAC local session tokens so they
// can be detected as authentic but cannot be forged cross-origin. Rotated by
// clearing localStorage (which is fine for an offline-only demo).
const STORAGE_KEY_LOCAL_SECRET = 'mindmirror_local_secret';

let configured = false;
let backendAvailable: boolean | null = null;
let backendCheckedAt = 0;
const BACKEND_CHECK_TTL_MS = 30_000;

function ensureConfigured() {
  if (configured) return;
  configured = true;
  configureApi({
    getToken: () => localStorage.getItem(STORAGE_KEY_TOKEN),
    onUnauthorized: () => {
      // Backend told us the token is bad. Wipe everything session-related
      // so the next login doesn't accidentally inherit stale state from
      // this account (history, local users, etc.).
      clearLocalSession();
    },
  });
}

interface ApiUser {
  id: string;
  email: string;
  username: string;
  avatar_url?: string | null;
  is_guest?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiTokenResponse {
  access_token: string;
  token_type: string;
  user: ApiUser;
}

function mapApiUser(u: ApiUser): User {
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    avatar: u.avatar_url || undefined,
    // The backend is supposed to send ISO-8601 strings. If it doesn't,
    // fall back to a sane default rather than letting `new Date(undefined)`
    // throw "Invalid Date" and abort the whole login flow.
    createdAt: parseDate(u.created_at) ?? new Date(0),
    lastLoginAt: parseDate(u.updated_at) ?? new Date(0),
    provider: 'email',
  };
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}

function mapLocalUser(u: LocalUserRecord): User {
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    avatar: u.avatar,
    createdAt: new Date(u.createdAt),
    lastLoginAt: new Date(u.updatedAt),
    provider: u.isGuest ? 'guest' : 'email',
  };
}

function persistSession(token: string, user: User) {
  localStorage.setItem(STORAGE_KEY_TOKEN, token);
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
}

// -------- Local-only fallback (offline / demo) --------

interface LocalUserRecord {
  id: string;
  email: string;
  username: string;
  passwordHash: string; // format: "pbkdf2$<saltB64>$<hashB64>$<iterations>$<hashFn>"
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isGuest?: boolean;
}

function getLocalUsers(): LocalUserRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_LOCAL_USERS) || '[]') as LocalUserRecord[];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: LocalUserRecord[]) {
  localStorage.setItem(STORAGE_KEY_LOCAL_USERS, JSON.stringify(users));
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64);
  const buf = new ArrayBuffer(bin.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

const PBKDF2_ITERATIONS = 200_000;
const PBKDF2_HASH = 'SHA-256';
const PBKDF2_KEY_BITS = 256;

async function derivePasswordHash(password: string, saltB64: string): Promise<string> {
  // SubtleCrypto is available in every modern browser we care about
  // (Chrome 37+, Firefox 34+, Safari 10.1+). We intentionally fail closed
  // rather than fall back to a non-cryptographic hash.
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('WebCrypto is not available in this browser; offline mode is disabled.');
  }
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: base64ToBytes(saltB64),
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    },
    keyMaterial,
    PBKDF2_KEY_BITS
  );
  return bytesToBase64(new Uint8Array(bits));
}

function buildPasswordRecord(saltB64: string, hashB64: string): string {
  return `pbkdf2$${saltB64}$${hashB64}$${PBKDF2_ITERATIONS}$${PBKDF2_HASH}`;
}

function verifyPasswordRecord(record: string, password: string): Promise<boolean> {
  const parts = record.split('$');
  if (parts.length !== 5 || parts[0] !== 'pbkdf2') return Promise.resolve(false);
  const [, saltB64, expectedB64, iterStr, hashFn] = parts;
  // We only support the current algorithm. Old records (sha256/fnv) are rejected
  // and the user has to re-register — acceptable for an offline-only demo.
  if (Number(iterStr) !== PBKDF2_ITERATIONS || hashFn !== PBKDF2_HASH) {
    return Promise.resolve(false);
  }
  return derivePasswordHash(password, saltB64).then(provided => provided === expectedB64);
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getLocalSecret(): string {
  let secret = localStorage.getItem(STORAGE_KEY_LOCAL_SECRET);
  if (!secret) {
    secret = uuid() + '.' + uuid();
    localStorage.setItem(STORAGE_KEY_LOCAL_SECRET, secret);
  }
  return secret;
}

async function hmacShort(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getLocalSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return bytesToBase64(new Uint8Array(sig)).slice(0, 22);
}

async function mintLocalToken(userId: string): Promise<string> {
  // Token carries no userId; the session row in localStorage is the source
  // of truth. The HMAC suffix makes it non-trivial to forge a "looks valid"
  // token across browsers.
  return `local.${await hmacShort(userId + ':' + uuid())}`;
}

function isLocalToken(token: string | null): boolean {
  return !!token && token.startsWith('local.');
}

async function pingBackend(): Promise<boolean> {
  const now = Date.now();
  if (backendAvailable !== null && now - backendCheckedAt < BACKEND_CHECK_TTL_MS) {
    return backendAvailable;
  }
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2500);
    const res = await fetch(API_BASE_URL + '/health', { signal: controller.signal });
    window.clearTimeout(timer);
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  backendCheckedAt = now;
  return backendAvailable;
}

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  }

  validateUsername(username: string): string | null {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 20) return 'Username must be less than 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  }

  validatePassword(password: string): string | null {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password.length > 50) return 'Password must be less than 50 characters';
    return null;
  }

  validateRegisterData(data: RegisterData): ValidationError[] {
    const errors: ValidationError[] = [];
    const emailError = this.validateEmail(data.email);
    if (emailError) errors.push({ field: 'email', message: emailError });
    const usernameError = this.validateUsername(data.username);
    if (usernameError) errors.push({ field: 'username', message: usernameError });
    const passwordError = this.validatePassword(data.password);
    if (passwordError) errors.push({ field: 'password', message: passwordError });
    if (data.password !== data.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }
    return errors;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    ensureConfigured();
    const errors = this.validateRegisterData(data);
    if (errors.length > 0) return { success: false, error: errors[0].message };

    const useBackend = await pingBackend();
    if (!useBackend) return this.registerLocal(data);

    try {
      const res = await apiRequest<ApiTokenResponse>('/auth/register', {
        method: 'POST',
        body: { email: data.email, username: data.username, password: data.password },
        skipAuth: true,
      });
      const user = mapApiUser(res.user);
      persistSession(res.access_token, user);
      return { success: true, user, token: res.access_token };
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        return this.registerLocal(data);
      }
      return { success: false, error: this.toMessage(err, 'Registration failed') };
    }
  }

  private async registerLocal(data: RegisterData): Promise<AuthResponse> {
    const users = getLocalUsers();
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists' };
    }
    if (users.find(u => u.username.toLowerCase() === data.username.toLowerCase())) {
      return { success: false, error: 'This username is already taken' };
    }
    const id = uuid();
    const saltB64 = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
    const hashB64 = await derivePasswordHash(data.password, saltB64);
    const now = new Date().toISOString();
    const record: LocalUserRecord = {
      id,
      email: data.email,
      username: data.username,
      passwordHash: buildPasswordRecord(saltB64, hashB64),
      avatar: this.generateAvatar(data.username),
      createdAt: now,
      updatedAt: now,
    };
    users.push(record);
    saveLocalUsers(users);
    const user = mapLocalUser(record);
    const token = await mintLocalToken(id);
    persistSession(token, user);
    return { success: true, user, token, mode: 'offline' };
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    ensureConfigured();
    const emailError = this.validateEmail(credentials.email);
    if (emailError) return { success: false, error: emailError };
    const passwordError = this.validatePassword(credentials.password);
    if (passwordError) return { success: false, error: passwordError };

    const useBackend = await pingBackend();
    if (!useBackend) return this.loginLocal(credentials);

    const form = new FormData();
    form.append('username', credentials.email);
    form.append('password', credentials.password);

    try {
      const res = await apiRequest<ApiTokenResponse>('/auth/login', {
        method: 'POST',
        formData: form,
        skipAuth: true,
      });
      const user = mapApiUser(res.user);
      persistSession(res.access_token, user);
      return { success: true, user, token: res.access_token };
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        return this.loginLocal(credentials);
      }
      return { success: false, error: this.toMessage(err, 'Incorrect email or password') };
    }
  }

  private async loginLocal(credentials: AuthCredentials): Promise<AuthResponse> {
    const users = getLocalUsers();
    const record = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    // Same error code for "no such user" and "wrong password" so the demo
    // mode does not become a user-enumeration oracle.
    const bad = { success: false, error: 'Incorrect email or password' } as const;
    if (!record) return bad;
    const ok = await verifyPasswordRecord(record.passwordHash, credentials.password);
    if (!ok) return bad;
    record.updatedAt = new Date().toISOString();
    saveLocalUsers(users);
    const user = mapLocalUser(record);
    const token = await mintLocalToken(record.id);
    persistSession(token, user);
    return { success: true, user, token, mode: 'offline' };
  }

  async loginAsGuest(): Promise<AuthResponse> {
    ensureConfigured();
    const useBackend = await pingBackend();
    if (!useBackend) return this.guestLocal();

    try {
      const res = await apiRequest<ApiTokenResponse>('/auth/guest', {
        method: 'POST',
        skipAuth: true,
      });
      const user = mapApiUser(res.user);
      persistSession(res.access_token, user);
      return { success: true, user, token: res.access_token };
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        return this.guestLocal();
      }
      return { success: false, error: this.toMessage(err, 'Guest login failed') };
    }
  }

  private async guestLocal(): Promise<AuthResponse> {
    const users = getLocalUsers();
    const id = uuid();
    const now = new Date().toISOString();
    const record: LocalUserRecord = {
      id,
      email: `guest-${id.slice(0, 6)}@local`,
      username: `guest_${id.slice(0, 6)}`,
      passwordHash: '',
      avatar: this.generateAvatar('Guest'),
      createdAt: now,
      updatedAt: now,
      isGuest: true,
    };
    users.push(record);
    saveLocalUsers(users);
    const user = mapLocalUser(record);
    const token = await mintLocalToken(id);
    persistSession(token, user);
    return { success: true, user, token, mode: 'offline' };
  }

  async loginWithOAuth(provider: 'google' | 'github'): Promise<AuthResponse> {
    return {
      success: false,
      error: `${provider} login is not configured on this deployment. Please use email/password.`,
    };
  }

  async handleOAuthCallback(): Promise<AuthResponse> {
    return { success: false, error: 'OAuth callback is not supported in this build.' };
  }

  async logout(): Promise<void> {
    ensureConfigured();
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (token && !isLocalToken(token)) {
      try {
        await apiRequest('/auth/logout', { method: 'POST' });
      } catch {
        // ignore
      }
    }
    clearLocalSession();
  }

  async resetPasswordForEmail(_email: string): Promise<AuthResponse> {
    return {
      success: false,
      error: 'Password reset via email is not configured on this deployment.',
    };
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEY_USER);
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr) as User;
      user.createdAt = new Date(user.createdAt);
      if (user.lastLoginAt) user.lastLoginAt = new Date(user.lastLoginAt);
      return user;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!this.getToken();
  }

  async restoreSession(): Promise<User | null> {
    ensureConfigured();
    const cached = this.getCurrentUser();
    const token = this.getToken();
    if (!cached || !token) return null;

    if (isLocalToken(token)) {
      return cached;
    }

    try {
      const fresh = await apiRequest<ApiUser>('/auth/me');
      const user = mapApiUser(fresh);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      return user;
    } catch {
      return cached;
    }
  }

  generateAvatar(username: string): string {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#F7DC6F',
    ];
    const color = colors[(username || 'X').charCodeAt(0) % colors.length];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=${color.slice(1)}&color=fff&size=128`;
  }

  async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    ensureConfigured();
    const payload: Record<string, string> = {};
    if (updates.username) payload.username = updates.username;
    if (updates.email) payload.email = updates.email;
    if (updates.avatar) payload.avatar_url = updates.avatar;

    const token = this.getToken();
    if (isLocalToken(token)) {
      const cached = this.getCurrentUser();
      if (!cached) return { success: false, error: 'Not signed in' };
      const users = getLocalUsers();
      const record = users.find(u => u.id === cached.id);
      if (!record) return { success: false, error: 'Account not found' };
      if (payload.username) record.username = payload.username;
      if (payload.email) record.email = payload.email;
      if (payload.avatar_url) record.avatar = payload.avatar_url;
      record.updatedAt = new Date().toISOString();
      saveLocalUsers(users);
      const user = mapLocalUser(record);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      return { success: true, user, token: token || undefined, mode: 'offline' };
    }

    try {
      const fresh = await apiRequest<ApiUser>('/auth/me', { method: 'PATCH', body: payload });
      const user = mapApiUser(fresh);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      return { success: true, user, token: token || undefined };
    } catch (err) {
      return { success: false, error: this.toMessage(err, 'Update failed') };
    }
  }

  async changePassword(_oldPassword: string, _newPassword: string): Promise<AuthResponse> {
    return {
      success: false,
      error: 'Password change is not supported in this build. Please contact an administrator.',
    };
  }

  isOffline(): boolean {
    return backendAvailable === false;
  }

  private toMessage(err: unknown, fallback: string): string {
    if (err instanceof ApiError) return err.message || fallback;
    if (err instanceof Error) return err.message || fallback;
    return fallback;
  }
}

// Seed a demo account once for first-time visitors in offline mode.
// Failure is non-fatal: the user just won't have a demo account to fall back on.
async function seedLocalDemoIfEmpty() {
  try {
    if (localStorage.getItem(STORAGE_KEY_LOCAL_USERS)) return;
    if (typeof crypto === 'undefined' || !crypto.subtle) return;
    const saltB64 = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
    const hashB64 = await derivePasswordHash('demo123', saltB64);
    const record: LocalUserRecord = {
      id: uuid(),
      email: 'demo@mindmirror.app',
      username: 'demo',
      passwordHash: buildPasswordRecord(saltB64, hashB64),
      avatar: 'https://ui-avatars.com/api/?name=demo&background=4F46E5&color=fff&size=128',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveLocalUsers([record]);
  } catch {
    // ignore
  }
}

if (typeof window !== 'undefined') {
  void seedLocalDemoIfEmpty();
}

export const authService = AuthService.getInstance();
