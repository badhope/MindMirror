// 镜心 · 答题 · 行（增强版）
//
// 增强点：
// 1. 顶部进度条：渐变色 + 已答/总数双指示
// 2. 选项卡片：悬停微抬 + 选中朱砂印章动画 + 键盘焦点高亮
// 3. 键盘导航：1-6 快速选，←→ 翻页，ESC 返回选域
// 4. 底部跳过/上一题/下一题按钮组，流畅渐进
// 5. 题目标题：进入时淡入
// 6. 答题回溯提示：前面某题未答时提醒

import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store';
import { itemsForDomain } from '../domain/items/items.index';
import { figuresForDomain } from '../domain/figures/figures.index';
import { computeUserVector } from '../domain/matching/vector';
import { buildReport } from '../domain/matching/report';
import { BrushButton } from '../components/BrushButton';
import { Verse } from '../components/Verse';
import { useT } from '../i18n';

export function Way() {
  const { domain, currentIndex, answers, answer, goPrev, goNext, goPhase, setReport, reset } =
    useStore();
  const t = useT();

  useEffect(() => {
    if (!domain) goPhase('path');
  }, [domain, goPhase]);

  const items = useMemo(() => itemsForDomain(domain ?? 'east-literati'), [domain]);
  const total = items.length;
  const item = items[currentIndex];

  // 越界保护
  useEffect(() => {
    if (domain && !item) goPhase('prologue');
  }, [domain, item, goPhase]);

  // 回溯提示
  const [showBacktrack, setShowBacktrack] = useState(false);
  useEffect(() => {
    const hasUnansweredBefore = items
      .slice(0, currentIndex)
      .some(it => answers[it.id] === undefined);
    setShowBacktrack(hasUnansweredBefore);
  }, [currentIndex, answers, items]);

  if (!domain || !item) return null;

  const figures = figuresForDomain(domain);
  const current = answers[item.id];
  const answeredCount = Object.keys(answers).length;
  const canFinish = answeredCount >= 30;

  const handleFinish = () => {
    const r = buildReport(computeUserVector(answers, items), figures, answers, items);
    setReport(r);
  };

  const handleSkip = () => {
    if (currentIndex < total - 1) goNext();
  };

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 忽略在输入框中的按键
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight' && currentIndex < total - 1) {
        if (current !== undefined) {
          e.preventDefault();
          goNext();
        }
      } else if (e.key >= '1' && e.key <= '6') {
        const optIndex = parseInt(e.key) - 1;
        if (optIndex < item.options.length) {
          e.preventDefault();
          answer(item.id, optIndex);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIndex < total - 1 && current !== undefined) {
          goNext();
        } else if (canFinish) {
          handleFinish();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, total, current, item, answer, goPrev, goNext, canFinish]);

  // 进度百分比
  const progressPct = Math.round((answeredCount / total) * 100);
  const currentProgressPct = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <section
      className="jx-container-narrow jx-page-enter"
      aria-labelledby="way-title"
      style={{ maxWidth: '42rem' }}
    >
      {/* 顶部装饰 */}
      <div
        aria-hidden
        style={{
          textAlign: 'center',
          color: 'var(--ink-faint)',
          fontSize: '0.75rem',
          letterSpacing: '0.5em',
          marginBottom: '1rem',
          opacity: 0.4,
          fontFamily: 'var(--font-accent)',
        }}
      >
        ✦ ─── ✦
      </div>
      <header style={{ marginBottom: '2rem' }}>
        {/* 双进度：当前题进度 + 已答数进度 */}
        <div
          style={{
            position: 'relative',
            height: '6px',
            background: 'var(--rice-deep)',
            overflow: 'hidden',
            marginBottom: '0.5rem',
          }}
          aria-hidden
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${currentProgressPct}%`,
              background: 'var(--cinnabar)',
              opacity: 0.35,
              transition: 'width 600ms var(--ease-out)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, var(--cinnabar) 0%, var(--jade) 100%)',
              transition: 'width 600ms var(--ease-out)',
            }}
          />
        </div>

        <p
          data-testid="way-progress-text"
          style={{
            marginTop: '0.5rem',
            color: 'var(--ink-faint)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.15em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span>
            第 {currentIndex + 1} 问 / 共 {total} 问
          </span>
          <span>
            已答 {answeredCount} 题 · {progressPct}%
          </span>
        </p>

        {/* 回溯提示 */}
        {showBacktrack && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(184, 149, 74, 0.1)',
              border: '1px dashed var(--gold-dim)',
              color: 'var(--ink-soft)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-display)',
              textAlign: 'center',
              letterSpacing: '0.1em',
              animation: 'jx-fade-stagger 500ms var(--ease-out) both',
            }}
          >
            前面尚有未答之题 · 可按 ← 返回补答
          </div>
        )}
      </header>

      {/* 题目 */}
      <article
        key={item.id}
        className="jx-fade-enter"
        aria-labelledby="way-title"
        style={{ minHeight: '16rem' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2
            id="way-title"
            data-testid="way-prompt"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '0.25rem' }}
          >
            {item.prompt}
          </h2>
          {item.promptGloss && (
            <p
              style={{
                color: 'var(--ink-faint)',
                marginBottom: '1rem',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.7,
                textAlign: 'center',
                maxWidth: '30rem',
              }}
            >
              {item.promptGloss}
            </p>
          )}
        </div>

        {/* 选项 */}
        <div
          role="radiogroup"
          aria-label={t.way.optionsLabel}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: '100%' }}
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
                data-testid={`option-${i}`}
                onClick={() => answer(item.id, i)}
                style={{
                  textAlign: 'left',
                  padding: '0.85rem 1rem',
                  background: selected ? 'var(--rice-warm)' : 'transparent',
                  border: `2px solid ${selected ? 'var(--cinnabar)' : 'var(--rice-deep)'}`,
                  cursor: 'pointer',
                  transition: 'all 250ms var(--ease-out)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  boxShadow: selected ? '0 4px 14px rgba(168, 50, 46, 0.15)' : 'none',
                  transform: selected ? 'translateY(-1px)' : 'none',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                }}
                onMouseEnter={e => {
                  if (!selected) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(26,26,26,0.12)';
                    e.currentTarget.style.borderColor = 'var(--ink)';
                  }
                }}
                onMouseLeave={e => {
                  if (!selected) {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.borderColor = 'var(--rice-deep)';
                  } else {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(168, 50, 46, 0.15)';
                  }
                }}
              >
                {/* 字母印章 */}
                <span
                  className="jx-opt-letter"
                  aria-hidden
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.2rem',
                    height: '2.2rem',
                    minWidth: '2.2rem',
                    background: selected ? 'var(--cinnabar)' : 'var(--rice-warm)',
                    color: selected ? 'var(--rice)' : 'var(--ink)',
                    border: `1px solid ${selected ? 'var(--cinnabar)' : 'var(--rice-deep)'}`,
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    transition: 'all 250ms var(--ease-out)',
                    flexShrink: 0,
                    borderRadius: '2px',
                  }}
                >
                  {letter}
                </span>

                <span
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    paddingTop: '0.1rem',
                  }}
                >
                  <Verse text={opt.text} gloss={opt.gloss} />
                </span>
              </button>
            );
          })}
        </div>
      </article>

      {/* 导航按钮 */}
      <nav
        data-testid="way-nav"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '2.5rem',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <BrushButton
          variant="ghost"
          onClick={goPrev}
          disabled={currentIndex === 0}
          data-testid="btn-prev"
          style={{ fontSize: '0.9rem' }}
        >
          ← 上一问
        </BrushButton>

        {currentIndex < total - 1 && (
          <BrushButton
            variant="ghost"
            onClick={handleSkip}
            data-testid="btn-skip"
            style={{ fontSize: '0.85rem', opacity: current === undefined ? 1 : 0.7 }}
          >
            {current === undefined ? '跳过此题' : '跳过'}
          </BrushButton>
        )}

        {currentIndex === total - 1 ? (
          <BrushButton
            variant="primary"
            data-testid="btn-finish"
            disabled={!canFinish}
            onClick={handleFinish}
            title={!canFinish ? `再答 ${30 - answeredCount} 题即可出镜` : undefined}
            style={{ minWidth: '9rem' }}
          >
            ✦ 出镜映照
          </BrushButton>
        ) : (
          <BrushButton
            variant="primary"
            data-testid="btn-next"
            onClick={goNext}
            disabled={current === undefined}
            style={{ minWidth: '8rem' }}
          >
            下一问 →
          </BrushButton>
        )}
      </nav>

      {/* 底部小提示：键盘导航 */}
      <p
        style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: 'var(--ink-faint)',
          fontFamily: 'var(--font-display)',
          opacity: 0.7,
          letterSpacing: '0.15em',
        }}
      >
        键盘：← → 切换 · 1-6 选答 · Enter 确认
      </p>

      {/* 底部装饰 */}
      <div
        aria-hidden
        style={{
          textAlign: 'center',
          color: 'var(--ink-faint)',
          fontSize: '0.7rem',
          letterSpacing: '0.4em',
          marginTop: '1.5rem',
          opacity: 0.3,
        }}
      >
        ✧ · · ✧ · · ✧
      </div>

      {/* 重置 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1rem',
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (confirm(t.ui.resetConfirm)) reset();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--ink-faint)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-display)',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            letterSpacing: '0.15em',
            transition: 'color 200ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--cinnabar)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--ink-faint)';
          }}
        >
          · 清零重来 ·
        </button>
      </div>

      <style>{`
        @keyframes jx-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes jx-fade-stagger {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .jx-fade-enter { animation: jx-fade-in 500ms var(--ease-out) both; }
      `}</style>
    </section>
  );
}
