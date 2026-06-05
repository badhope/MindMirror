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
    '基于 Connor & Davidson 2003 年编制的《心理韧性量表》简化版 (CD-RISC-10) 的完整 10 题,评估你在面对压力、变化和逆境时的心理复原力。题库扩展至 40 题,覆盖适应性/关系/意义/自我效能/乐观五大子维度,提供更细颗粒度的韧性画像。',
  category: '生活',
  totalQuestions: 40, // 10 道原量表 + 3 道行为延伸 + 27 道题库扩展
  icon: '🌱',
  difficulty: '简单',
  estimatedTime: '11 分钟',
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

// =====================================================================
// 行为情景分歧题 (3 道) — 延伸项
// 设计目的: CD-RISC 原量表"我能适应/我能应付"类题目社会赞许性严重,
//   用具体行为锚定 + 反事实情景, 揭示真实韧性水平
// 注: 不计入原量表分, 生成「行为分歧画像」附加报告
// =====================================================================

export const RESILIENCE_EXTENSION_QUESTIONS: Question[] = [
  {
    id: 'cdr11',
    text: '过去 6 个月, 当您经历重大挫折 (失业/分手/重病/重大失败) 时, 您最贴近的反应是:',
    trait: 'extension',
    // 0: 主动寻求专业帮助 (求助型, 资源利用)
    // 1: 向家人/朋友倾诉 (关系求助)
    // 2: 独自消化, 慢慢调整 (内化型)
    // 3: 转移注意力 (运动/工作/娱乐) (逃避型)
    // 4: 不知道该怎么办 (迷茫型)
    reverse: false,
  },
  {
    id: 'cdr12',
    text: '假设您的核心项目 (工作/学业/创业) 彻底失败, 您:',
    trait: 'extension',
    // 0: 很快开始新的尝试 (快速反弹)
    // 1: 休息一段时间再重新出发 (反思后重启)
    // 2: 怀疑自己的能力但坚持 (韧性动摇)
    // 3: 重新评估人生方向 (意义重塑)
    // 4: 不知道该怎么办 (韧性崩溃)
    reverse: false,
  },
  {
    id: 'cdr13',
    text: '面对未来 1 年的重大不确定性 (健康/经济/关系), 您最贴近的反应是:',
    trait: 'extension',
    // 0: 制定详细计划逐步执行 (控制型)
    // 1: 准备多个备选方案 (灵活型)
    // 2: 顺其自然不强求 (接纳型)
    // 3: 寻求他人建议 (协作型)
    // 4: 感到焦虑但不知道怎么办 (焦虑型)
    reverse: false,
  },
];

// =====================================================================
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

// =====================================================================
// 题库扩展题 (27 道) — 五子维度均衡扩充,提供更细颗粒度的韧性画像
// 设计原则:
//   - 同子维度追加 (不破坏五因子结构)
//   - 行为锚定 + 反向题,降低"我能应付"社会赞许性偏差
//   - 区分高韧性 vs 假装韧性
//   - 高区分度,让真实韧性差异拉开
// 注: 与原 10 题使用同一 0-4 量表,同子维度累加进入总分
// =====================================================================

// 适应性题库 (6 道, cdr14-cdr19)
export const RESILIENCE_ADAPTABILITY_BANK: Question[] = [
  {
    id: 'cdr14',
    text: '当计划被打乱时, 我能快速调整并找到新的方向',
    trait: 'adaptability',
    reverse: false,
  },
  {
    id: 'cdr15',
    text: '面对陌生环境, 我能较快进入状态',
    trait: 'adaptability',
    reverse: false,
  },
  {
    id: 'cdr16',
    text: '当规则改变时, 我能快速学习并适应新规则',
    trait: 'adaptability',
    reverse: false,
  },
  {
    id: 'cdr17',
    text: '我经常因为一点小变化就手足无措 (反向)',
    trait: 'adaptability',
    reverse: true,
  },
  {
    id: 'cdr18',
    text: '我能同时处理多个变化或任务, 不至于崩溃',
    trait: 'adaptability',
    reverse: false,
  },
  {
    id: 'cdr19',
    text: '面对突发的坏消息, 我能较快地稳住情绪',
    trait: 'adaptability',
    reverse: false,
  },
];

// 关系支持题库 (5 道, cdr20-cdr24)
export const RESILIENCE_RELATIONSHIPS_BANK: Question[] = [
  {
    id: 'cdr20',
    text: '我有可以依靠的朋友 / 家人, 在我困难时会真的伸出援手',
    trait: 'relationships',
    reverse: false,
  },
  {
    id: 'cdr21',
    text: '我愿意在脆弱时向亲近的人表达真实感受',
    trait: 'relationships',
    reverse: false,
  },
  {
    id: 'cdr22',
    text: '我身边的人在成功后, 会真心地为我高兴',
    trait: 'relationships',
    reverse: false,
  },
  {
    id: 'cdr23',
    text: '我经常觉得自己是孤身一人, 没人真正懂我 (反向)',
    trait: 'relationships',
    reverse: true,
  },
  {
    id: 'cdr24',
    text: '我能从一段破裂的关系中走出来, 并开始相信新的关系',
    trait: 'relationships',
    reverse: false,
  },
];

// 意义与目标题库 (6 道, cdr25-cdr30)
export const RESILIENCE_MEANING_BANK: Question[] = [
  {
    id: 'cdr25',
    text: '我清楚自己未来 3-5 年想成为什么样的人',
    trait: 'meaning',
    reverse: false,
  },
  {
    id: 'cdr26',
    text: '即使在最难的时候, 我也相信困境里有我可以学到的东西',
    trait: 'meaning',
    reverse: false,
  },
  {
    id: 'cdr27',
    text: '我做的事里, 至少有一件和"比我自己更大"的东西有关',
    trait: 'meaning',
    reverse: false,
  },
  {
    id: 'cdr28',
    text: '我经常觉得日复一日, 不知道到底为什么而活 (反向)',
    trait: 'meaning',
    reverse: true,
  },
  {
    id: 'cdr29',
    text: '我相信自己的坚持最终会带来意义',
    trait: 'meaning',
    reverse: false,
  },
  {
    id: 'cdr30',
    text: '面对长期困境, 我能找到让自己继续下去的理由',
    trait: 'meaning',
    reverse: false,
  },
];

// 自我效能题库 (5 道, cdr31-cdr35)
export const RESILIENCE_SELF_EFFICACY_BANK: Question[] = [
  {
    id: 'cdr31',
    text: '面对没做过的事, 我相信自己能学会',
    trait: 'selfEfficacy',
    reverse: false,
  },
  {
    id: 'cdr32',
    text: '当事情进展不顺时, 我通常能找到至少一种新的尝试',
    trait: 'selfEfficacy',
    reverse: false,
  },
  {
    id: 'cdr33',
    text: '我经常怀疑自己是否能处理真正的难题 (反向)',
    trait: 'selfEfficacy',
    reverse: true,
  },
  {
    id: 'cdr34',
    text: '我能在压力下保持清晰的判断',
    trait: 'selfEfficacy',
    reverse: false,
  },
  {
    id: 'cdr35',
    text: '过去 1 年, 我至少一次独立解决了原本以为做不到的难题',
    trait: 'selfEfficacy',
    reverse: false,
  },
];

// 乐观 / 接纳题库 (5 道, cdr36-cdr40)
export const RESILIENCE_OPTIMISM_BANK: Question[] = [
  {
    id: 'cdr36',
    text: '我能在压力里看到积极的一面, 不被负面吞没',
    trait: 'optimism',
    reverse: false,
  },
  {
    id: 'cdr37',
    text: '我相信大多数事情会向好的方向发展',
    trait: 'optimism',
    reverse: false,
  },
  {
    id: 'cdr38',
    text: '失败后, 我能较快地把这次经历转化为学习',
    trait: 'optimism',
    reverse: false,
  },
  {
    id: 'cdr39',
    text: '我经常预想最坏的结果, 让自己很难放松 (反向)',
    trait: 'optimism',
    reverse: true,
  },
  {
    id: 'cdr40',
    text: '我相信"痛苦是暂时的, 我会走出来"',
    trait: 'optimism',
    reverse: false,
  },
];

// 题库题号集合
export const RESILIENCE_BANK_ITEMS: Record<
  'adaptability' | 'relationships' | 'meaning' | 'selfEfficacy' | 'optimism',
  string[]
> = {
  adaptability: RESILIENCE_ADAPTABILITY_BANK.map(q => q.id),
  relationships: RESILIENCE_RELATIONSHIPS_BANK.map(q => q.id),
  meaning: RESILIENCE_MEANING_BANK.map(q => q.id),
  selfEfficacy: RESILIENCE_SELF_EFFICACY_BANK.map(q => q.id),
  optimism: RESILIENCE_OPTIMISM_BANK.map(q => q.id),
};

// 严重度 (按 Connor & Davidson 2003 + 中国常模, 比例缩放至 40 题 max=148)
// 原始 0-19/20-23/24-28/29-32/33-40 缩放为 0-70/71-85/86-103/104-118/119-148
export const RESILIENCE_SEVERITY = {
  veryLow: {
    level: 'veryLow',
    label: '韧性较低',
    range: [0, 70] as [number, number],
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
    range: [71, 85] as [number, number],
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
    range: [86, 103] as [number, number],
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
    range: [104, 118] as [number, number],
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
    range: [119, 148] as [number, number],
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

// 与 IntroPage 一致的严重度列表(供 IntroPage 渲染)
export const RESILIENCE_LEVELS = {
  veryLow: RESILIENCE_SEVERITY.veryLow,
  low: RESILIENCE_SEVERITY.low,
  moderate: RESILIENCE_SEVERITY.moderate,
  high: RESILIENCE_SEVERITY.high,
  veryHigh: RESILIENCE_SEVERITY.veryHigh,
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
