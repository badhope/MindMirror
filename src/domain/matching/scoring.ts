// 镜心 · 匹配算法 · 加权欧氏 + 余弦调和

import { TRAITS } from '../traits/trait.dimensions';
import type { TraitVector } from '../traits/trait.types';

const SQRT_12 = Math.sqrt(12);
const EPSILON = 1e-6; // 防止除零

function weightedEuclid(a: TraitVector, b: TraitVector): number {
  let sq = 0;
  for (let i = 0; i < 12; i++) {
    const d = a[i] - b[i];
    sq += TRAITS[i].weight * d * d;
  }
  return Math.sqrt(sq);
}

function cosine(a: TraitVector, b: TraitVector): number {
  let dot = 0,
    nA = 0,
    nB = 0;
  for (let i = 0; i < 12; i++) {
    dot += a[i] * b[i];
    nA += a[i] * a[i];
    nB += b[i] * b[i];
  }
  const denom = Math.sqrt(nA) * Math.sqrt(nB);
  // 更稳健的零向量处理
  if (denom < EPSILON) return 0.5; // 返回中性值而非 0
  return Math.max(-1, Math.min(1, dot / denom)); // 限制在 [-1, 1]
}

/** 综合相似度 ∈ [0, 1] */
export function similarity(user: TraitVector, fig: TraitVector): number {
  const e = weightedEuclid(user, fig) / SQRT_12;
  const c = cosine(user, fig);
  // 优化权重比例：0.55:0.45 更平衡
  return 0.55 * (1 - e) + 0.45 * c;
}

/** 计算两个向量的维度差异（用于平局检测） */
export function dimensionDifferences(user: TraitVector, fig: TraitVector): number[] {
  return user.map((u, i) => Math.abs(u - fig[i]));
}

/** 平局检测：当相似度差异小于阈值时，用维度差异排序 */
export function breakTie(
  user: TraitVector,
  fig1: TraitVector,
  fig2: TraitVector,
  threshold: number = 0.01
): number {
  const sim1 = similarity(user, fig1);
  const sim2 = similarity(user, fig2);
  
  if (Math.abs(sim1 - sim2) > threshold) {
    return sim1 > sim2 ? -1 : 1;
  }
  
  // 相似度接近，用维度差异排序（差异越小越好）
  const diff1 = dimensionDifferences(user, fig1).reduce((a, b) => a + b, 0);
  const diff2 = dimensionDifferences(user, fig2).reduce((a, b) => a + b, 0);
  
  return diff1 - diff2;
}
