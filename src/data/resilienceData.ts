import { Assessment, Question } from '../types';

/**
 * CD-RISC-10 — Connor-Davidson Resilience Scale (10-item short form)
 *
 * 理论基础 (Theoretical basis)
 * ─────────────────────────────
 * 由 Kathryn M. Connor 和 Jonathan R. T. Davidson (2003) 在
 * Journal of Traumatic Stress 上发表,是 CD-RISC-25 完整版的简化版本。
 * 10 题涵盖心理韧性的核心构念,被广泛用于临床和普通人群,信效度
 * (Cronbach α ≈ 0.85) 与 25 题版相当,执行时间大幅缩短。
 *
 * 心理韧性 (resilience) 的 5 个核心维度(Connor & Davidson 2003):
 *
 *   1. 适应性 (Adaptability)        — 应对变化的能力
 *   2. 关系性 (Relationships)        — 亲密、安全的人际连接
 *   3. 意义感 (Meaning / Purpose)    — 信念、目标感
 *   4. 自我效能 (Self-efficacy)      — 应对挑战的自信
 *   5. 乐观 / 接纳 (Optimism)        — 看到积极面、不轻易放弃
 *
 * 量表结构
 * ─────────
 * 10 题,0-4 李克特量表 (0=完全不是这样, 1=很少, 2=有时, 3=经常, 4=几乎总是)。
 * 全部同向计分,无反向题。范围 0 ~ 40。
 *
 * 严重度 (按中国常模 + 西方分界点综合):
 *   0 - 19  : 韧性较低
 *   20 - 23  : 韧性偏低
 *   24 - 28  : 韧性中等
 *   29 - 32  : 韧性较高
 *   33 - 40  : 韧性很高
 */

export const RESILIENCE_ASSESSMENT: Assessment = {
  id: 'resilience-cdrisc',
  title: '心理韧性量表 (CD-RISC-10)',
  description:
    '基于 Connor & Davidson 2003 年编制的《心理韧性量表》简化版 (CD-RISC-10) 的完整 10 题,评估你在面对压力、变化和逆境时的心理复原力。',
  category: '生活',
  totalQuestions: 10,
  icon: '🌱',
  difficulty: '简单',
  estimatedTime: '3 分钟',
};

export const RESILIENCE_RESPONSE_OPTIONS = [
  { value: 0, label: '完全不是这样' },
  { value: 1, label: '很少这样' },
  { value: 2, label: '有时这样' },
  { value: 3, label: '经常这样' },
  { value: 4, label: '几乎总是这样' },
];

// CD-RISC-10 完整 10 题 — 严格按 Connor & Davidson 2003 原文措辞翻译
// 维度分配:
//   adaptability: 1, 4
//   relationships: 2
//   meaning: 9, 10
//   selfEfficacy: 5, 8
//   optimism: 3, 6, 7
export const RESILIENCE_QUESTIONS: Question[] = [
  // adaptability
  {
    id: 'cdr1',
    text: '我能适应变化 (I am able to adapt when changes occur)',
    trait: 'adaptability',
    reverse: false,
  },
  // relationships
  {
    id: 'cdr2',
    text: '我有亲密、安全的关系 (I have at least one close and secure relationship)',
    trait: 'relationships',
    reverse: false,
  },
  // optimism (信念 / 命运)
  {
    id: 'cdr3',
    text: '有时我求助于命运或上帝 (Sometimes fate or God can help me)',
    trait: 'optimism',
    reverse: false,
  },
  // adaptability
  {
    id: 'cdr4',
    text: '无论发生什么,我都能应付 (I can deal with whatever comes my way)',
    trait: 'adaptability',
    reverse: false,
  },
  // selfEfficacy
  {
    id: 'cdr5',
    text: '过去的成功给了我面对新挑战的信心 (Past successes give me confidence to handle new challenges)',
    trait: 'selfEfficacy',
    reverse: false,
  },
  // optimism
  {
    id: 'cdr6',
    text: '我能看到事情幽默的一面 (I try to see the humorous side of things)',
    trait: 'optimism',
    reverse: false,
  },
  // optimism (成长)
  {
    id: 'cdr7',
    text: '应对压力使我变得更强 (Coping with stress strengthens me)',
    trait: 'optimism',
    reverse: false,
  },
  // selfEfficacy
  {
    id: 'cdr8',
    text: '经历艰难之后,我会很快恢复 (I tend to bounce back after illness or hardship)',
    trait: 'selfEfficacy',
    reverse: false,
  },
  // meaning
  {
    id: 'cdr9',
    text: '我觉得我能实现自己的目标 (I believe I can achieve my goals)',
    trait: 'meaning',
    reverse: false,
  },
  // meaning
  {
    id: 'cdr10',
    text: "即使看起来没有希望,我也不会放弃 (Even when things look hopeless, I don't give up)",
    trait: 'meaning',
    reverse: false,
  },
];

// 维度题号集合
export const RESILIENCE_DIMENSION_ITEMS: Record<
  'adaptability' | 'relationships' | 'meaning' | 'selfEfficacy' | 'optimism',
  string[]
> = {
  adaptability: ['cdr1', 'cdr4'],
  relationships: ['cdr2'],
  meaning: ['cdr9', 'cdr10'],
  selfEfficacy: ['cdr5', 'cdr8'],
  optimism: ['cdr3', 'cdr6', 'cdr7'],
};

// 严重度
export const RESILIENCE_SEVERITY = {
  veryLow: {
    level: 'veryLow',
    label: '韧性较低',
    range: [0, 19] as [number, number],
    color: 'red',
    description:
      '你的心理韧性目前较低,在面对压力、变化和挫折时可能会感到难以承受或恢复缓慢。韧性是可以培养的能力,从小的支持系统建立开始是有效的路径。',
    advice: [
      '识别一位可信任的人,作为"困难时的第一个电话"',
      '从微小、确定的成功开始,积累"我能行"的体验',
      '避免在压力期做重大决定,先稳定基本生活节奏',
      '如果持续感到难以应对,建议寻求专业心理支持',
    ],
  },
  low: {
    level: 'low',
    label: '韧性偏低',
    range: [20, 23] as [number, number],
    color: 'orange',
    description:
      '你的韧性在平均水平以下,具备一定的应对能力但在高压下可能仍会感到吃力。识别你韧性中的"短板"维度,针对性补强。',
    advice: [
      '检查最弱维度:是关系、意义、还是自我效能?',
      '建立至少 1 个稳定的支持性关系',
      '练习"如果-那么"计划,降低对未知的焦虑',
      '记录过去成功度过困难的 3 件事,作为资源库',
    ],
  },
  moderate: {
    level: 'moderate',
    label: '韧性中等',
    range: [24, 28] as [number, number],
    color: 'yellow',
    description:
      '你具备基本水平的心理韧性,大部分日常压力可以应对,但面对重大挫折时仍可能需要时间恢复。继续加强优势维度。',
    advice: [
      '保持规律运动,这是韧性最稳定的生理基础',
      '扩展你的"应对工具箱":冥想、写作、运动等',
      '主动寻求适度的挑战,锻炼"我可以"的经验',
    ],
  },
  high: {
    level: 'high',
    label: '韧性较高',
    range: [29, 32] as [number, number],
    color: 'emerald',
    description:
      '你具备较强的心理韧性,面对压力时能较快调整和恢复,且能从中学习和成长。这是心理健康的有力保障。',
    advice: [
      '保持现有的支持网络与健康习惯',
      '在状态好时主动帮助他人,这种给予会反哺自身韧性',
      '把韧性看作"可以锻造的肌肉",继续刻意练习',
    ],
  },
  veryHigh: {
    level: 'veryHigh',
    label: '韧性很强',
    range: [33, 40] as [number, number],
    color: 'green',
    description:
      '你拥有很强的心理韧性,面对逆境时不仅能恢复,还能成长。文献显示高韧性显著预测较低的心理症状风险。',
    advice: [
      '把自己的韧性经验提炼为方法论,可以帮助他人',
      '在自身状态好时为可能的低潮做"心理储备"',
      '保持谦逊 — 韧性不是免疫,只是更好的恢复能力',
    ],
  },
};

// 维度说明
export const RESILIENCE_DIMENSIONS = {
  adaptability: {
    name: '适应性',
    nameEn: 'Adaptability',
    description: '面对变化时灵活调整的能力。',
    highTip: '你面对变化能保持开放,这是韧性的基础。',
    lowTip: '你可能对变化更敏感,可以从"小步尝试"开始。',
  },
  relationships: {
    name: '关系支持',
    nameEn: 'Relationships',
    description: '你是否有亲密、安全的人际连接。',
    highTip: '你有可依靠的亲密关系,这是韧性最稳定的来源。',
    lowTip: '值得主动投入一个可以信任的关系,这能显著提升韧性。',
  },
  meaning: {
    name: '意义与目标',
    nameEn: 'Meaning & Purpose',
    description: '你对自己目标的信念和在逆境中不放弃的意愿。',
    highTip: '你对自己的目标有清晰的信念,这是最强的内部力量。',
    lowTip: '你可能在长期目标上感到迷茫,值得重新探索"我想要什么"。',
  },
  selfEfficacy: {
    name: '自我效能',
    nameEn: 'Self-Efficacy',
    description: '你相信自己能应对挑战的程度。',
    highTip: '你有较强的"我能行"信念,这种自我效能能直接预测韧性表现。',
    lowTip: '你可能低估了自己的能力,值得系统地记录过去的成功。',
  },
  optimism: {
    name: '乐观 / 接纳',
    nameEn: 'Optimism & Acceptance',
    description: '你看到事物积极面、接受压力为成长部分的程度。',
    highTip: '你能用成长的眼光看待压力,这是高韧性的标志。',
    lowTip: '你可能对压力过于警惕,值得练习"积极重构"。',
  },
};

// 提升策略
export const RESILIENCE_BOOST_STRATEGIES = {
  immediate: [
    '识别过去 3 个你成功应对的困难,作为"我有韧性"的证据',
    '找到 1 位可倾诉的人,把压力说出来(语言化即减压)',
    '保证今天的基本需求:睡眠、饮食、运动各 1 项',
  ],
  weekly: [
    '每周 3 次、每次 30 分钟有氧运动',
    '每周 1 次与重要的人深入交流',
    '每周 1 次写下 3 件感恩的事',
  ],
  monthly: [
    '回顾 1 次过去 1 个月,识别最有效的应对方式',
    '尝试 1 次新的、适度的挑战,扩展"我可以"的经验',
    '调整至少 1 个长期目标,让它更符合你现在的价值观',
  ],
  longTerm: [
    '建立"积极心理学 + 正念"的持续练习',
    '必要时寻求心理咨询,建立结构化的支持',
    '把韧性视为终身技能,而非天赋',
  ],
};
