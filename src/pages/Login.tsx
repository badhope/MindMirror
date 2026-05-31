import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { getTranslation } from '../i18n';
import type { AuthCredentials } from '../types/auth';

export const Login = () => {
  const navigate = useNavigate();
  const { login, authLoading, authError, isAuthenticated, clearAuthError, locale } = useAppStore();
  const i18n = getTranslation(locale);

  const [credentials, setCredentials] = useState<AuthCredentials>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<AuthCredentials>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthCredentials> = {};

    if (!credentials.email) {
      newErrors.email = i18n.auth?.emailRequired || 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!credentials.password) {
      newErrors.password = i18n.auth?.passwordRequired || 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await login(credentials);
    
    if (success) {
      navigate('/');
    }
  };

  const handleChange = (field: keyof AuthCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials({ ...credentials, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl">
              🧠
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MindMirror
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {i18n.auth?.welcomeBack || 'Welcome back!'}
          </h1>
          <p className="text-slate-600">
            {i18n.auth?.loginSubtitle || 'Sign in to continue your journey'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {authError}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                {i18n.auth?.email || 'Email'}
              </label>
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={handleChange('email')}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                }`}
                placeholder="name@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                {i18n.auth?.password || 'Password'}
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={handleChange('password')}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                }`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {i18n.auth?.forgotPassword || 'Forgot Password?'}
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {i18n.auth?.loggingIn || 'Logging in...'}
                </>
              ) : (
                i18n.auth?.login || 'Login'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">
                  {i18n.auth?.orContinueWith || 'Or continue with'}
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span className="text-xl">🔵</span>
                <span className="text-sm font-medium text-slate-700">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span className="text-xl">⚫</span>
                <span className="text-sm font-medium text-slate-700">GitHub</span>
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              {i18n.auth?.noAccount || "Don't have an account?"}{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                {i18n.auth?.signUpHere || 'Sign up here'}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-slate-600 hover:text-slate-700 text-sm font-medium"
          >
            ← {i18n.common?.back || 'Back'} {i18n.nav?.home || 'Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};
