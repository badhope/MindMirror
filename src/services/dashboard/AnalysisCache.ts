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
 *
 * Inputs are `UnifiedAssessmentResult[]` (the shape the dashboard
 * actually consumes).  The store holds `AssessmentResult[]`; callers
 * use `toUnifiedResult` from DataSyncService to map.
 */
import { storage } from '../../lib/utils';
import {
  DataStatistics,
  AssessmentTrend,
  PeriodicSummary,
  UnifiedAssessmentResult,
} from '../../types/dataAbstraction';

const HASH_KEY = 'mindmirror_analysis_history_hash';
const CACHE_KEY = 'mindmirror_analysis_cache';
const META_KEY = 'mindmirror_analysis_meta';

const SCHEMA_VERSION = 3;

export interface AnalysisCache {
  statistics: DataStatistics | null;
  trends: AssessmentTrend[];
  insights: string[];
  recentResults: Array<{
    id: string;
    title: string;
    timestamp: number;
    totalScore: number;
    assessmentType:
      | 'personality'
      | 'stress'
      | 'anxiety'
      | 'depression'
      | 'emotional'
      | 'cognitive'
      | 'social'
      | 'burnout'
      | 'life'
      | 'resilience'
      | 'other';
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

function fingerprint(results: UnifiedAssessmentResult[]): string {
  if (!results.length) return '0';
  const first = results[results.length - 1];
  const last = results[0];
  const sum = results.reduce((acc, r) => acc + (r.totalScore || 0), 0);
  return [
    results.length,
    first?.id || '',
    last?.id || '',
    sum.toFixed(2),
    last?.timestamp ?? 0,
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
   * Returns the cached analysis if the results haven't changed since
   * the last computation. Otherwise returns `null` so the caller can
   * recompute via DashboardService and then call `set(...)` to persist
   * the result.
   */
  getIfFresh(results: UnifiedAssessmentResult[]): AnalysisCache | null {
    const current = fingerprint(results);
    const stored = storage.get<string>(HASH_KEY, '');
    if (!stored || stored !== current) return null;
    return readCache();
  },

  set(results: UnifiedAssessmentResult[], cache: AnalysisCache): AnalysisMeta {
    const now = Date.now();
    const meta: AnalysisMeta = {
      lastVisitedAt: now,
      lastComputedAt: now,
      version: SCHEMA_VERSION,
    };
    storage.set(HASH_KEY, fingerprint(results));
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
