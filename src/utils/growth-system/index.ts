import {
  generatePersonalGrowthReport,
  createGrowthRecorder,
  TRAINING_PROGRAMS,
} from './personal-growth-analyzer'

import type {
  AssessmentRecord,
  GrowthInsight,
  TrainingSuggestion,
  PersonalGrowthReport,
} from './personal-growth-analyzer'

export type {
  AssessmentRecord,
  GrowthInsight,
  TrainingSuggestion,
  PersonalGrowthReport,
}

export {
  generatePersonalGrowthReport,
  createGrowthRecorder,
  TRAINING_PROGRAMS,
}

export function integrateResultToGrowthSystem(result: unknown, assessmentId: string, assessmentName: string) {
  const res = result as Record<string, unknown>
  const recorder = createGrowthRecorder()
  
  return recorder.save({
    assessmentId,
    assessmentName,
    dimensions: res.dimensions || [],
    traits: res.traits,
    overall: (res.overallScore || res.overall) as number | undefined,
    type: (res.type || res.typeCode) as string | undefined,
  })
}

export function generateResultWithTrainingSuggestions(result: unknown, _assessmentId: string) {
  const res = result as Record<string, unknown>
  const dimensions = (res.dimensions || []) as Array<Record<string, unknown>>
  
  const suggestions: TrainingSuggestion[] = []
  
  for (const dim of dimensions) {
    const score = (dim.percentile || dim.score || 50) as number
    
    if (score < 50) {
      const matchingPrograms = TRAINING_PROGRAMS.filter(p => 
        p.relatedDims.some(d => 
          (dim.dimensionId || dim.name || '').toLowerCase().includes(d.toLowerCase())
        )
      )
      if (matchingPrograms.length > 0 && !suggestions.find(s => s.id === matchingPrograms[0].id)) {
        suggestions.push(matchingPrograms[0])
      }
    }
  }
  
  return {
    ...res,
    recommendedTraining: suggestions.slice(0, 3),
  }
}
