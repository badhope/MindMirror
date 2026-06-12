// 镜心 · Zustand 全局状态
//
// 持久化键：mindmirror-v2（版本号便于迁移）
// 持久化字段：answers + locale + theme + 进度（phase / domain / currentIndex）
// 报告（report）不入盘：可由 answers + domain 在映照页重新计算
// 故：刷新可在原页面继续；清空则通过 reset() 主动清 localStorage

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DomainId } from './domain/figures/figure.types';
import type { MatchReport } from './domain/matching/report';
import type { ExportShape } from './share';

type Phase = 'prologue' | 'path' | 'way' | 'reflection';
type Locale = 'zh' | 'en';
type Theme = 'light' | 'dark';

type State = {
  phase: Phase;
  domain: DomainId | null;
  answers: Record<string, number>;
  currentIndex: number;
  locale: Locale;
  theme: Theme;
  report: MatchReport | null;
  version: number; // 用于数据迁移
};

type Actions = {
  goPhase: (p: Phase) => void;
  selectDomain: (d: DomainId) => void;
  answer: (itemId: string, optIdx: number) => void;
  goPrev: () => void;
  goNext: () => void;
  setReport: (r: MatchReport) => void;
  reset: () => void;
  setLocale: (l: Locale) => void;
  setTheme: (th: Theme) => void;
  importState: (s: ExportShape) => void;
};

const STORAGE_KEY = 'mindmirror-v2';
const CURRENT_VERSION = 2;

const detectInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(`${STORAGE_KEY}.theme`);
  if (saved === 'light' || saved === 'dark') return saved;
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
};

const applyTheme = (th: Theme) => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', th);
};

// 数据迁移函数
const migrateState = (persistedState: any): State => {
  if (!persistedState.version || persistedState.version < 2) {
    // v1 -> v2: 添加 version 字段
    return {
      ...persistedState,
      version: CURRENT_VERSION,
    };
  }
  return persistedState;
};

export const useStore = create<State & Actions>()(
  persist(
    set => ({
      phase: 'prologue',
      domain: null,
      answers: {},
      currentIndex: 0,
      locale: 'zh',
      theme: detectInitialTheme(),
      report: null,
      version: CURRENT_VERSION,

      goPhase: (p: Phase) => set({ phase: p }),
      selectDomain: (d: DomainId) =>
        set({ domain: d, phase: 'way', currentIndex: 0, answers: {}, report: null }),
      answer: (itemId: string, optIdx: number) =>
        set((s: State & Actions) => ({
          answers: { ...s.answers, [itemId]: optIdx },
        })),
      goPrev: () =>
        set((s: State & Actions) => ({ currentIndex: Math.max(0, s.currentIndex - 1) })),
      goNext: () => set((s: State & Actions) => ({ currentIndex: s.currentIndex + 1 })),
      setReport: (r: MatchReport) => set({ report: r, phase: 'reflection' }),
      reset: () =>
        set({
          answers: {},
          currentIndex: 0,
          report: null,
          phase: 'prologue',
          domain: null,
        }),
      setLocale: (l: Locale) => set({ locale: l }),
      setTheme: (th: Theme) => {
        applyTheme(th);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(`${STORAGE_KEY}.theme`, th);
        }
        set({ theme: th });
      },
      importState: (s: ExportShape) =>
        set({
          answers: s.answers,
          domain: s.domain,
          currentIndex: s.currentIndex,
          locale: s.locale,
          theme: s.theme,
          phase: s.domain && Object.keys(s.answers).length > 0 ? 'way' : 'prologue',
          report: null,
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s: State & Actions) => ({
        answers: s.answers,
        locale: s.locale,
        theme: s.theme,
        phase: s.phase,
        domain: s.domain,
        currentIndex: s.currentIndex,
        version: s.version,
      }),
      onRehydrateStorage: () => (s, error) => {
        if (error) {
          console.error('Failed to rehydrate state:', error);
          return;
        }
        if (s) {
          // 执行数据迁移
          const migrated = migrateState(s);
          if (migrated.version !== s.version) {
            useStore.setState(migrated);
          }
          applyTheme(migrated.theme);
        }
      },
      merge: (persistedState, currentState) => {
        // 合并时执行迁移
        const migrated = migrateState(persistedState);
        return { ...currentState, ...migrated };
      },
    }
  )
);
