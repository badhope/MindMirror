import { Question, TraitResult } from '../types';
import {
  SSRS_SEVERITY,
  SSRS_DIMENSIONS,
  SSRS_RESOURCES,
  SSRS_EXTENSION_QUESTIONS,
} from '../data/ssrsData';

/**
 * SSRS 评分算法
 *
 * 计分规则 (按肖水源 1990):
 *   客观支持: items 2, 6, 7    (3 题, 范围 1-22)
 *   主观支持: items 1, 3, 4, 5 (4 题, 范围 4-16)
 *   利用度:   items 8, 9, 10   (3 题, 范围 3-12)
 *   总分: 8-50 (理论最小: 1+0+0+4×1+3×1 = 8)
 *
 * 严重度 (肖水源 1990 + 王征宇 1987, 已按新总分 180 等比放大):
 *   29  -  80 : 低
 *   81  - 106 : 中等偏低
 *   107 - 161 : 中等
 *   162 - 180 : 高
 *
 * 扩展题库后:
 *   主观支持 14 题 (主 4 + 扩展 10), 各维度理论最大值动态计算
 */

export function calculateSSRSTraits(
  answers: Record<string, number>,
  questions: Question[]
): TraitResult[] {
  let totalScore = 0;
  let objectiveScore = 0;
  let subjectiveScore = 0;
  let utilizationScore = 0;
  let objectiveMax = 0;
  let subjectiveMax = 0;
  let utilizationMax = 0;

  for (const q of questions) {
    // 排除延伸题 (extension), 避免污染原量表总分
    if (q.trait === 'extension') continue;
    const a = answers[q.id];
    if (a === undefined || a === null) continue;
    const score = Number(a);
    if (Number.isNaN(score)) continue;
    totalScore += score;
    if (q.trait === 'objective') {
      objectiveScore += score;
      // 来源题 (ssrs6, ssrs7, ssrs26, ssrs27) 范围 0-9
      if (['ssrs6', 'ssrs7', 'ssrs26', 'ssrs27'].includes(q.id)) {
        objectiveMax += 9;
      } else {
        objectiveMax += 4;
      }
    } else if (q.trait === 'subjective') {
      subjectiveScore += score;
      subjectiveMax += 4;
    } else if (q.trait === 'utilization') {
      utilizationScore += score;
      utilizationMax += 4;
    }
  }

  const totalMax = objectiveMax + subjectiveMax + utilizationMax;

  const traits: TraitResult[] = [
    {
      name: '社会支持总分',
      score: totalScore,
      maxScore: totalMax,
      description: getSSRSTotalDescription(totalScore),
    },
    {
      name: '客观支持',
      score: objectiveMax > 0 ? Math.round((objectiveScore / objectiveMax) * 100) : 0,
      description: `${SSRS_DIMENSIONS.objective.description} (${objectiveScore}/${objectiveMax})`,
    },
    {
      name: '主观支持',
      score: subjectiveMax > 0 ? Math.round((subjectiveScore / subjectiveMax) * 100) : 0,
      description: `${SSRS_DIMENSIONS.subjective.description} (${subjectiveScore}/${subjectiveMax})`,
    },
    {
      name: '支持利用度',
      score: utilizationMax > 0 ? Math.round((utilizationScore / utilizationMax) * 100) : 0,
      description: `${SSRS_DIMENSIONS.utilization.description} (${utilizationScore}/${utilizationMax})`,
    },
  ];

  return traits;
}

export function getSSRSLevel(score: number) {
  if (score <= 80) return SSRS_SEVERITY.low;
  if (score <= 106) return SSRS_SEVERITY.mediumLow;
  if (score <= 161) return SSRS_SEVERITY.medium;
  return SSRS_SEVERITY.high;
}

/** 与其它 3 个量表的 getXxxLevelInfo 保持 API 一致性 */
export function getSSRSLevelInfo(score: number) {
  return getSSRSLevel(score);
}

export function getSSRSTotalDescription(score: number): string {
  const level = getSSRSLevel(score);
  return `${level.label} (${score} 分)`;
}

export function generateDetailedSSRSReport(answers: Record<string, number>, questions: Question[]) {
  const traits = calculateSSRSTraits(answers, questions);
  const total = traits[0].score;
  const totalMax = traits[0].maxScore;
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
      maxScore: totalMax,
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
    behavioralProfile: generateSSRSBehavioralProfile(answers),
  };
}

// =====================================================================
// 行为分歧画像 — 反映用户在「具体场景」中的真实行为倾向
// 设计目的: 原量表是抽象自评, 容易被社会赞许性偏差污染
//   行为分歧题用迫选式场景, 揭示真实关系模式
// =====================================================================

const SSRS_BEHAVIOR_LABELS: Record<string, string[]> = {
  ssrs11: ['内心祝贺但不互动', '默默点赞', '主动评论+点赞', '评论+私聊深入', '主动私信深度交流'],
  ssrs12: [
    '完全自己搞定',
    '在群里发求帮忙信息',
    '私下联系 1-2 个好友',
    '请家人/亲戚帮忙',
    '召集好友组团',
  ],
  ssrs13: [
    '直接表达不同看法',
    '主动寻找共同点',
    '表面同意但保留意见',
    '避免讨论该话题',
    '暂时不联系等冷静',
  ],
};

function generateSSRSBehavioralProfile(answers: Record<string, number>) {
  // 仅处理 extension 题
  const extensionAnswers = SSRS_EXTENSION_QUESTIONS.map(q => {
    const choice = answers[q.id];
    return {
      id: q.id,
      question: q.text,
      choice: choice ?? null,
      label: choice != null ? (SSRS_BEHAVIOR_LABELS[q.id]?.[choice] ?? '未填') : '未填',
    };
  }).filter(a => a.choice !== null);

  if (extensionAnswers.length === 0) {
    return null;
  }

  // 计算整体行为画像
  const sum = extensionAnswers.reduce((acc, a) => acc + (a.choice ?? 0), 0);
  const avg = sum / extensionAnswers.length;
  // avg 越高 = 越倾向"主动连接/依赖他人" → 外联型
  // avg 越低 = 越倾向"独立/内敛" → 独立型
  let archetype: string;
  let archetypeDesc: string;
  if (avg < 1) {
    archetype = '独立内敛型';
    archetypeDesc =
      '你更倾向于自我消化、不轻易打扰他人,享受独处与独立解决问题。优势是边界清晰、不耗竭;风险是关键时刻可能缺乏主动求助。';
  } else if (avg < 2) {
    archetype = '弹性平衡型';
    archetypeDesc =
      '你能在独立与连接之间自如切换,该自己扛时扛,该求助时也会开口。这是较健康的关系模式。';
  } else if (avg < 3) {
    archetype = '主动连接型';
    archetypeDesc =
      '你习惯主动维护关系、表达情感,在关系中投入度较高。优势是被支持感强;风险是可能在关系中消耗过多精力。';
  } else {
    archetype = '深度依赖型';
    archetypeDesc =
      '你高度依赖核心关系网,在亲密关系中寻求强连接。优势是关系深度;风险是当关系波动时,情绪冲击也大。';
  }

  return {
    title: '关系行为分歧画像',
    subtitle: '基于 3 道行为情景迫选题, 反映你"在具体场景中"的关系模式',
    archetype,
    archetypeDesc,
    items: extensionAnswers,
  };
}
