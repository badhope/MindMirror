import type { Answer, CompletedAssessment } from '@/types'

export interface AssessmentRecord {
  id: string
  assessmentId: string
  completedAt: number
  answers: Record<string, string | number>
  result: Record<string, number | string>
}

export interface AssessmentState {
  currentAssessmentId: string | null
  currentAnswers: Answer[]
  completedAssessments: CompletedAssessment[]
  records: AssessmentRecord[]
  results: Record<string, { data: Record<string, unknown> }> | null
  isLoading: boolean
}

export interface AssessmentActions {
  setCurrentAssessment: (id: string) => void
  addAnswer: (answer: Answer) => void
  updateAnswer: (questionId: string, answer: Answer) => void
  clearCurrentAssessment: () => void
  addCompletedAssessment: (assessment: CompletedAssessment) => void
  deleteAssessment: (recordId: string) => void
  clearAllAssessments: () => void
  addRecord: (record: Omit<AssessmentRecord, 'id'>) => void
  setResults: (results: Record<string, { data: Record<string, unknown> }>) => void
  setLoading: (loading: boolean) => void
}

export type AssessmentStore = AssessmentState & AssessmentActions
