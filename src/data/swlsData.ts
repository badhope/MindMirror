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
    '基于 Diener 等人 1985 年编制的《生活满意度量表》(SWLS) 的完整 5 题版本,作为主观幸福感的认知核心指标,衡量你对自己整个生活质量的整体判断。题库扩展至 40 题,涵盖关系/健康/成就/成长/意义/日常六大主题,提升测量信度并降低同质化偏差。',
  category: '生活',
  totalQuestions: 40, // 5 道原量表 + 2 道行为延伸 + 33 道题库扩展
  icon: '🌅',
  difficulty: '简单',
  estimatedTime: '11 分钟',
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

// =====================================================================
// 行为情景分歧题 (2 道) — 延伸项
// 设计目的: SWLS 5 题都是抽象自评, 互信息极高
//   用反事实 + 时间对比, 突破"自评天花板"
// 注: 不计入原量表分, 生成「行为分歧画像」附加报告
// =====================================================================

export const SWLS_EXTENSION_QUESTIONS: Question[] = [
  {
    id: 'swls6',
    text: '和您 5 年前的预期相比, 您现在的生活:',
    trait: 'extension',
    // 0: 比预期好很多 (超越)
    // 1: 比预期好一点 (略超)
    // 2: 和预期差不多 (符合)
    // 3: 比预期差一些 (略低)
    // 4: 比预期差很多 (大失所望)
    reverse: false,
  },
  {
    id: 'swls7',
    text: '如果现在您可以选择, 您最希望:',
    trait: 'extension',
    // 0: 保持现状不变 (满足型)
    // 1: 微调一些事情 (优化型)
    // 2: 大幅改变工作 (方向重置)
    // 3: 大幅改变关系 (关系重置)
    // 4: 几乎全部重来 (重来型)
    reverse: false,
  },
];

// =====================================================================
// 题库扩展题 (33 道) — 多主题覆盖,提升测量信度并降低同质化
// 设计原则:
//   - 6 个子主题 (关系 / 健康 / 成就 / 成长 / 意义 / 日常)
//   - 包含反向题 (检测顺从偏差 / 默认正向回答)
//   - 行为锚定 (具体场景,而非抽象自评)
//   - 高区分度, 让真正满足者与假装满足者拉开差距
// 注: 与原 5 题使用同一 1-7 量表,统一 trait='satisfaction' 累加
// =====================================================================

// 关系满意度题库 (8 道, swls8-swls15)
export const SWLS_RELATIONSHIPS_BANK: Question[] = [
  {
    id: 'swls8',
    text: '我对目前和家人的关系感到满意',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls9',
    text: '我有一位可以真正说心里话的朋友',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls10',
    text: '我的伴侣 / 最重要的亲密关系让我感到被理解',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls11',
    text: '我和同事 / 同学的关系是真诚的, 不是表面的客套',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls12',
    text: '我经常感到被身边的人忽视 (反向)',
    trait: 'satisfaction',
    reverse: true,
  },
  {
    id: 'swls13',
    text: '当我和别人比较时, 我对自己的人际关系感到自信',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls14',
    text: '过去 1 年, 我和至少一位重要的人有过真正深入的交流',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls15',
    text: '即使在最亲近的人面前, 我也需要"演"一个更好的自己 (反向)',
    trait: 'satisfaction',
    reverse: true,
  },
];

// 健康与身体满意度题库 (6 道, swls16-swls21)
export const SWLS_HEALTH_BANK: Question[] = [
  {
    id: 'swls16',
    text: '我对目前的身体健康状况感到满意',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls17',
    text: '我每天的精力足够支撑我想做的事',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls18',
    text: '我的睡眠质量让我能以良好的状态开始每一天',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls19',
    text: '我的饮食习惯让我感觉身体在变好而不是变差',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls20',
    text: '我经常因为身体的小问题 (头疼 / 疲惫 / 胃不舒服) 影响状态 (反向)',
    trait: 'satisfaction',
    reverse: true,
  },
  {
    id: 'swls21',
    text: '我和自己的身体是和谐相处, 不是总在"消耗"它',
    trait: 'satisfaction',
    reverse: false,
  },
];

// 成就满意度题库 (6 道, swls22-swls27)
export const SWLS_ACHIEVEMENT_BANK: Question[] = [
  {
    id: 'swls22',
    text: '我对目前的工作 / 学业表现感到满意',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls23',
    text: '我做的事情能让我看到自己的进步',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls24',
    text: '我的收入能支撑我想过的生活方式',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls25',
    text: '我经常觉得工作 / 学业只是应付, 没什么成就感 (反向)',
    trait: 'satisfaction',
    reverse: true,
  },
  {
    id: 'swls26',
    text: '我能在自己的领域里做出有辨识度的成果',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls27',
    text: '我对自己未来 1 年的发展有清晰的期待',
    trait: 'satisfaction',
    reverse: false,
  },
];

// 成长满意度题库 (5 道, swls28-swls32)
export const SWLS_GROWTH_BANK: Question[] = [
  {
    id: 'swls28',
    text: '过去 1 年, 我在认知 / 能力 / 视野上有明显的成长',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls29',
    text: '我经常会主动学习新东西, 不是被逼的',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls30',
    text: '我对自己的好奇心与探索欲感到满意',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls31',
    text: '我经常觉得自己被困在原地, 没有变化 (反向)',
    trait: 'satisfaction',
    reverse: true,
  },
  {
    id: 'swls32',
    text: '我敢于走出舒适区, 尝试新的可能性',
    trait: 'satisfaction',
    reverse: false,
  },
];

// 意义满意度题库 (4 道, swls33-swls36)
export const SWLS_MEANING_BANK: Question[] = [
  {
    id: 'swls33',
    text: '我做的事情里, 至少有一部分让我觉得"有更大的意义"',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls34',
    text: '我清楚自己为什么每天做这些事',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls35',
    text: '我经常觉得生活就是日复一日, 没人在乎我做什么 (反向)',
    trait: 'satisfaction',
    reverse: true,
  },
  {
    id: 'swls36',
    text: '我能感受到自己属于某个比个人更大的东西 (家庭/事业/价值观)',
    trait: 'satisfaction',
    reverse: false,
  },
];

// 日常满意度题库 (4 道, swls37-swls40)
export const SWLS_DAILY_BANK: Question[] = [
  {
    id: 'swls37',
    text: '我对每天的居住环境 (家/房间/工作位) 感到舒适',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls38',
    text: '我每天都有一些让自己真正放松或愉悦的时间',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls39',
    text: '我对所在的城市 / 社区感到归属感',
    trait: 'satisfaction',
    reverse: false,
  },
  {
    id: 'swls40',
    text: '我经常觉得日子过得很机械, 没什么"自己的时间" (反向)',
    trait: 'satisfaction',
    reverse: true,
  },
];

// 题库题号集合
export const SWLS_BANK_ITEMS: string[] = [
  ...SWLS_RELATIONSHIPS_BANK,
  ...SWLS_HEALTH_BANK,
  ...SWLS_ACHIEVEMENT_BANK,
  ...SWLS_GROWTH_BANK,
  ...SWLS_MEANING_BANK,
  ...SWLS_DAILY_BANK,
].map(q => q.id);

// =====================================================================
// 维度题号集合 (供 scoring service 使用)
export const SWLS_DIMENSION_ITEMS: Record<string, string[]> = {
  satisfaction: SWLS_QUESTIONS.map(q => q.id),
  relationships: SWLS_RELATIONSHIPS_BANK.map(q => q.id),
  health: SWLS_HEALTH_BANK.map(q => q.id),
  achievement: SWLS_ACHIEVEMENT_BANK.map(q => q.id),
  growth: SWLS_GROWTH_BANK.map(q => q.id),
  meaning: SWLS_MEANING_BANK.map(q => q.id),
  daily: SWLS_DAILY_BANK.map(q => q.id),
};
// 严重度 (按 Diener 1985 + Pavot & Diener 1993, 比例缩放至 40 题版 max=266)
// 原始 5-9/10-14/15-19/20-24/25-29/30-35 缩放为 38-72/73-108/109-144/145-184/185-220/221-266
export const SWLS_SEVERITY = {
  veryLow: {
    level: 'veryLow',
    label: '极不满意',
    range: [38, 72] as [number, number],
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
    range: [73, 108] as [number, number],
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
    range: [109, 144] as [number, number],
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
    range: [145, 184] as [number, number],
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
    range: [185, 220] as [number, number],
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
    range: [221, 266] as [number, number],
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

// 与 IntroPage 一致的严重度列表(供 IntroPage 渲染)
export const SWLS_LEVELS = {
  veryLow: SWLS_SEVERITY.veryLow,
  low: SWLS_SEVERITY.low,
  slightlyLow: SWLS_SEVERITY.slightlyLow,
  average: SWLS_SEVERITY.average,
  high: SWLS_SEVERITY.high,
  veryHigh: SWLS_SEVERITY.veryHigh,
};

// 详细解读维度 (Diener 多维子分)
// 注意: title/description 在 UI 中由当前 level 动态注入,这里只保留
// strengths/challenges 列表,避免与 SWLS_SEVERITY 中 6 档 label 冲突
export const SWLS_INTERPRETATION = {
  high: {
    strengths: ['内在标准与现实高度匹配', '对生活有清晰的目标感和意义感', '具备较强的心理调节能力'],
  },
  low: {
    strengths: ['对自己诚实的态度本身就是改变的开始', '认知觉察能力较好,识别出问题'],
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
