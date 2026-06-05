import { Assessment, Question } from '../types';

/**
 * 社会支持评定量表 SSRS (Social Support Rating Scale)
 *
 * 理论基础 (Theoretical basis)
 * ─────────────────────────────
 * 由中国湖南医科大学肖水源 (1986) 在《心理卫生评定量表手册》中正式发表,
 * 是中国本土最常使用的社会支持测量工具,被多项社会心理研究引用。
 * 理论基础来自社会支持 (social support) 的多维结构模型:
 *
 *   1. 客观支持 (Objective Support) — 个人实际上获得的支持来源和资源
 *      (家人、亲戚、同事、朋友等的实际帮助)
 *   2. 主观支持 (Subjective Support) — 个人在情感上感受到被支持、被理解
 *      与被尊重的程度
 *   3. 支持利用度 (Support Utilization) — 个人在遇到困难时是否会主动
 *      寻求并使用这些支持
 *
 * 三维度共同预测身心健康,缺失任一维度均与社会功能下降相关。
 *
 * 量表结构
 * ─────────
 * 共 10 题,使用 4 级 / 多级记分。维度归属按肖水源原始记分法:
 *
 *   客观支持 (Objective)   : 2, 6, 7 (3 题, 范围 1-22)
 *   主观支持 (Subjective) : 1, 3, 4, 5 (4 题, 范围 4-16)
 *   利用度 (Utilization)  : 8, 9, 10 (3 题, 范围 3-12)
 *
 * 总分范围 12 ~ 50 (合并维度后),分值越高社会支持越好。
 *
 * 严重度 (Severity) — 参考肖水源 1990 制定的分界点
 * (总分理论范围 8-50,按 4 级/来源数计分可得):
 *
 *   8  - 22 : 低社会支持
 *   23 - 29 : 中等偏低
 *   30 - 44 : 中等
 *   45 - 50 : 高社会支持
 */

export const SSRS_ASSESSMENT: Assessment = {
  id: 'social-support',
  title: '社会支持评定量表 (SSRS)',
  description:
    '基于肖水源 1986 年编制的《社会支持评定量表》(SSRS) 的完整 10 题核心 + 30 题扩展题库 (主观/客观/利用度各 10 题) + 3 道行为情景分歧题, 全面评估你的客观支持、主观支持与支持利用度, 理解你身边的关系网如何成为心理健康的资源。',
  category: '社交',
  totalQuestions: 43, // 10 道原量表 + 30 道扩展题库 + 3 道延伸题
  icon: '🤝',
  difficulty: '中等',
  estimatedTime: '12 分钟',
};

// 选项集合 — 主表 4 点量表
export const SSRS_RESPONSE_OPTIONS = [
  { value: 1, label: '没有 / 完全不符' },
  { value: 2, label: '较少 / 较不符' },
  { value: 3, label: '一般' },
  { value: 4, label: '全力支持 / 符合' },
];

// 客观支持 — 来源数计分专用选项 (items 6, 7)
export const SSRS_SOURCES_OPTIONS = [
  { value: 0, label: '无任何来源' },
  { value: 1, label: '1 个来源' },
  { value: 2, label: '2 个来源' },
  { value: 3, label: '3 个来源' },
  { value: 4, label: '4 个来源' },
  { value: 5, label: '5 个来源' },
  { value: 6, label: '6 个来源' },
  { value: 7, label: '7 个来源' },
  { value: 8, label: '8 个来源' },
  { value: 9, label: '9 个或以上' },
];

// SSRS 完整 10 题 — 严格按肖水源《心理卫生评定量表手册》原文措辞
export const SSRS_QUESTIONS: Question[] = [
  // 主观支持 (4 题) — dimension 'subjective'
  {
    id: 'ssrs1',
    text: '您有多少关系密切、可以得到支持和帮助的朋友?',
    trait: 'subjective',
    // 选项: 1=无, 2=1-2个, 3=3-5个, 4=6个及以上 — 复用主表 4 级
    reverse: false,
  },
  // 客观支持 (3 题) — dimension 'objective'
  {
    id: 'ssrs2',
    text: '近一年来您:(单选,指家庭/同住情况)',
    trait: 'objective',
    // 选项: 1=与家人同住, 2=与人合住, 3=独居一室, 4=其他
    reverse: false,
  },
  {
    id: 'ssrs3',
    text: '您与邻居:',
    trait: 'subjective',
    // 1=相互从不关心, 2=遇到困难可能稍微关心, 3=有些邻居很关心您, 4=大多数邻居很关心您
    reverse: false,
  },
  {
    id: 'ssrs4',
    text: '您与同事:',
    trait: 'subjective',
    // 1=相互从不关心, 2=遇到困难可能稍微关心, 3=有些同事很关心您, 4=大多数同事很关心您
    reverse: false,
  },
  {
    id: 'ssrs5',
    text: '您从家庭成员得到的支持和照顾:',
    trait: 'subjective',
    // 1=无, 2=极少, 3=一般, 4=全力支持
    reverse: false,
  },
  {
    id: 'ssrs6',
    text: '过去在您遇到急难情况时,曾经得到经济支持或解决实际问题的帮助来源有:',
    trait: 'objective',
    // 来源数: 0-9 (使用 SSRS_SOURCES_OPTIONS)
    reverse: false,
  },
  {
    id: 'ssrs7',
    text: '过去在您遇到急难情况时,曾经得到的安慰和关心的来源有:',
    trait: 'objective',
    // 来源数: 0-9
    reverse: false,
  },
  // 利用度 (3 题) — dimension 'utilization'
  {
    id: 'ssrs8',
    text: '您遇到烦恼时的倾诉方式:',
    trait: 'utilization',
    // 1=从不向任何人倾诉, 2=向关系较疏远的人倾诉, 3=如果朋友主动询问会说出来, 4=主动叙述自己的烦恼以获得支持和理解
    reverse: false,
  },
  {
    id: 'ssrs9',
    text: '您遇到烦恼时的求助方式:',
    trait: 'utilization',
    // 1=只靠自己, 2=很少请求别人帮助, 3=有时请求别人帮助, 4=有困难时经常向家人、亲友、组织求援
    reverse: false,
  },
  {
    id: 'ssrs10',
    text: '对于团体(如党组织、宗教组织、工会、学生会等)组织活动,您:',
    trait: 'utilization',
    // 1=从不参加, 2=偶尔参加, 3=经常参加, 4=主动参加并积极活动
    reverse: false,
  },
];

// =====================================================================
// SSRS 扩展题库 (新增 30 题, 覆盖更细粒度的社会支持维度)
// 设计目的: 解决原量表的"地板/天花板"问题, 用更细的题目提高区分度
// 维度保持: subjective / objective / utilization
// =====================================================================

// 主观支持扩展 (10 题) — 用 4 级量表 (1=完全不符 ~ 4=完全符合)
export const SSRS_SUBJECTIVE_BANK: Question[] = [
  {
    id: 'ssrs14',
    text: '您觉得身边有多少人真正了解您的真实想法和感受?',
    trait: 'subjective',
    reverse: false,
  },
  {
    id: 'ssrs15',
    text: '当您分享个人烦恼时, 身边的人会认真倾听吗?',
    trait: 'subjective',
    reverse: false,
  },
  {
    id: 'ssrs16',
    text: '您感到被关心和被尊重的频率?',
    trait: 'subjective',
    reverse: false,
  },
  {
    id: 'ssrs17',
    text: '在您遇到困难时, 身边会有人主动提供帮助吗?',
    trait: 'subjective',
    reverse: false,
  },
  {
    id: 'ssrs18',
    text: '您对现有的人际关系整体感到满意吗?',
    trait: 'subjective',
    reverse: false,
  },
  {
    id: 'ssrs19',
    text: '您身边有多少人是您可以放心展示脆弱面的?',
    trait: 'subjective',
    reverse: false,
  },
  {
    id: 'ssrs20',
    text: '您和亲近的人之间有深度的情感交流吗?',
    trait: 'subjective',
    reverse: false,
  },
  {
    id: 'ssrs21',
    text: '当您取得成就时, 身边有人会真心为您高兴吗?',
    trait: 'subjective',
    reverse: false,
  },
  {
    id: 'ssrs22',
    text: '如果您生病或情绪低落, 有人会主动来探望或问候吗?',
    trait: 'subjective',
    reverse: false,
  },
  {
    id: 'ssrs23',
    text: '您觉得您的家人/朋友真的在乎您的幸福吗?',
    trait: 'subjective',
    reverse: false,
  },
];

// 客观支持扩展 (10 题) — 覆盖实际支持资源和来源数
export const SSRS_OBJECTIVE_BANK: Question[] = [
  {
    id: 'ssrs24',
    text: '您和家人 (父母/配偶/子女) 见面的频率?',
    trait: 'objective',
    // 1=几乎不见, 2=每月, 3=每周, 4=每天
    reverse: false,
  },
  {
    id: 'ssrs25',
    text: '您身边有多少可以借到大额资金 (>=1万) 的亲友?',
    trait: 'objective',
    // 1=0, 2=1, 3=2-3, 4=4+
    reverse: false,
  },
  {
    id: 'ssrs26',
    text: '过去一年, 您在生活中获得实际帮助的来源数 (0-9)',
    trait: 'objective',
    // 使用 SSRS_SOURCES_OPTIONS (0-9)
    reverse: false,
  },
  {
    id: 'ssrs27',
    text: '过去一年, 您在情绪上获得支持的来源数 (0-9)',
    trait: 'objective',
    // 使用 SSRS_SOURCES_OPTIONS (0-9)
    reverse: false,
  },
  {
    id: 'ssrs28',
    text: '您所在的社区/邻里能为您提供生活上的帮助吗?',
    trait: 'objective',
    // 1=完全不能, 2=很少能, 3=有时能, 4=总能
    reverse: false,
  },
  {
    id: 'ssrs29',
    text: '您的工作单位/学校有关心您生活困难的同事/同学吗?',
    trait: 'objective',
    // 1=没有, 2=很少, 3=有一些, 4=很多
    reverse: false,
  },
  {
    id: 'ssrs30',
    text: '如果您临时需要住宿一晚, 您有多少亲友可以投靠?',
    trait: 'objective',
    // 1=0, 2=1, 3=2-3, 4=4+
    reverse: false,
  },
  {
    id: 'ssrs31',
    text: '您是否加入了至少一个社团/兴趣小组/线上社区?',
    trait: 'objective',
    // 1=否, 2=曾经加入但很少参与, 3=加入并偶尔参与, 4=积极活跃参与
    reverse: false,
  },
  {
    id: 'ssrs32',
    text: '您的家庭成员中是否有人可以长期照顾您的生活?',
    trait: 'objective',
    // 1=完全不能, 2=短期可以, 3=基本可以, 4=完全可以
    reverse: false,
  },
  {
    id: 'ssrs33',
    text: '过去一年, 您和家人/朋友一起参加活动 (聚餐/出游) 的次数?',
    trait: 'objective',
    // 1=0次, 2=1-2次, 3=3-5次, 4=6次以上
    reverse: false,
  },
];

// 利用度扩展 (10 题) — 测量用户在需要时是否愿意/能够使用支持
export const SSRS_UTILIZATION_BANK: Question[] = [
  {
    id: 'ssrs34',
    text: '遇到烦恼时, 您会主动找人倾诉吗?',
    trait: 'utilization',
    reverse: false,
  },
  {
    id: 'ssrs35',
    text: '您愿意接受他人主动提供的帮助吗?',
    trait: 'utilization',
    reverse: false,
  },
  {
    id: 'ssrs36',
    text: '您会参加社区/单位的集体活动吗?',
    trait: 'utilization',
    reverse: false,
  },
  {
    id: 'ssrs37',
    text: '当朋友有困难时, 您会主动提供帮助吗?',
    trait: 'utilization',
    reverse: false,
  },
  {
    id: 'ssrs38',
    text: '如果遇到心理困扰, 您愿意使用心理咨询服务吗?',
    trait: 'utilization',
    reverse: false,
  },
  {
    id: 'ssrs39',
    text: '您会主动维护重要的亲友关系 (节日问候/定期联系)?',
    trait: 'utilization',
    reverse: false,
  },
  {
    id: 'ssrs40',
    text: '您会在社交媒体上主动联系久未联系的朋友吗?',
    trait: 'utilization',
    reverse: false,
  },
  {
    id: 'ssrs41',
    text: '如果您生病住院, 您会让亲友知道吗?',
    trait: 'utilization',
    reverse: false,
  },
  {
    id: 'ssrs42',
    text: '您会主动向家人/朋友表达感激之情吗?',
    trait: 'utilization',
    reverse: false,
  },
  {
    id: 'ssrs43',
    text: '当您需要做重要决定时, 您会主动寻求他人意见吗?',
    trait: 'utilization',
    reverse: false,
  },
];

// =====================================================================
// 行为情景分歧题 (3 道) — 延伸项
// 设计目的: 解决原量表的"地板/天花板"问题, 用具体行为场景迫选,
//   让用户无法选择"社会赞许性"答案, 提升区分度
// 注: 这些题不计入 SSRS 原量表总分, 但会生成「行为分歧画像」附加报告
// =====================================================================

// 5 级分歧量表 (0-4), 专为分歧题设计
export const SSRS_EXTENSION_OPTIONS = [
  { value: 0, label: 'A 选' },
  { value: 1, label: 'B 选' },
  { value: 2, label: 'C 选' },
  { value: 3, label: 'D 选' },
  { value: 4, label: 'E 选' },
];

export const SSRS_EXTENSION_QUESTIONS: Question[] = [
  {
    id: 'ssrs11',
    text: '过去一个月, 当您在朋友圈/微博看到朋友分享的好消息 (升职/旅行/表白/获奖) 时, 您最贴近的反应是:',
    trait: 'extension',
    // 0: 内心祝贺但不互动 (内敛)
    // 1: 默默点赞 (低投入)
    // 2: 主动评论+点赞 (常规外联)
    // 3: 评论+私聊继续聊 (深度外联)
    // 4: 主动私信深入交流 (高投入, 但可能打扰)
    reverse: false,
  },
  {
    id: 'ssrs12',
    text: '假设您明天需要搬家 (大量家具/重物), 您的第一反应是:',
    trait: 'extension',
    // 0: 请搬家公司, 不麻烦任何人 (完全自助)
    // 1: 在群里发"求帮忙"信息等回应 (网络求助)
    // 2: 私下联系 1-2 个好朋友 (小范围求助)
    // 3: 请家人/亲戚帮忙 (核心圈求助)
    // 4: 召集好友组团帮忙 (深度关系网)
    reverse: false,
  },
  {
    id: 'ssrs13',
    text: '如果您和一位关系不错的朋友, 因为价值观差异 (政治/宗教/生活方式) 产生分歧, 您的第一反应是:',
    trait: 'extension',
    // 0: 直接表达不同看法 (对抗型)
    // 1: 主动寻找共同点 (修复型)
    // 2: 表面同意但保留意见 (回避型)
    // 3: 避免讨论该话题 (退缩型)
    // 4: 暂时不联系等双方冷静 (断联型)
    reverse: false,
  },
];

// 各维度的题号集合 (供 scoring service 使用)
export const SSRS_DIMENSION_ITEMS: Record<'objective' | 'subjective' | 'utilization', string[]> = {
  objective: ['ssrs2', 'ssrs6', 'ssrs7'],
  subjective: ['ssrs1', 'ssrs3', 'ssrs4', 'ssrs5'],
  utilization: ['ssrs8', 'ssrs9', 'ssrs10'],
};

// 严重度解释
// 注意: 范围已按新总分上限 180 (10 主+30 扩展) 等比放大, 保持原 50 上限的严重度语义
export const SSRS_SEVERITY = {
  low: {
    level: 'low',
    label: '低社会支持',
    range: [29, 80] as [number, number],
    color: 'red',
    description:
      '你当前感知到的社会支持较少,可能缺乏能依靠的人或难以获得实际帮助。这种状态长期持续会影响心理韧性和应对压力的能力,建议主动建立和扩展支持网络。',
    advice: [
      '从一位可信任的亲友开始,尝试定期联系和交流',
      '参加兴趣小组、志愿活动或社群,扩大弱关系',
      '主动学习表达需求,接受帮助不是软弱',
      '必要时寻求心理咨询师协助梳理关系网络',
    ],
  },
  mediumLow: {
    level: 'mediumLow',
    label: '社会支持中等偏低',
    range: [81, 106] as [number, number],
    color: 'orange',
    description:
      '你有一些支持来源,但在某些方面仍有缺口——可能是情感支持,也可能是实际资源或主动利用方面。这种状态下情绪低落时容易感到孤立,值得有意识地加强。',
    advice: [
      '识别自己最缺的是哪一类支持:情感 / 实际 / 利用度',
      '练习更主动地表达需求,允许自己被支持',
      '维系老朋友,每隔一段时间主动联系',
      '尝试加入一个高质量的小型社群',
    ],
  },
  medium: {
    level: 'medium',
    label: '社会支持中等',
    range: [107, 161] as [number, number],
    color: 'emerald',
    description:
      '你拥有较稳定的社会支持网络,大部分时候能感受到他人的关心并加以利用。继续保持主动联系与互惠,这是心理健康的稳定器。',
    advice: [
      '保持和朋友、家人的定期联系',
      '在支持关系中保持互惠,而非单向索取',
      '关注关系质量,而非仅仅数量',
      '在状态良好时主动关怀他人,这能反过来增强你的支持感',
    ],
  },
  high: {
    level: 'high',
    label: '高社会支持',
    range: [162, 180] as [number, number],
    color: 'green',
    description:
      '你拥有丰富且可用的社会支持资源,主观上感到被关心和被支持。研究显示这种状态与较强的心理韧性、较低的抑郁焦虑风险显著相关。',
    advice: [
      '继续保持主动表达感激,让支持者知道他们的存在对你重要',
      '在支持网络中担任联结者,让资源在群体中流动',
      '将支持感转化为对其他需要的人的帮助',
      '当状态变差时,记得自己曾经被支持过,可以相信这一次也有人会陪你度过',
    ],
  },
};

// 与 IntroPage 一致的严重度列表(供 IntroPage 渲染)
export const SSRS_LEVELS = {
  low: SSRS_SEVERITY.low,
  mediumLow: SSRS_SEVERITY.mediumLow,
  medium: SSRS_SEVERITY.medium,
  high: SSRS_SEVERITY.high,
};

// 维度解释
export const SSRS_DIMENSIONS = {
  objective: {
    name: '客观支持',
    nameEn: 'Objective Support',
    description: '你实际拥有的社会支持资源,包括同住者、紧急情况下的实际帮助来源数。',
    highTip: '你有丰富的实际支持来源,在紧急情况时能获得真实帮助。',
    lowTip: '客观支持来源较少,可能因为同住者少或紧急时没有可借力的对象。',
  },
  subjective: {
    name: '主观支持',
    nameEn: 'Subjective Support',
    description: '你主观上感受到的关心、理解和尊重。',
    highTip: '你强烈地感到被关心、被尊重,这是心理健康的重要保护因子。',
    lowTip: '你可能在情感上感到疏离,即使身边有人也难以感到被理解。',
  },
  utilization: {
    name: '支持利用度',
    nameEn: 'Support Utilization',
    description: '你在遇到困难时是否主动寻求并使用已有的支持。',
    highTip: '你善于调动资源,在需要时能主动求助。',
    lowTip: '你可能有支持但不会主动使用,容易独自承担。',
  },
};

// 专业资源
export const SSRS_RESOURCES = {
  whenToSeekHelp: [
    '长期感到孤立或没有可依靠的人',
    '遇到困难时无法向任何人倾诉',
    '因社交回避或退缩而影响工作/学习',
    '因缺乏支持出现持续的低落或焦虑',
  ],
  channels: [
    '心理咨询:帮助你识别支持缺口并练习表达需求',
    '社区资源:居委会、社工、义工组织可拓展弱关系',
    '兴趣社群:读书会、运动小组、线上社区等',
    '专业热线:当你需要即时倾听时',
  ],
};
