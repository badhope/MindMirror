import { Question, TraitResult } from '../types';
import {
  MBI_SEVERITY,
  MBI_DIMENSIONS,
  MBI_DIMENSION_LEVELS,
  MBI_COPING_STRATEGIES,
  MBI_EXTENSION_QUESTIONS,
} from '../data/mbiData';

/**
 * MBI-GS 评分算法
 *
 * 计分规则 (按 Maslach 1996 + 题库扩展 40 题版):
 *   EX (情感耗竭): 12 题 (mbi1-5, mbi19-25) × 0-6 → 0-72
 *   CY (犬儒主义): 10 题 (mbi6-9, mbi26-31) × 0-6 → 0-60
 *   PE (职业效能): 15 题 (mbi10-15, mbi32-40) × 0-6 → 0-90 (反向计分)
 *
 * 综合倦怠分: (EX + CY + (90 - PE)) / 3
 *   范围 0-74 (40 题扩展后, 比例缩放自原 15 题 0-30)
 *
 * 严重度 (Schaufeli 1996 切分点按 30/74 比例缩放):
 *   0-27  : 低
 *   28-42: 中度
 *   43-54: 高度
 *   55-74: 重度
 */

export function calculateMBITraits(
  answers: Record<string, number>,
  questions: Question[]
): TraitResult[] {
  // 动态计算各维度 max (基于实际题目数 × 选项最大值)
  let exMax = 0;
  let cyMax = 0;
  let peMax = 0;
  for (const q of questions) {
    if (q.trait === 'extension') continue;
    if (q.trait === 'exhaustion') exMax += 6;
    else if (q.trait === 'cynicism') cyMax += 6;
    else if (q.trait === 'efficacy') peMax += 6;
  }
  // 防御: 没有任何题目时给一个最小值
  if (exMax === 0) exMax = 1;
  if (cyMax === 0) cyMax = 1;
  if (peMax === 0) peMax = 1;

  let exScore = 0;
  let cyScore = 0;
  let peRaw = 0;

  for (const q of questions) {
    // 排除延伸题 (extension), 避免污染原量表总分
    if (q.trait === 'extension') continue;
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

  // PE 反向: 使其进入"高 = 倦怠"的方向
  const peReversed = peMax - peRaw;
  const totalMax = exMax + cyMax + peMax; // 用于综合分除以 3
  const total = (exScore + cyScore + peReversed) / 3;

  const traits: TraitResult[] = [
    {
      name: '综合倦怠分',
      score: Math.round(total * 10) / 10,
      maxScore: Math.round(totalMax / 3),
      description: `${getMBITotalLevel(total).label} (${total.toFixed(1)}/${Math.round(totalMax / 3)})`,
    },
    {
      name: '情感耗竭',
      score: Math.round((exScore / exMax) * 100),
      description: `${MBI_DIMENSIONS.exhaustion.description} (${exScore}/${exMax},高分=倦怠)`,
    },
    {
      name: '犬儒主义 / 去人格化',
      score: Math.round((cyScore / cyMax) * 100),
      description: `${MBI_DIMENSIONS.cynicism.description} (${cyScore}/${cyMax},高分=倦怠)`,
    },
    {
      name: '职业效能感',
      score: Math.round((peRaw / peMax) * 100),
      maxScore: peMax,
      description: `${MBI_DIMENSIONS.efficacy.description} (${peRaw}/${peMax},高分=健康)`,
    },
  ];

  return traits;
}

export function getMBITotalLevel(score: number, totalMax: number = 30) {
  // MBI 高分=倦怠,使用百分比判断,兼容 15/40 题版本
  // 原始阈值: ≥23/30=77% 重度, ≥18/30=60% 高度, ≥12/30=40% 中度, else 轻度
  const range = totalMax > 0 ? totalMax : 30;
  const pct = score / range;
  if (pct >= 0.77) return MBI_SEVERITY.severe;
  if (pct >= 0.60) return MBI_SEVERITY.high;
  if (pct >= 0.40) return MBI_SEVERITY.moderate;
  return MBI_SEVERITY.low;
}

/** 与其它 3 个量表的 getXxxLevelInfo 保持 API 一致性 */
export function getMBILevelInfo(score: number, totalMax?: number) {
  if (totalMax === undefined) {
    return getMBITotalLevel(score);
  }
  return getMBITotalLevel(score, totalMax);
}

export function getMBIExLevel(score: number, exMax: number = 30) {
  // EX 高分=倦怠,使用百分比判断,兼容 15/40 题版本
  // 原始阈值: ≥15/30=50% 极高, ≥11/30=37% 高, ≥6/30=20% 中, else 低
  const pct = exMax > 0 ? score / exMax : 0;
  if (pct >= 0.50) return MBI_DIMENSION_LEVELS.exhaustion.severe;
  if (pct >= 0.37) return MBI_DIMENSION_LEVELS.exhaustion.high;
  if (pct >= 0.20) return MBI_DIMENSION_LEVELS.exhaustion.moderate;
  return MBI_DIMENSION_LEVELS.exhaustion.low;
}

export function getMBICyLevel(score: number, cyMax: number = 24) {
  // CY 高分=倦怠,使用百分比判断,兼容 15/40 题版本
  // 原始阈值: ≥8/24=33% 极高, ≥5/24=21% 高, ≥3/24=13% 中, else 低
  const pct = cyMax > 0 ? score / cyMax : 0;
  if (pct >= 0.33) return MBI_DIMENSION_LEVELS.cynicism.severe;
  if (pct >= 0.21) return MBI_DIMENSION_LEVELS.cynicism.high;
  if (pct >= 0.13) return MBI_DIMENSION_LEVELS.cynicism.moderate;
  return MBI_DIMENSION_LEVELS.cynicism.low;
}

export function getMBIPeLevel(score: number, peMax: number = 90) {
  // PE 是反向,高分=健康 (使用百分比判断,兼容 15/40 题版本)
  // 原始阈值: ≥30/36=83% 高, ≥25/36=69% 中, ≥20/36=55% 低
  const pct = peMax > 0 ? score / peMax : 0;
  if (pct >= 0.83) return MBI_DIMENSION_LEVELS.efficacy.high;
  if (pct >= 0.69) return MBI_DIMENSION_LEVELS.efficacy.moderate;
  if (pct >= 0.55) return MBI_DIMENSION_LEVELS.efficacy.low;
  return MBI_DIMENSION_LEVELS.efficacy.veryLow;
}

export function calculateMBISubScores(
  answers: Record<string, number>,
  questions: Question[]
) {
  let ex = 0;
  let cy = 0;
  let pe = 0;
  let peMax = 0;
  for (const q of questions) {
    if (q.trait === 'extension') continue;
    if (q.trait === 'efficacy') peMax += 6;
  }
  // 防御
  if (peMax === 0) peMax = 36;
  for (const q of questions) {
    if (q.trait === 'extension') continue;
    const a = answers[q.id];
    if (a === undefined || a === null) continue;
    const v = Number(a);
    if (Number.isNaN(v)) continue;
    if (q.trait === 'exhaustion') ex += v;
    else if (q.trait === 'cynicism') cy += v;
    else if (q.trait === 'efficacy') pe += v;
  }
  return { ex, cy, pe, total: (ex + cy + (peMax - pe)) / 3 };
}

export function generateDetailedMBIReport(
  answers: Record<string, number>,
  questions: Question[]
) {
  const { ex, cy, pe, total } = calculateMBISubScores(answers, questions);

  // 动态计算各维度 max
  let exMax = 0;
  let cyMax = 0;
  let peMax = 0;
  for (const q of questions) {
    if (q.trait === 'extension') continue;
    if (q.trait === 'exhaustion') exMax += 6;
    else if (q.trait === 'cynicism') cyMax += 6;
    else if (q.trait === 'efficacy') peMax += 6;
  }
  if (exMax === 0) exMax = 30;
  if (cyMax === 0) cyMax = 24;
  if (peMax === 0) peMax = 36;
  const totalMax = Math.round((exMax + cyMax + peMax) / 3);

  const totalLevel = getMBITotalLevel(total, totalMax);
  const exLevel = getMBIExLevel(ex, exMax);
  const cyLevel = getMBICyLevel(cy, cyMax);
  const peLevel = getMBIPeLevel(pe, peMax);

  return {
    summary: {
      title: totalLevel.label,
      score: Math.round(total * 10) / 10,
      maxScore: totalMax,
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
    behavioralProfile: generateMBIBehavioralProfile(answers),
  };
}

// =====================================================================
// 行为分歧画像 — 反映用户在「具体工作场景」中的真实行为倾向
// 设计目的: MBI 原量表"耗竭同质化" + "效能社会赞许性", 行为分歧题
//   用具体迫选场景揭示真实倦怠状态
// =====================================================================

const MBI_BEHAVIOR_LABELS: Record<string, string[]> = {
  mbi16: ['没问题配合 (奉献)', '接受但讨价还价 (边界)', '直接拒绝/要求调休 (强硬)', '接受但心里抗拒 (压抑)', '心灰意冷 (重度倦怠)'],
  mbi17: ['真心祝贺并学习 (成长)', '失落但很快接受 (韧性)', '质疑晋升公平性 (犬儒)', '怀疑自身价值 (低效能)', '失去工作信任 (深度犬儒)'],
  mbi18: ['保持专注贡献 (高投入)', '听讲偶尔走神 (常规)', '同时处理其他工作 (多任务)', '觉得浪费时间忍耐 (犬儒)', '主动提缩短会议 (质疑者)'],
};

function generateMBIBehavioralProfile(answers: Record<string, number>) {
  const extensionAnswers = MBI_EXTENSION_QUESTIONS.map(q => {
    const choice = answers[q.id];
    return {
      id: q.id,
      question: q.text,
      choice: choice ?? null,
      label: choice != null ? MBI_BEHAVIOR_LABELS[q.id]?.[choice] ?? '未填' : '未填',
    };
  }).filter(a => a.choice !== null);

  if (extensionAnswers.length === 0) {
    return null;
  }

  const sum = extensionAnswers.reduce((acc, a) => acc + (a.choice ?? 0), 0);
  const avg = sum / extensionAnswers.length;
  // avg 越高 = 越倾向"被工作消耗/犬儒" → 高倦怠画像
  // avg 越低 = 越倾向"投入/成长" → 健康画像
  let archetype: string;
  let archetypeDesc: string;
  if (avg < 1) {
    archetype = '高投入成长型';
    archetypeDesc = '面对加班/同事晋升/冗长会议, 你倾向于主动配合、祝贺同事、保持专注, 是工作中的"正能量"角色。注意: 这也可能是高功能倦怠 (你只是没有表达疲惫)。';
  } else if (avg < 2) {
    archetype = '弹性务实型';
    archetypeDesc = '你能处理工作中的负面情绪, 但会设置边界。在奉献与自我保护之间找到了平衡点, 是可持续的工作模式。';
  } else if (avg < 3) {
    archetype = '压抑消耗型';
    archetypeDesc = '表面上你还在配合, 但内心已经积累了很多抗拒。这是倦怠的早期信号, 建议主动调整工作量或寻求支持。';
  } else {
    archetype = '犬儒耗竭型';
    archetypeDesc = '你在行为层面已经表现出明显的倦怠信号: 抗拒加班、怀疑晋升公平、质疑工作价值。建议认真评估: 是休息不足, 还是这份工作本身需要重新选择?';
  }

  return {
    title: '工作行为分歧画像',
    subtitle: '基于 3 道工作场景迫选题, 反映你"在具体工作中"的状态',
    archetype,
    archetypeDesc,
    items: extensionAnswers,
  };
}
