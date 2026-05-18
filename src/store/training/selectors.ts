import type { TrainingState } from './types'

export const selectTrainingRecords = (state: TrainingState) => state.trainingRecords
export const selectCurrentTrainingId = (state: TrainingState) => state.currentTrainingId
export const selectIsTrainingLoading = (state: TrainingState) => state.isLoading
export const selectTrainingCount = (state: TrainingState) => state.trainingRecords.length
export const selectTotalTrainingDuration = (state: TrainingState) =>
  state.trainingRecords.reduce((acc, r) => acc + r.duration, 0)
export const selectTrainingByCategory = (category: string) => (state: TrainingState) =>
  state.trainingRecords.filter((r) => r.category === category)
export const selectRecentTraining = (limit: number) => (state: TrainingState) =>
  state.trainingRecords.slice(0, limit)
