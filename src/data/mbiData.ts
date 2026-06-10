import { Assessment, Question } from '../types';

/**
 * MBI-GS(s) — Maslach Burnout Inventory General Survey, Short Form
 *
 * 理论基础 (Theoretical basis)
 * ─────────────────────────────
 * 由 Christina Maslach 与 Susan E. Jackson (1981) 编制,经多轮修订形成
 * MBI-GS (1996) 通用版,适用于所有职业人群,而不仅限于助人行业。
 *
 * 本量表采用 MBI-GS(s) 短版 (Schaufeli et al. 1996, 15 题):
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
 * 15 题,0-6 频率量表 (0=从未, 6=每天)。
 *   - EX: 5 题 (1-5)        → 原始 0-30
 *   - CY: 4 题 (6-9)        → 原始 0-24  (MBI-GS 完整版是 5 题 0-30)
 *   - PE: 6 题 (10-15),反向 → 原始 0-36
 *
 * 分数计算 (按 Schaufeli et al. 1996 + Maslach 1996 标准):
 *   - EX 原始分: 0-30
 *   - CY 原始分: 0-24
 *   - PE 原始分: 0-36
 *   - 综合倦怠分 (MBI Total): (EX + CY + (36-PE)) / 3, 范围 0-30
 *
 * 严重度 (按 Schaufeli 1996 cutoff):
 *   EX 高倦怠: ≥ 15 (中 ≥11, 低 ≥6)
 *   CY 高倦怠: ≥ 8  (中 ≥5, 低 ≥3)
 *   PE 低效能: ≤ 24 (中 ≤29, 高 ≥30)
 *   综合 MBI: < 12 轻度, 12-17 中度, 18-22 高度, ≥ 23 重度
 */

export const MBI_ASSESSMENT: Assessment = {
  id: 'mbi-burnout',
  title: '职业倦怠量表 (MBI-GS)',
  description:
    '基于 Maslach Burnout Inventory - General Survey (MBI-GS) 的 15 题专业版本,评估你当前在工作中的情感耗竭、犬儒主义(去人格化)与职业效能感,识别职业倦怠的早期信号。题库扩充至 40 题,覆盖更细颗粒度的症状维度,降低单题天花板效应。',
  category: '职业',
  totalQuestions: 40, // 15 道原量表 + 3 道行为延伸 + 22 道题库扩展
  icon: '🔥',
  difficulty: '中等',
  estimatedTime: '12 分钟',
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

// =====================================================================
// 行为情景分歧题 (3 道) — 延伸项
// 设计目的: 解决 MBI 原量表的"耗竭同质化"和"效能社会赞许性"问题,
//   用具体工作场景迫选, 反映真实倦怠程度
// 注: 不计入原量表分, 生成「行为分歧画像」附加报告
// =====================================================================

export const MBI_EXTENSION_QUESTIONS: Question[] = [
  {
    id: 'mbi16',
    text: '上周五晚上 8 点, 领导临时通知您周末加班处理紧急项目, 您的第一反应是:',
    trait: 'extension',
    // 0: 没问题配合 (奉献型/可能已麻木)
    // 1: 接受但讨价还价 (边界型)
    // 2: 直接拒绝或要求调休 (强硬型)
    // 3: 接受但心里非常抗拒 (压抑型, 倦怠前兆)
    // 4: 已对工作心灰意冷 (重度倦怠)
    reverse: false,
  },
  {
    id: 'mbi17',
    text: '当您发现一位入职时间比您短的同事获得了您一直想要的晋升机会, 您的第一反应是:',
    trait: 'extension',
    // 0: 真心祝贺并学习对方 (成长型)
    // 1: 失落但很快接受 (韧性型)
    // 2: 质疑晋升的公平性 (犬儒触发)
    // 3: 怀疑自己的价值 (低效能触发)
    // 4: 失去对工作的信任 (深度犬儒)
    reverse: false,
  },
  {
    id: 'mbi18',
    text: '在您参加的 2 小时冗长会议中, 您通常会:',
    trait: 'extension',
    // 0: 保持专注并贡献想法 (高投入)
    // 1: 听讲但偶尔走神 (常规)
    // 2: 同时处理其他工作 (多任务)
    // 3: 觉得在浪费时间但忍耐 (犬儒)
    // 4: 主动提"是否需要缩短" (质疑者)
    reverse: false,
  },
];

// =====================================================================
// 维度题号集合
export const MBI_DIMENSION_ITEMS: Record<'exhaustion' | 'cynicism' | 'efficacy', string[]> = {
  exhaustion: ['mbi1', 'mbi2', 'mbi3', 'mbi4', 'mbi5'],
  cynicism: ['mbi6', 'mbi7', 'mbi8', 'mbi9'],
  efficacy: ['mbi10', 'mbi11', 'mbi12', 'mbi13', 'mbi14', 'mbi15'],
};

// =====================================================================
// 题库扩展题 (22 道) — 同维度追加,提升测量信度并降低天花板/地板效应
// 设计原则:
//   - 同维度追加 (不破坏三因子结构)
//   - 内容覆盖症状"细颗粒度" (生理疲惫 / 睡眠 / 情绪反应 / 行为动机)
//   - 题目措辞差异化,避免与原量表同质
//   - 高区分度, 让真实耗竭者与无耗竭者分数拉开
// 注: 与原 15 题使用同一 0-6 频率量表,同维度累加进入总分
// =====================================================================

// 情感耗竭题库 (7 道, mbi19-mbi25)
export const MBI_EXHAUSTION_BANK: Question[] = [
  {
    id: 'mbi19',
    text: '下班回家后, 我经常累到什么都不想干, 甚至连饭都不想吃',
    trait: 'exhaustion',
    reverse: false,
  },
  {
    id: 'mbi20',
    text: '工作日我常常感到身体被"掏空", 只想一个人待着',
    trait: 'exhaustion',
    reverse: false,
  },
  {
    id: 'mbi21',
    text: '最近我经常半夜醒来, 脑子还在转白天工作的事',
    trait: 'exhaustion',
    reverse: false,
  },
  {
    id: 'mbi22',
    text: '我需要靠咖啡 / 烟 / 提神饮料才能熬过每个工作日',
    trait: 'exhaustion',
    reverse: false,
  },
  {
    id: 'mbi23',
    text: '工作日我几乎没有任何"留给自己"的精力',
    trait: 'exhaustion',
    reverse: false,
  },
  {
    id: 'mbi24',
    text: '我经常感到自己像一个被榨干的电池, 充不进去电',
    trait: 'exhaustion',
    reverse: false,
  },
  {
    id: 'mbi25',
    text: '一提到"上班"这两个字, 我身体就本能地紧张 / 抗拒',
    trait: 'exhaustion',
    reverse: false,
  },
];

// 犬儒主义题库 (6 道, mbi26-mbi31)
export const MBI_CYNICISM_BANK: Question[] = [
  {
    id: 'mbi26',
    text: '我经常觉得自己做的事没什么真正的影响',
    trait: 'cynicism',
    reverse: false,
  },
  {
    id: 'mbi27',
    text: '开会 / 团建时, 我经常在演"积极", 内心其实很疏离',
    trait: 'cynicism',
    reverse: false,
  },
  {
    id: 'mbi28',
    text: '如果同事不配合, 我会冷处理, 不再尝试沟通',
    trait: 'cynicism',
    reverse: false,
  },
  {
    id: 'mbi29',
    text: '我上班更多是"按部就班", 不再期待什么突破',
    trait: 'cynicism',
    reverse: false,
  },
  {
    id: 'mbi30',
    text: '我经常对单位的"价值观宣传"感到讽刺或反感',
    trait: 'cynicism',
    reverse: false,
  },
  {
    id: 'mbi31',
    text: '当同事离职, 我第一反应不是惋惜, 而是"他怎么不早点走"',
    trait: 'cynicism',
    reverse: false,
  },
];

// 职业效能题库 (9 道, mbi32-mbi40)
export const MBI_EFFICACY_BANK: Question[] = [
  {
    id: 'mbi32',
    text: '面对突发任务, 我能冷静地拆解并开始执行',
    trait: 'efficacy',
    reverse: true,
  },
  {
    id: 'mbi33',
    text: '即使在最忙的一天, 我也能保证工作质量不出大问题',
    trait: 'efficacy',
    reverse: true,
  },
  {
    id: 'mbi34',
    text: '我有信心在三个月内解决一个长期困扰我的工作难题',
    trait: 'efficacy',
    reverse: true,
  },
  {
    id: 'mbi35',
    text: '在团队中, 我的专业判断经常被同事采纳',
    trait: 'efficacy',
    reverse: true,
  },
  {
    id: 'mbi36',
    text: '面对不确定的反馈 (领导没回 / 客户没动静), 我能稳得住',
    trait: 'efficacy',
    reverse: true,
  },
  {
    id: 'mbi37',
    text: '我能从一次失败里快速恢复, 不让它影响下一件事',
    trait: 'efficacy',
    reverse: true,
  },
  {
    id: 'mbi38',
    text: '即使别人质疑, 我依然相信自己的专业判断',
    trait: 'efficacy',
    reverse: true,
  },
  {
    id: 'mbi39',
    text: '我能主动识别工作流程中可改进的点并提出方案',
    trait: 'efficacy',
    reverse: true,
  },
  {
    id: 'mbi40',
    text: '过去 1 年, 我至少有一项自己明显成长的工作成果',
    trait: 'efficacy',
    reverse: true,
  },
];

// 题库题号集合(供 scoring service 使用)
export const MBI_BANK_ITEMS: Record<'exhaustion' | 'cynicism' | 'efficacy', string[]> = {
  exhaustion: MBI_EXHAUSTION_BANK.map(q => q.id),
  cynicism: MBI_CYNICISM_BANK.map(q => q.id),
  efficacy: MBI_EFFICACY_BANK.map(q => q.id),
};

// 严重度 (按维度分别,综合采用 EX+CY 的 MBI 倦怠指数)
// 切分点基于 Schaufeli 1996 + 比例缩放到 40 题 (max=74)
// 原始 0-11/12-17/18-22/23-30 缩放为 0-27/28-42/43-54/55-74
export const MBI_SEVERITY = {
  low: {
    level: 'low',
    label: '轻度倦怠',
    range: [0, 27] as [number, number],
    color: 'green',
    description:
      '你目前没有明显的职业倦怠信号,工作热情和自我效能都处于良好状态。继续保持健康的边界与意义感。',
  },
  moderate: {
    level: 'moderate',
    label: '中度倦怠',
    range: [28, 42] as [number, number],
    color: 'yellow',
    description: '你开始出现一些倦怠的早期信号,如精力下降或工作意义感减弱,值得在近期进行主动调整。',
  },
  high: {
    level: 'high',
    label: '高度倦怠',
    range: [43, 54] as [number, number],
    color: 'orange',
    description:
      '你已处于明显的职业倦怠状态,情绪、认知与效能都受到不同程度的影响,需要认真做出调整。',
  },
  severe: {
    level: 'severe',
    label: '重度倦怠',
    range: [55, 74] as [number, number],
    color: 'red',
    description:
      '你目前处于严重职业倦怠,可能伴随身心健康风险,强烈建议尽快采取系统性干预,必要时寻求专业帮助。',
  },
};

// 与 IntroPage 一致的严重度列表(供 IntroPage 渲染)
export const MBI_LEVELS = {
  low: MBI_SEVERITY.low,
  moderate: MBI_SEVERITY.moderate,
  high: MBI_SEVERITY.high,
  severe: MBI_SEVERITY.severe,
};

// 单维度严重度 (per-dimension)
// 切分点比例缩放至新 max: EX=72, CY=60, PE=90
export const MBI_DIMENSION_LEVELS = {
  exhaustion: {
    low: { range: [0, 12] as [number, number], label: '低', color: 'green' },
    moderate: { range: [13, 24] as [number, number], label: '中', color: 'yellow' },
    high: { range: [25, 33] as [number, number], label: '高', color: 'orange' },
    severe: { range: [34, 72] as [number, number], label: '极高', color: 'red' },
  },
  cynicism: {
    low: { range: [0, 5] as [number, number], label: '低', color: 'green' },
    moderate: { range: [6, 10] as [number, number], label: '中', color: 'yellow' },
    high: { range: [11, 17] as [number, number], label: '高', color: 'orange' },
    severe: { range: [18, 60] as [number, number], label: '极高', color: 'red' },
  },
  // efficacy 是反向 — 高分 = 健康
  efficacy: {
    high: { range: [75, 90] as [number, number], label: '高', color: 'green' },
    moderate: { range: [63, 74] as [number, number], label: '中', color: 'yellow' },
    low: { range: [50, 62] as [number, number], label: '低', color: 'orange' },
    veryLow: { range: [0, 49] as [number, number], label: '极低', color: 'red' },
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
