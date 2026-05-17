import type { AssessmentResult, Dimension } from '../../types'

// 简单的 HTML 净化函数（前端安全措施）
function sanitizeText(text: unknown): string {
  if (typeof text !== 'string') return ''
  // 移除 HTML 标签和危险字符
  return text
    .replace(/<[^>]*>/g, '') // 移除 HTML 标签
    .replace(/javascript:/gi, '') // 移除 javascript 协议
    .replace(/data:/gi, '') // 移除 data 协议
    .trim()
}

function sanitizeArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return []
  return arr
    .map(item => typeof item === 'string' ? sanitizeText(item) : '')
    .filter(item => item.length > 0)
}

const DIMENSION_NAME_MAP: Record<string, string> = {
  // Big Five
  O: '开放性', C: '尽责性', E: '外向性', A: '宜人性', N: '神经质',
  openness: '开放性', conscientiousness: '尽责性', extraversion: '外向性',
  agreeableness: '宜人性', neuroticism: '神经质',
  
  // Dark Triad
  machiavellianism: '马基雅维利主义', narcissism: '自恋', psychopathy: '精神病态',
  
  // EQ
  selfAwareness: '自我意识', selfManagement: '自我管理', 
  socialAwareness: '社交意识', relationshipManagement: '关系管理',
  selfRegulation: '自我调节', motivation: '动机', empathy: '共情', socialSkills: '社交技能',
  
  // Attachment
  anxiety: '焦虑', ANXIETY: '焦虑',
  avoidance: '回避', AVOIDANCE: '回避',
  secure: '安全', SECURE: '安全',
  
  // Parenting
  authoritative: '权威型', authoritarian: '专制型', 
  permissive: '放任型', neglectful: '忽视型',
  
  // Anxiety
  somatic: '躯体化', cognitive: '认知焦虑', behavioral: '行为焦虑',
  
  // Political
  traditional: '传统', progressive: '进步', authority: '权威', liberty: '自由',
  
  // Work
  slacking: '摸鱼', working: '工作', focus: '专注', distraction: '分心',
  fubao: '福报', overwork: '过劳', endurance: '忍耐', resistance: '抵抗',
  
  // Experience
  experience: '经验', curiosity: '好奇', boldness: '大胆', conservatism: '保守',
  
  // Addiction
  addiction: '成瘾', control: '控制', withdrawal: '戒断', socialImpact: '社交影响',
  
  // Meaning
  meaning: '意义', coherence: '连贯', purpose: '目的', significance: '重要性',
  
  // Patriotism
  patriotism: '爱国', nationalism: '民族主义', criticism: '批判', pride: '自豪',
  
  // Manipulation
  manipulation: '操纵', guilt: '内疚', isolation: '孤立', gaslighting: '煤气灯',
  
  // Foodie
  foodie: '吃货', picky: '挑食', adventure: '冒险', comfort: '舒适',
  
  // IQ/Cognitive
  logical: '逻辑', verbal: '语言', spatial: '空间', memory: '记忆',
  
  // Maturity
  maturity: '成熟度', independence: '独立性', responsibility: '责任感', adaptability: '适应性',
  
  // General
  physical: '身体', emotional: '情绪', social: '社交', cognitive_dim: '认知',
  positive: '积极', negative: '消极', neutral: '中性',
  dominance: '支配', submission: '顺从', cooperation: '合作', competition: '竞争',
  introversion: '内向', extroversion: '外向', stability: '稳定', plasticity: '可塑性',
  warmth: '热情', reasoning: '推理', emotionalStability: '情绪稳定性',
  
  // DISC
  dominance_d: '支配型', influence_i: '影响型', 
  steadiness_s: '稳健型', compliance_c: '服从型',
  
  // Holland
  realistic: '现实型', investigative: '研究型', artistic: '艺术型',
  social_type: '社会型', enterprising: '企业型', conventional: '常规型',
  R: '现实型', I: '研究型', A: '艺术型', 
  S: '社会型', E: '企业型', C: '常规型',
  
  // MBTI
  EI: '外向-内向', SN: '感觉-直觉', TF: '思考-情感', JP: '判断-知觉',
  E: '外向', I: '内向', S: '感觉', N: '直觉', 
  T: '思考', F: '情感', J: '判断', P: '知觉',
  
  // Big Five Subscales (N1-N6, E1-E6, etc.)
  N1: '焦虑', N2: '愤怒敌意', N3: '抑郁', N4: '自我意识', N5: '冲动性', N6: '脆弱性',
  E1: '热情', E2: '乐群性', E3: '独断性', E4: '活跃性', E5: '寻求刺激', E6: '积极情绪',
  O1: '幻想', O2: '审美', O3: '情感', O4: '行动', O5: '观念', O6: '价值',
  A1: '信任', A2: '坦诚', A3: '利他', A4: '顺从', A5: '谦虚', A6: '同理心',
  C1: '胜任感', C2: '条理性', C3: '责任感', C4: '追求成就', C5: '自律', C6: '审慎',
}

function normalizeDimensions(dimensions: unknown): Dimension[] {
  if (Array.isArray(dimensions)) {
    return dimensions.map(d => ({
      name: sanitizeText(d.name) || '未知维度',
      score: typeof d.score === 'number' ? Math.max(0, Math.min(200, d.score)) : 0,
      maxScore: typeof d.maxScore === 'number' ? Math.max(0, d.maxScore) : undefined,
      description: sanitizeText(d.description),
      dimensionId: sanitizeText(d.dimensionId),
    }))
  }
  if (dimensions && typeof dimensions === 'object') {
    return Object.entries(dimensions as Record<string, any>).map(([key, value]) => {
      const safeKey = sanitizeText(key)
      if (typeof value === 'object' && value !== null && 'score' in value) {
        return {
          name: sanitizeText((value as any).name) || DIMENSION_NAME_MAP[safeKey] || safeKey,
          score: typeof (value as any).score === 'number' ? Math.max(0, Math.min(200, (value as any).score)) : 0,
          maxScore: typeof (value as any).maxScore === 'number' ? Math.max(0, (value as any).maxScore) : undefined,
          description: sanitizeText((value as any).description),
          dimensionId: safeKey,
        }
      }
      return {
        name: DIMENSION_NAME_MAP[safeKey] || safeKey,
        score: typeof value === 'number' ? Math.max(0, Math.min(200, value)) : 0,
        dimensionId: safeKey,
      }
    })
  }
  return []
}

export function normalizeResult(rawResult: unknown, assessmentType?: string): AssessmentResult {
  if (!rawResult || typeof rawResult !== 'object') {
    return {
      type: sanitizeText(assessmentType) || 'unknown',
      score: 0,
      accuracy: 0,
      title: '计算错误',
      description: '结果计算失败，请重新测评',
      dimensions: [],
      strengths: [],
      weaknesses: [],
      careers: [],
      suggestions: [],
    }
  }

  const r = rawResult as Record<string, unknown>
  const dimensions = normalizeDimensions(r.dimensions)

  // 确保不保留原始数据的未知属性，防止意外注入
  return {
    type: sanitizeText(r.type) || sanitizeText(assessmentType) || 'unknown',
    score: typeof r.score === 'number' ? Math.max(0, Math.min(200, r.score)) : 0,
    accuracy: typeof r.accuracy === 'number' ? Math.max(0, Math.min(100, r.accuracy)) : 85,
    title: sanitizeText(r.title),
    description: sanitizeText(r.description),
    dimensions,
    strengths: sanitizeArray(r.strengths),
    weaknesses: sanitizeArray(r.weaknesses),
    careers: sanitizeArray(r.careers),
    suggestions: sanitizeArray(r.suggestions),
  }
}

export { normalizeDimensions }
