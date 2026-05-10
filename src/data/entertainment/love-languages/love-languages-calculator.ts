import type { Answer, AssessmentResult, Dimension } from '../../../types'
import type { LoveLanguageType } from './love-languages-common'
import { loveLanguageProfiles } from './love-languages-common'

interface LoveLanguageAnswer extends Answer {
  meta?: {
    dimension: LoveLanguageType
    reverse: boolean
    weight: number
  }
}

export function calculateLoveLanguages(answers: Answer[]): AssessmentResult {
  const languageScores: Record<LoveLanguageType, number[]> = {
    words: [],
    time: [],
    gifts: [],
    service: [],
    touch: [],
  }

  answers.forEach((answer: LoveLanguageAnswer) => {
    const meta = answer.meta
    if (!meta) return

    let score = answer.value || 3
    if (meta.reverse) {
      score = 6 - score
    }

    const weightedScore = score * (meta.weight || 1)
    languageScores[meta.dimension].push(weightedScore)
  })

  const dimensions: Dimension[] = []
  const finalScores: Record<LoveLanguageType, number> = {} as Record<LoveLanguageType, number>

  ;(Object.keys(languageScores) as LoveLanguageType[]).forEach((lang) => {
    const scores = languageScores[lang]
    if (scores.length > 0) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
      const normalizedScore = Math.min(100, Math.max(0, ((avgScore - 1) / 4) * 100))
      finalScores[lang] = normalizedScore

      const profile = loveLanguageProfiles[lang]
      dimensions.push({
        name: profile.name,
        score: normalizedScore,
        description: profile.description,
      })
    }
  })

  dimensions.sort((a, b) => b.score - a.score)

  const primaryLanguage = dimensions[0]?.name || '肯定的言语'
  const secondaryLanguage = dimensions[1]?.name || '精心时刻'

  const topTwoTypes = (Object.keys(finalScores) as LoveLanguageType[])
    .sort((a, b) => finalScores[b] - finalScores[a])
    .slice(0, 2)

  const primaryProfile = loveLanguageProfiles[topTwoTypes[0]]
  const secondaryProfile = loveLanguageProfiles[topTwoTypes[1]]

  const traits = generateTraits(topTwoTypes, finalScores)

  return {
    type: 'love-languages',
    title: `你的主要爱情语言是「${primaryLanguage}」`,
    subtitle: primaryProfile?.title || '爱情语言探索者',
    summary: primaryProfile?.description || '你是一个对爱有独特理解的人。',
    quote: primaryProfile?.quote || '"爱是永恒的话题。"',
    strength: primaryProfile?.strength || '独特魅力',
    weakness: primaryProfile?.weakness || '需要更多理解',
    dimensions,
    traits,
    details: {
      primary: {
        name: primaryProfile?.name || '肯定的言语',
        description: primaryProfile?.description || '',
        tips: primaryProfile?.tips || [],
        examples: primaryProfile?.examples || [],
      },
      secondary: secondaryProfile ? {
        name: secondaryProfile.name,
        description: secondaryProfile.description,
        tips: secondaryProfile.tips,
        examples: secondaryProfile.examples,
      } : undefined,
    },
  }
}

function generateTraits(topTypes: LoveLanguageType[], scores: Record<LoveLanguageType, number>) {
  const traits: any[] = []

  if (topTypes.includes('words') && topTypes.includes('time')) {
    traits.push({ name: '浪漫主义者', description: '既需要言语的温度，也需要陪伴的深度', positive: true })
  }

  if (topTypes.includes('service') && topTypes.includes('gifts')) {
    traits.push({ name: '务实浪漫派', description: '既看重实际行动，也欣赏仪式感', positive: true })
  }

  if (topTypes.includes('touch') && topTypes.includes('time')) {
    traits.push({ name: '亲密陪伴型', description: '渴望身体和心灵的双重连接', positive: true })
  }

  if (topTypes.includes('words')) {
    traits.push({ name: '语言敏感者', description: '你对他人的话语非常敏感，一句赞美能温暖一整天', positive: true })
  }

  if (topTypes.includes('time')) {
    traits.push({ name: '时间守护者', description: '你觉得高质量的陪伴是最珍贵的礼物', positive: true })
  }

  if (topTypes.includes('gifts')) {
    traits.push({ name: '仪式感达人', description: '你相信礼物承载着心意，细节里藏着爱', positive: true })
  }

  if (topTypes.includes('service')) {
    traits.push({ name: '行动派恋人', description: '你觉得爱是做出来的，不是说出来的', positive: true })
  }

  if (topTypes.includes('touch')) {
    traits.push({ name: '触觉型依恋', description: '身体接触是你感受爱的重要方式', positive: true })
  }

  const hasBalancedScore = (Object.values(scores) as number[]).every(s => s >= 40 && s <= 80)
  if (hasBalancedScore && Object.keys(scores).length === 5) {
    traits.push({ name: '爱的全才', description: '你对各种形式的爱的感知都比较均衡，是个很好的伴侣', positive: true })
  }

  return traits
}
