import { Question, TraitResult } from '../types';
import {
  RESILIENCE_SEVERITY,
  RESILIENCE_DIMENSIONS,
  RESILIENCE_BOOST_STRATEGIES,
  RESILIENCE_EXTENSION_QUESTIONS,
} from '../data/resilienceData';

/**
 * CD-RISC-10 评分算法
 *
 * 计分规则 (Connor & Davidson 2003 + 40 题扩展版):
 *   37 道主量表题 (10 道原题 + 27 道题库) 0-4 评分,含反向题
 *   范围 0 ~ 148 (max = 37 × 4)
 *   反向题: 选择 0-4 实际记 4-value
 *
 * 严重度 (Connor & Davidson 2003 切分点按 40/148 比例缩放):
 *   0-70   : 韧性较低
 *   71-85  : 韧性偏低
 *   86-103 : 韧性中等
 *   104-118: 韧性较高
 *   119-148: 韧性很强
 */

export function calculateResilienceTraits(
  answers: Record<string, number>,
  questions: Question[]
): TraitResult[] {
  // 动态计算各维度 max
  const dimScores: Record<string, { sum: number; n: number; max: number }> = {
    adaptability: { sum: 0, n: 0, max: 0 },
    relationships: { sum: 0, n: 0, max: 0 },
    meaning: { sum: 0, n: 0, max: 0 },
    selfEfficacy: { sum: 0, n: 0, max: 0 },
    optimism: { sum: 0, n: 0, max: 0 },
  };

  let total = 0;
  let totalMax = 0;
  for (const q of questions) {
    if (q.trait === 'extension') continue;
    if (q.trait && dimScores[q.trait] !== undefined) {
      dimScores[q.trait].max += 4;
    }
    totalMax += 4;
  }
  if (totalMax === 0) totalMax = 40; // 防御默认值

  for (const q of questions) {
    if (q.trait === 'extension') continue;
    const a = answers[q.id];
    if (a === undefined || a === null) continue;
    let v = Number(a);
    if (Number.isNaN(v)) continue;
    // 反向题处理
    if (q.reverse) v = 4 - v;
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
      maxScore: totalMax,
      description: getResilienceTotalDescription(total, totalMax),
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

export function getResilienceLevel(score: number, maxScore: number = 40) {
  // CD-RISC 高分=韧性高,使用百分比判断,兼容 10/40 题版本
  // 原始阈值: ≥33/40=82% 很强, ≥29/40=72% 较高, ≥24/40=60% 中等
  //   ≥20/40=50% 偏低, else 较低
  const range = maxScore > 0 ? maxScore : 40;
  const pct = score / range;
  if (pct >= 0.82) return RESILIENCE_SEVERITY.veryHigh;
  if (pct >= 0.72) return RESILIENCE_SEVERITY.high;
  if (pct >= 0.6) return RESILIENCE_SEVERITY.moderate;
  if (pct >= 0.5) return RESILIENCE_SEVERITY.low;
  return RESILIENCE_SEVERITY.veryLow;
}

export function getResilienceLevelInfo(score: number, maxScore?: number) {
  if (maxScore === undefined) {
    return getResilienceLevel(score);
  }
  return getResilienceLevel(score, maxScore);
}

export function getResilienceTotalDescription(score: number, maxScore: number = 40): string {
  const level = getResilienceLevel(score);
  return `${level.label} (${score}/${maxScore})`;
}

export function generateDetailedResilienceReport(
  answers: Record<string, number>,
  questions: Question[]
) {
  const traits = calculateResilienceTraits(answers, questions);
  const total = traits[0].score;
  const totalMax = traits[0].maxScore;
  const level = getResilienceLevel(total, totalMax);

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
    意义与目标: 'meaning',
    自我效能: 'selfEfficacy',
    '乐观 / 接纳': 'optimism',
  };

  return {
    summary: {
      title: level.label,
      score: total,
      maxScore: totalMax,
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
    behavioralProfile: generateResilienceBehavioralProfile(answers),
  };
}

// =====================================================================
// 行为分歧画像 — 反映用户在「真实挫折场景」中的行为反应
// 设计目的: CD-RISC 原量表"我能适应/我能应付"是社会赞许性极重的
//   自评, 行为分歧题用"过去 6 个月"和"反事实"具体场景揭示真实韧性
// =====================================================================

const RESILIENCE_BEHAVIOR_LABELS: Record<string, string[]> = {
  cdr11: ['主动寻求专业帮助', '向家人朋友倾诉', '独自消化慢慢调整', '转移注意力', '不知道该怎么办'],
  cdr12: [
    '很快开始新尝试',
    '休息一段时间再重启',
    '怀疑能力但坚持',
    '重新评估人生方向',
    '不知道该怎么办',
  ],
  cdr13: [
    '制定详细计划执行',
    '准备多个备选方案',
    '顺其自然不强求',
    '寻求他人建议',
    '焦虑但不知道怎么办',
  ],
};

function generateResilienceBehavioralProfile(answers: Record<string, number>) {
  const extensionAnswers = RESILIENCE_EXTENSION_QUESTIONS.map(q => {
    const choice = answers[q.id];
    return {
      id: q.id,
      question: q.text,
      choice: choice ?? null,
      label: choice != null ? (RESILIENCE_BEHAVIOR_LABELS[q.id]?.[choice] ?? '未填') : '未填',
    };
  }).filter(a => a.choice !== null);

  if (extensionAnswers.length === 0) {
    return null;
  }

  const sum = extensionAnswers.reduce((acc, a) => acc + (a.choice ?? 0), 0);
  const avg = sum / extensionAnswers.length;
  // avg 越低 = 越积极/灵活/求助 → 韧性高
  // avg 越高 = 越逃避/迷茫/焦虑 → 韧性低
  let archetype: string;
  let archetypeDesc: string;
  if (avg < 1) {
    archetype = '高韧性行动型';
    archetypeDesc =
      '面对挫折你会主动寻求支持、调整后再出发, 面对不确定你会制定计划或灵活应对。你不需要"假装坚强", 但你有真实的复原力。';
  } else if (avg < 2) {
    archetype = '反思恢复型';
    archetypeDesc =
      '你会独自消化挫折、重新评估方向, 这是较成熟的应对方式。注意: "独自消化"长期累积可能耗竭, 适当分享反而能加速恢复。';
  } else if (avg < 3) {
    archetype = '逃避转移型';
    archetypeDesc =
      '面对挫折你倾向于转移注意力 (运动/工作/娱乐), 这能在短期内缓解痛苦, 但长期可能回避核心问题。建议偶尔停下来"直视"自己的状态。';
  } else {
    archetype = '迷茫崩溃型';
    archetypeDesc =
      '面对重大挫折或不确定, 你感到不知道该怎么办。这是真实的脆弱, 不是失败。建议: 1) 找一个值得信任的人聊聊; 2) 寻求专业支持; 3) 给自己时间, 不要强迫自己"立刻想通"。';
  }

  return {
    title: '韧性行为分歧画像',
    subtitle: '基于 3 道真实场景题, 反映你"在挫折/不确定中"的行为反应',
    archetype,
    archetypeDesc,
    items: extensionAnswers,
  };
}
