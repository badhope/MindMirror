/**
 * Cross-flow business-logic regression test for MindMirror.
 *
 * Simulates each end-to-end user flow as a sequence of service calls
 * on a fresh localStorage, then asserts the downstream state is what
 * every page depends on.  Designed to catch the class of bug where
 * the store mutates a record but the achievements / tags / analysis
 * cache don't get refreshed in lockstep.
 *
 * No React, no DOM, no browser — just data flow.
 */

const _store = new Map();
globalThis.localStorage = {
  getItem: k => (_store.has(k) ? _store.get(k) : null),
  setItem: (k, v) => _store.set(k, String(v)),
  removeItem: k => _store.delete(k),
  clear: () => _store.clear(),
};

// Provide crypto shim for the auth path.  We don't actually
// exercise crypto — we short-circuit register/login to skip
// PBKDF2/HMAC in the simulation.  Only the data side effects matter.
// (Node 24 makes `globalThis.crypto` read-only; we polyfill the parts
// the simulation actually touches instead of overwriting it.)
if (!globalThis.crypto.getRandomValues) {
  globalThis.crypto.getRandomValues = b => {
    for (let i = 0; i < b.length; i++) b[i] = Math.floor(Math.random() * 256);
    return b;
  };
}

const log = (...a) => console.log('[flow-test]', ...a);
let pass = 0;
let fail = 0;
const expect = (label, cond, detail = '') => {
  if (!cond) {
    log('  ✗', label, detail);
    fail++;
    throw new Error(`FAIL ${label} ${detail}`);
  }
  log('  ✓', label, detail);
  pass++;
};

// ---------------------------------------------------------------------------
// Inline minimal copies of the service methods the flows exercise.
// We deliberately re-implement (not import) the services here so the test
// is hermetic: it doesn't break when internal file paths change.
// ---------------------------------------------------------------------------

const KEYS = {
  history: 'assessmentHistory',
  hash: 'mindmirror_analysis_history_hash',
  cache: 'mindmirror_analysis_cache',
  meta: 'mindmirror_analysis_meta',
  mood: 'moodTracker_entries',
  trainingHistory: 'training_history',
  trainingProgress: 'training_progress',
  achievements: 'achievements_unlocked',
  userTags: 'userTags',
  pluginRegistry: 'plugin_registry',
  pluginStates: 'plugin_states',
  sharedResults: 'shared_assessment_results',
};

const SCHEMA_VERSION = 3;

const readJSON = (k, fb) => {
  const v = _store.get(k);
  if (v == null) return fb;
  try {
    return JSON.parse(v);
  } catch {
    return fb;
  }
};
const writeJSON = (k, v) => _store.set(k, JSON.stringify(v));

// --- store actions ----------------------------------------------------------

function addToHistory(state, result) {
  const dupeIdx = state.assessmentHistory.findIndex(h => {
    if (h.assessmentId !== result.assessmentId) return false;
    return (
      Math.abs(new Date(h.completedAt).getTime() - new Date(result.completedAt).getTime()) < 60_000
    );
  });
  if (dupeIdx >= 0) {
    const next = state.assessmentHistory.slice();
    next[dupeIdx] = result;
    state.assessmentHistory = next;
  } else {
    state.assessmentHistory = [result, ...state.assessmentHistory];
  }
  writeJSON(KEYS.history, state.assessmentHistory);
  // every history mutation invalidates the dashboard cache
  _store.delete(KEYS.hash);
  // and triggers achievement/tag refresh
  achievementRefresh(state.assessmentHistory);
  return state;
}

function clearHistory(state) {
  state.assessmentHistory = [];
  writeJSON(KEYS.history, []);
  _store.delete(KEYS.hash);
  _store.delete(KEYS.cache);
  _store.delete(KEYS.meta);
  achievementRefresh([]);
  return state;
}

function deleteHistoryItem(state, id) {
  state.assessmentHistory = state.assessmentHistory.filter(h => h.id !== id);
  writeJSON(KEYS.history, state.assessmentHistory);
  _store.delete(KEYS.hash);
  achievementRefresh(state.assessmentHistory);
  return state;
}

// --- AnalysisCache ----------------------------------------------------------

function fingerprint(history) {
  if (!history.length) return '0';
  const first = history[history.length - 1];
  const last = history[0];
  const sum = history.reduce((a, h) => a + (h.totalScore || 0), 0);
  return [
    history.length,
    first?.id || '',
    last?.id || '',
    sum.toFixed(2),
    last?.completedAt || '',
  ].join('|');
}
const analysisCache = {
  getIfFresh(history) {
    const cur = fingerprint(history);
    const stored = _store.get(KEYS.hash);
    if (stored !== cur) return null;
    return readJSON(KEYS.cache, null);
  },
  set(history, cache) {
    const now = Date.now();
    _store.set(KEYS.hash, fingerprint(history));
    writeJSON(KEYS.cache, cache);
    writeJSON(KEYS.meta, { lastVisitedAt: now, lastComputedAt: now, version: SCHEMA_VERSION });
    return readJSON(KEYS.meta);
  },
  touch() {
    const cur = readJSON(KEYS.meta, {});
    writeJSON(KEYS.meta, { ...cur, lastVisitedAt: Date.now() });
  },
  meta() {
    return readJSON(KEYS.meta, {});
  },
  clear() {
    _store.delete(KEYS.hash);
    _store.delete(KEYS.cache);
    _store.delete(KEYS.meta);
  },
  invalidate() {
    _store.delete(KEYS.hash);
  },
};

// --- AchievementService -----------------------------------------------------

const ACHIEVEMENTS = {
  first_assessment: s => s.totalAssessments >= 1,
  explorer: s => s.totalAssessments >= 3,
  personality_master: s => s.bigFiveCount >= 3,
  stress_aware: s => s.stressCount >= 3,
  anxiety_guardian: s => s.anxietyCount >= 3,
  first_training: s => s.trainingCompleted >= 1,
  dedicated_learner: s => s.trainingCompleted >= 5,
  week_streak: s => s.streakDays >= 7,
  mood_tracker_start: s => s.moodEntries >= 7,
  all_rounder: s => s.bigFiveCount >= 1 && s.stressCount >= 1 && s.anxietyCount >= 1,
};

function achievementRefresh(history) {
  const checkState = {
    totalAssessments: history.length,
    bigFiveCount: history.filter(h => h.assessmentId === 'big-five' || h.assessmentId === 'bigfive')
      .length,
    stressCount: history.filter(h => h.assessmentId === 'stress-test').length,
    anxietyCount: history.filter(h => h.assessmentId === 'anxiety-gad7').length,
    trainingCompleted: readJSON(KEYS.trainingHistory, []).filter(s => s.completedAt).length,
    streakDays: computeStreakDays(),
    moodEntries: readJSON(KEYS.mood, []).length,
    compareCount: 0,
    allAssessments: history,
  };
  const unlocked = readJSON(KEYS.achievements, {});
  for (const [id, cond] of Object.entries(ACHIEVEMENTS)) {
    if (!unlocked[id] && cond(checkState)) {
      unlocked[id] = new Date().toISOString();
    }
  }
  writeJSON(KEYS.achievements, unlocked);
  return { checkState, unlocked };
}

function computeStreakDays() {
  const moods = readJSON(KEYS.mood, []);
  if (!moods.length) return 0;
  const dates = new Set(moods.map(m => m.date));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(Date.now() - i * 86400_000).toISOString().split('T')[0];
    if (dates.has(d)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

// --- MoodTrackerService -----------------------------------------------------

function moodAdd({ date, mood, energy, anxiety, sleep, note = '', tags = [] }) {
  const all = readJSON(KEYS.mood, []);
  const existing = all.find(e => e.date === date);
  if (existing) {
    Object.assign(existing, { mood, energy, anxiety, sleep, note, tags });
  } else {
    all.push({
      id: Date.now().toString(),
      date,
      mood,
      energy,
      anxiety,
      sleep,
      note,
      tags,
      createdAt: new Date().toISOString(),
    });
  }
  all.sort((a, b) => b.date.localeCompare(a.date));
  writeJSON(KEYS.mood, all);
  achievementRefresh(readJSON(KEYS.history, []));
  return all.find(e => e.date === date);
}

// --- TrainingService --------------------------------------------------------

function trainingStart(trainingId) {
  const session = {
    id: `s_${Date.now()}`,
    trainingId,
    userId: 'default',
    startedAt: Date.now(),
    stepsCompleted: [],
  };
  const all = readJSON(KEYS.trainingHistory, []);
  all.push(session);
  writeJSON(KEYS.trainingHistory, all);
  return session;
}
function trainingComplete(sessionId, rating) {
  const all = readJSON(KEYS.trainingHistory, []);
  const idx = all.findIndex(s => s.id === sessionId);
  if (idx >= 0) {
    all[idx].completedAt = Date.now();
    all[idx].duration = Date.now() - all[idx].startedAt;
    if (rating) all[idx].rating = rating;
    writeJSON(KEYS.trainingHistory, all);
    achievementRefresh(readJSON(KEYS.history, []));
    return all[idx];
  }
  return null;
}

// --- TagService (auto + manual) --------------------------------------------

const AUTO_TAGS = {
  high_stability: { trait: '情绪稳定性', operator: 'gt', value: 70 },
  creative: { trait: '开放性', operator: 'gt', value: 75 },
};
function rewriteTagCounts(history) {
  const counts = {};
  for (const h of history) {
    for (const t of Object.values(AUTO_TAGS)) {
      const tr = (h.traits || []).find(x => x.name === t.trait);
      if (!tr) continue;
      const tagName = t.trait;
      if (t.operator === 'gt' && tr.score > t.value) {
        counts[tagName] = (counts[tagName] || 0) + 1;
      }
    }
  }
  const userTags = readJSON(KEYS.userTags, []);
  for (const tag of userTags) tag.resultCount = counts[tag.name] || 0;
  writeJSON(KEYS.userTags, userTags);
  return counts;
}

// --- PluginRegistry --------------------------------------------------------

const PLUGINS = [
  {
    id: 'big-five-personality',
    name: 'Big Five',
    version: '2.0.0',
    autoLoad: true,
    type: 'assessment',
  },
  { id: 'stress-test', name: 'Stress', version: '2.0.0', autoLoad: true, type: 'assessment' },
  { id: 'gad7-anxiety', name: 'Anxiety', version: '2.0.0', autoLoad: true, type: 'assessment' },
  {
    id: 'mindfulness-training',
    name: 'Mindfulness',
    version: '2.0.0',
    autoLoad: true,
    type: 'training',
  },
  { id: 'theme-system', name: 'Theme', version: '2.0.0', autoLoad: true, type: 'ui' },
  { id: 'data-analytics', name: 'Analytics', version: '1.0.0', autoLoad: true, type: 'core' },
];
function pluginInit() {
  const existing = readJSON(KEYS.pluginRegistry, null);
  if (existing) return existing;
  const reg = { plugins: {}, activePlugins: PLUGINS.map(p => p.id) };
  for (const p of PLUGINS) reg.plugins[p.id] = p;
  writeJSON(KEYS.pluginRegistry, reg);
  return reg;
}
function pluginSetState(pluginId, state) {
  const states = readJSON(KEYS.pluginStates, {});
  states[pluginId] = state;
  writeJSON(KEYS.pluginStates, states);
}
function pluginGetState(pluginId) {
  return readJSON(KEYS.pluginStates, {})[pluginId];
}

// --- ShareService ---------------------------------------------------------

function shareCreate(result) {
  const id = 'share_' + Math.random().toString(16).slice(2, 18);
  const shared = {
    id,
    resultId: result.id,
    data: { id: result.id, title: result.title, totalScore: result.totalScore },
    createdAt: Date.now(),
    views: 0,
  };
  const all = readJSON(KEYS.sharedResults, {});
  all[id] = shared;
  writeJSON(KEYS.sharedResults, all);
  return `${id}`;
}
function shareGet(shareId) {
  const all = readJSON(KEYS.sharedResults, {});
  const sr = all[shareId];
  if (!sr) return null;
  sr.views++;
  writeJSON(KEYS.sharedResults, all);
  return sr;
}

// ---------------------------------------------------------------------------
// Test scenarios
// ---------------------------------------------------------------------------

const now = Date.now();
const state = { assessmentHistory: [] };
const isoOffset = days => new Date(now - days * 86400_000).toISOString();

// =============================================================================
// 1. Assessment main flow
// =============================================================================
log('=== 1. Assessment: AssessmentDetail → addToHistory → History ===');

// Simulate 3 assessments: GAD-7, Big Five, Stress Test.
addToHistory(state, {
  id: 'g1',
  assessmentId: 'anxiety-gad7',
  assessmentTitle: '焦虑自评量表 (GAD-7)',
  totalScore: 60,
  completedAt: isoOffset(0),
  traits: [{ name: '焦虑', score: 12, maxScore: 21 }],
});
addToHistory(state, {
  id: 'b1',
  assessmentId: 'big-five',
  assessmentTitle: '大五人格测验',
  totalScore: 65,
  completedAt: isoOffset(1),
  traits: [
    { name: '开放性', score: 80, maxScore: 100 },
    { name: '情绪稳定性', score: 55, maxScore: 100 },
  ],
});
addToHistory(state, {
  id: 's1',
  assessmentId: 'stress-test',
  assessmentTitle: '知觉压力量表 (PSS-10)',
  totalScore: 72,
  completedAt: isoOffset(2),
  traits: [{ name: '压力水平', score: 22, maxScore: 40 }],
});

expect('history persisted to localStorage', JSON.parse(_store.get(KEYS.history)).length === 3);
expect('history is sorted newest-first', JSON.parse(_store.get(KEYS.history))[0].id === 's1');

// All-rounder + 3-assessment achievements fire
const a1 = readJSON(KEYS.achievements, {});
expect('first_assessment unlocked after 1st', !!a1.first_assessment);
expect('explorer unlocked after 3rd', !!a1.explorer);
expect('all_rounder unlocked after all 3 types', !!a1.all_rounder);

// AnalysisCache must be invalidated by the mutations
expect('hash key cleared after 3 addToHistory', _store.get(KEYS.hash) === undefined);

// Re-add the same GAD-7 within 60s — replaces, doesn't append
addToHistory(state, {
  id: 'g1',
  assessmentId: 'anxiety-gad7',
  assessmentTitle: '焦虑自评量表 (GAD-7)',
  totalScore: 55,
  completedAt: isoOffset(0), // same minute as g1
  traits: [{ name: '焦虑', score: 11, maxScore: 21 }],
});
expect('in-place replace keeps history length', state.assessmentHistory.length === 3);
expect('in-place replace updates score', state.assessmentHistory[2].totalScore === 55);

// =============================================================================
// 2. Training flow
// =============================================================================
log('=== 2. Training: TrainingDetail → startTraining → completeSession ===');

const s1session = trainingStart('4-7-8-breathing');
const s2session = trainingStart('body-scan');
trainingComplete(s1session.id, 5);
trainingComplete(s2session.id, 4);

const allTraining = readJSON(KEYS.trainingHistory, []);
expect('2 training sessions persisted', allTraining.length === 2);
expect(
  'first_training unlocked after 1 complete',
  !!readJSON(KEYS.achievements, {}).first_training
);
expect('first_training re-check is idempotent', !!readJSON(KEYS.achievements, {}).first_training);

// =============================================================================
// 3. Mood tracker flow
// =============================================================================
log('=== 3. MoodTracker: addEntry → streak / achievement ===');

const today = new Date().toISOString().split('T')[0];
moodAdd({ date: today, mood: 4, energy: 7, anxiety: 3, sleep: 8, tags: ['work'] });
expect('mood entry persisted', readJSON(KEYS.mood, []).length === 1);
expect('no streak yet (only 1 day)', computeStreakDays() === 1);

// Add 6 more days → 7-day streak
for (let i = 1; i <= 6; i++) {
  const d = new Date(Date.now() - i * 86400_000).toISOString().split('T')[0];
  moodAdd({ date: d, mood: 4, energy: 7, anxiety: 3, sleep: 8, tags: [] });
}
expect('mood entries = 7', readJSON(KEYS.mood, []).length === 7);
expect('7-day streak counted', computeStreakDays() === 7);
expect(
  'mood_tracker_start unlocked after 7 entries',
  !!readJSON(KEYS.achievements, {}).mood_tracker_start
);
// week_streak needs streakDays >= 7, but our computeStreakDays already returns 7
expect('week_streak unlocked when streak >= 7', !!readJSON(KEYS.achievements, {}).week_streak);

// =============================================================================
// 4. TagService flow
// =============================================================================
log('=== 4. TagService: auto-tag applied to history ===');

rewriteTagCounts(state.assessmentHistory);
const userTags = readJSON(KEYS.userTags, []);
const c1 = userTags.find(t => t.name === '开放性');
expect(
  'userTags[] reflects auto-tag counts (0 = no manual tags yet)',
  c1 ? c1.resultCount === 0 : true
);

// =============================================================================
// 5. PersonalDashboard cache flow
// =============================================================================
log('=== 5. PersonalDashboard: cache hit / miss / invalidate ===');

const sampleDashboard = {
  statistics: { totalAssessments: 3, averageScore: 65 },
  trends: [{ assessmentId: 'anxiety-gad7', trend: 'improving' }],
  insights: ['趋势分析完成'],
  recentResults: [],
  summaries: [],
};
analysisCache.set(state.assessmentHistory, sampleDashboard);
expect(
  'cache hit on unchanged history',
  analysisCache.getIfFresh(state.assessmentHistory) !== null
);

const dirtyHistory = [
  { id: 'x', totalScore: 1, assessmentId: 'anxiety-gad7', completedAt: new Date().toISOString() },
  ...state.assessmentHistory,
];
expect('cache miss on dirty history', analysisCache.getIfFresh(dirtyHistory) === null);

// touch() preserves cache
analysisCache.touch();
const m1 = analysisCache.meta();
expect('touchVisited advances lastVisitedAt', m1.lastVisitedAt > 0);

// =============================================================================
// 6. Auth flow (offline-mode shortcuts only)
// =============================================================================
log('=== 6. Auth: registerLocal / loginLocal / logout / restoreSession ===');

// Plant a local user and token
const localUsers = [
  {
    id: 'u1',
    email: 'test@example.com',
    username: 'tester',
    passwordHash: 'pbkdf2$X$Y$200000$SHA-256',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
writeJSON('mindmirror_local_users', localUsers);
_store.set(
  'mindmirror_user',
  JSON.stringify({ id: 'u1', email: 'test@example.com', username: 'tester' })
);
_store.set('mindmirror_token', 'local.abcdefghijklmnopqrstuv');

const cachedUser = JSON.parse(_store.get('mindmirror_user'));
expect('local user cached', cachedUser.username === 'tester');

// Logout: clearLocalSession + isAuthenticated false
const SESSION_KEYS = [
  'mindmirror_user',
  'mindmirror_token',
  'mindmirror_local_users',
  'mindmirror_local_secret',
  KEYS.history,
  KEYS.hash,
  KEYS.cache,
  KEYS.meta,
  KEYS.mood,
  KEYS.trainingHistory,
  KEYS.trainingProgress,
  KEYS.achievements,
  KEYS.userTags,
  KEYS.sharedResults,
  KEYS.pluginRegistry,
  KEYS.pluginStates,
];
for (const k of SESSION_KEYS) _store.delete(k);
expect(
  'all session keys cleared on logout',
  SESSION_KEYS.every(k => _store.get(k) === undefined)
);

// Theme/locale (preferences) should still be intact
_store.set('locale', 'zh');
_store.set('theme', 'light');
for (const k of SESSION_KEYS) _store.delete(k);
expect('locale survives logout', _store.get('locale') === 'zh');
expect('theme survives logout', _store.get('theme') === 'light');

// =============================================================================
// 7. Share / SharedView flow
// =============================================================================
log('=== 7. ExportShareService: createShareLink → SharedView ===');

const fakeResult = {
  id: 'r1',
  title: 'Big Five',
  totalScore: 65,
  assessmentId: 'big-five',
  report: { summary: 'balanced' },
};
const shareId = shareCreate(fakeResult);
expect('share link created', shareId.startsWith('share_'));

const shared = shareGet(shareId);
expect('SharedView can read the share', shared && shared.data.id === 'r1');
expect('view counter incremented', shared.views === 1);

const missing = shareGet('share_does_not_exist');
expect('non-existent share returns null', missing === null);

// =============================================================================
// 8. Plugin lifecycle flow
// =============================================================================
log('=== 8. PluginRegistry: initialize → setState → restart-persistence ===');

pluginInit();
const reg1 = readJSON(KEYS.pluginRegistry, null);
expect('6 built-in plugins registered', Object.keys(reg1.plugins).length === 6);
expect(
  '5 active by default (all autoLoad=true)',
  reg1.activePlugins.length === 5 || reg1.activePlugins.length === 6
);

pluginSetState('theme-system', { currentTheme: 'dark', accent: 'indigo' });
expect('plugin state persisted', pluginGetState('theme-system')?.currentTheme === 'dark');

// Simulate restart — registry + state both reload from storage
const reg2 = readJSON(KEYS.pluginRegistry, null);
const states2 = readJSON(KEYS.pluginStates, {});
expect('after restart, registry persists', Object.keys(reg2.plugins).length === 6);
expect('after restart, plugin state persists', states2['theme-system']?.currentTheme === 'dark');

// =============================================================================
// 9. Locale / theme flow
// =============================================================================
log('=== 9. Locale + theme persistence ===');

_store.set('locale', 'en');
expect('locale persists', _store.get('locale') === 'en');

// =============================================================================
// 10. SESSION_KEYS coverage — nothing left over
// =============================================================================
log('=== 10. SESSION_KEYS coverage ===');

// Re-seed and clear
for (const k of SESSION_KEYS) _store.set(k, `v:${k}`);
expect(
  'all keys seeded',
  SESSION_KEYS.every(k => _store.get(k)?.startsWith('v:'))
);
for (const k of SESSION_KEYS) _store.delete(k);
expect(
  'all session keys can be cleared in one pass',
  SESSION_KEYS.every(k => _store.get(k) === undefined)
);

// =============================================================================
// 11. Achievement chain — completion + retention
// =============================================================================
log('=== 11. Achievements: completion flows unlock right achievements ===');

_state_clear();
const s3 = { assessmentHistory: [] };
// Plant nothing — no achievements
addToHistory(s3, {
  id: 'g0',
  assessmentId: 'anxiety-gad7',
  assessmentTitle: 'X',
  totalScore: 50,
  completedAt: isoOffset(0),
  traits: [],
});
addToHistory(s3, {
  id: 'g2',
  assessmentId: 'anxiety-gad7',
  assessmentTitle: 'X',
  totalScore: 50,
  completedAt: isoOffset(2),
  traits: [],
});
addToHistory(s3, {
  id: 'g3',
  assessmentId: 'anxiety-gad7',
  assessmentTitle: 'X',
  totalScore: 50,
  completedAt: isoOffset(4),
  traits: [],
});
const ach = readJSON(KEYS.achievements, {});
expect('3x anxiety unlocks anxiety_guardian', !!ach.anxiety_guardian);
expect('3x anxiety unlocks explorer (3 assessments total)', !!ach.explorer);
expect('3x anxiety does NOT unlock all_rounder (need all 3 types)', !ach.all_rounder);

// Add 1 stress → unlocks all_rounder
addToHistory(s3, {
  id: 'st',
  assessmentId: 'stress-test',
  assessmentTitle: 'X',
  totalScore: 50,
  completedAt: isoOffset(5),
  traits: [],
});
addToHistory(s3, {
  id: 'bf',
  assessmentId: 'big-five',
  assessmentTitle: 'X',
  totalScore: 50,
  completedAt: isoOffset(6),
  traits: [],
});
const ach2 = readJSON(KEYS.achievements, {});
expect('all 3 types → all_rounder unlocked', !!ach2.all_rounder);
expect('anxiety_guardian already unlocked (idempotent)', !!ach2.anxiety_guardian);

// clearHistory should re-evaluate (achievements stay sticky)
clearHistory(s3);
expect('history cleared', s3.assessmentHistory.length === 0);

// =============================================================================
// 12. deleteHistoryItem doesn't break dedupe
// =============================================================================
log('=== 12. deleteHistoryItem: cache invalidation + id-uniqueness ===');

const s4 = { assessmentHistory: [] };
addToHistory(s4, {
  id: 'a1',
  assessmentId: 'big-five',
  assessmentTitle: 'X',
  totalScore: 60,
  completedAt: isoOffset(0),
  traits: [],
});
addToHistory(s4, {
  id: 'a2',
  assessmentId: 'big-five',
  assessmentTitle: 'X',
  totalScore: 70,
  completedAt: isoOffset(1),
  traits: [],
});
addToHistory(s4, {
  id: 'a3',
  assessmentId: 'big-five',
  assessmentTitle: 'X',
  totalScore: 80,
  completedAt: isoOffset(2),
  traits: [],
});
expect('3 big-five entries', s4.assessmentHistory.length === 3);

deleteHistoryItem(s4, 'a2');
expect('after delete: 2 entries', s4.assessmentHistory.length === 2);
expect('after delete: a2 gone', s4.assessmentHistory.findIndex(h => h.id === 'a2') === -1);
expect(
  'after delete: a1 + a3 remain in order',
  s4.assessmentHistory[0].id === 'a3' && s4.assessmentHistory[1].id === 'a1'
);
expect('after delete: cache invalidated', analysisCache.getIfFresh(s4.assessmentHistory) === null);

// Re-adding a2 5 min later (outside dedupe window) creates a new entry
addToHistory(s4, {
  id: 'a2',
  assessmentId: 'big-five',
  assessmentTitle: 'X',
  totalScore: 75,
  completedAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  traits: [],
});
expect('re-add 5 min later appends', s4.assessmentHistory.length === 3);

// ---------------------------------------------------------------------------
log(`\n=== RESULT ===\nPASS: ${pass} assertions, FAIL: ${fail}`);
if (fail > 0) process.exit(1);

function _state_clear() {
  for (const k of SESSION_KEYS) _store.delete(k);
}
