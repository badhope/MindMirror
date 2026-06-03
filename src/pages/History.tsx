import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { AssessmentResult, TraitResult } from '../types';
import { mockAssessments, getQuestionsForAssessment } from '../data/mockData';
import { getTranslation } from '../i18n';
import { useToasts } from '../store/toastStore';

type Filter = 'all' | 'personality' | 'stress' | 'anxiety';
type Sort = 'newest' | 'oldest' | 'highest' | 'lowest';

const TYPE_BY_ID: Record<string, Filter> = {
  '1': 'personality',
  'big-five': 'personality',
  '2': 'stress',
  'stress-test': 'stress',
  '3': 'anxiety',
  'anxiety-gad7': 'anxiety',
};

function assessmentType(id: string): Filter {
  return TYPE_BY_ID[id] ?? 'personality';
}

function typeLabel(type: Filter, i18n: ReturnType<typeof getTranslation>): string {
  if (type === 'all') return i18n.history.filter.all;
  return i18n.history.type[type === 'personality' ? 'personality' : type];
}

function formatDate(date: Date | string, i18n: ReturnType<typeof getTranslation>): string {
  const d = new Date(date);
  const now = new Date();
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, now)) {
    return i18n.history.today;
  }
  const yest = new Date(now);
  yest.setDate(yest.getDate() - 1);
  if (sameDay(d, yest)) {
    return i18n.history.yesterday;
  }

  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays < 7) {
    return i18n.history.daysAgo.replace('{n}', String(diffDays));
  }

  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Two recorders made the same assessment within 24h counts as one streak day.
function dayKey(d: Date | string): string {
  const x = new Date(d);
  return `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`;
}

function calcStreak(history: AssessmentResult[]): number {
  if (!history.length) return 0;
  const days = new Set(history.map(h => dayKey(h.completedAt)));
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 365; i += 1) {
    if (days.has(dayKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0) {
      // If today has nothing yet, don't break the streak — try from yesterday.
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function groupLabel(date: Date): 'thisWeek' | 'thisMonth' | 'earlier' {
  const now = new Date();
  const dayMs = 86_400_000;
  const diff = (now.getTime() - date.getTime()) / dayMs;
  if (diff <= 7) return 'thisWeek';
  if (diff <= 31 && date.getFullYear() === now.getFullYear()) return 'thisMonth';
  return 'earlier';
}

function scoreTone(score: number): { bar: string; chip: string; ring: string } {
  // T-score style: 50 is the population mean.
  if (score >= 60)
    return { bar: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700', ring: 'ring-rose-200' };
  if (score <= 40)
    return {
      bar: 'bg-emerald-500',
      chip: 'bg-emerald-50 text-emerald-700',
      ring: 'ring-emerald-200',
    };
  return { bar: 'bg-blue-500', chip: 'bg-blue-50 text-blue-700', ring: 'ring-blue-200' };
}

// Lightweight sparkline rendered with SVG. No chart library needed.
function Trend({ values, height = 64 }: { values: number[]; height?: number }) {
  if (values.length < 2) return null;
  const width = 100;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / span) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {values.map((v, i) => {
        const x = i * stepX;
        const y = height - ((v - min) / span) * (height - 8) - 4;
        return <circle key={i} cx={x} cy={y} r={1.6} fill="currentColor" />;
      })}
    </svg>
  );
}

function StatsBar({
  history,
  i18n,
}: {
  history: AssessmentResult[];
  i18n: ReturnType<typeof getTranslation>;
}) {
  const total = history.length;
  const now = new Date();
  const thisMonth = history.filter(h => {
    const d = new Date(h.completedAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  const streak = calcStreak(history);

  const counts = history.reduce<Record<string, number>>((acc, h) => {
    acc[h.assessmentTitle] = (acc[h.assessmentTitle] ?? 0) + 1;
    return acc;
  }, {});
  const favorite = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];

  const latest = history[0];
  const previous = history[1];
  const delta = latest && previous ? latest.totalScore - previous.totalScore : null;

  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <StatTile
        label={i18n.history.stats.total}
        value={String(total)}
        hint={i18n.history.stats.thisMonth.replace('{n}', String(thisMonth))}
      />
      <StatTile
        label={i18n.history.stats.streak}
        value={String(streak)}
        suffix={i18n.common.thisYear}
      />
      <StatTile
        label={i18n.history.stats.favorite}
        value={favorite ? favorite.split(/[（(]/)[0] : '—'}
        small
      />
      <StatTile
        label={i18n.history.stats.lastScore}
        value={latest ? String(Math.round(latest.totalScore)) : '—'}
        hint={
          delta !== null
            ? `${delta > 0 ? '▲' : delta < 0 ? '▼' : '−'} ${Math.abs(delta).toFixed(1)} ${i18n.history.stats.changeLabel}`
            : undefined
        }
        tone={delta !== null ? (delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat') : undefined}
      />
    </section>
  );
}

function StatTile({
  label,
  value,
  hint,
  suffix,
  small,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  suffix?: string;
  small?: boolean;
  tone?: 'up' | 'down' | 'flat';
}) {
  const toneColor =
    tone === 'up' ? 'text-emerald-600' : tone === 'down' ? 'text-rose-600' : 'text-slate-500';
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-100 shadow-sm">
      <div className="text-xs sm:text-sm text-slate-500">{label}</div>
      <div
        className={`mt-1 font-semibold text-slate-800 ${small ? 'text-base sm:text-lg' : 'text-2xl sm:text-3xl'}`}
      >
        {value}
        {suffix && <span className="ml-1 text-sm font-normal text-slate-500">{suffix}</span>}
      </div>
      {hint && <div className={`mt-1 text-xs ${toneColor}`}>{hint}</div>}
    </div>
  );
}

function HistoryCard({
  result,
  onDelete,
  onRetake,
  onShare,
  i18n,
}: {
  result: AssessmentResult;
  onDelete: (id: string) => void;
  onRetake: (result: AssessmentResult) => void;
  onShare: (result: AssessmentResult) => void;
  i18n: ReturnType<typeof getTranslation>;
}) {
  const { setCurrentAssessment, setQuestions, setCurrentQuestionIndex, setResult, setCurrentStep } =
    useAppStore();
  const tone = scoreTone(result.totalScore);

  const handleView = () => {
    const assessment = mockAssessments.find(a => a.id === result.assessmentId);
    if (assessment) {
      setCurrentAssessment(assessment);
      setQuestions(getQuestionsForAssessment(assessment.id));
      setCurrentQuestionIndex(0);
      setResult(result);
      setCurrentStep('result');
    }
  };

  return (
    <article className="rounded-2xl bg-white p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${tone.chip}`}
          >
            {typeLabel(assessmentType(result.assessmentId), i18n)}
          </span>
          <h3 className="mt-2 text-lg sm:text-xl font-semibold text-slate-800 truncate">
            {result.assessmentTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {formatDate(result.completedAt, i18n)}
          </p>
        </div>
        <div
          className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${tone.chip} flex flex-col items-center justify-center ring-1 ${tone.ring}`}
          aria-label={`${i18n.results.comprehensiveScore}: ${Math.round(result.totalScore)}`}
        >
          <span className="text-2xl sm:text-3xl font-bold leading-none">
            {Math.round(result.totalScore)}
          </span>
          <span className="text-[10px] sm:text-xs mt-0.5 opacity-80">
            {i18n.results.totalScore}
          </span>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {result.traits.slice(0, 3).map((t: TraitResult, idx: number) => (
          <span
            key={idx}
            className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-full text-xs sm:text-sm border border-slate-100"
          >
            {t.name} {Math.round(t.score)}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          to={`/assessments/${result.assessmentId}`}
          onClick={handleView}
          className="flex-1 sm:flex-none min-w-[120px] text-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors"
        >
          {i18n.history.viewDetails}
        </Link>
        <button
          onClick={() => onRetake(result)}
          className="px-3 py-2.5 text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100"
        >
          {i18n.history.retake}
        </button>
        <button
          onClick={() => onShare(result)}
          className="px-3 py-2.5 text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100"
        >
          {i18n.history.share}
        </button>
        <button
          onClick={() => onDelete(result.id)}
          aria-label={i18n.history.delete}
          className="ml-auto px-3 py-2.5 text-sm text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          🗑
        </button>
      </div>
    </article>
  );
}

function EmptyState({ i18n }: { i18n: ReturnType<typeof getTranslation> }) {
  return (
    <div className="rounded-3xl bg-white p-10 sm:p-16 border border-slate-100 shadow-sm text-center">
      <div className="text-6xl sm:text-7xl mb-4" aria-hidden>
        🪞
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">{i18n.history.empty}</h2>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">{i18n.history.emptyDesc}</p>
      <Link
        to="/assessments"
        className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-md"
      >
        {i18n.history.startFirst} <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

export const History = () => {
  const {
    assessmentHistory,
    loadHistory,
    deleteHistoryItem,
    clearHistory,
    locale,
    resetAssessment,
    setCurrentAssessment,
    setQuestions,
  } = useAppStore();
  const showToast = useToasts(s => s.addToast);
  const i18n = getTranslation(locale);

  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('newest');

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filtered = useMemo(() => {
    let list = assessmentHistory;
    if (filter !== 'all') {
      list = list.filter(r => assessmentType(r.assessmentId) === filter);
    }
    const sorted = [...list];
    switch (sort) {
      case 'newest':
        sorted.sort((a, b) => +new Date(b.completedAt) - +new Date(a.completedAt));
        break;
      case 'oldest':
        sorted.sort((a, b) => +new Date(a.completedAt) - +new Date(b.completedAt));
        break;
      case 'highest':
        sorted.sort((a, b) => b.totalScore - a.totalScore);
        break;
      case 'lowest':
        sorted.sort((a, b) => a.totalScore - b.totalScore);
        break;
    }
    return sorted;
  }, [assessmentHistory, filter, sort]);

  const trendValues = useMemo(
    () =>
      [...filtered]
        .reverse()
        .map(r => r.totalScore)
        .filter(v => Number.isFinite(v)),
    [filtered]
  );

  const grouped = useMemo(() => {
    const buckets: Record<'thisWeek' | 'thisMonth' | 'earlier', AssessmentResult[]> = {
      thisWeek: [],
      thisMonth: [],
      earlier: [],
    };
    for (const r of filtered) {
      buckets[groupLabel(new Date(r.completedAt))].push(r);
    }
    return buckets;
  }, [filtered, i18n]);

  const handleClearAll = () => {
    if (window.confirm(i18n.history.confirmClear)) {
      clearHistory();
    }
  };

  const handleRetake = (r: AssessmentResult) => {
    const assessment = mockAssessments.find(a => a.id === r.assessmentId);
    if (!assessment) return;
    resetAssessment();
    setCurrentAssessment(assessment);
    setQuestions(getQuestionsForAssessment(assessment.id));
    window.location.href = `/assessments/${assessment.id}`;
  };

  const handleShare = async (r: AssessmentResult) => {
    const url = `${window.location.origin}/shared/${r.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: r.assessmentTitle, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast(i18n.common.shareCopied, 'success');
      }
    } catch {
      // User cancelled the share sheet — that's fine.
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">{i18n.history.title}</h1>
          <p className="mt-1 text-base sm:text-lg text-slate-600">
            {i18n.history.subtitle.replace('{count}', String(assessmentHistory.length))}
          </p>
        </div>
        {assessmentHistory.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-colors"
          >
            {i18n.history.clearAll}
          </button>
        )}
      </header>

      {assessmentHistory.length > 0 && <StatsBar history={assessmentHistory} i18n={i18n} />}

      {trendValues.length >= 2 && (
        <section className="rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 p-5 sm:p-6 border border-indigo-100">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm sm:text-base font-medium text-slate-700">
              {filter === 'all' ? i18n.history.stats.title : typeLabel(filter, i18n)}
            </h2>
            <span className="text-xs text-slate-500">
              {i18n.history.trendPoints.replace('{n}', String(trendValues.length))}
            </span>
          </div>
          <div className="mt-3 text-blue-600">
            <Trend values={trendValues} />
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(['all', 'personality', 'stress', 'anxiety'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                filter === f
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {typeLabel(f, i18n)}
            </button>
          ))}
        </div>
        <label className="text-sm text-slate-500 inline-flex items-center gap-2">
          {i18n.history.sort.label}
          <select
            value={sort}
            onChange={e => setSort(e.target.value as Sort)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="newest">{i18n.history.sort.newest}</option>
            <option value="oldest">{i18n.history.sort.oldest}</option>
            <option value="highest">{i18n.history.sort.highest}</option>
            <option value="lowest">{i18n.history.sort.lowest}</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState i18n={i18n} />
      ) : (
        <div className="space-y-10">
          {(['thisWeek', 'thisMonth', 'earlier'] as const).map(group =>
            grouped[group].length > 0 ? (
              <section key={group}>
                <h2 className="text-xs sm:text-sm uppercase tracking-wider text-slate-500 mb-3 font-semibold">
                  {i18n.history.group[group]}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {grouped[group].map(r => (
                    <HistoryCard
                      key={r.id}
                      result={r}
                      onDelete={deleteHistoryItem}
                      onRetake={handleRetake}
                      onShare={handleShare}
                      i18n={i18n}
                    />
                  ))}
                </div>
              </section>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};
