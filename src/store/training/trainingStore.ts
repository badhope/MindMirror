import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TrainingStore, TrainingState, TrainingRecord } from './types'

const initialState: TrainingState = {
  trainingRecords: [],
  currentTrainingId: null,
  isLoading: false,
}

export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set) => ({
      ...initialState,

      addTrainingRecord: (record: Omit<TrainingRecord, 'id'>) =>
        set((state) => ({
          trainingRecords: [
            { ...record, id: crypto.randomUUID() },
            ...state.trainingRecords,
          ],
        })),

      deleteTrainingRecord: (id: string) =>
        set((state) => ({
          trainingRecords: state.trainingRecords.filter((r) => r.id !== id),
        })),

      clearTrainingRecords: () => set({ trainingRecords: [] }),

      setCurrentTraining: (id: string | null) => set({ currentTrainingId: id }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'mindmirror-training',
      partialize: (state) => ({ trainingRecords: state.trainingRecords }),
    }
  )
)
