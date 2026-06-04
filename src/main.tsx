import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Global error handler — if React fails to mount, surface the error visibly
// instead of leaving the user staring at a blank page.
function showFatalError(err: unknown) {
  console.error('[MindMirror] fatal boot error:', err);
  const boot = document.getElementById('__app_boot__');
  const root = document.getElementById('root');
  const message = err instanceof Error ? `${err.message}\n\n${err.stack ?? ''}` : String(err);
  const safe = message.replace(
    /[<>&]/g,
    c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] as string
  );
  const html = `
    <div style="text-align:left;max-width:640px;padding:0 24px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace">
      <div style="width:64px;height:64px;margin:0 0 20px;background:#fee2e2;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:32px">⚠️</div>
      <h1 style="margin:0 0 8px;font-family:system-ui;font-size:24px;color:#991b1b">MindMirror failed to start</h1>
      <p style="margin:0 0 16px;font-family:system-ui;font-size:14px;color:#7f1d1d">A JavaScript error prevented the app from loading. The most common cause is a stale browser cache. Try a hard refresh (Ctrl+Shift+R / Cmd+Shift+R) or open the browser DevTools console for the full error.</p>
      <pre style="white-space:pre-wrap;background:#fef2f2;border:1px solid #fecaca;padding:12px;border-radius:8px;font-size:12px;color:#7f1d1d;max-height:240px;overflow:auto">${safe}</pre>
    </div>
  `;
  if (boot) boot.innerHTML = html;
  else if (root) root.innerHTML = html;
  else document.body.innerHTML = html;
}

window.addEventListener('error', e => {
  if (document.getElementById('__app_boot__')) {
    setTimeout(() => {
      if (document.getElementById('__app_boot__')) {
        showFatalError(e.error || e.message);
      }
    }, 100);
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  showFatalError(new Error('Root element #root not found in document'));
} else {
  try {
    // Read locale from storage before mounting
    let storedLocale: 'en' | 'zh' = 'zh';
    try {
      const v = localStorage.getItem('locale');
      if (v === 'en' || v === 'zh') storedLocale = v;
    } catch {
      /* ignore */
    }
    document.documentElement.lang = storedLocale === 'zh' ? 'zh-CN' : 'en';

    // Remove the boot shell so React can mount cleanly into #root
    const boot = document.getElementById('__app_boot__');
    if (boot) boot.remove();

    // Dev-only: expose the app store on window for E2E tests and
    // DevTools. Stripped from production builds by Vite's dead-code
    // elimination.
    if (import.meta.env.DEV) {
      import('./store').then(({ useAppStore }) => {
        (window as unknown as { __mindmirrorStore: typeof useAppStore }).__mindmirrorStore =
          useAppStore;
      });
    }

    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (err) {
    showFatalError(err);
  }
}
