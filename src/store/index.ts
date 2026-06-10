import { create } from 'zustand';
import { Assessment, Question, AssessmentResult } from '../types';
import { storage } from '../lib/utils';
import { calculateBigFiveScores, calculateOverallScore } from '../services/bigFiveScoring';
import { calculateStressTestTraits } from '../services/stressTestScoring';
import { calculateGAD7Traits } from '../services/anxietyGad7Scoring';
import { calculateSSRSTraits } from '../services/ssrsScoring';
import { calculateMBITraits } from '../services/mbiScoring';
import { calculateSWLSTraits } from '../services/swlsScoring';
import { calculateResilienceTraits } from '../services/resilienceScoring';
import { analysisCache } from '../services/dashboard/AnalysisCache';
import { achievementService } from '../services/achievement/AchievementService';
import { tagService } from '../services/dashboard/TagService';
import { moodTrackerService } from '../services/mood/MoodTrackerService';
import { trainingService } from '../services/training/TrainingService';
import type { Locale } from '../i18n';

/**
 * Recompute the AchievementCheckState from the latest on-disk
 * services, run `achievementService.checkAndUnlock`, and refresh
 * tag counts.
 *
 * Called from every history mutation (add/clear/delete) so the
 * achievements page never shows stale progress.  We pull
 * training + mood + history from their respective storage services
 * because they each own their own persistence layer; the store is
 * intentionally the thin glue over the localStorage-bound data
 * sources and the React-facing actions.
 */
function runAchievementRefresh(history: AssessmentResult[]): void {
  try {
    const allTraining = trainingService.getSessionHistory('default');
    const trainingCompleted = allTraining.filter(s => !!s.completedAt).length;
    const moodEntries = moodTrackerService.getAll().length;
    const moodStreak = moodTrackerService.getStats().streakDays;
    const bigFiveCount = history.filter(
      h => h.assessmentId === 'big-five' || h.assessmentId === 'bigfive'
    ).length;
    const stressCount = history.filter(h => h.assessmentId === 'stress-test').length;
    const anxietyCount = history.filter(h => h.assessmentId === 'anxiety-gad7').length;
    const socialSupportCount = history.filter(h => h.assessmentId === 'social-support').length;
    const mbiCount = history.filter(h => h.assessmentId === 'mbi-burnout').length;
    const swlsCount = history.filter(h => h.assessmentId === 'life-satisfaction').length;
    const resilienceCount = history.filter(h => h.assessmentId === 'resilience-cdrisc').length;
    const checkState = {
      totalAssessments: history.length,
      bigFiveCount,
      stressCount,
      anxietyCount,
      socialSupportCount,
      mbiCount,
      swlsCount,
      resilienceCount,
      trainingCompleted,
      streakDays: moodStreak,
      moodEntries,
      // The compare-counter lives in PersonalDashboard local state; we
      // don't track it across navigations yet, so 0 is the safe
      // minimum (no achievement is ever auto-unlocked without a real
      // comparison).  Achievements page still shows progress.
      compareCount: 0,
      allAssessments: history,
    };
    achievementService.checkAndUnlock(checkState);
    // Refresh tag result counts so History / Compare show the right
    // numbers; the auto-tag pass operates on the new history.
    refreshTagCountsFromHistory(history);
  } catch (e) {
    // never let a service hiccup break the store mutation
    console.warn('[runAchievementRefresh] failed:', e);
  }
}

/**
 * Re-apply the AUTO_TAGS to each history entry and persist the
 * result counts.  Operates on the store's `AssessmentResult[]`
 * shape (not the derived `UnifiedAssessmentResult[]`), so the
 * logic is a slimmed-down version of TagService.applyTagsToResults
 * that doesn't depend on the legacy `personalDataCenter` cache.
 */
function refreshTagCountsFromHistory(history: AssessmentResult[]): void {
  try {
    const allTags = tagService.getAllTags();
    const counts: Record<string, number> = {};
    for (const h of history) {
      const traits = h.traits || [];
      for (const tag of allTags) {
        if (matchesAutoTag(tag, traits, h)) {
          counts[tag.name] = (counts[tag.name] || 0) + 1;
        }
      }
    }
    // Persist back to storage so Dashboard
    // see the right counts on the next read.  We don't try to mutate
    // the in-memory `autoTags` array on the service; the persistence
    // is via userTags which holds the same `resultCount` field.
    tagService.rewriteCounts(counts);
  } catch (e) {
    console.warn('[refreshTagCountsFromHistory] failed:', e);
  }
}

function matchesAutoTag(
  tag: {
    id: string;
    criteria?: {
      type: string;
      conditions: Array<{
        trait?: string;
        assessmentType?: string;
        operator: string;
        value: unknown;
      }>;
      operator: string;
    };
  },
  traits: Array<{ name: string; score: number }>,
  _history: AssessmentResult
): boolean {
  const c = tag.criteria;
  if (!c || c.type !== 'automatic' || c.conditions.length === 0) return false;
  const results = c.conditions.map(cond => {
    if (cond.trait) {
      const t = traits.find(x => x.name === cond.trait);
      if (!t) return false;
      const target = cond.value;
      switch (cond.operator) {
        case 'gt':
          return t.score > Number(target);
        case 'lt':
          return t.score < Number(target);
        case 'eq':
          return t.score === Number(target);
        default:
          return false;
      }
    }
    return false;
  });
  if (c.operator === 'and') return results.every(r => r);
  return results.some(r => r);
}

const STORAGE_KEY_HISTORY = 'assessmentHistory';
const STORAGE_KEY_LOCALE = 'locale';

interface AppState {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, number>;

  result: AssessmentResult | null;

  isLoading: boolean;
  currentStep: 'intro' | 'quiz' | 'result';
  isSidebarOpen: boolean;

  locale: Locale;

  assessmentHistory: AssessmentResult[];

  setAssessments: (assessments: Assessment[]) => void;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, score: number) => void;
  setCurrentStep: (step: 'intro' | 'quiz' | 'result') => void;
  setResult: (result: AssessmentResult | null) => void;
  resetAssessment: () => void;
  calculateResult: (assessmentId: string, assessmentTitle: string) => void;

  setLocale: (locale: Locale) => void;

  loadHistory: () => void;
  addToHistory: (result: AssessmentResult) => void;
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => {
  const initialHistory = storage.get<AssessmentResult[]>(STORAGE_KEY_HISTORY, []);
  const initialLocale = storage.get<Locale>(STORAGE_KEY_LOCALE, 'zh');

  return {
    assessments: [],
    currentAssessment: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    result: null,
    isLoading: false,
    currentStep: 'intro',
    isSidebarOpen: false,
    locale: initialLocale,
    assessmentHistory: initialHistory,

    setAssessments: assessments => set({ assessments }),

    setCurrentAssessment: assessment => set({ currentAssessment: assessment }),

    setQuestions: questions => set({ questions }),

    setCurrentQuestionIndex: index => set({ currentQuestionIndex: index }),

    setAnswer: (questionId, score) =>
      set(state => ({
        answers: { ...state.answers, [questionId]: score },
      })),

    setCurrentStep: step => set({ currentStep: step }),

    setResult: result => set({ result }),

    setLocale: locale => {
      storage.set(STORAGE_KEY_LOCALE, locale);
      set({ locale });
    },

    resetAssessment: () =>
      set({
        currentQuestionIndex: 0,
        answers: {},
        result: null,
        currentStep: 'intro',
      }),

    calculateResult: (assessmentId, assessmentTitle) => {
      const { answers, questions } = get();

      let traits;
      let totalScore;

      if (assessmentId === 'stress-test' || assessmentId === '2') {
        traits = calculateStressTestTraits(answers, questions);
        totalScore = traits[0]?.score || 0;
      } else if (assessmentId === 'anxiety-gad7' || assessmentId === '3') {
        traits = calculateGAD7Traits(answers, questions);
        totalScore = traits[0]?.score || 0;
      } else if (assessmentId === 'social-support' || assessmentId === '4') {
        traits = calculateSSRSTraits(answers, questions);
        totalScore = traits[0]?.score || 0;
      } else if (assessmentId === 'mbi-burnout' || assessmentId === '5') {
        traits = calculateMBITraits(answers, questions);
        totalScore = traits[0]?.score || 0;
      } else if (assessmentId === 'life-satisfaction' || assessmentId === '6') {
        traits = calculateSWLSTraits(answers, questions);
        totalScore = traits[0]?.score || 0;
      } else if (assessmentId === 'resilience-cdrisc' || assessmentId === '7') {
        traits = calculateResilienceTraits(answers, questions);
        totalScore = traits[0]?.score || 0;
      } else {
        traits = calculateBigFiveScores(answers, questions);
        totalScore = calculateOverallScore(traits);
      }

      const result: AssessmentResult = {
        id: Date.now().toString(),
        totalScore,
        traits,
        completedAt: new Date(),
        assessmentId,
        assessmentTitle,
      };

      set({ result, currentStep: 'result' });
      get().addToHistory(result);
    },

    loadHistory: () => {
      const history = storage.get<AssessmentResult[]>(STORAGE_KEY_HISTORY, []);
      set({ assessmentHistory: history });
    },

    addToHistory: result =>
      set(state => {
        // De-dupe: same assessment within the same minute would just
        // stack up duplicates when the user revisits the result page
        // or re-runs the quiz by accident. Replace the existing entry
        // so the user gets the latest score in place of the older one.
        const dupeIdx = state.assessmentHistory.findIndex(h => {
          if (h.assessmentId !== result.assessmentId) return false;
          const tA = new Date(h.completedAt).getTime();
          const tB = new Date(result.completedAt).getTime();
          return Math.abs(tA - tB) < 60_000;
        });
        if (dupeIdx >= 0) {
          const next = state.assessmentHistory.slice();
          next[dupeIdx] = result;
          storage.set(STORAGE_KEY_HISTORY, next);
          // Always invalidate the dashboard cache on mutation — even
          // an in-place score replace should rerun the analysis so
          // insights/trends reflect the latest value.
          analysisCache.invalidate();
          // Re-evaluate achievements/tags with the new history (they
          // are derived state — they don't live in the history array
          // itself, so we just need to refresh them).
          runAchievementRefresh(next);
          return { assessmentHistory: next };
        }
        const newHistory = [result, ...state.assessmentHistory];
        storage.set(STORAGE_KEY_HISTORY, newHistory);
        analysisCache.invalidate();
        runAchievementRefresh(newHistory);
        return { assessmentHistory: newHistory };
      }),

    clearHistory: () =>
      set(() => {
        storage.set(STORAGE_KEY_HISTORY, []);
        // History is gone — there's nothing to cache an analysis of.
        analysisCache.clear();
        // Re-evaluate achievements (most assessment-related ones will
        // un-unlock... actually we don't un-unlock here because
        // achievements are sticky; we only re-check in case a related
        // mood/streak count is affected).  Tag stats will refresh on
        // next dashboard mount.
        runAchievementRefresh([]);
        return { assessmentHistory: [] };
      }),

    deleteHistoryItem: id =>
      set(state => {
        const newHistory = state.assessmentHistory.filter(item => item.id !== id);
        storage.set(STORAGE_KEY_HISTORY, newHistory);
        analysisCache.invalidate();
        runAchievementRefresh(newHistory);
        return { assessmentHistory: newHistory };
      }),

    toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),

    setSidebarOpen: open => set({ isSidebarOpen: open }),
  };
});
