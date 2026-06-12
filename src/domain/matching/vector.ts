// 镜心 · 答题 → 12 维向量

import type { TraitVector } from '../traits/trait.types';
import type { Item } from '../items/item.types';

/** 把答题记录压成 12 维特征向量 */
export function computeUserVector(
  answers: Record<string, number>,
  pool: readonly Item[]
): TraitVector {
  const raw = new Array(12).fill(0);
  const coverage = new Array(12).fill(0);
  const answeredCount = Object.keys(answers).length;

  // 第一遍：收集所有已答题项的原始分数
  for (const item of pool) {
    const optIdx = answers[item.id];
    if (optIdx === undefined) continue;
    const opt = item.options[optIdx];
    if (!opt) continue;

    raw[opt.primary.traitId - 1] += opt.primary.delta;
    coverage[opt.primary.traitId - 1] += 1;
    for (const s of opt.secondary ?? []) {
      raw[s.traitId - 1] += s.delta;
    }
  }

  // 第二遍：归一化到 [0, 1]
  return raw.map((s, i) => {
    if (coverage[i] === 0) {
      // 未答题项：使用中性值 0.5
      return 0.5;
    }
    
    const mean = s / coverage[i];
    
    // 自适应 sigmoid 系数：根据覆盖度动态调整
    // 覆盖度越高，系数越大（区分度越高）
    const adaptiveK = 2.5 + (coverage[i] / Math.max(1, answeredCount)) * 1.5;
    
    const normalized = 1 / (1 + Math.exp(-mean * adaptiveK));
    
    // 边界处理：确保不会过于极端
    return Math.max(0.05, Math.min(0.95, normalized));
  }) as TraitVector;
}
