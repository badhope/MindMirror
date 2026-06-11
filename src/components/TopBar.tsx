// 镜心 · 顶部导航
import { useStore } from '../store';
import { BrushButton } from './BrushButton';
import { useT } from '../i18n';

export function TopBar() {
  const { phase, reset, locale, setLocale, theme, setTheme } = useStore();
  const t = useT();
  const onLogo = () => {
    if (confirm(t.ui.returnHomeConfirm)) reset();
  };
  const label = t.ui.phase[phase];
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        position: 'sticky',
        top: 0,
        background: 'var(--rice-translucent)',
        backdropFilter: 'blur(8px)',
        zIndex: 10,
        borderBottom: '1px solid var(--rice-deep)',
        minHeight: '3.5rem',
        gap: '0.5rem',
      }}
    >
      <button
        onClick={onLogo}
        title={t.ui.returnHome}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.25rem 0.5rem',
          color: 'var(--ink)',
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          letterSpacing: '0.2em',
          minHeight: '2.5rem',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
        aria-label={t.ui.returnHome}
      >
        <span className="jx-seal" aria-hidden>
          {t.ui.sealChar}
        </span>
        <span>{t.ui.appName}</span>
      </button>

      <nav style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        <span
          aria-label="当前阶段"
          data-testid="topbar-phase"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--ink-faint)',
            fontSize: '0.875rem',
            letterSpacing: '0.1em',
            padding: '0 0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        <BrushButton
          variant="ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? '昼' : '夜'}
          data-testid="btn-theme"
          aria-label={theme === 'dark' ? 'switch to light' : 'switch to dark'}
          style={{ minWidth: '2.5rem', padding: '0.25rem 0.6rem' }}
        >
          {theme === 'dark' ? '☾' : '☼'}
        </BrushButton>
        <BrushButton
          variant="ghost"
          onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
          data-testid="btn-lang"
          style={{ minWidth: '2.5rem', padding: '0.25rem 0.6rem' }}
        >
          {t.ui.toggleLang}
        </BrushButton>
      </nav>
    </header>
  );
}
