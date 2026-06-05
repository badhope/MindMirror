import { Assessment, Question } from '../types';

/**
 * SWLS — Satisfaction With Life Scale (生活满意度量表)
 *
 * 理论基础 (Theoretical basis)
 * ─────────────────────────────
 * 由 Ed Diener, Robert A. Emmons, Randy J. Larsen 与 Sharon Griffin (1985)
 * 在 Journal of Personality Assessment 上发表。是主观幸福感 (Subjective
 * Well-Being, SWB) 三大结构 (生活满意度 + 正性情感 + 负性情感) 中
 * 认知维度 (cognitive component) 的标准测量工具。
 *
 * 5 个题目构成"整体生活满意度"单一维度,衡量个人对自己生活质量的
 * 主观判断 (而非情绪),不依赖于外部标准。
 *
 * 量表结构
 * ─────────
 * 5 题,7 点李克特量表 (1=完全不同意, 7=完全同意)。
 * 所有题目同向计分 — 没有反向题。范围 5 ~ 35。
 *
 * 严重度 (Diener 1985 + Pavot & Diener 1993 标准切分点):
 *   5 - 9  : 极不满意 (Extremely dissatisfied)
 *   10 - 14: 不满意   (Dissatisfied)
 *   15 - 19: 略低     (Slightly below average)
 *   20 - 24: 中等     (Average)
 *   25 - 29: 较满意   (High)
 *   30 - 35: 高度满意 (Very high)
 */

export const SWLS_ASSESSMENT: Assessment = {
  id: 'life-satisfaction',
  title: '生活满意度量表 (SWLS)',
  description:
    '基于 Diener 等人 1985 年编制的《生活满意度量表》(SWLS) 的完整 5 题版本,作为主观幸福感的认知核心指标,衡量你对自己整个生活质量的整体判断。',
  category: '生活',
  totalQuestions: 5,
  icon: '🌅',
  difficulty: '简单',
  estimatedTime: '2 分钟',
};

export const SWLS_RESPONSE_OPTIONS = [
  { value: 1, label: '完全不同意' },
  { value: 2, label: '不同意' },
  { value: 3, label: '有点不同意' },
  { value: 4, label: '中立' },
  { value: 5, label: '有点同意' },
  { value: 6, label: '同意' },
  { value: 7, label: '完全同意' },
];

// SWLS 5 题 — 严格按 Diener et al. 1985 原文 (以及 Pavot 2009 修订版) 翻译
export const SWLS_QUESTIONS: Question[] = [
  {
    id: 'swls1',
    text: '在大多数方面,我的人生都接近我的理想 (In most ways my life is close to my ideal)',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls2',
    text: '我的生活条件非常好 (The conditions of my life are excellent)',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls3',
    text: '我对自己的生活感到满意 (I am satisfied with my life)',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls4',
    text: '到目前为止,我已经得到了我在生活中想要得到的重要东西 (So far I have gotten the important things I want in life)',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls5',
    text: '如果我能重新活一次,我几乎不想改变任何事 (If I could live my life over, I would change almost nothing)',
    trait: 'satisfaction',
    reverse: false,
  },
];

// 严重度 (按 Diener 1985 + Pavot & Diener 1993)
export const SWLS_SEVERITY = {
  veryLow: {
    level: 'veryLow',
    label: '极不满意',
    range: [5, 9] as [number, number],
    color: 'red',
    description:
      '你对自己的整体生活现状感到强烈的不满意。这种状态可能伴随较低的主观幸福感,值得认真对待,必要时寻求专业支持。',
    advice: [
      '和值得信任的人聊聊你目前的感受',
      '识别生活中"小但具体"的不满来源,并尝试逐项调整',
      '如果持续低落超过 2 周,建议咨询心理师',
      '接纳"不完美"而不放弃寻找更好的状态',
    ],
  },
  low: {
    level: 'low',
    label: '不满意',
    range: [10, 14] as [number, number],
    color: 'orange',
    description:
      '你对自己的生活在多个方面并不满意,但尚未到完全绝望的程度。识别最关键的几个领域 (健康、关系、意义等) 并开始调整会带来明显改善。',
    advice: [
      '列出生活中你希望改变但可控的 3 件事',
      '关注关系和健康这两个常被低估的幸福源',
      '练习"感恩三件事"等微小的积极心理学方法',
    ],
  },
  slightlyLow: {
    level: 'slightlyLow',
    label: '略低于平均',
    range: [15, 19] as [number, number],
    color: 'yellow',
    description:
      '你对自己的生活略有不满但整体尚可,可能存在某些未被满足的期待。识别是"路径问题"还是"目标问题",能帮助你更有效地行动。',
    advice: [
      '识别期望值与现实的差距在哪里',
      '尝试体验性消费 (体验类活动) 而非物质性消费',
      '重新评估生活目标,看是否需要更新',
    ],
  },
  average: {
    level: 'average',
    label: '中等',
    range: [20, 24] as [number, number],
    color: 'emerald',
    description:
      '你对自己的生活持中性偏正的评价,基本符合多数人对生活的中等满意度。这是较稳定的认知状态,适合在保持的基础上追求成长。',
    advice: [
      '保持现有的积极习惯,定期回顾生活',
      '在擅长的领域继续投入,以获得意义感',
      '关注关系质量,这常是决定满意度的关键',
    ],
  },
  high: {
    level: 'high',
    label: '较满意',
    range: [25, 29] as [number, number],
    color: 'green',
    description:
      '你对生活的整体满意度较高,说明你目前的现实与内在期望基本匹配。继续保持并关注那些让你满足的核心领域。',
    advice: [
      '留意对你最重要的几件事是什么,刻意保留它们',
      '把你的满足感转化为对其他人的支持',
      '继续建立长期目标,避免安于现状',
    ],
  },
  veryHigh: {
    level: 'veryHigh',
    label: '高度满意',
    range: [30, 35] as [number, number],
    color: 'green',
    description:
      '你对自己的生活非常满意。这种状态与较高的心理韧性、较低的心理症状风险相关。请保持这来之不易的稳定感,也不要忘记在状态好时为可能的下行积累支持。',
    advice: [
      '把这段时间作为你的"基线"参考',
      '在状态好时主动建立关系和储蓄意义感',
      '把这种满足感传递出去,它会反过来强化它本身',
    ],
  },
};

// 详细解读维度 (Diener 多维子分)
export const SWLS_INTERPRETATION = {
  high: {
    title: '高度满意',
    description: '你的生活现状高度符合内心期望,主观幸福感高。',
    strengths: [
      '内在标准与现实高度匹配',
      '对生活有清晰的目标感和意义感',
      '具备较强的心理调节能力',
    ],
  },
  low: {
    title: '较低满意',
    description: '你的生活现状低于内心期望,值得探索具体的不满足来源。',
    strengths: [
      '对自己诚实的态度本身就是改变的开始',
      '认知觉察能力较好,识别出问题',
    ],
    challenges: [
      '期望与现实可能存在较大差距',
      '可能存在未表达的需求',
      '注意避免用"现状无法改变"作为结论',
    ],
  },
};

// 维度说明
export const SWLS_DIMENSIONS = {
  satisfaction: {
    name: '生活满意度',
    nameEn: 'Life Satisfaction',
    description: '整体上,你对自己生活质量的判断。',
  },
};

// 提升策略
export const SWLS_BOOST_STRATEGIES = {
  relationships: [
    '每周与重要的人进行一次深入对话',
    '主动表达感激,留意对方回应',
    '减少抱怨,练习"积极重构"',
  ],
  flow: [
    '找到一项能让你进入"心流"的活动并规律进行',
    '为目标设置略高于现有能力,保持"心流通道"',
    '把"任务"变成"练习",享受过程',
  ],
  meaning: [
    '重新审视"我想成为什么样的人"',
    '选择一个大于自我的目标作为指引',
    '把日常工作与更长远的意义连接',
  ],
  health: [
    '运动是幸福感最稳定的单一来源之一',
    '优先保证 7-9 小时睡眠',
    '减少屏幕时间,增加户外自然接触',
  ],
};
