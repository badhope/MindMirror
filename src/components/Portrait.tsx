// 镜心 · 人物手绘肖像
//
// 真正的全人像留给设计师二次出图。
// 此处先用 <img> 加载 public/portraits/.../ 下的水墨写意 SVG。
// 若图片加载失败，自动降级为占位卡片。

import type { Figure } from '../domain/figures/figure.types';
import { useState } from 'react';

const BASE = import.meta.env.BASE_URL;

type Props = { figure: Figure };

export function Portrait({ figure }: Props) {
  const [err, setErr] = useState(false);

  if (err) {
    return <Placeholder figure={figure} />;
  }

  // 确保 portrait 路径在 GitHub Pages 子路径下正确解析
  const portraitSrc = figure.portrait.startsWith('/')
    ? figure.portrait
    : `${BASE}${figure.portrait}`;

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '3 / 4',
        background: 'var(--rice-warm)',
        border: '1px solid var(--rice-deep)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src={portraitSrc}
        alt={`${figure.name}（${figure.era}）`}
        loading="lazy"
        onError={() => setErr(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  );
}

function Placeholder({ figure }: Props) {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '3 / 4',
        background: 'var(--rice-warm)',
        border: '1px solid var(--rice-deep)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: '0.875rem',
          color: 'var(--ink-faint)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.2em',
        }}
      >
        {figure.era}
      </div>
      <div
        aria-hidden
        style={{
          fontSize: '5rem',
          color: 'var(--ink)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.05em',
          lineHeight: 1,
          textAlign: 'center',
        }}
      >
        {figure.name.slice(0, 1)}
      </div>
      <div
        style={{
          fontSize: '1.25rem',
          color: 'var(--ink)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.2em',
        }}
      >
        {figure.name}
      </div>
      <div
        style={{ position: 'absolute', right: '0.75rem', bottom: '0.75rem' }}
        className="jx-seal"
        aria-hidden
      >
        镜
      </div>
    </div>
  );
}
