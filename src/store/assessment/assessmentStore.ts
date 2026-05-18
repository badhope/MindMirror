import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AssessmentStore, AssessmentState, AssessmentRecord } from './types'
import type { Answer, CompletedAssessment } from '@/types'

const initialState: AssessmentState = {
  currentAssessmentId: null,
  currentAnswers: [],
  completedAssessments: [],
  records: [],
  results: null,
  isLoading: false,
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentAssessment: (id: string) => set({
        currentAssessmentId: id,
        currentAnswers: [],
      }),

      addAnswer: (answer: Answer) =>
        set((state) => ({
          currentAnswers: [...state.currentAnswers, answer],
        })),

      updateAnswer: (questionId: string, answer: Answer) =>
        set((state) => ({
          currentAnswers: state.currentAnswers.map((a) =>
            a.questionId === questionId ? answer : a
          ),
        })),

      clearCurrentAssessment: () => set({
        currentAssessmentId: null,
        currentAnswers: [],
      }),

      addCompletedAssessment: (assessment: CompletedAssessment) =>
        set((state) => ({
          completedAssessments: [assessment, ...state.completedAssessments],
        })),

      deleteAssessment: (recordId: string) =>
        set((state) => ({
          completedAssessments: state.completedAssessments.filter((a) => a.id !== recordId),
        })),

      clearAllAssessments: () => set({
        completedAssessments: [],
        records: [],
      }),

      addRecord: (record: Omit<AssessmentRecord, 'id'>) =>
        set((state) => ({
          records: [{ id: crypto.randomUUID(), ...record }, ...state.records],
        })),

      setResults: (results) => set({ results }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'mindmirror-assessment',
      partialize: (state) => ({
        records: state.records,
        completedAssessments: state.completedAssessments,
        results: state.results,
      }),
    }
  )
)
