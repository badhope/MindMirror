/**
 * Persistent analysis cache.
 *
 * DashboardService does heavy work (sync across modules, aggregation,
 * trend calculation) on every page load. The result is deterministic
 * for a given history, so we memoize it in localStorage and only
 * recompute when the underlying data has actually changed.
 *
 * Three keys back the cache:
 *   mindmirror_analysis_history_hash  — fingerprint of last input
 *   mindmirror_analysis_cache         — JSON of { statistics, trends, insights, recentResults }
 *   mindmirror_analysis_meta          — JSON of { lastVisitedAt, lastComputedAt, version }
 *
 * The fingerprint is a length + first/last id + summed score; cheap to
 * recompute on every read but tight enough to catch every meaningful
 * change.
 */
import { storage } from '../../lib/utils';
import { AssessmentResult } from '../../types';
import { DataStatistics, AssessmentTrend, PeriodicSummary } from '../../types/dataAbstraction';

const HASH_KEY = 'mindmirror_analysis_history_hash';
const CACHE_KEY = 'mindmirror_analysis_cache';
const META_KEY = 'mindmirror_analysis_meta';

const SCHEMA_VERSION = 2;

export interface AnalysisCache {
  statistics: DataStatistics | null;
  trends: AssessmentTrend[];
  insights: string[];
  recentResults: Array<{
    id: string;
    title: string;
    timestamp: number;
    totalScore: number;
    assessmentType: 'personality' | 'stress' | 'anxiety';
    tags: string[];
  }>;
  summaries: PeriodicSummary[];
}

export interface AnalysisMeta {
  lastVisitedAt: number;
  lastComputedAt: number;
  version: number;
}

const emptyMeta: AnalysisMeta = {
  lastVisitedAt: 0,
  lastComputedAt: 0,
  version: 0,
};

const emptyCache: AnalysisCache = {
  statistics: null,
  trends: [],
  insights: [],
  recentResults: [],
  summaries: [],
};

function fingerprint(history: AssessmentResult[]): string {
  if (!history.length) return '0';
  const first = history[history.length - 1];
  const last = history[0];
  const sum = history.reduce((acc, h) => acc + (h.totalScore || 0), 0);
  return [
    history.length,
    first?.id || '',
    last?.id || '',
    sum.toFixed(2),
    last?.completedAt instanceof Date
      ? last.completedAt.toISOString()
      : String(last?.completedAt || ''),
  ].join('|');
}

function readCache(): AnalysisCache {
  return storage.get<AnalysisCache>(CACHE_KEY, emptyCache);
}

function readMeta(): AnalysisMeta {
  const m = storage.get<AnalysisMeta>(META_KEY, emptyMeta);
  // Invalidate older schema versions so a stale structure never leaks in.
  if (m.version !== SCHEMA_VERSION) return { ...emptyMeta, version: SCHEMA_VERSION };
  return m;
}

function writeCache(cache: AnalysisCache, meta: AnalysisMeta): void {
  storage.set(CACHE_KEY, cache);
  storage.set(META_KEY, meta);
}

export const analysisCache = {
  /**
   * Returns the cached analysis if the history hasn't changed since the
   * last computation. Otherwise returns `null` so the caller can recompute
   * via DashboardService and then call `set(...)` to persist the result.
   */
  getIfFresh(history: AssessmentResult[]): AnalysisCache | null {
    const current = fingerprint(history);
    const stored = storage.get<string>(HASH_KEY, '');
    if (!stored || stored !== current) return null;
    return readCache();
  },

  set(history: AssessmentResult[], cache: AnalysisCache): AnalysisMeta {
    const now = Date.now();
    const meta: AnalysisMeta = {
      lastVisitedAt: now,
      lastComputedAt: now,
      version: SCHEMA_VERSION,
    };
    storage.set(HASH_KEY, fingerprint(history));
    writeCache(cache, meta);
    return meta;
  },

  /**
   * Touch `lastVisitedAt` without recomputing anything. Used on page
   * mount so we know when the user last opened the dashboard.
   */
  touchVisited(): AnalysisMeta {
    const cur = readMeta();
    const next: AnalysisMeta = { ...cur, lastVisitedAt: Date.now() };
    storage.set(META_KEY, next);
    return next;
  },

  meta(): AnalysisMeta {
    return readMeta();
  },

  /**
   * Force a recompute on next read.
   */
  invalidate(): void {
    storage.remove(HASH_KEY);
  },

  clear(): void {
    storage.remove(HASH_KEY);
    storage.remove(CACHE_KEY);
    storage.remove(META_KEY);
  },
};
