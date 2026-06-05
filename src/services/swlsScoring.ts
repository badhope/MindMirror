import { Question, TraitResult } from '../types';
import {
  SWLS_SEVERITY,
  SWLS_DIMENSIONS,
  SWLS_INTERPRETATION,
  SWLS_BOOST_STRATEGIES,
} from '../data/swlsData';

/**
 * SWLS 评分算法
 *
 * 计分规则 (Diener 1985):
 *   5 题同向 1-7 评分,总和 = 总分
 *   范围 5 ~ 35
 *
 * 严重度 (按 Pavot & Diener 1993):
 *   5-9  : 极不满意
 *   10-14: 不满意
 *   15-19: 略低
 *   20-24: 中等
 *   25-29: 较满意
 *   30-35: 高度满意
 */

export function calculateSWLSTraits(
  answers: Record<string, number>,
  questions: Question[]
): TraitResult[] {
  let total = 0;
  for (const q of questions) {
    const a = answers[q.id];
    if (a === undefined || a === null) continue;
    const v = Number(a);
    if (Number.isNaN(v)) continue;
    total += v;
  }

  const traits: TraitResult[] = [
    {
      name: '生活满意度',
      score: total,
      description: getSWLSTotalDescription(total),
    },
  ];

  return traits;
}

export function getSWLSLevel(score: number) {
  if (score <= 9) return SWLS_SEVERITY.veryLow;
  if (score <= 14) return SWLS_SEVERITY.low;
  if (score <= 19) return SWLS_SEVERITY.slightlyLow;
  if (score <= 24) return SWLS_SEVERITY.average;
  if (score <= 29) return SWLS_SEVERITY.high;
  return SWLS_SEVERITY.veryHigh;
}

export function getSWLSLevelInfo(score: number) {
  return getSWLSLevel(score);
}

export function getSWLSTotalDescription(score: number): string {
  const level = getSWLSLevel(score);
  return `${level.label} (${score}/35)`;
}

export function generateDetailedSWLSReport(
  answers: Record<string, number>,
  questions: Question[]
) {
  const traits = calculateSWLSTraits(answers, questions);
  const total = traits[0].score;
  const level = getSWLSLevel(total);
  const isHigh = total >= 25;

  return {
    summary: {
      title: level.label,
      score: total,
      maxScore: 35,
      description: level.description,
      color: level.color,
      level,
    },
    interpretation: isHigh
      ? SWLS_INTERPRETATION.high
      : SWLS_INTERPRETATION.low,
    dimensions: [
      {
        name: '生活满意度',
        score: total,
        description: SWLS_DIMENSIONS.satisfaction.description,
      },
    ],
    advice: level.advice || [],
    boost: SWLS_BOOST_STRATEGIES,
  };
}
