// 镜心 · 映照 · 卷

import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store';
import { TraitRadar } from '../components/TraitRadar';
import { Portrait } from '../components/Portrait';
import { BrushButton } from '../components/BrushButton';
import { Verse } from '../components/Verse';
import { TRAITS } from '../domain/traits/trait.dimensions';
import { itemsForDomain } from '../domain/items/items.index';
import { figuresForDomain } from '../domain/figures/figures.index';
import { computeUserVector } from '../domain/matching/vector';
import { buildReport } from '../domain/matching/report';
import { useT } from '../i18n';
import { exportState, encodeResume, downloadJSON, readJSONFile } from '../share';

export function Reflection() {
  const { report, domain, answers, goPhase, setReport, reset, locale, theme } = useStore();
  const t = useT();
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const goPhaseRef = useRef(goPhase);
  goPhaseRef.current = goPhase;

  // 刷新后报告丢失：可由 domain + answers 重新计算
  useEffect(() => {
    if (!report) {
      if (domain && Object.keys(answers).length >= 30) {
        const items = itemsForDomain(domain);
        const figures = figuresForDomain(domain);
        const r = buildReport(computeUserVector(answers, items), figures, answers, items);
        setReport(r);
      } else {
        goPhaseRef.current('prologue');
      }
    }
  }, [report, domain, answers, setReport]);

  // C17 同道 3 维高亮（必须在任何条件 return 之前）
  const top3 = useMemo<number[]>(() => {
    if (!report) return [];
    return [...report.traitBreakdown]
      .map(b => ({
        traitId: b.traitId,
        diff: Math.abs(b.user - b.figure),
      }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 3)
      .map(x => x.traitId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);

  if (!report) return null;

  const { primary, alternates, traitBreakdown, confidence } = report;
  const pct = Math.round(primary.score * 100);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  // C18 分享
  const handleShare = async () => {
    const shareData = {
      title: t.share.title,
      text: `${t.share.text} — ${primary.figure.name} (${primary.figure.era})`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        flash(t.reflection.shareCopied);
      }
    } catch {
      /* user cancel */
    }
  };

  // C13 导出 JSON
  const handleExport = () => {
    const s = exportState({
      domain,
      currentIndex: Object.keys(answers).length,
      answers,
      locale,
      theme,
    });
    downloadJSON(s);
  };

  // C13 复制续答 URL
  const handleCopyResume = async () => {
    const s = exportState({
      domain,
      currentIndex: Object.keys(answers).length,
      answers,
      locale,
      theme,
    });
    const enc = encodeResume(s);
    const url = `${window.location.origin}${window.location.pathname}?resume=${enc}`;
    try {
      await navigator.clipboard.writeText(url);
      flash(t.reflection.shareCopied);
    } catch {
      flash(url);
    }
  };

  // C13 导入 JSON
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const s = await readJSONFile(f);
    if (s) {
      useStore.getState().importState(s);
      flash(t.reflection.imported);
    } else {
      flash(t.reflection.importFail);
    }
    e.target.value = '';
  };

  return (
    <article className="jx-container jx-scroll-reveal" aria-labelledby="ref-title">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p
          style={{
            color: 'var(--ink-faint)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.3em',
            marginBottom: '1rem',
          }}
        >
          {t.reflection.sealLabel}
        </p>
        <h1 id="ref-title" data-figure="primary" style={{ marginBottom: '0.5rem' }}>
          {primary.figure.name}
        </h1>
        <p style={{ color: 'var(--ink-faint)' }}>
          {primary.figure.era} · {t.reflection.score(pct)}
        </p>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 2fr',
          gap: '2rem',
          marginBottom: '3rem',
        }}
        className="jx-ref-grid"
      >
        <div>
          <Portrait figure={primary.figure} />
        </div>
        <div>
          <Verse text={primary.figure.signature} gloss={primary.figure.bio} />
          <div
            className="jx-blurb"
            style={{
              marginTop: '1.5rem',
              padding: '1rem 1.25rem',
              background: 'var(--rice-warm)',
              borderLeft: '3px solid var(--cinnabar)',
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              lineHeight: 1.8,
            }}
          >
            {primary.blurb}
          </div>
          {primary.figure.anecdotes && primary.figure.anecdotes.length > 0 && (
            <details
              className="jx-anecdotes"
              style={{ marginTop: '1rem', color: 'var(--ink-faint)', fontSize: '0.9rem' }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--ink)',
                }}
              >
                {t.reflection.anecdote} ▾
              </summary>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                {primary.figure.anecdotes.map((a, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>
                    <strong style={{ color: 'var(--ink)' }}>{a.title}</strong>：{a.body}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>{t.reflection.samePath}</h2>
        <div
          className="jx-alt-grid jx-stagger"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
            gap: '1rem',
          }}
        >
          {alternates
            .sort((a, b) => b.score - a.score)
            .map((a, idx) => {
              const diff = Math.abs(a.score - primary.score);
              const isClose = diff < 0.05;
              return (
                <article
                  key={a.figure.id}
                  data-figure="alternate"
                  data-figure-id={a.figure.id}
                  className={isClose ? 'jx-alt-close' : ''}
                  style={{
                    padding: '1rem',
                    background: isClose ? 'var(--rice-warm)' : 'transparent',
                    border: `1px solid ${isClose ? 'var(--cinnabar)' : 'var(--rice-deep)'}`,
                    position: 'relative',
                    transition: 'all 300ms var(--ease-out)',
                  }}
                >
                  {idx === 0 && (
                    <span
                      className="jx-chip jx-chip-cinnabar"
                      style={{
                        position: 'absolute',
                        top: '-0.5rem',
                        right: '0.5rem',
                        fontSize: '0.75rem',
                      }}
                    >
                      最似
                    </span>
                  )}
                  <h3 style={{ marginBottom: '0.5rem' }}>{a.figure.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--ink-faint)', margin: 0 }}>
                    {a.figure.era}
                  </p>
                  <p
                    style={{
                      marginTop: '0.5rem',
                      fontFamily: 'var(--font-display)',
                      color: isClose ? 'var(--cinnabar)' : 'var(--jade)',
                      fontSize: '0.875rem',
                      fontWeight: isClose ? 600 : 400,
                    }}
                  >
                    {Math.round(a.score * 100)}%
                  </p>
                </article>
              );
            })}
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t.reflection.twelve}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
            gap: '2rem',
            alignItems: 'center',
          }}
          className="jx-ref-grid"
        >
          <TraitRadar
            user={
              report.traitBreakdown.map(b => b.user) as unknown as [
                number,
                number,
                number,
                number,
                number,
                number,
                number,
                number,
                number,
                number,
                number,
                number,
              ]
            }
            figure={primary.figure.vector}
          />
          <div>
            {traitBreakdown.map(b => {
              const trait = TRAITS.find(t => t.id === b.traitId);
              if (!trait) return null;
              const highlight = top3.includes(b.traitId);
              return (
                <div
                  key={b.traitId}
                  data-trait-id={b.traitId}
                  className={highlight ? 'jx-trait-highlight' : ''}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '4rem 1fr',
                    gap: '0.75rem',
                    padding: '0.5rem 0',
                    borderBottom: '1px dashed var(--rice-deep)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--ink)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {trait.name}
                    {highlight && <span aria-label="高亮"> ✦</span>}
                  </span>
                  <span style={{ color: 'var(--ink-faint)', fontSize: '0.9rem' }}>
                    {t.reflection.rowFormat(b.user.toFixed(2), b.figure.toFixed(2), b.comment)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer
        style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'center',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--rice-deep)',
          flexWrap: 'wrap',
        }}
      >
        <BrushButton variant="primary" onClick={handleShare} data-testid="btn-share">
          {t.reflection.share}
        </BrushButton>
        <BrushButton onClick={handleCopyResume} data-testid="btn-copy-resume">
          {t.reflection.copyResume}
        </BrushButton>
        <BrushButton onClick={handleExport} data-testid="btn-export">
          {t.reflection.exportJSON}
        </BrushButton>
        <BrushButton onClick={() => fileRef.current?.click()} data-testid="btn-import">
          {t.reflection.importJSON}
        </BrushButton>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          onChange={handleImport}
          style={{ display: 'none' }}
          aria-hidden
        />
        <BrushButton
          variant="primary"
          onClick={() => goPhase('path')}
          data-testid="btn-change-domain"
        >
          {t.reflection.changeDomain}
        </BrushButton>
        <BrushButton
          onClick={() => {
            if (confirm(t.ui.resetConfirm)) reset();
          }}
          data-testid="btn-reset"
        >
          {t.reflection.reset}
        </BrushButton>
      </footer>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="jx-toast"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--ink)',
            color: 'var(--rice)',
            padding: '0.5rem 1rem',
            fontFamily: 'var(--font-display)',
            fontSize: '0.875rem',
            borderRadius: '2px',
            zIndex: 100,
            animation: 'jx-fade-stagger 200ms var(--ease-out) both',
          }}
        >
          {toast}
        </div>
      )}

      {confidence < 0.6 && (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--ash)',
            fontSize: '0.875rem',
            marginTop: '1.5rem',
          }}
        >
          {t.reflection.lowConfidence}
        </p>
      )}

      <style>{`
        @media (max-width: 640px) {
          .jx-ref-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </article>
  );
}
