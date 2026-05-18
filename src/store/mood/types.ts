export interface MoodRecord {
  date: string
  mood: number
  timestamp: number
  note?: string
}

export interface MoodState {
  moodHistory: MoodRecord[]
  isLoading: boolean
}

export interface MoodActions {
  recordMood: (mood: number, note?: string) => void
  deleteMoodRecord: (date: string) => void
  clearMoodHistory: () => void
  setLoading: (loading: boolean) => void
}

export type MoodStore = MoodState & MoodActions
