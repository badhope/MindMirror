// 镜心 · 置信度

import { computeUserVector } from './vector';
import type { Item } from '../items/item.types';

/**
 * 计算置信度
 * 综合三个指标：
 * 1. 完成度：已答题数 / 总题数
 * 2. 决断度：向量方差（答案是否明确）
 * 3. 一致性：答案是否前后矛盾
 */
export function confidence(answers: Record<string, number>, pool: readonly Item[]): number {
  const answered = Object.keys(answers).length;
  const total = pool.length;
  
  // 1. 完成度：动态阈值（总题数的 60%）
  const threshold = Math.ceil(total * 0.6);
  const completeness = Math.min(1, answered / threshold);
  
  // 2. 决断度：向量方差（答案是否明确）
  const user = computeUserVector(answers, pool);
  const mean = user.reduce((s, v) => s + v, 0) / 12;
  const variance = user.reduce((s, v) => s + (v - mean) ** 2, 0) / 12;
  const decisiveness = Math.min(1, variance * 8);
  
  // 3. 一致性：检测答案是否前后矛盾
  // 计算每个维度的答案一致性（同一维度的题目答案是否一致）
  const dimensionAnswers = new Array(12).fill(null).map(() => [] as number[]);
  
  for (const item of pool) {
    const optIdx = answers[item.id];
    if (optIdx === undefined) continue;
    const opt = item.options[optIdx];
    if (!opt) continue;
    
    // 主维度答案
    dimensionAnswers[opt.primary.traitId - 1].push(opt.primary.delta);
    
    // 副维度答案
    for (const s of opt.secondary ?? []) {
      dimensionAnswers[s.traitId - 1].push(s.delta);
    }
  }
  
  // 计算每个维度的一致性（标准差越小越一致）
  let consistencySum = 0;
  let consistencyCount = 0;
  
  for (const answers of dimensionAnswers) {
    if (answers.length < 2) continue; // 至少 2 个答案才能计算一致性
    
    const avg = answers.reduce((s, v) => s + v, 0) / answers.length;
    const std = Math.sqrt(answers.reduce((s, v) => s + (v - avg) ** 2, 0) / answers.length);
    
    // 标准差越小越一致（0-1 之间）
    const dimConsistency = Math.max(0, 1 - std / 2);
    consistencySum += dimConsistency;
    consistencyCount++;
  }
  
  const consistency = consistencyCount > 0 ? consistencySum / consistencyCount : 0.5;
  
  // 综合三个指标：完成度 0.5 + 决断度 0.3 + 一致性 0.2
  return 0.5 * completeness + 0.3 * decisiveness + 0.2 * consistency;
}
