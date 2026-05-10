import type { Answer, Dimension, TraitScore } from '../../types'
import { createProfessionalCalculator } from './BaseProfessionalCalculator'

export const calculateHardiness = createProfessionalCalculator({
  name: 'Hardiness',
  questionPrefix: 'hardiness',
  dimensionKeys: ['commitment', 'control', 'challenge', 'confidence', 'adaptability'],
  dimensionNames: {
    commitment: '投入承诺',
    control: '掌控感',
    challenge: '挑战认知',
    confidence: '自我效能',
    adaptability: '适应性',
  },
  traitsGenerator: (scores, _dimensions): TraitScore[] => {
    const traits: TraitScore[] = []
    const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length

    if (avg > 70) {
      traits.push({ name: '钢铁意志', description: '压不垮的精神韧性', score: 85, maxScore: 100 })
    }
    if (scores.commitment > 75) {
      traits.push({ name: '使命必达', description: '一旦投入就会坚持到底', score: 90, maxScore: 100 })
    }
    if (scores.control > 75) {
      traits.push({ name: '内心舵手', description: '相信自己能够影响事件走向', score: 88, maxScore: 100 })
    }
    return traits
  },
})

export const calculateMindset = createProfessionalCalculator({
  name: 'Mindset',
  questionPrefix: 'mindset',
  dimensionKeys: ['growth', 'challenge', 'effort', 'feedback', 'mistakes'],
  dimensionNames: {
    growth: '成长信念',
    challenge: '挑战态度',
    effort: '努力信念',
    feedback: '反馈态度',
    mistakes: '错误认知',
  },
})

export const calculateMLQ = createProfessionalCalculator({
  name: 'MLQ',
  questionPrefix: 'mlq',
  dimensionKeys: ['idealized', 'inspirational', 'intellectual', 'individualized', 'contingent', 'management'],
  dimensionNames: {
    idealized: '理想化影响力',
    inspirational: '鼓舞动机',
    intellectual: '智力激发',
    individualized: '个性化关怀',
    contingent: '权变奖励',
    management: '例外管理',
  },
})

export function calculateMFT(answers: Answer[]) {
  const foundations = ['care', 'fairness', 'loyalty', 'authority', 'sanctity', 'liberty']
  return createProfessionalCalculator({
    name: 'MFT',
    questionPrefix: 'mft',
    dimensionKeys: foundations,
    dimensionNames: {
      care: '关怀/伤害',
      fairness: '公平/欺骗',
      loyalty: '忠诚/背叛',
      authority: '权威/颠覆',
      sanctity: '圣洁/堕落',
      liberty: '自由/压迫',
    },
  })(answers)
}

export const calculateSDS = createProfessionalCalculator({
  name: 'SDS',
  questionPrefix: 'sds',
  dimensionKeys: ['physiological', 'safety', 'love', 'esteem', 'selfactualization'],
  dimensionNames: {
    physiological: '生理需求',
    safety: '安全需求',
    love: '归属与爱',
    esteem: '尊重需求',
    selfactualization: '自我实现',
  },
})

export const calculatePSS = createProfessionalCalculator({
  name: 'PSS',
  questionPrefix: 'pss',
  dimensionKeys: ['tension', 'control', 'coping', 'lifeevents', 'resilience'],
  dimensionNames: {
    tension: '主观紧张感',
    control: '失控感',
    coping: '应对能力',
    lifeevents: '生活事件',
    resilience: '心理韧性',
  },
})

export const calculatePCQ = createProfessionalCalculator({
  name: 'PCQ',
  questionPrefix: 'pcq',
  dimensionKeys: ['efficacy', 'hope', 'resilience', 'optimism'],
  dimensionNames: {
    efficacy: '自我效能',
    hope: '希望意志',
    resilience: '复原力',
    optimism: '乐观心态',
  },
})

export const calculateSchwartz = createProfessionalCalculator({
  name: 'Schwartz',
  questionPrefix: 'schwartz',
  dimensionKeys: ['selfdirection', 'stimulation', 'hedonism', 'achievement', 'power', 'security'],
  dimensionNames: {
    selfdirection: '自主导向',
    stimulation: '刺激寻求',
    hedonism: '享乐主义',
    achievement: '成就追求',
    power: '权力追求',
    security: '安全稳定',
  },
})

export const calculateMetacognition = createProfessionalCalculator({
  name: 'Metacognition',
  questionPrefix: 'metacognition',
  dimensionKeys: ['planning', 'monitoring', 'evaluation', 'regulation', 'awareness'],
  dimensionNames: {
    planning: '计划策略',
    monitoring: '监控策略',
    evaluation: '评估策略',
    regulation: '调节策略',
    awareness: '认知觉察',
  },
})

export const calculateTKI = createProfessionalCalculator({
  name: 'TKI',
  questionPrefix: 'tki',
  dimensionKeys: ['competing', 'collaborating', 'compromising', 'avoiding', 'accommodating'],
  dimensionNames: {
    competing: '竞争型',
    collaborating: '合作型',
    compromising: '妥协型',
    avoiding: '回避型',
    accommodating: '迁就型',
  },
})

export const calculateELS = createProfessionalCalculator({
  name: 'ELS',
  questionPrefix: 'els',
  dimensionKeys: ['selfawareness', 'selfregulation', 'motivation', 'empathy', 'socialskills'],
  dimensionNames: {
    selfawareness: '自我觉察',
    selfregulation: '自我管理',
    motivation: '自我激励',
    empathy: '同理心',
    socialskills: '社交技能',
  },
})

export const calculateOCB = createProfessionalCalculator({
  name: 'OCB',
  questionPrefix: 'ocb',
  dimensionKeys: ['altruism', 'conscientiousness', 'sportsmanship', 'courtesy', 'civicvirtue'],
  dimensionNames: {
    altruism: '利他行为',
    conscientiousness: '责任意识',
    sportsmanship: '运动员精神',
    courtesy: '礼貌谦逊',
    civicvirtue: '公民美德',
  },
})

export const calculateSelfCompassion = createProfessionalCalculator({
  name: 'SelfCompassion',
  questionPrefix: 'selfcompassion',
  dimensionKeys: ['selfkindness', 'selfjudgment', 'commonhumanity', 'isolation', 'mindfulness', 'overidentification'],
  dimensionNames: {
    selfkindness: '自我善待',
    selfjudgment: '自我批判',
    commonhumanity: '人性共通',
    isolation: '孤立感',
    mindfulness: '正念觉察',
    overidentification: '过度认同',
  },
})

export const calculatePsychCap = createProfessionalCalculator({
  name: 'PsychCap',
  questionPrefix: 'psychcap',
  dimensionKeys: ['efficacy', 'hope', 'resilience', 'optimism'],
  dimensionNames: {
    efficacy: '自我效能',
    hope: '希望',
    resilience: '心理韧性',
    optimism: '乐观',
  },
})

export const calculateInternalLocus = createProfessionalCalculator({
  name: 'InternalLocus',
  questionPrefix: 'locus',
  dimensionKeys: ['internality', 'powerfulothers', 'chance'],
  dimensionNames: {
    internality: '内在控制',
    powerfulothers: '他人控制',
    chance: '机遇控制',
  },
})

export const calculateEmotionalRegulation = createProfessionalCalculator({
  name: 'EmotionalRegulation',
  questionPrefix: 'erq',
  dimensionKeys: ['reappraisal', 'suppression'],
  dimensionNames: {
    reappraisal: '认知重评',
    suppression: '表达抑制',
  },
})

export const calculateEIS = createProfessionalCalculator({
  name: 'EIS',
  questionPrefix: 'eis',
  dimensionKeys: ['perception', 'appraisal', 'regulation', 'utilization'],
  dimensionNames: {
    perception: '情绪感知',
    appraisal: '情绪评价',
    regulation: '情绪调节',
    utilization: '情绪运用',
  },
})

export const calculateCareerAdaptability = createProfessionalCalculator({
  name: 'CareerAdaptability',
  questionPrefix: 'caas',
  dimensionKeys: ['concern', 'control', 'curiosity', 'confidence'],
  dimensionNames: {
    concern: '生涯关注',
    control: '生涯控制',
    curiosity: '生涯好奇',
    confidence: '生涯自信',
  },
})

export const calculateProactive = createProfessionalCalculator({
  name: 'Proactive',
  questionPrefix: 'proactive',
  dimensionKeys: ['scanning', 'identifying', 'initiating', 'persisting'],
  dimensionNames: {
    scanning: '环境扫描',
    identifying: '机会识别',
    initiating: '主动行动',
    persisting: '坚持克服',
  },
})

export const calculatePSQI = createProfessionalCalculator({
  name: 'PSQI',
  questionPrefix: 'psqi',
  dimensionKeys: ['sleepQuality', 'sleepLatency', 'sleepDuration', 'sleepEfficiency', 'sleepDisturbance', 'hypnoticDrugs', 'daytimeDysfunction', 'sleepHabits', 'sleepEnvironment'],
  dimensionNames: {
    sleepQuality: '主观睡眠质量',
    sleepLatency: '睡眠潜伏期',
    sleepDuration: '睡眠持续时间',
    sleepEfficiency: '睡眠效率',
    sleepDisturbance: '睡眠障碍',
    hypnoticDrugs: '催眠药物使用',
    daytimeDysfunction: '日间功能障碍',
    sleepHabits: '睡眠习惯',
    sleepEnvironment: '睡眠环境',
  },
  traitsGenerator: (scores, _dimensions): TraitScore[] => {
    const traits: TraitScore[] = []
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
    
    if (totalScore <= 5) {
      traits.push({ name: '睡眠健康达人', description: '睡眠质量优秀，生活规律', score: 90, maxScore: 100 })
    } else if (totalScore <= 10) {
      traits.push({ name: '睡眠改善中', description: '存在轻微睡眠问题，可进一步优化', score: 70, maxScore: 100 })
    } else if (totalScore <= 15) {
      traits.push({ name: '睡眠亚健康', description: '睡眠问题需要关注，建议调整习惯', score: 50, maxScore: 100 })
    } else {
      traits.push({ name: '睡眠需改善', description: '睡眠质量较差，建议寻求专业帮助', score: 30, maxScore: 100 })
    }

    if (scores.sleepHabits && scores.sleepHabits < 3) {
      traits.push({ name: '作息较规律', description: '睡眠时间相对稳定', score: 80, maxScore: 100 })
    }

    if (scores.daytimeDysfunction && scores.daytimeDysfunction < 3) {
      traits.push({ name: '日间状态良好', description: '白天精力充沛', score: 85, maxScore: 100 })
    }

    return traits
  },
})

export const calculateAttention = createProfessionalCalculator({
  name: 'Attention',
  questionPrefix: 'att',
  dimensionKeys: ['sustained', 'selective', 'divided', 'shifting'],
  dimensionNames: {
    sustained: '持续性注意力',
    selective: '选择性注意力',
    divided: '分配性注意力',
    shifting: '转换性注意力',
  },
  traitsGenerator: (scores, _dimensions): TraitScore[] => {
    const traits: TraitScore[] = []
    const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length

    if (avg >= 4) {
      traits.push({ name: '专注达人', description: '注意力表现出色，认知效率高', score: 90, maxScore: 100 })
    } else if (avg >= 3) {
      traits.push({ name: '专注力良好', description: '注意力基本稳定，可进一步提升', score: 75, maxScore: 100 })
    } else {
      traits.push({ name: '注意力待提升', description: '建议通过训练改善注意力', score: 55, maxScore: 100 })
    }

    if (scores.sustained && scores.sustained >= 4) {
      traits.push({ name: '持久专注', description: '长时间保持注意力，适合深度工作', score: 88, maxScore: 100 })
    }

    if (scores.selective && scores.selective >= 4) {
      traits.push({ name: '慧眼识珠', description: '善于从干扰中筛选关键信息', score: 85, maxScore: 100 })
    }

    if (scores.divided && scores.divided >= 4) {
      traits.push({ name: '一心多用', description: '多任务处理能力较强', score: 82, maxScore: 100 })
    }

    if (scores.shifting && scores.shifting >= 4) {
      traits.push({ name: '灵活切换', description: '任务切换流畅，适应变化能力强', score: 86, maxScore: 100 })
    }

    return traits
  },
})
