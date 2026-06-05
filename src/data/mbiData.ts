import { Assessment, Question } from '../types';

/**
 * MBI-GS — Maslach Burnout Inventory General Survey
 *
 * 理论基础 (Theoretical basis)
 * ─────────────────────────────
 * 由 Christina Maslach 与 Susan E. Jackson (1981) 编制,经多轮修订形成
 * MBI-GS (1996) 通用版,适用于所有职业人群,而不仅限于助人行业。
 *
 * 三维度结构 (Three-factor model):
 *
 *   1. 情感耗竭 (Emotional Exhaustion, EX) — 来自工作的情绪/生理疲惫
 *   2. 犬儒主义 / 去人格化 (Cynicism, CY) — 对工作意义的疏离与冷漠
 *   3. 职业效能 (Professional Efficacy, PE) — 对自己工作能力的自信
 *      (PE 是 MBI 中唯一的"积极"维度,高分代表低倦怠)
 *
 * 三者共同构成职业倦怠的核心:能量耗竭 + 意义抽离 + 低自我效能。
 *
 * 量表结构
 * ─────────
 * 15 题 + 1 题缓冲 (16 题),0-6 频率量表 (0=从未, 6=每天)。
 *   - EX: 5 题 (1-5)
 *   - CY: 4 题 (6-9)
 *   - PE: 6 题 (10-15), 反向计分 — 高分 = 低倦怠
 *
 * 分数计算 (按 Maslach 1996 标准):
 *   - EX 原始分: 0-30
 *   - CY 原始分: 0-24
 *   - PE 原始分: 0-36
 *   - 综合倦怠分 (MBI Total): (EX + CY + (36-PE)) / 3, 范围 0-30
 *
 * 严重度:
 *   EX 高倦怠: ≥ 15 (中 ≥11, 低 ≥6)
 *   CY 高倦怠: ≥ 8  (中 ≥5, 低 ≥3)
 *   PE 低效能: ≤ 24 (中 ≤29, 高 ≥30)
 *   综合 MBI ≥ 12: 中重度倦怠
 */

export const MBI_ASSESSMENT: Assessment = {
  id: 'mbi-burnout',
  title: '职业倦怠量表 (MBI-GS)',
  description:
    '基于 Maslach Burnout Inventory - General Survey (MBI-GS) 的 15 题专业版本,评估你当前在工作中的情感耗竭、犬儒主义(去人格化)与职业效能感,识别职业倦怠的早期信号。',
  category: '职业',
  totalQuestions: 15,
  icon: '🔥',
  difficulty: '中等',
  estimatedTime: '5 分钟',
};

export const MBI_RESPONSE_OPTIONS = [
  { value: 0, label: '从未' },
  { value: 1, label: '每年几次' },
  { value: 2, label: '每月一次或更少' },
  { value: 3, label: '每月几次' },
  { value: 4, label: '每周一次' },
  { value: 5, label: '每周几次' },
  { value: 6, label: '每天' },
];

// MBI-GS 完整 15 题 — 严格按 Maslach & Jackson 1996 General Survey 原文措辞
// 维度分配:1-5 EX, 6-9 CY, 10-15 PE
export const MBI_QUESTIONS: Question[] = [
  // ========== 维度 1: 情感耗竭 (Exhaustion) ==========
  {
    id: 'mbi1',
    text: '工作让我感到身心俱疲 (Emotional exhaustion)',
    trait: 'exhaustion',
    reverse: false,
  },
  {
    id: 'mbi2',
    text: '一天工作结束后我感觉精疲力竭',
    trait: 'exhaustion',
    reverse: false,
  },
  {
    id: 'mbi3',
    text: '早上起床时想到要面对一天的工作就感到疲惫',
    trait: 'exhaustion',
    reverse: false,
  },
  {
    id: 'mbi4',
    text: '整天工作对我来说确实压力很大',
    trait: 'exhaustion',
    reverse: false,
  },
  {
    id: 'mbi5',
    text: '工作让我感觉快要崩溃了',
    trait: 'exhaustion',
    reverse: false,
  },

  // ========== 维度 2: 犬儒主义 / 去人格化 (Cynicism) ==========
  {
    id: 'mbi6',
    text: '我对工作越来越不感兴趣',
    trait: 'cynicism',
    reverse: false,
  },
  {
    id: 'mbi7',
    text: '我对工作不再像以前那样投入了',
    trait: 'cynicism',
    reverse: false,
  },
  {
    id: 'mbi8',
    text: '我开始质疑自己的工作是否真的有意义',
    trait: 'cynicism',
    reverse: false,
  },
  {
    id: 'mbi9',
    text: '我对自己工作的价值感到怀疑',
    trait: 'cynicism',
    reverse: false,
  },

  // ========== 维度 3: 职业效能 (Professional Efficacy) — 反向 ==========
  {
    id: 'mbi10',
    text: '我能有效地解决工作中出现的问题',
    trait: 'efficacy',
    reverse: true, // 高分 = 高自我效能 (低倦怠)
  },
  {
    id: 'mbi11',
    text: '我觉得我在为单位做出有用的贡献',
    trait: 'efficacy',
    reverse: true,
  },
  {
    id: 'mbi12',
    text: '在我看来,我擅长于自己的工作',
    trait: 'efficacy',
    reverse: true,
  },
  {
    id: 'mbi13',
    text: '我完成了很多有价值的工作',
    trait: 'efficacy',
    reverse: true,
  },
  {
    id: 'mbi14',
    text: '我自信自己能有效地完成各项工作',
    trait: 'efficacy',
    reverse: true,
  },
  {
    id: 'mbi15',
    text: '我能够创造一个轻松、开放的工作氛围',
    trait: 'efficacy',
    reverse: true,
  },
];

// 维度题号集合
export const MBI_DIMENSION_ITEMS: Record<'exhaustion' | 'cynicism' | 'efficacy', string[]> = {
  exhaustion: ['mbi1', 'mbi2', 'mbi3', 'mbi4', 'mbi5'],
  cynicism: ['mbi6', 'mbi7', 'mbi8', 'mbi9'],
  efficacy: ['mbi10', 'mbi11', 'mbi12', 'mbi13', 'mbi14', 'mbi15'],
};

// 严重度 (按维度分别,综合采用 EX+CY 的 MBI 倦怠指数)
export const MBI_SEVERITY = {
  low: {
    level: 'low',
    label: '轻度倦怠',
    range: [0, 11] as [number, number],
    color: 'green',
    description:
      '你目前没有明显的职业倦怠信号,工作热情和自我效能都处于良好状态。继续保持健康的边界与意义感。',
  },
  moderate: {
    level: 'moderate',
    label: '中度倦怠',
    range: [12, 17] as [number, number],
    color: 'yellow',
    description:
      '你开始出现一些倦怠的早期信号,如精力下降或工作意义感减弱,值得在近期进行主动调整。',
  },
  high: {
    level: 'high',
    label: '高度倦怠',
    range: [18, 22] as [number, number],
    color: 'orange',
    description:
      '你已处于明显的职业倦怠状态,情绪、认知与效能都受到不同程度的影响,需要认真做出调整。',
  },
  severe: {
    level: 'severe',
    label: '重度倦怠',
    range: [23, 30] as [number, number],
    color: 'red',
    description:
      '你目前处于严重职业倦怠,可能伴随身心健康风险,强烈建议尽快采取系统性干预,必要时寻求专业帮助。',
  },
};

// 单维度严重度 (per-dimension)
export const MBI_DIMENSION_LEVELS = {
  exhaustion: {
    low: { range: [0, 5] as [number, number], label: '低', color: 'green' },
    moderate: { range: [6, 10] as [number, number], label: '中', color: 'yellow' },
    high: { range: [11, 14] as [number, number], label: '高', color: 'orange' },
    severe: { range: [15, 30] as [number, number], label: '极高', color: 'red' },
  },
  cynicism: {
    low: { range: [0, 2] as [number, number], label: '低', color: 'green' },
    moderate: { range: [3, 4] as [number, number], label: '中', color: 'yellow' },
    high: { range: [5, 7] as [number, number], label: '高', color: 'orange' },
    severe: { range: [8, 24] as [number, number], label: '极高', color: 'red' },
  },
  // efficacy 是反向 — 高分 = 健康
  efficacy: {
    high: { range: [30, 36] as [number, number], label: '高', color: 'green' },
    moderate: { range: [25, 29] as [number, number], label: '中', color: 'yellow' },
    low: { range: [20, 24] as [number, number], label: '低', color: 'orange' },
    veryLow: { range: [0, 19] as [number, number], label: '极低', color: 'red' },
  },
};

// 维度说明
export const MBI_DIMENSIONS = {
  exhaustion: {
    name: '情感耗竭',
    nameEn: 'Emotional Exhaustion',
    description: '工作带给你的情绪与生理疲惫感。',
    highTip: '你已经因为工作消耗了大量身心能量,需要安排真正的休息和恢复。',
    lowTip: '你的能量水平较好,工作没有过度榨取你。',
  },
  cynicism: {
    name: '犬儒主义 / 去人格化',
    nameEn: 'Cynicism',
    description: '你与工作的心理距离、对工作意义的疏离。',
    highTip: '你正在对工作产生疏离感,值得重新审视什么对你是真正重要的。',
    lowTip: '你与工作保持健康的连接,仍然能在其中看到意义。',
  },
  efficacy: {
    name: '职业效能感',
    nameEn: 'Professional Efficacy',
    description: '你对自己完成工作能力的自信与自我评价。',
    highTip: '你对自己有清晰的胜任感,这种自我效能是抵抗倦怠的最好疫苗。',
    lowTip: '你怀疑自己的工作能力,这种自我怀疑会放大倦怠。',
  },
};

// 应对策略
export const MBI_COPING_STRATEGIES = {
  immediate: [
    '安排一次真正的"无工作"休假,断开工作消息提醒',
    '保证 7-9 小时睡眠和规律运动,先恢复基本能量',
    '列出最近让你产生意义感的小事,作为"燃料"',
  ],
  work: [
    '和上级沟通工作边界,明确下班后的不可联系时段',
    '拆分大型任务为小步骤,获得完成感反馈',
    '与同事建立互助支持网络,减少孤立感',
    '把"完美标准"调整为"足够好"标准',
  ],
  cognitive: [
    '识别"全有或全无"的思维模式,记录反例',
    '区分"应该"与"想要",识别过度的内在要求',
    '把工作放在生活的大图景中,而非生命的全部',
  ],
  professional: [
    '如果持续 4 周以上,建议做心理咨询或员工援助计划 (EAP)',
    '认知行为疗法 (CBT) 对职业倦怠有强证据支持',
    '正念减压 (MBSR) 8 周课程对情感耗竭有显著效果',
  ],
};
