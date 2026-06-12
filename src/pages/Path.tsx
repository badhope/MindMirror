// 镜心 · 选域 · 路

import { useState } from 'react';
import { useStore } from '../store';
import { BrushButton } from '../components/BrushButton';
import { Verse } from '../components/Verse';
import { figuresForDomain } from '../domain/figures/figures.index';
import type { DomainId } from '../domain/figures/figure.types';
import { useT } from '../i18n';

type Region = 'east' | 'west';

const DOMAIN_REGION: Record<DomainId, Region> = {
  'east-literati': 'east',
  'east-statesman': 'east',
  'east-scientist': 'east',
  'west-philosopher': 'west',
  'west-scientist': 'west',
};

const READY: Record<DomainId, boolean> = {
  'east-literati': true,
  'east-statesman': true,
  'east-scientist': true,
  'west-philosopher': true,
  'west-scientist': true,
};

const REGION_KEYS: readonly DomainId[] = [
  'east-literati',
  'east-statesman',
  'east-scientist',
  'west-philosopher',
  'west-scientist',
];

export function Path() {
  const { selectDomain } = useStore();
  const t = useT();
  const [region, setRegion] = useState<Region>('east');
  const [picked, setPicked] = useState<DomainId | null>(null);

  const chosen = picked ? figuresForDomain(picked).length : 0;
  const ready = picked && chosen > 0;

  return (
    <section className="jx-container jx-page-enter" aria-labelledby="path-title">
      {/* 顶部装饰 */}
      <div
        aria-hidden
        style={{
          textAlign: 'center',
          color: 'var(--ink-faint)',
          fontSize: '0.8rem',
          letterSpacing: '0.6em',
          marginBottom: '1.5rem',
          opacity: 0.5,
          fontFamily: 'var(--font-accent)',
        }}
      >
        ✦ ─── ❖ ─── ✦
      </div>

      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 id="path-title" className="jx-ink-spread">
          {t.path.title}
        </h1>
        <p
          style={{
            color: 'var(--ink-soft)',
            fontFamily: 'var(--font-accent)',
            fontSize: '1.05rem',
          }}
        >
          {t.path.prompt}
        </p>
      </header>

      <div
        role="tablist"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {(['east', 'west'] as Region[]).map(r => (
          <button
            key={r}
            role="tab"
            aria-selected={region === r}
            onClick={() => {
              setRegion(r);
              setPicked(null);
            }}
            style={{
              padding: '0.5rem 1.5rem',
              background: region === r ? 'var(--ink)' : 'var(--rice-deep)',
              color: region === r ? 'var(--rice)' : 'var(--ink)',
              border: '1.5px solid var(--ink)',
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              transition: 'all 300ms var(--ease-out)',
            }}
          >
            {t.path.region[r]}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(0, 14rem))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        {REGION_KEYS.filter(d => DOMAIN_REGION[d] === region).map(d => {
          const count = figuresForDomain(d).length;
          const meta = t.path.domains[d];
          const readyFlag = READY[d];
          const active = picked === d;
          return (
            <button
              key={d}
              type="button"
              data-domain={d}
              data-ready={readyFlag ? 'true' : 'false'}
              data-testid={`domain-card-${d}`}
              onClick={() => readyFlag && setPicked(d)}
              disabled={!readyFlag}
              aria-pressed={active}
              aria-label={`${meta.name} · ${meta.sub}`}
              style={{
                padding: '1.5rem 1.25rem',
                textAlign: 'left',
                background: active ? 'var(--rice-warm)' : 'transparent',
                border: `1.5px solid ${active ? 'var(--cinnabar)' : 'var(--rice-deep)'}`,
                cursor: readyFlag ? 'pointer' : 'not-allowed',
                opacity: readyFlag ? 1 : 0.45,
                transition: 'all 300ms var(--ease-out)',
                position: 'relative',
              }}
            >
              <h2
                style={{
                  marginBottom: '0.5rem',
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {meta.name}
              </h2>
              <p style={{ color: 'var(--ink-faint)', fontSize: '0.875rem', margin: 0 }}>
                {meta.sub}
              </p>
              <p
                style={{
                  marginTop: '0.75rem',
                  fontFamily: 'var(--font-display)',
                  color: readyFlag ? 'var(--jade)' : 'var(--ash)',
                  fontSize: '0.875rem',
                }}
              >
                {readyFlag ? t.path.peopleCount(count) : t.path.pending}
              </p>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="jx-fade-enter" style={{ textAlign: 'center' }}>
          {/* 装饰分隔 */}
          <div
            aria-hidden
            style={{
              color: 'var(--cinnabar)',
              fontSize: '0.9rem',
              letterSpacing: '0.5em',
              opacity: 0.4,
              marginBottom: '1.5rem',
            }}
          >
            ── ◈ ──
          </div>
          <Verse
            text={`${t.path.region[DOMAIN_REGION[picked]]} · ${t.path.domains[picked].name}`}
            gloss={t.path.picked}
          />
          <div style={{ marginTop: '2rem' }}>
            <BrushButton
              variant="primary"
              disabled={!ready}
              onClick={() => ready && selectDomain(picked)}
              data-testid="btn-start"
            >
              {t.path.start}
            </BrushButton>
          </div>
        </div>
      )}

      {/* 底部装饰 */}
      <div
        aria-hidden
        style={{
          textAlign: 'center',
          color: 'var(--ink-faint)',
          fontSize: '0.7rem',
          letterSpacing: '0.4em',
          marginTop: '3rem',
          opacity: 0.3,
        }}
      >
        ✧ · · ✧ · · ✧
      </div>
    </section>
  );
}
