import type { Answer } from '../../types'

export interface PSQIResult extends Record<string, any> {
  score: number
  title: string
  subtitle: string
  description: string
  dimensions: Array<{
    name: string
    score: number
    maxScore: number
    description: string
    componentScore: number
  }>
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  careers: string[]
  radarData?: Array<{ dimension: string; score: number; fullMark: number }>
  sleepQualityLevel: 'good' | 'fair' | 'poor' | 'veryPoor'
  sleepQualityText: string
  globalPSQIScore: number
  componentScores: Record<string, number>
  sleepHours: number
  sleepMinutesToFallAsleep: number
  sleepEfficiencyPercent: number
}

const dimensionNames: Record<string, string> = {
  sleepQuality: '主观睡眠质量',
  sleepLatency: '睡眠潜伏期',
  sleepDuration: '睡眠持续时间',
  sleepEfficiency: '睡眠效率',
  sleepDisturbance: '睡眠障碍',
  hypnoticDrugs: '催眠药物',
  daytimeDysfunction: '日间功能障碍',
  sleepHabits: '睡眠习惯',
  sleepEnvironment: '睡眠环境',
}

const optimizedDimensionMapping: Record<string, string[]> = {
  sleepQuality: ['psqi_n01', 'psqi_n04', 'psqi_n07', 'psqi_n10'],
  sleepLatency: ['psqi_n02', 'psqi_n05', 'psqi_n08', 'psqi_n11'],
  sleepDuration: ['psqi_n03', 'psqi_n06', 'psqi_n09', 'psqi_n12'],
  sleepEfficiency: ['psqi_n13', 'psqi_n16', 'psqi_n19', 'psqi_n22'],
  sleepDisturbance: ['psqi_n14', 'psqi_n17', 'psqi_n20', 'psqi_n23'],
  hypnoticDrugs: ['psqi_n15', 'psqi_n18', 'psqi_n21', 'psqi_n24'],
  daytimeDysfunction: ['psqi_n25', 'psqi_n28', 'psqi_n30'],
  sleepHabits: ['psqi_n26', 'psqi_n29'],
  sleepEnvironment: ['psqi_n27'],
}

const getLevelText = (score: number): string => {
  if (score <= 5) return '睡眠质量良好'
  if (score <= 10) return '睡眠质量一般'
  if (score <= 15) return '睡眠质量较差'
  return '睡眠质量很差'
}

const getLevel = (score: number): PSQIResult['sleepQualityLevel'] => {
  if (score <= 5) return 'good'
  if (score <= 10) return 'fair'
  if (score <= 15) return 'poor'
  return 'veryPoor'
}

function getComponentScore(avgScore: number, maxValue: number = 3): number {
  // 标准化到 0-3 分（PSQI 标准）
  const normalized = avgScore / maxValue
  if (normalized <= 0.25) return 0
  if (normalized <= 0.5) return 1
  if (normalized <= 0.75) return 2
  return 3
}

export function calculatePSQI(answers: Answer[]): PSQIResult {
  const answerMap: Record<string, number> = {}
  answers.forEach(a => {
    answerMap[a.questionId] = typeof a.value === 'number' ? a.value : parseInt(String(a.value || 1))
  })

  const componentScores: Record<string, number> = {}
  const dimensionScores: PSQIResult['dimensions'] = []
  let totalComponentScore = 0

  // 计算各个维度得分
  Object.entries(optimizedDimensionMapping).forEach(([dimKey, questionIds]) => {
    let sum = 0
    let count = 0
    
    questionIds.forEach(qid => {
      if (answerMap[qid] !== undefined) {
        sum += answerMap[qid]
        count++
      }
    })

    const avgScore = count > 0 ? sum / count : 0
    const componentScore = getComponentScore(avgScore)
    const normalizedScore = Math.round((avgScore / 3) * 100)

    componentScores[dimKey] = componentScore
    totalComponentScore += componentScore

    dimensionScores.push({
      name: dimensionNames[dimKey] || dimKey,
      score: Math.min(100, Math.max(0, normalizedScore)),
      maxScore: 100,
      componentScore,
      description: getDimensionDescription(dimKey, componentScore),
    })
  })

  // PSQI 全球总分（0-21分，>5分表示睡眠质量差）
  const globalPSQIScore = Math.min(21, Math.round(totalComponentScore))
  
  // 估算睡眠时长
  const sleepHours = 8 - (globalPSQIScore / 4)
  
  // 估算入睡时间
  const sleepMinutesToFallAsleep = Math.round(globalPSQIScore * 5)
  
  // 估算睡眠效率
  const sleepEfficiencyPercent = Math.max(50, Math.round(100 - globalPSQIScore * 3))

  const sleepQualityLevel = getLevel(globalPSQIScore)
  const sleepQualityText = getLevelText(globalPSQIScore)

  const strengths: string[] = []
  const weaknesses: string[] = []
  const suggestions: string[] = []

  dimensionScores.forEach(dim => {
    if (dim.componentScore === 0) {
      strengths.push(`${dim.name}表现良好`)
    } else if (dim.componentScore >= 2) {
      weaknesses.push(`${dim.name}需要改善`)
    }
  })

  if (globalPSQIScore > 10) {
    suggestions.push('建议保持规律作息时间')
    suggestions.push('睡前避免使用电子设备')
    suggestions.push('营造舒适的睡眠环境')
  }
  if (globalPSQIScore > 15) {
    suggestions.push('考虑咨询睡眠专家')
    suggestions.push('记录睡眠日记以便更好地了解睡眠模式')
  }
  if (globalPSQIScore <= 5) {
    suggestions.push('继续保持良好的睡眠习惯')
    suggestions.push('适度运动有助于提高睡眠质量')
  }

  // 专业建议
  if (componentScores['sleepLatency'] >= 2) {
    suggestions.push('尝试放松技巧，如深呼吸或渐进性肌肉放松')
  }
  if (componentScores['sleepDisturbance'] >= 2) {
    suggestions.push('减少咖啡因和酒精摄入')
  }
  if (componentScores['daytimeDysfunction'] >= 2) {
    suggestions.push('白天适度增加光照，减少午睡时间')
  }

  return {
    score: Math.round(Math.max(0, (1 - globalPSQIScore / 21) * 100)),
    title: '匹兹堡睡眠质量指数（PSQI）专业报告',
    subtitle: `PSQI全球总分: ${globalPSQIScore} · ${sleepQualityText}`,
    description: `您的睡眠质量${sleepQualityText}，${sleepQualityLevel === 'good' ? '继续保持良好的睡眠习惯' : sleepQualityLevel === 'fair' ? '有一些方面可以改善' : '建议采取措施改善睡眠'}`,
    dimensions: dimensionScores,
    strengths,
    weaknesses,
    suggestions,
    careers: [],
    radarData: dimensionScores.map(d => ({ dimension: d.name, score: d.score, fullMark: 100 })),
    sleepQualityLevel,
    sleepQualityText,
    globalPSQIScore,
    componentScores,
    sleepHours: Math.max(5, Math.round(sleepHours)),
    sleepMinutesToFallAsleep: Math.min(60, sleepMinutesToFallAsleep),
    sleepEfficiencyPercent,
  }
}

function getDimensionDescription(dimKey: string, score: number): string {
  const descriptions: Record<string, string> = {
    '0': '表现优秀，继续保持',
    '1': '基本正常，可小幅改善',
    '2': '需要关注，建议采取措施',
    '3': '问题明显，需要重视',
  }
  return descriptions[String(score)] || '表现正常'
}
