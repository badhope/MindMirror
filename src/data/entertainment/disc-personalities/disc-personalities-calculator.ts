import type { Answer, AssessmentResult, Dimension } from '../../../types'
import type { DISCType } from './disc-personalities-common'
import { discProfiles, discCombinations } from './disc-personalities-common'

interface DISCAnswer extends Answer {
  meta?: {
    dimension: DISCType
    reverse: boolean
    weight: number
  }
}

export function calculateDISC(answers: Answer[]): AssessmentResult {
  const typeScores: Record<DISCType, number[]> = {
    D: [],
    I: [],
    S: [],
    C: [],
  }

  answers.forEach((answer: DISCAnswer) => {
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
  const finalScores: Record<DISCType, number> = {} as Record<DISCType, number>

  ;(Object.keys(typeScores) as DISCType[]).forEach((type) => {
    const scores = typeScores[type]
    if (scores.length > 0) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
      const normalizedScore = Math.min(100, Math.max(0, ((avgScore - 1) / 4) * 100))
      finalScores[type] = normalizedScore

      const profile = discProfiles[type]
      dimensions.push({
        name: profile.name,
        score: normalizedScore,
        description: profile.description,
      })
    }
  })

  dimensions.sort((a, b) => b.score - a.score)

  const primaryType = dimensions[0]?.name?.split('（')[0] || 'D型'
  const secondaryType = dimensions[1]?.name?.split('（')[0] || 'I型'

  const topTwoTypes = (Object.keys(finalScores) as DISCType[])
    .sort((a, b) => finalScores[b] - finalScores[a])
    .slice(0, 2)

  const primaryProfile = discProfiles[topTwoTypes[0]]
  const secondaryProfile = discProfiles[topTwoTypes[1]]

  const traits = generateTraits(topTwoTypes, finalScores, dimensions)
  const combination = generateCombination(topTwoTypes)

  return {
    type: 'disc-personalities',
    title: `你的性格类型是「${primaryProfile?.name}」`,
    subtitle: primaryProfile?.title || '性格探索者',
    summary: primaryProfile?.description || '你是一个性格独特的人。',
    quote: primaryProfile?.quote || '"认识自己，是一切的开始。"',
    strength: primaryProfile?.strength || '独特优势',
    weakness: primaryProfile?.weakness || '需要改进的地方',
    dimensions,
    traits,
    details: {
      primary: {
        name: primaryProfile?.name || 'D型',
        color: primaryProfile?.color || '#666',
        title: primaryProfile?.title || '',
        description: primaryProfile?.description || '',
        strength: primaryProfile?.strength || '',
        weakness: primaryProfile?.weakness || '',
        tips: primaryProfile?.tips || [],
        communication: primaryProfile?.communication || [],
        workStyle: primaryProfile?.workStyle || [],
        careers: primaryProfile?.careers || [],
        teamRole: primaryProfile?.teamRole || '',
        leadership: primaryProfile?.leadership || '',
      },
      secondary: secondaryProfile ? {
        name: secondaryProfile.name,
        color: secondaryProfile.color,
        title: secondaryProfile.title,
        description: secondaryProfile.description,
        strength: secondaryProfile.strength,
        weakness: secondaryProfile.weakness,
        tips: secondaryProfile.tips,
        communication: secondaryProfile.communication,
        workStyle: secondaryProfile.workStyle,
        careers: secondaryProfile.careers,
        teamRole: secondaryProfile.teamRole,
        leadership: secondaryProfile.leadership,
      } : undefined,
      combination,
    },
  }
}

function generateTraits(topTypes: DISCType[], scores: Record<DISCType, number>, dimensions: Dimension[]) {
  const traits: any[] = []

  if (topTypes.includes('D') && topTypes.includes('I')) {
    traits.push({ name: '领袖魅力型', description: '既有决策魄力，又有社交魅力，是天生的团队核心', positive: true })
  }

  if (topTypes.includes('S') && topTypes.includes('C')) {
    traits.push({ name: '沉稳专业型', description: '兼具稳定性和分析力，是值得信赖的专业伙伴', positive: true })
  }

  if (topTypes.includes('I') && topTypes.includes('S')) {
    traits.push({ name: '亲和支持型', description: '温暖友善且善于倾听，是最受欢迎的合作者', positive: true })
  }

  if (topTypes.includes('D') && topTypes.includes('C')) {
    traits.push({ name: '精确决策型', description: '既能果断决策，又能精益求精', positive: true })
  }

  if (topTypes.includes('D')) {
    traits.push({ name: '目标导向', description: '你以结果为导向，追求成功和成就', positive: true })
  }

  if (topTypes.includes('I')) {
    traits.push({ name: '人际敏感', description: '你善于感知他人情绪，是社交场合的气氛制造者', positive: true })
  }

  if (topTypes.includes('S')) {
    traits.push({ name: '和谐维护者', description: '你重视关系的和谐，是团队中的稳定力量', positive: true })
  }

  if (topTypes.includes('C')) {
    traits.push({ name: '细节把控者', description: '你追求精确和完美，不放过任何细节', positive: true })
  }

  const hasBalancedScore = (Object.values(scores) as number[]).every(s => s >= 35 && s <= 75)
  if (hasBalancedScore && Object.keys(scores).length === 4) {
    const scoreRange = Math.max(...(Object.values(scores) as number[])) - Math.min(...(Object.values(scores) as number[]))
    if (scoreRange < 15) {
      traits.push({ name: '性格均衡型', description: '你的性格特征分布均衡，具有很好的适应能力', positive: true })
    }
  }

  return traits
}

function generateCombination(topTypes: DISCType[]) {
  const key = topTypes.join('')
  const reverseKey = topTypes.slice().reverse().join('')
  return discCombinations[key] || discCombinations[reverseKey] || null
}
