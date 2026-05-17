import type { Answer } from '../../types'

export function calculateMentalAge(
  chronologicalAge: number,
  answers: Answer[]
): { mentalAge: number; mentalAgeString: string; gap: number; description: string; } {
  const dimensionScores = {
    creativity: 0,
    curiosity: 0,
    emotionalIntelligence: 0,
    adaptability: 0,
    wisdom: 0,
  }

  const dimensionCount: Record<string, number> = {}
  Object.keys(dimensionScores).forEach(k => dimensionCount[k] = 0)

  answers.forEach(answer => {
    const dim = answer.dimension || ''
    const value = typeof answer.value === 'number' ? answer.value : 3
    if (Object.prototype.hasOwnProperty.call(dimensionScores, dim)) {
      dimensionScores[dim as keyof typeof dimensionScores] += value
      dimensionCount[dim]++
    }
  })

  Object.keys(dimensionScores).forEach(key => {
    if (dimensionCount[key] > 0) {
      dimensionScores[key as keyof typeof dimensionScores] = Math.round(
        (dimensionScores[key as keyof typeof dimensionScores] / dimensionCount[key] - 1) * 100 / 4
      )
    }
  })

  const mentalAge = Math.round(
    (Object.values(dimensionScores).reduce((a, b) => a + b, 0) / 5) * 0.4 + chronologicalAge * 0.6
  )

  const mentalAgeString = mentalAge >= 100 ? '100+' : mentalAge.toString()
  const gap = mentalAge - chronologicalAge
  const description = mentalAge >= chronologicalAge + 20
    ? '你的心理年龄远超实际年龄，展现出超乎寻常的成熟与智慧。'
    : mentalAge >= chronologicalAge + 10
      ? '你保持着相当年轻的心理状态，思维敏捷，富有创造力。'
      : mentalAge >= chronologicalAge
        ? '你的心理年龄与实际年龄相符，处于健康的平衡状态。'
        : mentalAge >= chronologicalAge - 10
          ? '你的心理年龄相对年轻，保持着对世界的好奇心和探索欲。'
          : '你的心理年龄非常年轻，童心未泯，永远对生活充满热情。'

  return {
    mentalAge,
    mentalAgeString,
    gap,
    description,
  }
}
