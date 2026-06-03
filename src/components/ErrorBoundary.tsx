import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHardReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const err = this.state.error;
      // Stack traces and library names leak version info to anyone who
      // hits an unhandled error. Only show them in dev builds so an
      // engineer reproducing a bug can still see them locally.
      const showDetails = import.meta.env.DEV;
      const detail = showDetails && err ? `${err.message}\n\n${err.stack ?? ''}` : null;
      const safe = (detail ?? '').replace(
        /[<>&]/g,
        c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] as string
      );
      return (
        <div
          role="alert"
          className="min-h-screen flex items-center justify-center p-6"
          style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
              ⚠️
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
            <p className="text-slate-600 mb-4 leading-relaxed">
              MindMirror hit an error while rendering. The most common cause is the browser caching
              an old version of the app.
            </p>
            {safe && (
              <pre className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-auto max-h-48 text-slate-700 mb-4">
                {safe}
              </pre>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Reload
              </button>
              <button
                type="button"
                onClick={this.handleHardReset}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
              >
                Clear cache &amp; reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
