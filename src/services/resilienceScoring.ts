import { Question, TraitResult } from '../types';
import {
  RESILIENCE_SEVERITY,
  RESILIENCE_DIMENSIONS,
  RESILIENCE_BOOST_STRATEGIES,
} from '../data/resilienceData';

/**
 * CD-RISC-10 评分算法
 *
 * 计分规则 (Connor & Davidson 2003):
 *   10 题同向 0-4 评分,总和 = 总分
 *   范围 0 ~ 40
 *
 * 严重度 (按中国常模 + Western norms):
 *   0-19  : 韧性较低
 *   20-23  : 韧性偏低
 *   24-28  : 韧性中等
 *   29-32  : 韧性较高
 *   33-40  : 韧性很强
 */

export function calculateResilienceTraits(
  answers: Record<string, number>,
  questions: Question[]
): TraitResult[] {
  let total = 0;
  const dimScores: Record<string, { sum: number; n: number; max: number }> = {
    adaptability: { sum: 0, n: 0, max: 8 }, // 2 题 × 4
    relationships: { sum: 0, n: 0, max: 4 }, // 1 题 × 4
    meaning: { sum: 0, n: 0, max: 8 }, // 2 题 × 4
    selfEfficacy: { sum: 0, n: 0, max: 8 }, // 2 题 × 4
    optimism: { sum: 0, n: 0, max: 12 }, // 3 题 × 4
  };

  for (const q of questions) {
    const a = answers[q.id];
    if (a === undefined || a === null) continue;
    const v = Number(a);
    if (Number.isNaN(v)) continue;
    total += v;
    const dim = q.trait;
    if (dim && dimScores[dim]) {
      dimScores[dim].sum += v;
      dimScores[dim].n++;
    }
  }

  const traits: TraitResult[] = [
    {
      name: '心理韧性总分',
      score: total,
      description: getResilienceTotalDescription(total),
    },
  ];

  for (const [dim, ds] of Object.entries(dimScores)) {
    const dimInfo = RESILIENCE_DIMENSIONS[dim as keyof typeof RESILIENCE_DIMENSIONS];
    if (!dimInfo) continue;
    traits.push({
      name: dimInfo.name,
      score: ds.max > 0 ? Math.round((ds.sum / ds.max) * 100) : 0,
      description: `${dimInfo.description} (${ds.sum}/${ds.max})`,
    });
  }

  return traits;
}

export function getResilienceLevel(score: number) {
  if (score <= 19) return RESILIENCE_SEVERITY.veryLow;
  if (score <= 23) return RESILIENCE_SEVERITY.low;
  if (score <= 28) return RESILIENCE_SEVERITY.moderate;
  if (score <= 32) return RESILIENCE_SEVERITY.high;
  return RESILIENCE_SEVERITY.veryHigh;
}

export function getResilienceLevelInfo(score: number) {
  return getResilienceLevel(score);
}

export function getResilienceTotalDescription(score: number): string {
  const level = getResilienceLevel(score);
  return `${level.label} (${score}/40)`;
}

export function generateDetailedResilienceReport(
  answers: Record<string, number>,
  questions: Question[]
) {
  const traits = calculateResilienceTraits(answers, questions);
  const total = traits[0].score;
  const level = getResilienceLevel(total);

  // 找出最强/最弱维度
  const dimScores = traits.slice(1).map(t => ({
    name: t.name,
    score: t.score,
  }));
  const sorted = [...dimScores].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  // 维度名 -> 英文 key 映射
  const dimNameToKey: Record<string, keyof typeof RESILIENCE_DIMENSIONS> = {
    适应性: 'adaptability',
    关系支持: 'relationships',
    '意义与目标': 'meaning',
    自我效能: 'selfEfficacy',
    '乐观 / 接纳': 'optimism',
  };

  return {
    summary: {
      title: level.label,
      score: total,
      maxScore: 40,
      description: level.description,
      color: level.color,
      level,
    },
    dimensions: dimScores.map(d => ({
      name: d.name,
      score: d.score,
      description: RESILIENCE_DIMENSIONS[dimNameToKey[d.name] || 'adaptability'].description,
      highTip: RESILIENCE_DIMENSIONS[dimNameToKey[d.name] || 'adaptability'].highTip,
      lowTip: RESILIENCE_DIMENSIONS[dimNameToKey[d.name] || 'adaptability'].lowTip,
    })),
    strongest,
    weakest,
    advice: level.advice,
    boost: RESILIENCE_BOOST_STRATEGIES,
  };
}
