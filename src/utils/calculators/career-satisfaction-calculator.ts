import type { Answer, AssessmentResult } from '../../types'
import { buildAnswerMap, calculateLikertScore } from './calculator-utils'

export interface CareerSatisfactionResult extends Record<string, unknown> {
  totalScore: number
  categoryScores: {
    jobContent: number
    workEnvironment: number
    growthOpportunities: number
    compensation: number
    workLifeBalance: number
  }
  satisfactionLevel: 'excellent' | 'good' | 'moderate' | 'needs_improvement' | 'low'
  strengths: string[]
  areasToConsider: string[]
  typeName: string
  typeEmoji: string
}

export function calculateCareerSatisfaction(answers: Answer[]): CareerSatisfactionResult & AssessmentResult {
  const answerMap = buildAnswerMap(answers)

  const jobContentItems = ['cs_01', 'cs_06', 'cs_11', 'cs_16', 'cs_21', 'cs_26', 'cs_31']
  const workEnvironmentItems = ['cs_02', 'cs_07', 'cs_12', 'cs_17', 'cs_22', 'cs_27', 'cs_32']
  const growthOpportunitiesItems = ['cs_03', 'cs_08', 'cs_13', 'cs_18', 'cs_23', 'cs_28', 'cs_33']
  const compensationItems = ['cs_04', 'cs_09', 'cs_14', 'cs_19', 'cs_24', 'cs_29', 'cs_34']
  const workLifeBalanceItems = ['cs_05', 'cs_10', 'cs_15', 'cs_20', 'cs_25', 'cs_30', 'cs_35']

  const jobContent = calculateLikertScore(answerMap, jobContentItems, [])
  const workEnvironment = calculateLikertScore(answerMap, workEnvironmentItems, [])
  const growthOpportunities = calculateLikertScore(answerMap, growthOpportunitiesItems, [])
  const compensation = calculateLikertScore(answerMap, compensationItems, [])
  const workLifeBalance = calculateLikertScore(answerMap, workLifeBalanceItems, [])

  const totalScore = (jobContent + workEnvironment + growthOpportunities + compensation + workLifeBalance) / 5

  let satisfactionLevel: 'excellent' | 'good' | 'moderate' | 'needs_improvement' | 'low'
  if (totalScore >= 80) satisfactionLevel = 'excellent'
  else if (totalScore >= 65) satisfactionLevel = 'good'
  else if (totalScore >= 50) satisfactionLevel = 'moderate'
  else if (totalScore >= 35) satisfactionLevel = 'needs_improvement'
  else satisfactionLevel = 'low'

  const strengths: string[] = []
  const areasToConsider: string[] = []

  const categoryNames = [
    { key: 'jobContent', name: '工作内容' },
    { key: 'workEnvironment', name: '工作环境' },
    { key: 'growthOpportunities', name: '发展机会' },
    { key: 'compensation', name: '薪酬福利' },
    { key: 'workLifeBalance', name: '工作生活平衡' },
  ]

  categoryNames.forEach(({ key, name }) => {
    const score = [jobContent, workEnvironment, growthOpportunities, compensation, workLifeBalance][
      categoryNames.findIndex(c => c.key === key)
    ]
    if (score >= 70) strengths.push(name)
    else if (score < 50) areasToConsider.push(name)
  })

  const types = [
    { level: 'excellent', name: '理想职业', emoji: '🚀' },
    { level: 'good', name: '满意的工作', emoji: '✨' },
    { level: 'moderate', name: '还行的工作', emoji: '🤔' },
    { level: 'needs_improvement', name: '需要调整的工作', emoji: '🔄' },
    { level: 'low', name: '考虑改变', emoji: '⚠️' },
  ]

  const typeInfo = types.find(t => t.level === satisfactionLevel) || types[2]

  return {
    totalScore: Math.round(totalScore),
    categoryScores: {
      jobContent: Math.round(jobContent),
      workEnvironment: Math.round(workEnvironment),
      growthOpportunities: Math.round(growthOpportunities),
      compensation: Math.round(compensation),
      workLifeBalance: Math.round(workLifeBalance),
    },
    satisfactionLevel,
    strengths,
    areasToConsider,
    typeName: typeInfo.name,
    typeEmoji: typeInfo.emoji,
  }
}
