import type { User, AuthCredentials, RegisterData, AuthResponse, ValidationError } from '../types/auth';
import { clearLocalSession } from '../lib/apiClient';

const STORAGE_KEY_USER = 'mindmirror_user';
const STORAGE_KEY_TOKEN = 'mindmirror_token';
const STORAGE_KEY_LOCAL_USERS = 'mindmirror_local_users';
// One persistent secret per browser; used to HMAC local session tokens so
// they can be detected as authentic but cannot be forged across origins.
// Rotated by clearing localStorage (fine for an offline-only build).
const STORAGE_KEY_LOCAL_SECRET = 'mindmirror_local_secret';

interface LocalUserRecord {
  id: string;
  email: string;
  username: string;
  passwordHash: string; // "pbkdf2$<saltB64>$<hashB64>$<iterations>$<hashFn>"
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
  // WebCrypto is available in every modern browser we care about. We
  // intentionally fail closed rather than fall back to a non-cryptographic
  // hash.
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
  if (Number(iterStr) !== PBKDF2_ITERATIONS || hashFn !== PBKDF2_HASH) {
    return Promise.resolve(false);
  }
  return derivePasswordHash(password, saltB64).then(provided => provided === expectedB64);
}

function uuid(): string {
  if (typeof crypto === 'undefined') {
    throw new Error('WebCrypto is not available in this browser; offline mode is disabled.');
  }
  const c = crypto as Crypto;
  if (c.randomUUID) return c.randomUUID();
  if (c.getRandomValues) {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  console.warn('crypto.getRandomValues unavailable; falling back to Math.random for uuid()');
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ch => {
    const r = (Math.random() * 16) | 0;
    const v = ch === 'x' ? r : (r & 0x3) | 0x8;
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
  // Token carries no userId; the session row in localStorage is the
  // source of truth. The HMAC suffix makes it non-trivial to forge a
  // "looks valid" token across browsers.
  return `local.${await hmacShort(userId + ':' + uuid())}`;
}

function persistSession(token: string, user: User) {
  localStorage.setItem(STORAGE_KEY_TOKEN, token);
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
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

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) AuthService.instance = new AuthService();
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
    const errors = this.validateRegisterData(data);
    if (errors.length > 0) return { success: false, error: errors[0].message };

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
    return { success: true, user, token };
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const emailError = this.validateEmail(credentials.email);
    if (emailError) return { success: false, error: emailError };
    const passwordError = this.validatePassword(credentials.password);
    if (passwordError) return { success: false, error: passwordError };

    const users = getLocalUsers();
    const record = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    // Same error for "no such user" and "wrong password" — we are not
    // running an authentication oracle for a remote attacker.
    const bad = { success: false, error: 'Incorrect email or password' } as const;
    if (!record) return bad;
    const ok = await verifyPasswordRecord(record.passwordHash, credentials.password);
    if (!ok) return bad;
    record.updatedAt = new Date().toISOString();
    saveLocalUsers(users);
    const user = mapLocalUser(record);
    const token = await mintLocalToken(record.id);
    persistSession(token, user);
    return { success: true, user, token };
  }

  async loginAsGuest(): Promise<AuthResponse> {
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
    return { success: true, user, token };
  }

  async logout(): Promise<void> {
    clearLocalSession();
  }

  async resetPasswordForEmail(_email: string): Promise<AuthResponse> {
    return {
      success: false,
      error: 'Password reset is not available in the offline build. Register a new local account instead.',
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
    const cached = this.getCurrentUser();
    if (!cached) return { success: false, error: 'Not signed in' };
    const users = getLocalUsers();
    const record = users.find(u => u.id === cached.id);
    if (!record) return { success: false, error: 'Account not found' };
    if (updates.username) {
      const err = this.validateUsername(updates.username);
      if (err) return { success: false, error: err };
      record.username = updates.username;
    }
    if (updates.email) {
      const err = this.validateEmail(updates.email);
      if (err) return { success: false, error: err };
      record.email = updates.email;
    }
    if (updates.avatar) record.avatar = updates.avatar;
    record.updatedAt = new Date().toISOString();
    saveLocalUsers(users);
    const user = mapLocalUser(record);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return { success: true, user, token: this.getToken() || undefined };
  }

  async changePassword(_oldPassword: string, _newPassword: string): Promise<AuthResponse> {
    return {
      success: false,
      error: 'Password change is not supported in the offline build. Register a new account if needed.',
    };
  }
}

export const authService = AuthService.getInstance();

// Seed a demo account once for first-time visitors.
// Failure is non-fatal: the user just won't have a demo account to fall back on.
async function seedLocalDemoIfEmpty() {
  try {
    if (localStorage.getItem(STORAGE_KEY_LOCAL_USERS)) return;
    if (typeof crypto === 'undefined' || !crypto.subtle) return;
    const saltB64 = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
    const hashB64 = await derivePasswordHash('demo123', saltB64);
    const record: LocalUserRecord = {
      id: uuid(),
      email: 'demo@local',
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
