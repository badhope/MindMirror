export interface TrainingRecord {
  id: string
  programId: string
  completedAt: number
  duration: number
  category: string
}

export interface TrainingState {
  trainingRecords: TrainingRecord[]
  currentTrainingId: string | null
  isLoading: boolean
}

export interface TrainingActions {
  addTrainingRecord: (record: Omit<TrainingRecord, 'id'>) => void
  deleteTrainingRecord: (id: string) => void
  clearTrainingRecords: () => void
  setCurrentTraining: (id: string | null) => void
  setLoading: (loading: boolean) => void
}

export type TrainingStore = TrainingState & TrainingActions
