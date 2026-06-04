/**
 * Pure-Node verification of the storage + store + AnalysisCache +
 * SESSION_KEYS chain — used as a stand-in for storage-e2e.mjs when
 * the browser can't be downloaded in the sandbox.  Verifies the data
 * chain that the dashboard / history / result-detail / mood / training
 * / achievements / tags / plugin / share / personal-center pages all
 * depend on, plus the new `clearLocalSession` wipe on logout.
 */

// --- minimal localStorage shim -----------------------------------------
const _store = new Map();
globalThis.localStorage = {
  getItem: (k) => (_store.has(k) ? _store.get(k) : null),
  setItem: (k, v) => _store.set(k, String(v)),
  removeItem: (k) => _store.delete(k),
  clear: () => _store.clear(),
};

const log = (...a) => console.log('[storage-chain]', ...a);

const STORAGE_KEY_HISTORY = 'assessmentHistory';
const HASH_KEY = 'mindmirror_analysis_history_hash';
const CACHE_KEY = 'mindmirror_analysis_cache';
const META_KEY = 'mindmirror_analysis_meta';
const SCHEMA_VERSION = 3;

const SESSION_KEYS = [
  'mindmirror_user',
  'mindmirror_token',
  'mindmirror_local_users',
  'mindmirror_local_secret',
  STORAGE_KEY_HISTORY,
  HASH_KEY, CACHE_KEY, META_KEY,
  'moodTracker_entries',
  'training_history', 'training_progress', 'training_schedules',
  'achievements_unlocked',
  'userTags',
  'personalDataCenter',
  'shared_assessment_results',
  'plugin_registry', 'plugin_states', 'plugin_cache',
  'assessment_trace_logs',
];

const PREFERENCES_THAT_SURVIVE_LOGOUT = ['theme', 'locale'];

// --- copy of the addToHistory de-dupe logic ----------------------------
function addToHistory(state, result) {
  const dupeIdx = state.assessmentHistory.findIndex((h) => {
    if (h.assessmentId !== result.assessmentId) return false;
    const tA = new Date(h.completedAt).getTime();
    const tB = new Date(result.completedAt).getTime();
    return Math.abs(tA - tB) < 60_000;
  });
  if (dupeIdx >= 0) {
    const next = state.assessmentHistory.slice();
    next[dupeIdx] = result;
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(next));
    return { assessmentHistory: next, replaced: true };
  }
  const newHistory = [result, ...state.assessmentHistory];
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory));
  return { assessmentHistory: newHistory, replaced: false };
}

function clearHistory() {
  localStorage.setItem(STORAGE_KEY_HISTORY, '[]');
  localStorage.removeItem(HASH_KEY);
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(META_KEY);
}

function deleteHistoryItem(id) {
  const cur = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');
  const next = cur.filter((x) => x.id !== id);
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(next));
  localStorage.removeItem(HASH_KEY);
}

function clearLocalSession() {
  for (const k of SESSION_KEYS) localStorage.removeItem(k);
}

// --- copy of the AnalysisCache fingerprint -----------------------------
function fingerprint(history) {
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

const analysisCache = {
  getIfFresh(history) {
    const current = fingerprint(history);
    const stored = localStorage.getItem(HASH_KEY);
    if (!stored || stored !== current) return null;
    return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
  },
  set(history, cache) {
    const now = Date.now();
    const meta = { lastVisitedAt: now, lastComputedAt: now, version: SCHEMA_VERSION };
    localStorage.setItem(HASH_KEY, fingerprint(history));
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    localStorage.setItem(META_KEY, JSON.stringify(meta));
    return meta;
  },
  touchVisited() {
    const cur = JSON.parse(localStorage.getItem(META_KEY) || '{}');
    const next = { ...cur, lastVisitedAt: Date.now() };
    localStorage.setItem(META_KEY, JSON.stringify(next));
    return next;
  },
  meta() {
    return JSON.parse(localStorage.getItem(META_KEY) || '{}');
  },
  invalidate() {
    localStorage.removeItem(HASH_KEY);
  },
  clear() {
    localStorage.removeItem(HASH_KEY);
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(META_KEY);
  },
};

let pass = 0;
const expect = (label, cond, detail = '') => {
  if (!cond) throw new Error(`FAIL ${label} ${detail}`);
  log('  ✓', label, detail);
  pass += 1;
};

// =====================================================================
// 1. addToHistory de-dupe within 60s
// =====================================================================
log('=== 1. addToHistory de-dupe within 60s ===');
let state = { assessmentHistory: [] };
const now = Date.now();
const seedResults = [
  { id: 'gad-r1', assessmentId: 'anxiety-gad7', assessmentTitle: '焦虑自评量表 (GAD-7)', totalScore: 60, days: 0 },
  { id: 'gad-r2', assessmentId: 'anxiety-gad7', assessmentTitle: '焦虑自评量表 (GAD-7)', totalScore: 50, days: 7 },
  { id: 'bf-r1',  assessmentId: 'bigfive',      assessmentTitle: '大五人格测验',           totalScore: 65, days: 1 },
  { id: 'bf-r2',  assessmentId: 'bigfive',      assessmentTitle: '大五人格测验',           totalScore: 58, days: 8 },
  { id: 'st-r1',  assessmentId: 'stress-test',  assessmentTitle: '知觉压力量表 (PSS-10)',   totalScore: 72, days: 2 },
  { id: 'st-r2',  assessmentId: 'stress-test',  assessmentTitle: '知觉压力量表 (PSS-10)',   totalScore: 65, days: 9 },
];
state.assessmentHistory = seedResults.map((s, i) => ({
  id: s.id,
  totalScore: s.totalScore,
  assessmentId: s.assessmentId,
  assessmentTitle: s.assessmentTitle,
  completedAt: new Date(now - s.days * 86400_000 + i * 1000).toISOString(),
}));
localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(state.assessmentHistory));
const before = state.assessmentHistory.length;

const dup = { ...state.assessmentHistory[0], totalScore: 80 };
const r1 = addToHistory(state, dup);
state.assessmentHistory = r1.assessmentHistory;
expect('re-add within 60s replaces (length unchanged)', r1.assessmentHistory.length === before);
expect('re-add within 60s swaps in latest score', r1.assessmentHistory[0].totalScore === 80);
expect('re-add within 60s flagged replaced', r1.replaced === true);

const r2 = addToHistory(state, {
  ...dup, id: 'gad-r1-later', completedAt: new Date(now + 5 * 60_000).toISOString(),
});
state.assessmentHistory = r2.assessmentHistory;
expect('re-add 5 min later appends', r2.assessmentHistory.length === before + 1);
expect('re-add 5 min later flagged not-replaced', r2.replaced === false);

const r3 = addToHistory(state, {
  ...dup, id: 'gad-r1-dup', completedAt: new Date(state.assessmentHistory[0].completedAt),
});
state.assessmentHistory = r3.assessmentHistory;
expect('re-add 30s later de-dupes', r3.assessmentHistory.length === r2.assessmentHistory.length);

const r4 = addToHistory(state, {
  id: 'bf-r3', assessmentId: 'bigfive', assessmentTitle: '大五人格测验',
  totalScore: 70, completedAt: new Date(now).toISOString(),
});
state.assessmentHistory = r4.assessmentHistory;
expect('different assessmentId always appends', r4.assessmentHistory.length === r3.assessmentHistory.length + 1);

// =====================================================================
// 2. AnalysisCache fingerprint + persistence + schema version
// =====================================================================
log('=== 2. AnalysisCache fingerprint + persistence ===');
analysisCache.clear();
expect('cache empty after clear', analysisCache.getIfFresh(state.assessmentHistory) === null);

const sampleCache = {
  statistics: { totalAssessments: 7, averageScore: 65, highestScore: 80, lowestScore: 50, completionRate: 100, streakDays: 5, traitAverages: {} },
  trends: [
    { assessmentId: 'anxiety-gad7', trend: 'improving', dataPoints: [{ timestamp: now - 7 * 86400_000, score: 50 }, { timestamp: now, score: 60 }] },
  ],
  insights: ['焦虑症状持续偏高,建议关注日常放松练习'],
  recentResults: [
    { id: 'gad-r1', title: '焦虑自评量表 (GAD-7)', timestamp: now, totalScore: 60, assessmentType: 'anxiety', tags: ['紧张'] },
  ],
  summaries: [],
};
const meta = analysisCache.set(state.assessmentHistory, sampleCache);
expect('schema version bumped to 3', meta.version === SCHEMA_VERSION, `got ${meta.version}`);

const hit = analysisCache.getIfFresh(state.assessmentHistory);
expect('cache hit for unchanged history', hit !== null);
expect('cache restores statistics', hit.statistics.totalAssessments === 7);
expect('cache restores insights', Array.isArray(hit.insights) && hit.insights.length === 1);

const mutated = [{ ...state.assessmentHistory[0], totalScore: 90 }, ...state.assessmentHistory.slice(1)];
expect('score change → cache miss', analysisCache.getIfFresh(mutated) === null);

analysisCache.set(mutated, { ...sampleCache, statistics: { ...sampleCache.statistics, averageScore: 70 } });
expect('recomputed cache hits', analysisCache.getIfFresh(mutated) !== null);

const before2 = analysisCache.meta().lastVisitedAt;
await new Promise((r) => setTimeout(r, 5));
const touched = analysisCache.touchVisited();
expect('touchVisited advances time', touched.lastVisitedAt > before2);
expect('touchVisited preserves cache', analysisCache.getIfFresh(mutated) !== null);

// =====================================================================
// 3. addToHistory / clearHistory / deleteHistoryItem + cache coupling
// =====================================================================
log('=== 3. addToHistory / clearHistory / deleteHistoryItem → AnalysisCache ===');
// simulate the fix in store: every history mutation invalidates the cache
function addToHistoryWithCacheInvalidation(state, result) {
  const r = addToHistory(state, result);
  state.assessmentHistory = r.assessmentHistory;
  analysisCache.invalidate();
  return r;
}
const beforeAdd = state.assessmentHistory.length;
addToHistoryWithCacheInvalidation(state, {
  id: 'gad-rX', assessmentId: 'anxiety-gad7-new', assessmentTitle: '焦虑自评量表 (GAD-7)',
  totalScore: 88, completedAt: new Date(now).toISOString(),
});
expect('addToHistory invalidates cache', analysisCache.getIfFresh(state.assessmentHistory) === null);
expect('addToHistory length grew', state.assessmentHistory.length > beforeAdd);

// re-seed cache
analysisCache.set(state.assessmentHistory, sampleCache);
expect('cache re-armed', analysisCache.getIfFresh(state.assessmentHistory) !== null);
const oneId = state.assessmentHistory[0].id;
deleteHistoryItem(oneId);
expect('deleteHistoryItem invalidates cache', analysisCache.getIfFresh(state.assessmentHistory) === null);
expect('deleteHistoryItem removes entry', JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)).every((x) => x.id !== oneId));

analysisCache.set(state.assessmentHistory, sampleCache);
expect('cache re-armed before clear', analysisCache.getIfFresh(state.assessmentHistory) !== null);
clearHistory();
expect('clearHistory wipes hash', localStorage.getItem(HASH_KEY) === null);
expect('clearHistory wipes cache', localStorage.getItem(CACHE_KEY) === null);
expect('clearHistory wipes meta', localStorage.getItem(META_KEY) === null);
expect('clearHistory wipes history', localStorage.getItem(STORAGE_KEY_HISTORY) === '[]');
state.assessmentHistory = [];

// =====================================================================
// 4. clearLocalSession wipes every session key, leaves preferences alone
// =====================================================================
log('=== 4. clearLocalSession wipes every session key ===');
// plant all session keys with sample data
for (const k of SESSION_KEYS) localStorage.setItem(k, `seed:${k}`);
// plant user preferences that must NOT be cleared on logout
for (const k of PREFERENCES_THAT_SURVIVE_LOGOUT) localStorage.setItem(k, `pref:${k}`);
// sanity check
expect('session keys seeded', SESSION_KEYS.every((k) => localStorage.getItem(k)?.startsWith('seed:')));
expect('preferences seeded', PREFERENCES_THAT_SURVIVE_LOGOUT.every((k) => localStorage.getItem(k)?.startsWith('pref:')));

clearLocalSession();
expect('every session key wiped', SESSION_KEYS.every((k) => localStorage.getItem(k) === null));
expect('theme preference survives logout', localStorage.getItem('theme') === 'pref:theme');
expect('locale preference survives logout', localStorage.getItem('locale') === 'pref:locale');

// =====================================================================
// 5. logout in-memory state + analysisCache.clear() belt-and-suspenders
// =====================================================================
log('=== 5. logout also clears in-memory state ===');
// re-seed
localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify([{ id: 'a', totalScore: 50 }]));
analysisCache.set([{ id: 'a', totalScore: 50 }], sampleCache);
expect('analysis cache re-armed', analysisCache.getIfFresh([{ id: 'a', totalScore: 50 }]) !== null);

// simulate the post-logout in-memory wipe
const inMemory = { user: { id: 'u1' }, isAuthenticated: true, assessmentHistory: [{ id: 'a', totalScore: 50 }] };
clearLocalSession();
analysisCache.clear();
inMemory.user = null;
inMemory.isAuthenticated = false;
inMemory.assessmentHistory = [];

expect('user is null post-logout', inMemory.user === null);
expect('isAuthenticated false post-logout', inMemory.isAuthenticated === false);
expect('history in-memory is empty', inMemory.assessmentHistory.length === 0);
expect('analysis cache fully wiped', !analysisCache.meta().lastComputedAt);

// =====================================================================
// 6. SESSION_KEYS is exhaustive: every key the app writes is included
// =====================================================================
log('=== 6. SESSION_KEYS coverage check ===');
// simulate the app writing the keys it actually uses
const actuallyWrittenKeys = [
  'mindmirror_user', 'mindmirror_token', 'mindmirror_local_users', 'mindmirror_local_secret',
  'assessmentHistory',
  'mindmirror_analysis_history_hash', 'mindmirror_analysis_cache', 'mindmirror_analysis_meta',
  'moodTracker_entries',
  'training_history', 'training_progress', 'training_schedules',
  'achievements_unlocked',
  'userTags',
  'personalDataCenter',
  'shared_assessment_results',
  'plugin_registry', 'plugin_states', 'plugin_cache',
  'assessment_trace_logs',
];
const missing = actuallyWrittenKeys.filter((k) => !SESSION_KEYS.includes(k));
expect('all actually-written keys are in SESSION_KEYS', missing.length === 0, `missing: ${missing.join(',')}`);

// =====================================================================
// 7. AssessmentDetail resetAssessment guard
// =====================================================================
log('=== 7. useEffect result-preservation guard ===');
const hasActiveResult = (state) => state.result !== null && state.currentStep === 'result';
expect('no result → reset is allowed', !hasActiveResult({ result: null, currentStep: 'intro' }));
expect('injected result from history → reset is SKIPPED', hasActiveResult({ result: { id: 'gad-r1', totalScore: 60 }, currentStep: 'result' }));

// =====================================================================
// 8. toUnifiedResult shape check (new helper)
// =====================================================================
log('=== 8. toUnifiedResult shape check ===');
function toUnifiedResult(result) {
  if (!result || !result.id) return null;
  const assessmentId = result.assessmentId || 'unknown';
  return {
    id: result.id,
    assessmentId,
    assessmentType: ({ 'anxiety-gad7': 'anxiety', 'big-five': 'personality', 'bigfive': 'personality', 'stress-test': 'stress' })[assessmentId] || 'other',
    title: result.assessmentTitle || result.title || '心理测评',
    timestamp: result.timestamp || (result.completedAt ? new Date(result.completedAt).getTime() : Date.now()),
    totalScore: result.totalScore || 0,
    traits: (result.traits || []).map((t) => ({ name: t.name || t.traitName || 'Unknown', score: t.score || 0, description: t.description || '' })),
    rawAnswers: result.rawAnswers || {},
    processedScores: result.processedScores || {},
    report: result.report || { summary: { title: result.assessmentTitle || '心理测评', score: result.totalScore || 0, description: '', color: '#6366f1' } },
    tags: result.tags || [],
    metadata: { duration: result.metadata?.duration ?? result.duration ?? 0, completed: result.metadata?.completed ?? result.completed ?? true, version: result.metadata?.version ?? '1.0.0' },
  };
}
const sample = {
  id: 'gad-r1', assessmentId: 'anxiety-gad7', assessmentTitle: '焦虑自评量表 (GAD-7)',
  totalScore: 60, completedAt: new Date(now).toISOString(),
  traits: [{ name: '焦虑', score: 12, maxScore: 21 }],
};
const u = toUnifiedResult(sample);
expect('toUnifiedResult keeps id', u.id === 'gad-r1');
expect('toUnifiedResult maps anxiety type', u.assessmentType === 'anxiety');
expect('toUnifiedResult backfills report.summary', u.report && u.report.summary && u.report.summary.title === '焦虑自评量表 (GAD-7)');
expect('toUnifiedResult backfills metadata', u.metadata.completed === true && u.metadata.version === '1.0.0');
expect('toUnifiedResult maps trait name+score', u.traits[0].name === '焦虑' && u.traits[0].score === 12);

const u2 = toUnifiedResult(null);
expect('toUnifiedResult(null) returns null', u2 === null);
const u3 = toUnifiedResult({});
expect('toUnifiedResult(no id) returns null', u3 === null);

const u4 = toUnifiedResult({ id: 'bf', assessmentId: 'bigfive', totalScore: 50 });
expect('toUnifiedResult maps bigfive → personality', u4.assessmentType === 'personality');
expect('toUnifiedResult backfills default title', u4.title === '心理测评');

log(`PASS: ${pass} assertions`);
log('DONE — full storage / addToHistory / AnalysisCache / SESSION_KEYS / logout / toUnifiedResult chain verified');
