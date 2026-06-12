// 镜心 · 答题 · 行

import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store';
import { itemsForDomain } from '../domain/items/items.index';
import { figuresForDomain } from '../domain/figures/figures.index';
import { computeUserVector } from '../domain/matching/vector';
import { buildReport } from '../domain/matching/report';
import { BrushButton } from '../components/BrushButton';
import { Progress } from '../components/Progress';
import { Verse } from '../components/Verse';
import { useT } from '../i18n';

export function Way() {
  const { domain, currentIndex, answers, answer, goPrev, goNext, setReport, goPhase } = useStore();
  const t = useT();
  const goPhaseRef = useRef(goPhase);
  goPhaseRef.current = goPhase;

  // 若未选域则回到 path —— 副作用应放 effect
  useEffect(() => {
    if (!domain) goPhaseRef.current('path');
  }, [domain]);

  const items = useMemo(() => itemsForDomain(domain ?? 'east-literati'), [domain]);
  const total = items.length;
  const item = items[currentIndex];

  // 越界（例如 currentIndex 越界）—— 回 prologue
  useEffect(() => {
    if (domain && !item) goPhaseRef.current('prologue');
  }, [domain, item]);

  // 回溯提示状态
  const [showBacktrackHint, setShowBacktrackHint] = useState(false);

  useEffect(() => {
    // 如果用户在前面的题目中有未答题，显示提示
    const hasUnansweredBefore = items.slice(0, currentIndex).some((it) => answers[it.id] === undefined);
    setShowBacktrackHint(hasUnansweredBefore);
  }, [currentIndex, answers, items]);

  if (!domain || !item) return null;

  const figures = figuresForDomain(domain);

  const current = answers[item.id];
  const answered = Object.keys(answers).length;
  const canFinish = answered >= 30;

  const handleFinish = () => {
    const r = buildReport(computeUserVector(answers, items), figures, answers, items);
    setReport(r);
  };

  const handleSkip = () => {
    if (currentIndex < total - 1) {
      goNext();
    }
  };

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        goPrev();
      } else if (e.key === 'ArrowRight' && currentIndex < total - 1) {
        if (current !== undefined) {
          goNext();
        }
      } else if (e.key >= '1' && e.key <= '6') {
        const optIndex = parseInt(e.key) - 1;
        if (optIndex < item.options.length) {
          answer(item.id, optIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, total, current, item, answer, goPrev, goNext]);

  return (
    <section className="jx-container-narrow jx-fade-enter" aria-labelledby="way-title">
      <header style={{ marginBottom: '2rem' }}>
        <Progress value={answered} total={total} />
        <p
          data-testid="way-progress-text"
          style={{
            marginTop: '0.5rem',
            color: 'var(--ink-faint)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.1em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{t.way.question(currentIndex + 1, total)}</span>
          <span>{t.way.answered(answered, total)}</span>
        </p>
        {showBacktrackHint && (
          <p
            style={{
              marginTop: '0.5rem',
              color: 'var(--cinnabar)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-display)',
              opacity: 0.8,
            }}
          >
            提示：前面有未回答的题目，可以返回补充
          </p>
        )}
      </header>

      <article
        key={item.id}
        className="jx-fade-enter"
        aria-labelledby="way-title"
        style={{ minHeight: '16rem' }}
      >
        <h2 id="way-title" data-testid="way-prompt" style={{ marginBottom: '1.5rem' }}>
          {item.prompt}
        </h2>
        {item.promptGloss && (
          <p style={{ color: 'var(--ink-faint)', marginBottom: '2rem' }}>{item.promptGloss}</p>
        )}

        <div
          role="radiogroup"
          aria-label={t.way.optionsLabel}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {item.options.map((opt, i) => {
            const selected = current === i;
            const letter = String.fromCharCode(65 + i); // A B C D E F
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={selected}
                data-role="option"
                data-opt-index={i}
                data-opt-letter={letter}
                data-testid={`option-${i}`}
                onClick={() => answer(item.id, i)}
                style={{
                  textAlign: 'left',
                  padding: '1rem 1.25rem',
                  background: selected ? 'var(--rice-warm)' : 'transparent',
                  border: `1px solid ${selected ? 'var(--cinnabar)' : 'var(--rice-deep)'}`,
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0',
                }}
              >
                <span className="jx-opt-letter" aria-hidden>
                  {letter}
                </span>
                <span style={{ flex: 1 }}>
                  <Verse text={opt.text} gloss={opt.gloss} />
                </span>
              </button>
            );
          })}
        </div>
      </article>

      <nav
        data-testid="way-nav"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '3rem',
          gap: '1rem',
        }}
      >
        <BrushButton
          variant="ghost"
          onClick={goPrev}
          disabled={currentIndex === 0}
          data-testid="btn-prev"
        >
          {t.way.prev}
        </BrushButton>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {currentIndex < total - 1 && (
            <BrushButton
              variant="ghost"
              onClick={handleSkip}
              data-testid="btn-skip"
              style={{ fontSize: '0.875rem' }}
            >
              跳过
            </BrushButton>
          )}

          {currentIndex === total - 1 ? (
            <BrushButton
              variant="primary"
              data-testid="btn-finish"
              disabled={!canFinish}
              onClick={handleFinish}
              title={!canFinish ? t.way.finishTitle(30 - answered) : undefined}
            >
              {t.way.finish}
            </BrushButton>
          ) : (
            <BrushButton
              variant="primary"
              data-testid="btn-next"
              onClick={goNext}
              disabled={current === undefined}
            >
              {t.way.next}
            </BrushButton>
          )}
        </div>
      </nav>
    </section>
  );
}
