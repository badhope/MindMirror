import { Question, TraitResult } from '../types';
import {
  MBI_SEVERITY,
  MBI_DIMENSIONS,
  MBI_DIMENSION_LEVELS,
  MBI_COPING_STRATEGIES,
} from '../data/mbiData';

/**
 * MBI-GS 评分算法
 *
 * 计分规则 (按 Maslach 1996):
 *   EX (情感耗竭): items 1-5 (5 题, 0-6, 正向) → 0-30
 *   CY (犬儒主义): items 6-9 (4 题, 0-6, 正向) → 0-24
 *   PE (职业效能): items 10-15 (6 题, 0-6, 反向计分 — 高分 = 低倦怠)
 *                反向计分后范围 0-36
 *
 * 综合倦怠分: (EX + CY + (36 - PE)) / 3
 *   范围 0-30,数值越高倦怠越严重
 *
 * 严重度:
 *   0-11:  低
 *   12-17: 中度
 *   18-22: 高度
 *   23-30: 重度
 */

export function calculateMBITraits(
  answers: Record<string, number>,
  questions: Question[]
): TraitResult[] {
  let exScore = 0;
  let cyScore = 0;
  let peRaw = 0;

  for (const q of questions) {
    const a = answers[q.id];
    if (a === undefined || a === null) continue;
    const v = Number(a);
    if (Number.isNaN(v)) continue;
    if (q.trait === 'exhaustion') {
      exScore += v;
    } else if (q.trait === 'cynicism') {
      cyScore += v;
    } else if (q.trait === 'efficacy') {
      peRaw += v;
    }
  }

  // PE 反向: 36 - 原始分,使其进入"高 = 倦怠"的方向
  const peReversed = 36 - peRaw;
  const total = (exScore + cyScore + peReversed) / 3;

  const exMax = 30;
  const cyMax = 24;
  const peMax = 36;
  const totalMax = 30;

  const traits: TraitResult[] = [
    {
      name: '综合倦怠分',
      score: Math.round(total * 10) / 10,
      description: `${getMBITotalLevel(total).label} (${total.toFixed(1)}/${totalMax})`,
    },
    {
      name: '情感耗竭',
      score: Math.round((exScore / exMax) * 100),
      description: `${MBI_DIMENSIONS.exhaustion.description} (${exScore}/${exMax})`,
    },
    {
      name: '犬儒主义 / 去人格化',
      score: Math.round((cyScore / cyMax) * 100),
      description: `${MBI_DIMENSIONS.cynicism.description} (${cyScore}/${cyMax})`,
    },
    {
      name: '职业效能感(反向)',
      score: Math.round((peRaw / peMax) * 100),
      description: `${MBI_DIMENSIONS.efficacy.description} (${peRaw}/${peMax},高分=健康)`,
    },
  ];

  return traits;
}

export function getMBITotalLevel(score: number) {
  if (score <= 11) return MBI_SEVERITY.low;
  if (score <= 17) return MBI_SEVERITY.moderate;
  if (score <= 22) return MBI_SEVERITY.high;
  return MBI_SEVERITY.severe;
}

export function getMBIExLevel(score: number) {
  if (score <= 5) return MBI_DIMENSION_LEVELS.exhaustion.low;
  if (score <= 10) return MBI_DIMENSION_LEVELS.exhaustion.moderate;
  if (score <= 14) return MBI_DIMENSION_LEVELS.exhaustion.high;
  return MBI_DIMENSION_LEVELS.exhaustion.severe;
}

export function getMBICyLevel(score: number) {
  if (score <= 2) return MBI_DIMENSION_LEVELS.cynicism.low;
  if (score <= 4) return MBI_DIMENSION_LEVELS.cynicism.moderate;
  if (score <= 7) return MBI_DIMENSION_LEVELS.cynicism.high;
  return MBI_DIMENSION_LEVELS.cynicism.severe;
}

export function getMBIPeLevel(score: number) {
  // PE 是反向,高分=健康
  if (score >= 30) return MBI_DIMENSION_LEVELS.efficacy.high;
  if (score >= 25) return MBI_DIMENSION_LEVELS.efficacy.moderate;
  if (score >= 20) return MBI_DIMENSION_LEVELS.efficacy.low;
  return MBI_DIMENSION_LEVELS.efficacy.veryLow;
}

export function calculateMBISubScores(
  answers: Record<string, number>,
  questions: Question[]
) {
  let ex = 0;
  let cy = 0;
  let pe = 0;
  for (const q of questions) {
    const a = answers[q.id];
    if (a === undefined || a === null) continue;
    const v = Number(a);
    if (Number.isNaN(v)) continue;
    if (q.trait === 'exhaustion') ex += v;
    else if (q.trait === 'cynicism') cy += v;
    else if (q.trait === 'efficacy') pe += v;
  }
  return { ex, cy, pe, total: (ex + cy + (36 - pe)) / 3 };
}

export function generateDetailedMBIReport(
  answers: Record<string, number>,
  questions: Question[]
) {
  const { ex, cy, pe, total } = calculateMBISubScores(answers, questions);
  const totalLevel = getMBITotalLevel(total);
  const exLevel = getMBIExLevel(ex);
  const cyLevel = getMBICyLevel(cy);
  const peLevel = getMBIPeLevel(pe);

  return {
    summary: {
      title: totalLevel.label,
      score: Math.round(total * 10) / 10,
      maxScore: 30,
      description: totalLevel.description,
      color: totalLevel.color,
      level: totalLevel,
    },
    dimensions: [
      {
        name: '情感耗竭 (EX)',
        raw: ex,
        level: exLevel,
        description: MBI_DIMENSIONS.exhaustion.description,
        highTip: MBI_DIMENSIONS.exhaustion.highTip,
        lowTip: MBI_DIMENSIONS.exhaustion.lowTip,
      },
      {
        name: '犬儒主义 (CY)',
        raw: cy,
        level: cyLevel,
        description: MBI_DIMENSIONS.cynicism.description,
        highTip: MBI_DIMENSIONS.cynicism.highTip,
        lowTip: MBI_DIMENSIONS.cynicism.lowTip,
      },
      {
        name: '职业效能 (PE)',
        raw: pe,
        level: peLevel,
        description: MBI_DIMENSIONS.efficacy.description,
        highTip: MBI_DIMENSIONS.efficacy.highTip,
        lowTip: MBI_DIMENSIONS.efficacy.lowTip,
      },
    ],
    advice: MBI_COPING_STRATEGIES,
  };
}
