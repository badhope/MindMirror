// 镜心 · 12 维雷达图

import { TRAITS } from '../domain/traits/trait.dimensions';
import type { TraitVector } from '../domain/traits/trait.types';

type Props = {
  user: TraitVector;
  figure?: TraitVector;
  size?: number;
};

export function TraitRadar({ user, figure, size = 360 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const N = 12;

  const angles = Array.from({ length: N }, (_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / N);

  const userPoints = user.map((v, i) => {
    const a = angles[i];
    return [cx + r * v * Math.cos(a), cy + r * v * Math.sin(a)] as const;
  });

  const figPoints = figure?.map((v, i) => {
    const a = angles[i];
    return [cx + r * v * Math.cos(a), cy + r * v * Math.sin(a)] as const;
  });

  const gridRings = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="jx-radar"
      data-testid="trait-radar"
      role="img"
      aria-label="十二维特征雷达"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {gridRings.map((g, i) => (
        <circle
          key={`g${i}`}
          cx={cx}
          cy={cy}
          r={r * g}
          fill="none"
          stroke="var(--ink)"
          strokeOpacity={0.08}
          strokeDasharray="2 4"
        />
      ))}

      {angles.map((a, i) => (
        <line
          key={`l${i}`}
          x1={cx}
          y1={cy}
          x2={cx + r * Math.cos(a)}
          y2={cy + r * Math.sin(a)}
          stroke="var(--ink)"
          strokeOpacity={0.12}
        />
      ))}

      {figPoints && (
        <polygon
          points={figPoints.map(p => p.join(',')).join(' ')}
          fill="var(--cinnabar)"
          fillOpacity={0.1}
          stroke="var(--cinnabar)"
          strokeOpacity={0.55}
          strokeWidth={1.25}
          className="jx-radar-figure"
        />
      )}

      <polygon
        points={userPoints.map(p => p.join(',')).join(' ')}
        fill="var(--ink)"
        fillOpacity={0.05}
        stroke="var(--ink)"
        strokeWidth={1.75}
        className="jx-radar-user"
      />

      {userPoints.map((p, i) => (
        <text
          key={`t${i}`}
          x={cx + (r + 18) * Math.cos(angles[i])}
          y={cy + (r + 18) * Math.sin(angles[i])}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.05}
          fill="var(--ink)"
          fontFamily="var(--font-display)"
        >
          {TRAITS[i].glyph}
        </text>
      ))}
    </svg>
  );
}
