import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardService } from '../../services/dashboard/DashboardService';
import { analysisCache } from '../../services/dashboard/AnalysisCache';
import { toUnifiedResult } from '../../services/dataAbstraction/DataSyncService';
import {
  UnifiedAssessmentResult,
  DataStatistics,
  AssessmentTrend,
} from '../../types/dataAbstraction';
import { useAppStore } from '../../store';
import { getTranslation } from '../../i18n';
import { Skeleton, SkeletonCard } from '../Loading';
import { useReducedMotion } from '../../hooks/useMotion';

export function PersonalDashboard() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<DataStatistics | null>(null);
  const [recentResults, setRecentResults] = useState<UnifiedAssessmentResult[]>([]);
  const [trends, setTrends] = useState<AssessmentTrend[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [computedAt, setComputedAt] = useState<number>(0);
  const [fromCache, setFromCache] = useState<boolean>(false);
  const locale = useAppStore(state => state.locale);
  const assessmentHistory = useAppStore(state => state.assessmentHistory);
  const i18n = getTranslation(locale);
  const reduce = useReducedMotion();

  // Build a UnifiedAssessmentResult[] view of the store's history.  This
  // is the *single source of truth* for the dashboard — we never read
  // from `dataSyncService.getPersonalDataCenter()` here because that
  // cache can lag behind a freshly-added result.
  const unifiedResults: UnifiedAssessmentResult[] = assessmentHistory
    .map(r => toUnifiedResult(r))
    .filter((r): r is UnifiedAssessmentResult => r !== null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Refresh when the history changes (e.g. user finishes a new
  // assessment in another tab / comes back from the result page).
  // Track the head of the history (most recent entry id) so we also
  // catch in-place replaces from `addToHistory` de-dupe.
  const headId = assessmentHistory[0]?.id ?? '';
  useEffect(() => {
    if (!loading) {
      loadDashboardData(true);
    }
  }, [assessmentHistory.length, headId]);

  const loadDashboardData = async (force = false) => {
    try {
      setLoading(true);
      if (!force) {
        // Try cache first (skip on force-refresh so the user gets fresh data).
        const cached = analysisCache.getIfFresh(unifiedResults);
        if (cached) {
          setStatistics(cached.statistics);
          setTrends(cached.trends);
          setInsights(cached.insights);
          // recentResults shape: stored as a trimmed projection; cast safely
          setRecentResults(cached.recentResults as unknown as UnifiedAssessmentResult[]);
          const meta = analysisCache.meta();
          setComputedAt(meta.lastComputedAt);
          setFromCache(true);
          setLoading(false);
          analysisCache.touchVisited();
          return;
        }
      }
      const data = await dashboardService.initializeDashboard('default', unifiedResults);
      setStatistics(data.statistics);
      setRecentResults(data.recentResults);
      setTrends(data.trends ?? []);
      setInsights(data.insights);
      const meta = analysisCache.set(unifiedResults, {
        statistics: data.statistics,
        trends: data.trends ?? [],
        insights: data.insights,
        recentResults: data.recentResults.map(r => ({
          id: r.id,
          title: r.title,
          timestamp: r.timestamp,
          totalScore: r.totalScore,
          assessmentType: r.assessmentType,
          tags: r.tags,
        })),
        summaries: data.summaries ?? [],
      });
      setComputedAt(meta.lastComputedAt);
      setFromCache(false);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    analysisCache.invalidate();
    loadDashboardData(true);
  };

  if (loading) {
    return (
      <div
        className="max-w-7xl mx-auto p-6 space-y-6"
        aria-busy="true"
        aria-label={i18n.dashboard.loading}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 space-y-3">
          <Skeleton className="h-7 w-56 bg-white/20" />
          <Skeleton className="h-4 w-80 bg-white/20" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full bg-white/20" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-8 sm:space-y-10">
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-10 shadow-2xl"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-pink-300 blur-3xl" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs sm:text-sm font-medium mb-3">
              <span>🪞</span> {i18n.dashboard.title}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {i18n.dashboard.subtitle}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/80">
              {computedAt > 0
                ? `${locale === 'zh' ? '数据更新于' : 'Updated'} ${new Date(
                    computedAt
                  ).toLocaleString(
                    locale === 'zh' ? 'zh-CN' : 'en-US'
                  )}${fromCache ? ' · ' + (locale === 'zh' ? '来自本地缓存' : 'from local cache') : ''}`
                : ''}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-sm font-semibold transition-colors"
          >
            🔄 {i18n.dashboard.refresh}
          </button>
        </div>
      </motion.section>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title={i18n.dashboard.totalAssessments}
          value={statistics?.totalAssessments || 0}
          icon="📋"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          title={i18n.dashboard.streakDays}
          value={statistics?.streakDays || 0}
          icon="🔥"
          gradient="from-orange-500 to-rose-500"
        />
        <StatCard
          title={i18n.dashboard.averageScore}
          value={Math.round(statistics?.averageScore || 0)}
          icon="📊"
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard
          title={i18n.dashboard.tagsEarned}
          value={Object.keys(statistics?.tagDistribution || {}).length}
          icon="🏷️"
          gradient="from-violet-500 to-fuchsia-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3 rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💡</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              {i18n.dashboard.insights}
            </h2>
          </div>
          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                >
                  <span className="text-xl sm:text-2xl">💡</span>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed flex-1">
                    {insight}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">{i18n.dashboard.noInsights}</p>
          )}

          {trends.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📈</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  {locale === 'zh' ? '关键特质趋势' : 'Key trait trends'}
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {trends.slice(0, 6).map((t, i) => (
                  <TrendBar key={`${t.traitName}-${i}`} trend={t} />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🕒</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              {i18n.dashboard.recentResults}
            </h2>
          </div>
          {recentResults.length > 0 ? (
            <div className="space-y-3">
              {recentResults.slice(0, 5).map(result => (
                <ResultCard key={result.id} result={result} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">{i18n.dashboard.noData}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: number;
  icon: string;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-slate-100"
    >
      <div
        className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-15 blur-2xl pointer-events-none`}
      />
      <div className="relative">
        <div
          className={`inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${gradient} text-xl sm:text-2xl text-white shadow-sm mb-3`}
        >
          {icon}
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{value}</div>
        <div className="text-xs sm:text-sm text-slate-500 mt-0.5">{title}</div>
      </div>
    </motion.div>
  );
}

function TrendBar({ trend }: { trend: AssessmentTrend }) {
  const direction = trend.trend;
  const arrow = direction === 'increasing' ? '↗' : direction === 'decreasing' ? '↘' : '→';
  const tone =
    direction === 'increasing'
      ? 'text-rose-600 bg-rose-50'
      : direction === 'decreasing'
        ? 'text-emerald-600 bg-emerald-50'
        : 'text-slate-600 bg-slate-50';
  const barTone =
    direction === 'increasing'
      ? 'bg-rose-500'
      : direction === 'decreasing'
        ? 'bg-emerald-500'
        : 'bg-slate-400';
  // Use latest value (0..100) for the bar
  const last = trend.dataPoints?.[trend.dataPoints.length - 1]?.score ?? 50;
  return (
    <div className="rounded-xl border border-slate-100 p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-slate-700">{trend.traitName}</span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${tone}`}
        >
          {arrow}{' '}
          {direction === 'increasing' ? '上升' : direction === 'decreasing' ? '下降' : '平稳'}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${barTone} transition-all`}
          style={{ width: `${Math.min(Math.max(last, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

function ResultCard({ result, locale }: { result: UnifiedAssessmentResult; locale: 'en' | 'zh' }) {
  const i18n = getTranslation(locale);

  const typeNames: Record<string, string> = {
    personality: i18n.dashboard.personality,
    stress: i18n.dashboard.stress,
    anxiety: i18n.dashboard.anxiety,
    social: i18n.dashboard.social,
    burnout: i18n.dashboard.burnout,
    life: i18n.dashboard.life,
    resilience: i18n.dashboard.resilience,
  };

  const typeGradients: Record<string, string> = {
    personality: 'from-violet-500 to-fuchsia-500',
    stress: 'from-emerald-500 to-teal-500',
    anxiety: 'from-blue-500 to-indigo-500',
    social: 'from-cyan-500 to-teal-500',
    burnout: 'from-red-500 to-orange-500',
    life: 'from-emerald-500 to-green-500',
    resilience: 'from-lime-500 to-yellow-500',
  };

  return (
    <div className="rounded-xl border border-slate-100 p-3 sm:p-4 hover:border-slate-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
            {result.title}
          </h3>
          <p className="text-xs text-slate-500">
            {new Date(result.timestamp).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
          </p>
        </div>
        <span
          className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-white bg-gradient-to-r ${
            typeGradients[result.assessmentType] || 'from-slate-400 to-slate-500'
          }`}
        >
          {typeNames[result.assessmentType]}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${Math.min((result.totalScore / 100) * 100, 100)}%` }}
          />
        </div>
        <span className="text-sm font-bold text-blue-600">{result.totalScore}</span>
      </div>
      {result.tags && result.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {result.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] sm:text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
