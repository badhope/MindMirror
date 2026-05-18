import type { AssessmentState } from './types'

export const selectCurrentAssessmentId = (state: AssessmentState) => state.currentAssessmentId
export const selectCurrentAnswers = (state: AssessmentState) => state.currentAnswers
export const selectCompletedAssessments = (state: AssessmentState) => state.completedAssessments
export const selectAssessmentRecords = (state: AssessmentState) => state.records
export const selectAssessmentResults = (state: AssessmentState) => state.results
export const selectIsAssessmentLoading = (state: AssessmentState) => state.isLoading
export const selectAssessmentCount = (state: AssessmentState) => state.records.length
export const selectHasCompletedAssessment = (state: AssessmentState) => state.records.length > 0
