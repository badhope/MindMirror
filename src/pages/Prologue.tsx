// 镜心 · 入门 · 题
import { useStore } from '../store';
import { BrushButton } from '../components/BrushButton';
import { Verse } from '../components/Verse';
import { useT } from '../i18n';

export function Prologue() {
  const { goPhase } = useStore();
  const t = useT();
  const pick = Math.floor(Math.random() * t.prologue.verses.length);
  const lines = t.prologue.verses[pick];

  return (
    <section className="jx-container-narrow jx-page-enter" aria-labelledby="prologue-title">
      {/* 顶部装饰 */}
      <div
        aria-hidden
        style={{
          textAlign: 'center',
          color: 'var(--ink-faint)',
          fontSize: '0.9rem',
          fontFamily: 'var(--font-accent)',
          letterSpacing: '0.5em',
          marginBottom: '1rem',
          opacity: 0.6,
        }}
      >
        ✦ ─── ◆ ─── ✦
      </div>

      <div style={{ textAlign: 'center', padding: '3rem 0 2rem' }}>
        <div
          aria-hidden
          className="jx-seal-large jx-stamp-in"
          style={{
            color: 'var(--cinnabar)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.3em',
            lineHeight: 1,
            marginBottom: '1.5rem',
          }}
        >
          {t.prologue.seal}
        </div>
        <h1
          id="prologue-title"
          className="jx-ink-spread"
          style={{ marginBottom: '1rem', animationDelay: '400ms' }}
        >
          {t.prologue.title}
        </h1>
        {/* 装饰分隔 */}
        <div
          aria-hidden
          style={{
            color: 'var(--cinnabar)',
            fontSize: '1.2rem',
            letterSpacing: '0.8em',
            opacity: 0.5,
            marginTop: '0.5rem',
          }}
        >
          ◆ ◇ ◆
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }} className="jx-bamboo-unfold">
        {lines.map((l, i) => (
          <Verse key={i} text={l.text} gloss={l.gloss} />
        ))}
      </div>

      {/* 中部装饰符号 */}
      <div
        aria-hidden
        style={{
          textAlign: 'center',
          color: 'var(--ink-faint)',
          fontSize: '0.8rem',
          letterSpacing: '0.3em',
          margin: '2rem 0',
          opacity: 0.4,
          fontFamily: 'var(--font-accent)',
        }}
      >
        ── 墨 · 心 · 镜 ──
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        <BrushButton variant="primary" onClick={() => goPhase('path')} data-testid="btn-enter">
          {t.prologue.enter}
        </BrushButton>
      </div>

      <p
        style={{
          textAlign: 'center',
          color: 'var(--ink-faint)',
          fontSize: '0.875rem',
          marginTop: '4rem',
          fontFamily: 'var(--font-accent)',
        }}
      >
        ◈ {t.prologue.privacy} ◈
      </p>

      {/* 底部装饰 */}
      <div
        aria-hidden
        style={{
          textAlign: 'center',
          color: 'var(--ink-faint)',
          fontSize: '0.75rem',
          letterSpacing: '0.4em',
          marginTop: '2rem',
          opacity: 0.3,
        }}
      >
        ✧ · · ✧ · · ✧
      </div>
    </section>
  );
}
