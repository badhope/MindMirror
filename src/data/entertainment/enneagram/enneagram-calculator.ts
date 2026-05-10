import type { Answer, AssessmentResult, Dimension } from '../../../types'
import type { EnneagramType } from './enneagram-common'
import { enneagramProfiles } from './enneagram-common'

interface EnneagramAnswer extends Answer {
  meta?: {
    dimension: EnneagramType
    reverse: boolean
    weight: number
  }
}

const typeOrder: EnneagramType[] = [
  'type1', 'type2', 'type3', 'type4', 'type5',
  'type6', 'type7', 'type8', 'type9',
]

export function calculateEnneagram(answers: Answer[]): AssessmentResult {
  const typeScores: Record<EnneagramType, number[]> = {
    type1: [], type2: [], type3: [], type4: [], type5: [],
    type6: [], type7: [], type8: [], type9: [],
  }

  answers.forEach((answer: EnneagramAnswer) => {
    const meta = answer.meta
    if (!meta) return

    let score = answer.value || 3
    if (meta.reverse) {
      score = 6 - score
    }

    const weightedScore = score * (meta.weight || 1)
    typeScores[meta.dimension].push(weightedScore)
  })

  const dimensions: Dimension[] = []
  const finalScores: Record<EnneagramType, number> = {} as Record<EnneagramType, number>

  typeOrder.forEach((type) => {
    const scores = typeScores[type]
    if (scores.length > 0) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
      const normalizedScore = Math.min(100, Math.max(0, ((avgScore - 1) / 4) * 100))
      finalScores[type] = normalizedScore

      const profile = enneagramProfiles[type]
      dimensions.push({
        name: profile.chineseName,
        score: normalizedScore,
        description: `${profile.name} - ${profile.title}`,
      })
    }
  })

  dimensions.sort((a, b) => b.score - a.score)

  const topTypes = typeOrder
    .sort((a, b) => finalScores[b] - finalScores[a])
    .slice(0, 3)

  const primaryType = topTypes[0] as EnneagramType
  const secondaryType = topTypes[1] as EnneagramType
  const tertiaryType = topTypes[2] as EnneagramType

  const primaryProfile = enneagramProfiles[primaryType]
  const secondaryProfile = enneagramProfiles[secondaryType]

  const wings = determineWings(primaryType, finalScores)
  const traits = generateTraits(topTypes, finalScores)

  return {
    type: 'enneagram',
    title: `你的九型人格是「${primaryProfile.chineseName}」`,
    subtitle: `${primaryProfile.name} - ${primaryProfile.title}`,
    summary: primaryProfile.description,
    quote: primaryProfile.quote,
    strength: primaryProfile.strength,
    weakness: primaryProfile.weakness,
    dimensions,
    traits,
    details: {
      primary: {
        name: primaryProfile.chineseName,
        type: primaryProfile.name,
        description: primaryProfile.description,
        coreFear: primaryProfile.coreFear,
        coreDesire: primaryProfile.coreDesire,
        tips: primaryProfile.tips,
        careers: primaryProfile.careers,
        growth: primaryProfile.growth,
        workplace: primaryProfile.workplace,
        relationship: primaryProfile.relationship,
        social: primaryProfile.social,
        wing: wings,
      },
      secondary: {
        name: secondaryProfile.chineseName,
        type: secondaryProfile.name,
        description: secondaryProfile.description,
        coreFear: secondaryProfile.coreFear,
        coreDesire: secondaryProfile.coreDesire,
        tips: secondaryProfile.tips,
        careers: secondaryProfile.careers,
        growth: secondaryProfile.growth,
        workplace: secondaryProfile.workplace,
        relationship: secondaryProfile.relationship,
        social: secondaryProfile.social,
        wing: null,
      },
    },
    enneagram: {
      heart: {
        type1: finalScores.type1,
        type2: finalScores.type2,
        type3: finalScores.type3,
      },
      head: {
        type5: finalScores.type5,
        type6: finalScores.type6,
        type7: finalScores.type7,
      },
      gut: {
        type8: finalScores.type8,
        type9: finalScores.type9,
      },
      primaryType,
      secondaryType,
      tertiaryType,
    },
  }
}

function determineWings(
  primaryType: EnneagramType,
  scores: Record<EnneagramType, number>
): { main: string; plus?: string; minus?: string; plusScore: number; minusScore: number } {
  const profile = enneagramProfiles[primaryType]
  const wingTypes = getWingTypes(primaryType)

  let plusScore = 0
  let minusScore = 0

  if (wingTypes.plus) {
    plusScore = scores[wingTypes.plus] || 0
  }
  if (wingTypes.minus) {
    minusScore = scores[wingTypes.minus] || 0
  }

  return {
    main: profile.name,
    plus: wingTypes.plus ? profile.wing.plus : undefined,
    minus: wingTypes.minus ? profile.wing.minus : undefined,
    plusScore,
    minusScore,
  }
}

function getWingTypes(type: EnneagramType): { plus?: EnneagramType; minus?: EnneagramType } {
  const wingMap: Record<EnneagramType, { plus?: EnneagramType; minus?: EnneagramType }> = {
    type1: { minus: 'type9', plus: 'type2' },
    type2: { minus: 'type1', plus: 'type3' },
    type3: { minus: 'type2', plus: 'type4' },
    type4: { minus: 'type3', plus: 'type5' },
    type5: { minus: 'type4', plus: 'type6' },
    type6: { minus: 'type5', plus: 'type7' },
    type7: { minus: 'type6', plus: 'type8' },
    type8: { minus: 'type7', plus: 'type9' },
    type9: { minus: 'type8', plus: 'type1' },
  }
  return wingMap[type]
}

function generateTraits(topTypes: EnneagramType[], scores: Record<EnneagramType, number>) {
  const traits: any[] = []
  const primaryType = topTypes[0]

  if (topTypes.includes('type1') && topTypes.includes('type3')) {
    traits.push({ name: '目标达成型', description: '既有理想追求，又有执行动力，是追求卓越的代表', positive: true })
  }

  if (topTypes.includes('type2') && topTypes.includes('type4')) {
    traits.push({ name: '情感丰富型', description: '对情感有深刻理解，是天生的情感导师', positive: true })
  }

  if (topTypes.includes('type5') && topTypes.includes('type7')) {
    traits.push({ name: '创意探索型', description: '兼具深度思考和广泛兴趣，创意无限', positive: true })
  }

  if (topTypes.includes('type6') && topTypes.includes('type9')) {
    traits.push({ name: '稳定忠诚型', description: '可靠且善于维护和谐，是值得信赖的伙伴', positive: true })
  }

  if (topTypes.includes('type8')) {
    traits.push({ name: '领导者气质', description: '你天生具有领导力，愿意保护和支持他人', positive: true })
  }

  const triad = getTriad(primaryType)
  traits.push({
    name: `${getTriadName(triad)}三元组`,
    description: `你的核心驱动力主要来自${getTriadDescription(triad)}`,
    positive: true,
  })

  if (topTypes.includes('type1') || topTypes.includes('type4') || topTypes.includes('type7')) {
    traits.push({ name: '内在驱动型', description: '你主要被内在愿景和理想所驱动', positive: true })
  }

  if (topTypes.includes('type2') || topTypes.includes('type5') || topTypes.includes('type8')) {
    traits.push({ name: '能力自信型', description: '你通过展示能力和自信来获得安全感', positive: true })
  }

  if (topTypes.includes('type3') || topTypes.includes('type6') || topTypes.includes('type9')) {
    traits.push({ name: '环境适应型', description: '你善于根据环境调整自己以获得归属', positive: true })
  }

  return traits
}

function getTriad(type: EnneagramType): 'heart' | 'head' | 'gut' {
  if (['type2', 'type3', 'type4'].includes(type)) return 'heart'
  if (['type5', 'type6', 'type7'].includes(type)) return 'head'
  return 'gut'
}

function getTriadName(triad: 'heart' | 'head' | 'gut'): string {
  const names = { heart: '心', head: '脑', gut: '腹' }
  return names[triad]
}

function getTriadDescription(triad: 'heart' | 'head' | 'gut'): string {
  const descriptions = {
    heart: '情感和关系的体验',
    head: '思考和认知的活动',
    gut: '本能和行动的驱动力',
  }
  return descriptions[triad]
}
