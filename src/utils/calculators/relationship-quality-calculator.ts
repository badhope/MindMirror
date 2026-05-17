import type { Answer, AssessmentResult } from '../../types'
import { buildAnswerMap, calculateLikertScore } from './calculator-utils'

export interface RelationshipQualityResult extends Record<string, unknown> {
  totalScore: number
  categoryScores: {
    communication: number
    intimacy: number
    trust: number
    conflictResolution: number
    sharedValues: number
  }
  qualityLevel: 'excellent' | 'good' | 'moderate' | 'needs_work' | 'struggling'
  strengths: string[]
  areasForGrowth: string[]
  typeName: string
  typeEmoji: string
}

export function calculateRelationshipQuality(answers: Answer[]): RelationshipQualityResult & AssessmentResult {
  const answerMap = buildAnswerMap(answers)

  const communicationItems = ['rq_01', 'rq_06', 'rq_11', 'rq_16', 'rq_21', 'rq_26', 'rq_31']
  const intimacyItems = ['rq_02', 'rq_07', 'rq_12', 'rq_17', 'rq_22', 'rq_27', 'rq_32']
  const trustItems = ['rq_03', 'rq_08', 'rq_13', 'rq_18', 'rq_23', 'rq_28', 'rq_33']
  const conflictResolutionItems = ['rq_04', 'rq_09', 'rq_14', 'rq_19', 'rq_24', 'rq_29', 'rq_34']
  const sharedValuesItems = ['rq_05', 'rq_10', 'rq_15', 'rq_20', 'rq_25', 'rq_30', 'rq_35']

  const communication = calculateLikertScore(answerMap, communicationItems, [])
  const intimacy = calculateLikertScore(answerMap, intimacyItems, [])
  const trust = calculateLikertScore(answerMap, trustItems, [])
  const conflictResolution = calculateLikertScore(answerMap, conflictResolutionItems, [])
  const sharedValues = calculateLikertScore(answerMap, sharedValuesItems, [])

  const totalScore = (communication + intimacy + trust + conflictResolution + sharedValues) / 5

  let qualityLevel: 'excellent' | 'good' | 'moderate' | 'needs_work' | 'struggling'
  if (totalScore >= 80) qualityLevel = 'excellent'
  else if (totalScore >= 65) qualityLevel = 'good'
  else if (totalScore >= 50) qualityLevel = 'moderate'
  else if (totalScore >= 35) qualityLevel = 'needs_work'
  else qualityLevel = 'struggling'

  const strengths: string[] = []
  const areasForGrowth: string[] = []

  const categoryNames = [
    { key: 'communication', name: '沟通质量' },
    { key: 'intimacy', name: '亲密感' },
    { key: 'trust', name: '信任程度' },
    { key: 'conflictResolution', name: '冲突处理' },
    { key: 'sharedValues', name: '共同价值观' },
  ]

  categoryNames.forEach(({ key, name }) => {
    const score = [communication, intimacy, trust, conflictResolution, sharedValues][
      categoryNames.findIndex(c => c.key === key)
    ]
    if (score >= 70) strengths.push(name)
    else if (score < 50) areasForGrowth.push(name)
  })

  const types = [
    { level: 'excellent', name: '灵魂伴侣', emoji: '💖' },
    { level: 'good', name: '温暖伴侣', emoji: '💕' },
    { level: 'moderate', name: '成长中的关系', emoji: '🌱' },
    { level: 'needs_work', name: '需要调整的关系', emoji: '🔧' },
    { level: 'struggling', name: '需要帮助的关系', emoji: '🆘' },
  ]

  const typeInfo = types.find(t => t.level === qualityLevel) || types[2]

  return {
    totalScore: Math.round(totalScore),
    categoryScores: {
      communication: Math.round(communication),
      intimacy: Math.round(intimacy),
      trust: Math.round(trust),
      conflictResolution: Math.round(conflictResolution),
      sharedValues: Math.round(sharedValues),
    },
    qualityLevel,
    strengths,
    areasForGrowth,
    typeName: typeInfo.name,
    typeEmoji: typeInfo.emoji,
  }
}
