import type { Answer, AssessmentResult } from '../../types'
import { buildAnswerMap, calculateLikertScore } from './calculator-utils'

export interface FinancialHealthResult extends Record<string, unknown> {
  totalScore: number
  categoryScores: {
    budgeting: number
    saving: number
    debtManagement: number
    investing: number
    riskManagement: number
  }
  healthLevel: 'excellent' | 'good' | 'moderate' | 'needs_improvement' | 'poor'
  strengths: string[]
  improvements: string[]
  typeName: string
  typeEmoji: string
}

export function calculateFinancialHealth(answers: Answer[]): FinancialHealthResult & AssessmentResult {
  const answerMap = buildAnswerMap(answers)

  const budgetingItems = ['fh_01', 'fh_06', 'fh_11', 'fh_16', 'fh_21', 'fh_26', 'fh_31']
  const savingItems = ['fh_02', 'fh_07', 'fh_12', 'fh_17', 'fh_22', 'fh_27', 'fh_32']
  const debtManagementItems = ['fh_03', 'fh_08', 'fh_13', 'fh_18', 'fh_23', 'fh_28', 'fh_33']
  const investingItems = ['fh_04', 'fh_09', 'fh_14', 'fh_19', 'fh_24', 'fh_29', 'fh_34']
  const riskManagementItems = ['fh_05', 'fh_10', 'fh_15', 'fh_20', 'fh_25', 'fh_30', 'fh_35']

  const budgeting = calculateLikertScore(answerMap, budgetingItems, [])
  const saving = calculateLikertScore(answerMap, savingItems, [])
  const debtManagement = calculateLikertScore(answerMap, debtManagementItems, [])
  const investing = calculateLikertScore(answerMap, investingItems, [])
  const riskManagement = calculateLikertScore(answerMap, riskManagementItems, [])

  const totalScore = (budgeting + saving + debtManagement + investing + riskManagement) / 5

  let healthLevel: 'excellent' | 'good' | 'moderate' | 'needs_improvement' | 'poor'
  if (totalScore >= 80) healthLevel = 'excellent'
  else if (totalScore >= 65) healthLevel = 'good'
  else if (totalScore >= 50) healthLevel = 'moderate'
  else if (totalScore >= 35) healthLevel = 'needs_improvement'
  else healthLevel = 'poor'

  const strengths: string[] = []
  const improvements: string[] = []

  const categoryNames = [
    { key: 'budgeting', name: '预算管理' },
    { key: 'saving', name: '储蓄习惯' },
    { key: 'debtManagement', name: '债务管理' },
    { key: 'investing', name: '投资意识' },
    { key: 'riskManagement', name: '风险保障' },
  ]

  categoryNames.forEach(({ key, name }) => {
    const score = [budgeting, saving, debtManagement, investing, riskManagement][
      categoryNames.findIndex(c => c.key === key)
    ]
    if (score >= 70) strengths.push(name)
    else if (score < 50) improvements.push(name)
  })

  const types = [
    { level: 'excellent', name: '财务大师', emoji: '🏆' },
    { level: 'good', name: '稳健投资者', emoji: '💰' },
    { level: 'moderate', name: '成长中的理财者', emoji: '📈' },
    { level: 'needs_improvement', name: '财务规划初学者', emoji: '📝' },
    { level: 'poor', name: '财务健康警报', emoji: '⚠️' },
  ]

  const typeInfo = types.find(t => t.level === healthLevel) || types[2]

  return {
    totalScore: Math.round(totalScore),
    categoryScores: {
      budgeting: Math.round(budgeting),
      saving: Math.round(saving),
      debtManagement: Math.round(debtManagement),
      investing: Math.round(investing),
      riskManagement: Math.round(riskManagement),
    },
    healthLevel,
    strengths,
    improvements,
    typeName: typeInfo.name,
    typeEmoji: typeInfo.emoji,
  }
}
