import { Question, TraitResult } from '../types';
import {
  SSRS_SEVERITY,
  SSRS_DIMENSIONS,
  SSRS_RESOURCES,
} from '../data/ssrsData';

/**
 * SSRS 评分算法
 *
 * 计分规则 (按肖水源 1990):
 *   客观支持: items 2, 6, 7    (3 题, 范围 1-22)
 *   主观支持: items 1, 3, 4, 5 (4 题, 范围 4-16)
 *   利用度:   items 8, 9, 10   (3 题, 范围 3-12)
 *   总分: 12-50
 *
 * 严重度:
 *   ≤ 22: 低
 *   23-29: 中等偏低
 *   30-44: 中等
 *   ≥ 45: 高
 */

export function calculateSSRSTraits(
  answers: Record<string, number>,
  questions: Question[]
): TraitResult[] {
  let totalScore = 0;
  let objectiveScore = 0;
  let subjectiveScore = 0;
  let utilizationScore = 0;

  for (const q of questions) {
    const a = answers[q.id];
    if (a === undefined || a === null) continue;
    const score = Number(a);
    if (Number.isNaN(score)) continue;
    totalScore += score;
    if (q.trait === 'objective') {
      objectiveScore += score;
    } else if (q.trait === 'subjective') {
      subjectiveScore += score;
    } else if (q.trait === 'utilization') {
      utilizationScore += score;
    }
  }

  // 各维度理论最大值
  const objectiveMax = 4 + 9 + 9; // item2=4 + item6=9 + item7=9
  const subjectiveMax = 4 * 4; // 4 题各最大 4
  const utilizationMax = 3 * 4; // 3 题各最大 4

  const traits: TraitResult[] = [
    {
      name: '社会支持总分',
      score: totalScore,
      description: getSSRSTotalDescription(totalScore),
    },
    {
      name: '客观支持',
      score: Math.round((objectiveScore / objectiveMax) * 100),
      description: `${SSRS_DIMENSIONS.objective.description} (${objectiveScore}/${objectiveMax})`,
    },
    {
      name: '主观支持',
      score: Math.round((subjectiveScore / subjectiveMax) * 100),
      description: `${SSRS_DIMENSIONS.subjective.description} (${subjectiveScore}/${subjectiveMax})`,
    },
    {
      name: '支持利用度',
      score: Math.round((utilizationScore / utilizationMax) * 100),
      description: `${SSRS_DIMENSIONS.utilization.description} (${utilizationScore}/${utilizationMax})`,
    },
  ];

  return traits;
}

export function getSSRSLevel(score: number) {
  if (score <= 22) return SSRS_SEVERITY.low;
  if (score <= 29) return SSRS_SEVERITY.mediumLow;
  if (score <= 44) return SSRS_SEVERITY.medium;
  return SSRS_SEVERITY.high;
}

export function getSSRSLevelInfo(score: number) {
  return getSSRSLevel(score);
}

export function getSSRSTotalDescription(score: number): string {
  const level = getSSRSLevel(score);
  return `${level.label} (${score}/50)`;
}

export function generateDetailedSSRSReport(
  answers: Record<string, number>,
  questions: Question[]
) {
  const traits = calculateSSRSTraits(answers, questions);
  const total = traits[0].score;
  const level = getSSRSLevel(total);

  // 找出最强/最弱维度
  const dimScores = traits.slice(1).map(t => ({
    name: t.name,
    score: t.score,
  }));
  const sorted = [...dimScores].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  // 紧急度前缀
  const urgencyPrefix =
    level.level === 'low'
      ? '⚠️ 需要关注:'
      : level.level === 'mediumLow'
        ? '💡 建议加强:'
        : '✅ 继续保持:';

  // 维度图例
  const dimensionMap: Record<string, keyof typeof SSRS_DIMENSIONS> = {
    客观支持: 'objective',
    主观支持: 'subjective',
    支持利用度: 'utilization',
  };

  return {
    summary: {
      title: level.label,
      score: total,
      maxScore: 50,
      description: level.description,
      color: level.color,
      level,
      urgencyPrefix,
    },
    dimensions: dimScores.map(d => ({
      name: d.name,
      score: d.score,
      description: SSRS_DIMENSIONS[dimensionMap[d.name] || 'objective'].description,
      highTip: SSRS_DIMENSIONS[dimensionMap[d.name] || 'objective'].highTip,
      lowTip: SSRS_DIMENSIONS[dimensionMap[d.name] || 'objective'].lowTip,
    })),
    strongest,
    weakest,
    advice: level.advice,
    resources: SSRS_RESOURCES,
  };
}
