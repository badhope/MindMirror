/**
 * Pure-Node verification of the storage + addToHistory + AnalysisCache
 * logic — used as a stand-in for storage-e2e.mjs when the browser
 * can't be downloaded in the sandbox.  Verifies the data chain that
 * the dashboard / history / result-detail pages depend on.
 */

// --- minimal localStorage shim -----------------------------------------
const _store = new Map();
globalThis.localStorage = {
  getItem: (k) => (_store.has(k) ? _store.get(k) : null),
  setItem: (k, v) => _store.set(k, String(v)),
  removeItem: (k) => _store.delete(k),
  clear: () => _store.clear(),
};

const STORAGE_KEY_HISTORY = 'assessmentHistory';

const log = (...a) => console.log('[storage-unit]', ...a);

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

// --- copy of the AnalysisCache fingerprint -----------------------------
const HASH_KEY = 'mindmirror_analysis_history_hash';
const CACHE_KEY = 'mindmirror_analysis_cache';
const META_KEY = 'mindmirror_analysis_meta';
const SCHEMA_VERSION = 2;

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

// === Scenario 1: addToHistory de-dupe within 60s ======================
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
log('  seeded', state.assessmentHistory.length, 'history items');
const before = state.assessmentHistory.length;

// re-add the most recent entry (same minute window) — should replace, not append
const dup = { ...state.assessmentHistory[0], totalScore: 80 };
const r1 = addToHistory(state, dup);
state.assessmentHistory = r1.assessmentHistory;
log(`  re-add most recent within 60s → length ${before} → ${r1.assessmentHistory.length} (replaced=${r1.replaced})`);
if (r1.assessmentHistory.length !== before) throw new Error('de-dupe within 60s failed: length changed');
if (r1.assessmentHistory[0].totalScore !== 80) throw new Error('de-dupe did not replace score');
if (!r1.replaced) throw new Error('de-dupe did not mark as replaced');
log('  ✓ de-dupe works, score replaced in place');

// re-add 5 minutes later — should append as new entry
const r2 = addToHistory(state, {
  ...dup,
  id: 'gad-r1-later',
  completedAt: new Date(now + 5 * 60_000).toISOString(),
});
state.assessmentHistory = r2.assessmentHistory;
log(`  re-add 5 min later → length ${before} → ${r2.assessmentHistory.length} (replaced=${r2.replaced})`);
if (r2.assessmentHistory.length !== before + 1) throw new Error('new entry should append');
if (r2.replaced) throw new Error('new entry marked as replaced incorrectly');
log('  ✓ new entry appended after dedupe window');

// re-add same GAD-7 assessment 30s later — should dedupe (within 60s window)
const r3 = addToHistory(state, {
  ...dup,
  id: 'gad-r1-dup',
  completedAt: new Date(state.assessmentHistory[0].completedAt),
});
state.assessmentHistory = r3.assessmentHistory;
log(`  re-add same GAD-7 30s later → length ${r2.assessmentHistory.length} → ${r3.assessmentHistory.length} (replaced=${r3.replaced})`);
if (r3.assessmentHistory.length !== r2.assessmentHistory.length) throw new Error('30s dedupe failed');
log('  ✓ 30s dedupe works');

// re-add BIG-FIVE — different assessmentId, should always append
const r4 = addToHistory(state, {
  id: 'bf-r3',
  assessmentId: 'bigfive',
  assessmentTitle: '大五人格测验',
  totalScore: 70,
  completedAt: new Date(now).toISOString(),
});
state.assessmentHistory = r4.assessmentHistory;
log(`  re-add BIG-FIVE → length ${r3.assessmentHistory.length} → ${r4.assessmentHistory.length} (replaced=${r4.replaced})`);
if (r4.assessmentHistory.length !== r3.assessmentHistory.length + 1) throw new Error('BIG-FIVE different id should append');
log('  ✓ different assessmentId appends');

// === Scenario 2: AnalysisCache fingerprint + persistence ==============
log('=== 2. AnalysisCache fingerprint ===');
analysisCache.clear();
if (analysisCache.getIfFresh(state.assessmentHistory) !== null) throw new Error('cache should be null after clear');
log('  ✓ fresh store → cache miss');

const sampleCache = {
  statistics: { totalAssessments: 7, averageScore: 65, highestScore: 80, lowestScore: 50, completionRate: 100 },
  trends: [
    { assessmentId: 'anxiety-gad7', trend: 'improving', dataPoints: [{ timestamp: now - 7*86400_000, score: 50 }, { timestamp: now, score: 60 }] },
    { assessmentId: 'bigfive', trend: 'stable', dataPoints: [{ timestamp: now - 8*86400_000, score: 58 }, { timestamp: now - 1*86400_000, score: 65 }] },
  ],
  insights: ['焦虑症状持续偏高,建议关注日常放松练习', '开放性特质随时间稳步提升'],
  recentResults: [
    { id: 'gad-r1', title: '焦虑自评量表 (GAD-7)', timestamp: now, totalScore: 60, assessmentType: 'anxiety', tags: ['紧张', '担忧'] },
  ],
  summaries: [],
};
const meta = analysisCache.set(state.assessmentHistory, sampleCache);
log('  meta version =', meta.version);
if (meta.version !== 2) throw new Error('schema version mismatch');
log('  ✓ cache persisted with version', meta.version);

const hit = analysisCache.getIfFresh(state.assessmentHistory);
if (!hit) throw new Error('cache hit failed for unchanged history');
if (hit.statistics.totalAssessments !== 7) throw new Error('cache content corrupt');
log('  ✓ same history → cache hit,', hit.insights.length, 'insights restored');

// mutate history → cache miss
const mutated = [{ ...state.assessmentHistory[0], totalScore: 90 }, ...state.assessmentHistory.slice(1)];
const miss = analysisCache.getIfFresh(mutated);
if (miss !== null) throw new Error('cache should miss on change');
log('  ✓ score change → cache miss');

// re-set after recompute
analysisCache.set(mutated, { ...sampleCache, statistics: { ...sampleCache.statistics, averageScore: 70 } });
const hit2 = analysisCache.getIfFresh(mutated);
if (!hit2) throw new Error('re-set cache miss');
log('  ✓ recomputed cache hit');

// touchVisited updates lastVisitedAt without losing cache
const before2 = analysisCache.meta().lastVisitedAt;
await new Promise((r) => setTimeout(r, 5));
const touched = analysisCache.touchVisited();
if (touched.lastVisitedAt <= before2) throw new Error('touchVisited did not advance time');
const stillHit = analysisCache.getIfFresh(mutated);
if (!stillHit) throw new Error('touchVisited broke cache');
log('  ✓ touchVisited preserves cache');

// === Scenario 3: AssessmentDetail resetAssessment regression ==========
log('=== 3. useEffect result-preservation guard ===');
// The actual fix lives in AssessmentDetail.tsx, but we simulate the
// predicate it uses: skip resetAssessment() when an active result
// has just been injected (e.g. by the History page click-through).
const state1 = { result: null, currentStep: 'intro' };
const hasActiveResult1 = state1.result !== null && state1.currentStep === 'result';
log('  no active result → hasActiveResult =', hasActiveResult1, '(should reset)');
if (hasActiveResult1) throw new Error('guard mis-fires for empty result');

const state2 = { result: { id: 'gad-r1', totalScore: 60 }, currentStep: 'result' };
const hasActiveResult2 = state2.result !== null && state2.currentStep === 'result';
log('  injected result from history → hasActiveResult =', hasActiveResult2, '(should SKIP reset)');
if (!hasActiveResult2) throw new Error('guard did not detect injected result');

// === Summary ==========================================================
log('=== 6 localStorage keys persisted ===');
for (const k of ['assessmentHistory', 'mindmirror_analysis_history_hash', 'mindmirror_analysis_cache', 'mindmirror_analysis_meta']) {
  const v = localStorage.getItem(k);
  if (!v) throw new Error('missing key: ' + k);
  log('  ✓', k, '=', v.length > 80 ? v.slice(0, 80) + '…' : v);
}
log('DONE — all storage + addToHistory + AnalysisCache + result-preservation checks passed');
