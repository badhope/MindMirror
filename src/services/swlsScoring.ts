import { Question, TraitResult } from '../types';
import {
  SWLS_SEVERITY,
  SWLS_DIMENSIONS,
  SWLS_INTERPRETATION,
  SWLS_BOOST_STRATEGIES,
  SWLS_EXTENSION_QUESTIONS,
} from '../data/swlsData';

/**
 * SWLS 评分算法
 *
 * 计分规则 (Diener 1985 + 40 题扩展版):
 *   38 道主量表题 (5 道原题 + 33 道题库) 同向 1-7 评分
 *   范围 38 ~ 266 (max = 38 × 7)
 *   反向题: 选择 1-7 实际记 8-value (1↔7, 2↔6, 3↔5, 4↔4)
 *
 * 严重度 (Pavot & Diener 1993 切分点按 35/266 比例缩放):
 *   38-72  : 极不满意
 *   73-108: 不满意
 *   109-144: 略低
 *   145-184: 中等
 *   185-220: 较满意
 *   221-266: 高度满意
 */

export function calculateSWLSTraits(
  answers: Record<string, number>,
  questions: Question[]
): TraitResult[] {
  // 动态计算 max (基于实际题目数 × 7)
  let totalMax = 0;
  for (const q of questions) {
    if (q.trait === 'extension') continue;
    totalMax += 7;
  }
  if (totalMax === 0) totalMax = 35; // 防御默认值

  let total = 0;
  for (const q of questions) {
    if (q.trait === 'extension') continue;
    const a = answers[q.id];
    if (a === undefined || a === null) continue;
    let v = Number(a);
    if (Number.isNaN(v)) continue;
    // 反向题处理
    if (q.reverse) v = 8 - v;
    total += v;
  }

  const traits: TraitResult[] = [
    {
      name: '生活满意度',
      score: total,
      maxScore: totalMax,
      description: getSWLSTotalDescription(total, totalMax),
    },
  ];

  return traits;
}

export function getSWLSLevel(score: number, maxScore: number = 35) {
  // SWLS 高分=满意,使用百分比判断,兼容 5/40 题版本
  // 原始阈值: ≥30/35=86% 高度满意, ≥25/35=71% 较满意, ≥20/35=57% 中等
  //   ≥15/35=43% 略低, ≥10/35=29% 不满意, else 极不满意
  const range = maxScore > 0 ? maxScore : 35;
  const pct = score / range;
  if (pct >= 0.86) return SWLS_SEVERITY.veryHigh;
  if (pct >= 0.71) return SWLS_SEVERITY.high;
  if (pct >= 0.57) return SWLS_SEVERITY.average;
  if (pct >= 0.43) return SWLS_SEVERITY.slightlyLow;
  if (pct >= 0.29) return SWLS_SEVERITY.low;
  return SWLS_SEVERITY.veryLow;
}

export function getSWLSLevelInfo(score: number, maxScore?: number) {
  if (maxScore === undefined) {
    return getSWLSLevel(score);
  }
  return getSWLSLevel(score, maxScore);
}

export function getSWLSTotalDescription(score: number, maxScore: number = 35): string {
  const level = getSWLSLevel(score);
  return `${level.label} (${score}/${maxScore})`;
}

export function generateDetailedSWLSReport(
  answers: Record<string, number>,
  questions: Question[]
) {
  const traits = calculateSWLSTraits(answers, questions);
  const total = traits[0].score;
  const totalMax = traits[0].maxScore;
  const level = getSWLSLevel(total, totalMax);
  // 与原 6 档严重度对齐: high (25-29 "较满意") 和 veryHigh (30-35 "高度满意") 共用 strengths;
  // veryLow / low / slightlyLow / average 共用 challenges 视角
  const isHigh = level.level === 'high' || level.level === 'veryHigh';

  return {
    summary: {
      title: level.label,
      score: total,
      maxScore: totalMax,
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
    behavioralProfile: generateSWLSBehavioralProfile(answers),
  };
}

// =====================================================================
// 行为分歧画像 — 反映用户对生活的"反事实 + 时间对比"判断
// 设计目的: SWLS 5 题是"我满意"的同义反复, 用反事实/对比题
//   揭示用户对现状的真实态度
// =====================================================================

const SWLS_BEHAVIOR_LABELS: Record<string, string[]> = {
  swls6: ['比预期好很多 (超越)', '比预期好一点 (略超)', '和预期差不多 (符合)', '比预期差一些 (略低)', '比预期差很多 (大失所望)'],
  swls7: ['保持现状不变 (满足型)', '微调一些事情 (优化型)', '大幅改变工作 (方向重置)', '大幅改变关系 (关系重置)', '几乎全部重来 (重来型)'],
};

function generateSWLSBehavioralProfile(answers: Record<string, number>) {
  const extensionAnswers = SWLS_EXTENSION_QUESTIONS.map(q => {
    const choice = answers[q.id];
    return {
      id: q.id,
      question: q.text,
      choice: choice ?? null,
      label: choice != null ? SWLS_BEHAVIOR_LABELS[q.id]?.[choice] ?? '未填' : '未填',
    };
  }).filter(a => a.choice !== null);

  if (extensionAnswers.length === 0) {
    return null;
  }

  const sum = extensionAnswers.reduce((acc, a) => acc + (a.choice ?? 0), 0);
  const avg = sum / extensionAnswers.length;
  // swls6: 低分=超越预期 (好), 高分=大失所望
  // swls7: 低分=满足现状 (好), 高分=重来型
  // avg 越低 = 越满足, 越高 = 越不满
  let archetype: string;
  let archetypeDesc: string;
  if (avg < 1) {
    archetype = '超越满足型';
    archetypeDesc = '你不仅对现状满意, 还觉得生活超出了自己 5 年前的预期。如果让你重来, 你甚至不想改变。这种状态很难得, 值得珍惜。';
  } else if (avg < 2) {
    archetype = '稳定满足型';
    archetypeDesc = '你的生活基本符合预期, 也愿意保持现状或微调。这是较稳定的状态, 注意: 稳定不等于停滞, 可在擅长的领域继续追求成长。';
  } else if (avg < 3) {
    archetype = '不满修正型';
    archetypeDesc = '你对生活某些方面存在不满, 想要做出具体改变。建议明确"改变什么", 区分可控与不可控, 避免陷入"全盘重来"的冲动。';
  } else {
    archetype = '大失所望型';
    archetypeDesc = '你的生活与 5 年前的预期差距很大, 也想做出大幅改变。重要的是: 在行动前先识别哪些是"目标问题"(目标定太高) vs "路径问题"(执行不到位), 避免无谓的重来。';
  }

  return {
    title: '生活态度分歧画像',
    subtitle: '基于 2 道反事实/时间对比题, 反映你"对现状的真实判断"',
    archetype,
    archetypeDesc,
    items: extensionAnswers,
  };
}
