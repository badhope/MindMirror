import type { User, AuthCredentials, RegisterData, AuthResponse, ValidationError } from '../types/auth';
import { apiRequest, configureApi, ApiError } from '../lib/apiClient';

const STORAGE_KEY_USER = 'mindmirror_user';
const STORAGE_KEY_TOKEN = 'mindmirror_token';

let configured = false;

function ensureConfigured() {
  if (configured) return;
  configured = true;
  configureApi({
    getToken: () => localStorage.getItem(STORAGE_KEY_TOKEN),
    onUnauthorized: () => {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
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
    createdAt: new Date(u.created_at),
    lastLoginAt: new Date(u.updated_at),
    provider: 'email',
  };
}

function persistSession(token: string, user: User) {
  localStorage.setItem(STORAGE_KEY_TOKEN, token);
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
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
    if (errors.length > 0) {
      return { success: false, error: errors[0].message };
    }
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
      return { success: false, error: this.toMessage(err, 'Registration failed') };
    }
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    ensureConfigured();
    const emailError = this.validateEmail(credentials.email);
    if (emailError) return { success: false, error: emailError };
    const passwordError = this.validatePassword(credentials.password);
    if (passwordError) return { success: false, error: passwordError };

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
      return { success: false, error: this.toMessage(err, 'Incorrect email or password') };
    }
  }

  async loginAsGuest(): Promise<AuthResponse> {
    ensureConfigured();
    try {
      const res = await apiRequest<ApiTokenResponse>('/auth/guest', {
        method: 'POST',
        skipAuth: true,
      });
      const user = mapApiUser(res.user);
      persistSession(res.access_token, user);
      return { success: true, user, token: res.access_token };
    } catch (err) {
      return { success: false, error: this.toMessage(err, 'Guest login failed') };
    }
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
    if (token) {
      try {
        await apiRequest('/auth/logout', { method: 'POST' });
      } catch {
        // ignore logout errors
      }
    }
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }

  async resetPasswordForEmail(_email: string): Promise<AuthResponse> {
    return { success: false, error: 'Password reset via email is not configured on this deployment.' };
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
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    const color = colors[username.charCodeAt(0) % colors.length];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=${color.slice(1)}&color=fff&size=128`;
  }

  async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    ensureConfigured();
    const payload: Record<string, string> = {};
    if (updates.username) payload.username = updates.username;
    if (updates.email) payload.email = updates.email;
    if (updates.avatar) payload.avatar_url = updates.avatar;

    try {
      const fresh = await apiRequest<ApiUser>('/auth/me', { method: 'PATCH', body: payload });
      const user = mapApiUser(fresh);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      return { success: true, user, token: this.getToken() || undefined };
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

  private toMessage(err: unknown, fallback: string): string {
    if (err instanceof ApiError) return err.message || fallback;
    if (err instanceof Error) return err.message || fallback;
    return fallback;
  }
}

export const authService = AuthService.getInstance();
