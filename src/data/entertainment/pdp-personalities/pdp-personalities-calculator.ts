import type { Answer, AssessmentResult, Dimension } from '../../../types'
import type { PDPType } from './pdp-personalities-common'
import { pdpProfiles } from './pdp-personalities-common'

interface PDPAnswer extends Answer {
  meta?: {
    dimension: PDPType
    reverse: boolean
    weight: number
  }
}

export function calculatePDP(answers: Answer[]): AssessmentResult {
  const typeScores: Record<PDPType, number[]> = {
    tiger: [],
    peacock: [],
    koala: [],
    owl: [],
    chameleon: [],
  }

  answers.forEach((answer: PDPAnswer) => {
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
  const finalScores: Record<PDPType, number> = {} as Record<PDPType, number>

  ;(Object.keys(typeScores) as PDPType[]).forEach((type) => {
    const scores = typeScores[type]
    if (scores.length > 0) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
      const normalizedScore = Math.min(100, Math.max(0, ((avgScore - 1) / 4) * 100))
      finalScores[type] = normalizedScore

      const profile = pdpProfiles[type]
      dimensions.push({
        name: profile.name,
        score: normalizedScore,
        description: profile.description,
      })
    }
  })

  dimensions.sort((a, b) => b.score - a.score)

  const primaryType = dimensions[0]?.name || '老虎型'
  const secondaryType = dimensions[1]?.name || '孔雀型'

  const topTwoTypes = (Object.keys(finalScores) as PDPType[])
    .sort((a, b) => finalScores[b] - finalScores[a])
    .slice(0, 2)

  const primaryProfile = pdpProfiles[topTwoTypes[0]]
  const secondaryProfile = pdpProfiles[topTwoTypes[1]]

  const traits = generateTraits(topTwoTypes, finalScores, dimensions)

  return {
    type: 'pdp-personalities',
    title: `你的性格类型是「${primaryType}」`,
    subtitle: primaryProfile?.title || '性格探索者',
    summary: primaryProfile?.description || '你是一个性格独特的人。',
    quote: primaryProfile?.quote || '"认识自己，是一切的开始。"',
    strength: primaryProfile?.strength || '独特优势',
    weakness: primaryProfile?.weakness || '需要改进的地方',
    dimensions,
    traits,
    details: {
      primary: {
        name: primaryProfile?.name || '老虎型',
        animal: primaryProfile?.animal || '老虎',
        description: primaryProfile?.description || '',
        tips: primaryProfile?.tips || [],
        careers: primaryProfile?.careers || [],
        relationships: primaryProfile?.relationships || '',
      },
      secondary: secondaryProfile ? {
        name: secondaryProfile.name,
        animal: secondaryProfile.animal,
        description: secondaryProfile.description,
        tips: secondaryProfile.tips,
        careers: secondaryProfile.careers,
        relationships: secondaryProfile.relationships,
      } : undefined,
    },
  }
}

function generateTraits(topTypes: PDPType[], scores: Record<PDPType, number>, dimensions: Dimension[]) {
  const traits: any[] = []

  if (topTypes.includes('tiger') && topTypes.includes('peacock')) {
    traits.push({ name: '领袖魅力型', description: '既有决策魄力，又有表现魅力，是天生的团队核心', positive: true })
  }

  if (topTypes.includes('koala') && topTypes.includes('owl')) {
    traits.push({ name: '沉稳内敛型', description: '兼具稳定性和分析力，是值得信赖的伙伴', positive: true })
  }

  if (topTypes.includes('chameleon') && topTypes.includes('peacock')) {
    traits.push({ name: '社交达人型', description: '灵活应变且善于表达，在社交场合如鱼得水', positive: true })
  }

  if (topTypes.includes('tiger') && topTypes.includes('owl')) {
    traits.push({ name: '战略执行型', description: '既能制定战略，又能注重执行细节', positive: true })
  }

  if (topTypes.includes('tiger')) {
    traits.push({ name: '目标导向', description: '你以结果为导向，追求成功和成就', positive: true })
  }

  if (topTypes.includes('peacock')) {
    traits.push({ name: '人际敏感', description: '你善于感知他人情绪，是社交场合的气氛制造者', positive: true })
  }

  if (topTypes.includes('koala')) {
    traits.push({ name: '和谐维护者', description: '你重视关系的和谐，是团队中的稳定力量', positive: true })
  }

  if (topTypes.includes('owl')) {
    traits.push({ name: '细节把控者', description: '你追求精确和完美，不放过任何细节', positive: true })
  }

  if (topTypes.includes('chameleon')) {
    traits.push({ name: '灵活适应者', description: '你能轻松应对各种环境，是天生的协调者', positive: true })
  }

  const hasBalancedScore = (Object.values(scores) as number[]).every(s => s >= 35 && s <= 75)
  if (hasBalancedScore && Object.keys(scores).length === 5) {
    const scoreRange = Math.max(...(Object.values(scores) as number[])) - Math.min(...(Object.values(scores) as number[]))
    if (scoreRange < 15) {
      traits.push({ name: '性格均衡型', description: '你的性格特征分布均衡，具有很好的适应能力', positive: true })
    }
  }

  return traits
}
