import type { Answer } from '../../types'

export interface SCL90Result extends Record<string, any> {
  score: number
  title: string
  subtitle: string
  description: string
  dimensions: Array<{
    name: string
    score: number
    maxScore: number
    description: string
    avgScore: number
  }>
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  careers: string[]
  radarData: { dimension: string; score: number; fullMark: number }[]
  rawScore: number
  generalSymptomIndex: number
  positiveSymptomTotal: number
  positiveSymptomDistressIndex: number
  level: 'normal' | 'mild' | 'moderate' | 'severe'
  levelText: string
  interpretation: string
  recommendations: string[]
  warning: string
  symptomCount: number
  avgSymptomScore: number
}

const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const dimensionNames: Record<string, string> = {
  somatization: '躯体化',
  obsessiveCompulsive: '强迫症状',
  interpersonalSensitivity: '人际关系敏感',
  depression: '抑郁',
  anxiety: '焦虑',
  hostility: '敌对',
  phobicAnxiety: '恐怖',
  paranoidIdeation: '偏执',
  psychoticism: '精神病性',
}

// SCL-90-R 标准的维度到题目ID的映射（专业版）
const dimensionMap: Record<string, string[]> = {
  somatization: ['psqi_n01', 'psqi_n04', 'psqi_n07', 'psqi_n10', 'psqi_n13', 'psqi_n16', 'psqi_n19', 'psqi_n22', 'psqi_n25', 'psqi_n28'],
  obsessiveCompulsive: ['psqi_n02', 'psqi_n05', 'psqi_n08', 'psqi_n11', 'psqi_n14', 'psqi_n17', 'psqi_n20', 'psqi_n23', 'psqi_n26', 'psqi_n29'],
  interpersonalSensitivity: ['psqi_n03', 'psqi_n06', 'psqi_n09', 'psqi_n12', 'psqi_n15', 'psqi_n18', 'psqi_n21', 'psqi_n24', 'psqi_n27', 'psqi_n30'],
  depression: ['psqi_n01', 'psqi_n04', 'psqi_n07', 'psqi_n10', 'psqi_n13', 'psqi_n16', 'psqi_n19', 'psqi_n22', 'psqi_n25', 'psqi_n28'],
  anxiety: ['psqi_n02', 'psqi_n05', 'psqi_n08', 'psqi_n11', 'psqi_n14', 'psqi_n17', 'psqi_n20', 'psqi_n23', 'psqi_n26', 'psqi_n29'],
  hostility: ['psqi_n03', 'psqi_n06', 'psqi_n09', 'psqi_n12', 'psqi_n15', 'psqi_n18', 'psqi_n21', 'psqi_n24', 'psqi_n27', 'psqi_n30'],
  phobicAnxiety: ['psqi_n01', 'psqi_n04', 'psqi_n07', 'psqi_n10', 'psqi_n13', 'psqi_n16', 'psqi_n19', 'psqi_n22', 'psqi_n25', 'psqi_n28'],
  paranoidIdeation: ['psqi_n02', 'psqi_n05', 'psqi_n08', 'psqi_n11', 'psqi_n14', 'psqi_n17', 'psqi_n20', 'psqi_n23', 'psqi_n26', 'psqi_n29'],
  psychoticism: ['psqi_n03', 'psqi_n06', 'psqi_n09', 'psqi_n12', 'psqi_n15', 'psqi_n18', 'psqi_n21', 'psqi_n24', 'psqi_n27', 'psqi_n30'],
}

// 为简化版的30题优化的维度分配
const optimizedDimensionMap: Record<string, string[]> = {
  somatization: ['psqi_n01', 'psqi_n10', 'psqi_n19', 'psqi_n28'],
  obsessiveCompulsive: ['psqi_n02', 'psqi_n11', 'psqi_n20', 'psqi_n29'],
  interpersonalSensitivity: ['psqi_n03', 'psqi_n12', 'psqi_n21', 'psqi_n30'],
  depression: ['psqi_n04', 'psqi_n13', 'psqi_n22'],
  anxiety: ['psqi_n05', 'psqi_n14', 'psqi_n23'],
  hostility: ['psqi_n06', 'psqi_n15', 'psqi_n24'],
  phobicAnxiety: ['psqi_n07', 'psqi_n16', 'psqi_n25'],
  paranoidIdeation: ['psqi_n08', 'psqi_n17', 'psqi_n26'],
  psychoticism: ['psqi_n09', 'psqi_n18', 'psqi_n27'],
}

function getLevel(percentage: number): string {
  if (percentage >= 75) return '重度'
  if (percentage >= 60) return '中度'
  if (percentage >= 50) return '轻度'
  return '正常'
}

export function calculateSCL90(answers: Answer[]): SCL90Result {
  const answerMap: Record<string, number> = {}
  answers.forEach(a => {
    answerMap[a.questionId] = typeof a.value === 'number' ? a.value : parseInt(String(a.value || 1))
  })

  const rawDimensions: Record<string, { score: number; level: string; items: number; avgScore: number }> = {}
  let totalRaw = 0
  let positiveSymptomCount = 0

  // 使用优化后的维度映射
  Object.entries(optimizedDimensionMap).forEach(([dim, ids]) => {
    const score = ids.reduce((sum, id) => sum + (answerMap[id] || 1), 0)
    const itemCount = ids.length
    const averageScore = score / itemCount
    
    // 统计阳性症状
    ids.forEach(id => {
      if (answerMap[id] >= 2) {
        positiveSymptomCount++
      }
    })
    
    rawDimensions[dim] = {
      score: Math.round(averageScore * 100) / 100,
      avgScore: Math.round(averageScore * 100) / 100,
      level: getLevel((averageScore / 5) * 100),
      items: itemCount,
    }
    totalRaw += score
  })

  // SCL-90-R 专业统计指标
  const generalSymptomIndex = Math.round((totalRaw / 30) * 100) / 100  // 总症状指数 = 总分/题数
  const positiveSymptomTotal = positiveSymptomCount  // 阳性项目数
  const positiveSymptomDistressIndex = positiveSymptomCount > 0 
    ? Math.round((totalRaw / positiveSymptomCount) * 100) / 100 
    : 0
  const avgSymptomScore = Math.round((totalRaw / 30) * 100) / 100

  // 专业评分标准
  let level: SCL90Result['level'] = 'normal'
  let levelText = '心理健康状态良好'
  
  if (generalSymptomIndex >= 3.0) { 
    level = 'severe'
    levelText = '心理健康状况需重点关注' 
  } else if (generalSymptomIndex >= 2.5) { 
    level = 'moderate'
    levelText = '存在中等程度心理困扰' 
  } else if (generalSymptomIndex >= 2.0) { 
    level = 'mild'
    levelText = '存在轻微心理症状' 
  }

  const dimensions: SCL90Result['dimensions'] = [
    { name: '躯体化', score: Math.round((rawDimensions.somatization.score / 5) * 100), maxScore: 100, avgScore: rawDimensions.somatization.avgScore, description: getDimensionAdvice('躯体化', rawDimensions.somatization.score) },
    { name: '强迫症状', score: Math.round((rawDimensions.obsessiveCompulsive.score / 5) * 100), maxScore: 100, avgScore: rawDimensions.obsessiveCompulsive.avgScore, description: getDimensionAdvice('强迫症状', rawDimensions.obsessiveCompulsive.score) },
    { name: '人际关系敏感', score: Math.round((rawDimensions.interpersonalSensitivity.score / 5) * 100), maxScore: 100, avgScore: rawDimensions.interpersonalSensitivity.avgScore, description: getDimensionAdvice('人际关系', rawDimensions.interpersonalSensitivity.score) },
    { name: '抑郁', score: Math.round((rawDimensions.depression.score / 5) * 100), maxScore: 100, avgScore: rawDimensions.depression.avgScore, description: getDimensionAdvice('抑郁', rawDimensions.depression.score) },
    { name: '焦虑', score: Math.round((rawDimensions.anxiety.score / 5) * 100), maxScore: 100, avgScore: rawDimensions.anxiety.avgScore, description: getDimensionAdvice('焦虑', rawDimensions.anxiety.score) },
    { name: '敌对', score: Math.round((rawDimensions.hostility.score / 5) * 100), maxScore: 100, avgScore: rawDimensions.hostility.avgScore, description: getDimensionAdvice('敌对', rawDimensions.hostility.score) },
    { name: '恐怖', score: Math.round((rawDimensions.phobicAnxiety.score / 5) * 100), maxScore: 100, avgScore: rawDimensions.phobicAnxiety.avgScore, description: getDimensionAdvice('恐怖', rawDimensions.phobicAnxiety.score) },
    { name: '偏执', score: Math.round((rawDimensions.paranoidIdeation.score / 5) * 100), maxScore: 100, avgScore: rawDimensions.paranoidIdeation.avgScore, description: getDimensionAdvice('偏执', rawDimensions.paranoidIdeation.score) },
    { name: '精神病性', score: Math.round((rawDimensions.psychoticism.score / 5) * 100), maxScore: 100, avgScore: rawDimensions.psychoticism.avgScore, description: getDimensionAdvice('精神病性', rawDimensions.psychoticism.score) },
  ]

  const radarData = dimensions.map(d => ({ dimension: d.name, score: d.score, fullMark: 100 }))

  const strengths: string[] = []
  const weaknesses: string[] = []
  
  dimensions.forEach(dim => {
    if (dim.score <= 40) {
      strengths.push(`${dim.name}表现正常`)
    } else if (dim.score >= 60) {
      weaknesses.push(`${dim.name}需要关注`)
    }
  })

  let interpretation = `### SCL-90-R 症状自评量表报告\n\n`
  interpretation += `## 核心统计指标\n\n`
  interpretation += `- **总症状指数（GSI）**: ${generalSymptomIndex}\n`
  interpretation += `- **阳性项目数**: ${positiveSymptomTotal}\n`
  interpretation += `- **阳性症状痛苦指数**: ${positiveSymptomDistressIndex}\n`
  interpretation += `- **平均分**: ${avgSymptomScore}\n\n`
  interpretation += `**评估结论：${levelText}**\n\n`
  interpretation += `## 各维度得分详情\n\n`
  interpretation += `| 维度 | 因子分（1-5） | 标准化分（0-100） | 状态 |\n`
  interpretation += `|------|---------------|-------------------|------|\n`
  
  dimensions.forEach(dim => {
    const rawDim = Object.values(rawDimensions).find(d => dim.name.includes(dimensionNames[Object.keys(rawDimensions).find(k => dimensionNames[k] === dim.name) || '']))
    const levelStr = rawDim?.level || '正常'
    interpretation += `| ${dim.name} | ${rawDim?.avgScore.toFixed(2) || dim.avgScore.toFixed(2)} | ${dim.score} | ${levelStr} |\n`
  })

  interpretation += `\n`

  const normalInterpretations = [
    '你的心理健康状况良好，各维度得分均在正常范围内。继续保持良好的生活习惯和积极的心态。',
    '恭喜！测评结果显示你的心理状态非常健康。请继续保持规律作息和适度运动。',
    '你的心理健康指数处于理想水平，说明你有着良好的心理调适能力和社会适应能力。',
  ]

  const mildInterpretations = [
    '测评显示你存在轻微的心理困扰，这在现代生活中较为常见。建议适当关注自己的情绪变化，必要时寻求专业支持。',
    '你有一些轻微的心理症状提示，但仍在可控范围内。可以通过运动、休息和社交来缓解。',
    '轻微的心理波动是正常的应激反应。建议保持觉察，给自己一些放松的时间。',
  ]

  const moderateInterpretations = [
    '测评显示你存在中等程度的心理困扰，建议认真对待这个信号。考虑寻求专业的心理咨询帮助。',
    '你的某些心理维度得分偏高，可能正在经历较大的心理压力。现在是时候采取行动来改善了。',
    '中等程度的心理症状可能已经影响到你的日常生活。建议优先照顾好自己，必要时寻求专业帮助。',
  ]

  const severeInterpretations = [
    '测评结果显示你的心理健康需要重点关注。请务必寻求专业心理咨询或精神科医生的帮助。',
    '你的心理困扰程度较重，请不要独自承受。专业的心理支持真的可以带来帮助。',
    '强烈建议你就近就医或联系心理咨询师。你值得获得专业的帮助和支持。',
  ]

  if (level === 'normal') {
    interpretation += randomPick(normalInterpretations)
  } else if (level === 'mild') {
    interpretation += randomPick(mildInterpretations)
  } else if (level === 'moderate') {
    interpretation += randomPick(moderateInterpretations)
  } else {
    interpretation += randomPick(severeInterpretations)
  }

  const recommendationPools = [
    ['保持规律作息和适度运动', '每天给自己留出放松时间', '与信任的朋友或家人交流', '练习深呼吸或正念冥想'],
    ['增加有氧运动（每周3-5次）', '建立规律的睡眠习惯', '尝试记录情绪日记', '必要时寻求心理咨询'],
    ['优先保证充足睡眠', '减少不必要的压力源', '寻求专业心理支持', '建立支持性社交网络'],
    ['建议寻求专业心理咨询', '考虑预约精神科医生', '告知信任的人你的状态', '必要时拨打心理援助热线'],
  ]

  const levelIndex = level === 'normal' ? 0 : level === 'mild' ? 1 : level === 'moderate' ? 2 : 3
  const recommendations = recommendationPools[levelIndex]

  const warning = level !== 'normal'
    ? '⚠️ 本测评仅作为初步筛查工具，不能替代专业诊断。如有需要，请及时就医或寻求专业心理咨询。'
    : '✓ 本测评结果仅供参考，保持健康的生活方式是维持心理健康的关键。'

  return {
    score: Math.round(Math.max(0, (1 - generalSymptomIndex / 5) * 100)),
    title: 'SCL-90-R 症状自评量表专业报告',
    subtitle: `总症状指数: ${generalSymptomIndex} · 阳性项目: ${positiveSymptomTotal}`,
    description: `您的心理健康状态${levelText}。${weaknesses.length > 0 ? '建议关注' + weaknesses.join('、') : '各维度表现正常'}`,
    dimensions,
    strengths: strengths.length > 0 ? strengths : ['心理健康状态良好'],
    weaknesses,
    suggestions: recommendations,
    careers: [],
    radarData,
    rawScore: totalRaw,
    generalSymptomIndex,
    positiveSymptomTotal,
    positiveSymptomDistressIndex,
    avgSymptomScore,
    symptomCount: positiveSymptomTotal,
    level,
    levelText,
    interpretation,
    recommendations,
    warning,
  }
}

function getDimensionAdvice(name: string, score: number): string {
  const percentage = (score / 5) * 100
  if (percentage <= 40) return '表现正常，继续保持'
  if (percentage <= 60) return '轻度异常，建议关注'
  if (percentage <= 75) return '中度异常，需要干预'
  return '重度异常，务必重视'
}
