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
    <section className="jx-container-narrow jx-fade-enter" aria-labelledby="prologue-title">
      <div style={{ textAlign: 'center', padding: '4rem 0 2rem' }}>
        <div
          aria-hidden
          className="jx-seal-large"
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
        <h1 id="prologue-title" style={{ marginBottom: '2rem' }}>
          {t.prologue.title}
        </h1>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        {lines.map((l, i) => (
          <Verse key={i} text={l.text} gloss={l.gloss} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
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
        }}
      >
        {t.prologue.privacy}
      </p>
    </section>
  );
}
