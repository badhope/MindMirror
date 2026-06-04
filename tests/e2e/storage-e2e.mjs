/**
 * E2E smoke for the storage + dashboard + history fix chain.
 *
 * Verifies:
 *   1. PersonalDashboard renders insights + stat cards with new design.
 *   2. History page renders the redesigned hero + stat cards.
 *   3. Clicking "view details" on a history entry reaches the result page
 *      (the useEffect resetAssessment() regression is fixed).
 *   4. localStorage contains the assessmentHistory we injected.
 *   5. AnalysisCache is populated after a dashboard visit.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const VITE = 'http://localhost:5173/MindMirror';
const OUT = 'tests/e2e/screenshots';
mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log('[storage-e2e]', ...a);

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push('console.error: ' + m.text());
  });

  // Bootstrap the SPA on a normal landing route first.
  log('1. bootstrap SPA');
  await page.goto(VITE + '/', { waitUntil: 'networkidle' });
  await sleep(1500);

  // Inject 6 history items across the 3 assessment types so the dashboard
  // and history pages have something meaningful to render.
  log('2. seed assessment history');
  await page.evaluate(() => {
    const store = window.__mindmirrorStore;
    if (!store) throw new Error('store not on window');
    const now = Date.now();
    const seedResults = [
      { id: 'gad-r1', assessmentId: 'anxiety-gad7', assessmentTitle: '焦虑自评量表 (GAD-7)', totalScore: 60, traits: [{ name: '紧张', score: 3 }, { name: '担忧', score: 2 }], days: 0 },
      { id: 'gad-r2', assessmentId: 'anxiety-gad7', assessmentTitle: '焦虑自评量表 (GAD-7)', totalScore: 50, traits: [{ name: '紧张', score: 2 }], days: 7 },
      { id: 'bf-r1',  assessmentId: 'bigfive',      assessmentTitle: '大五人格测验',           totalScore: 65, traits: [{ name: '开放性', score: 78 }, { name: '外向性', score: 67 }], days: 1 },
      { id: 'bf-r2',  assessmentId: 'bigfive',      assessmentTitle: '大五人格测验',           totalScore: 58, traits: [{ name: '开放性', score: 65 }], days: 8 },
      { id: 'st-r1',  assessmentId: 'stress-test',  assessmentTitle: '知觉压力量表 (PSS-10)',   totalScore: 72, traits: [{ name: '压力感受', score: 75 }], days: 2 },
      { id: 'st-r2',  assessmentId: 'stress-test',  assessmentTitle: '知觉压力量表 (PSS-10)',   totalScore: 65, traits: [{ name: '压力感受', score: 70 }], days: 9 },
    ];
    const history = seedResults.map((s, i) => ({
      id: s.id,
      totalScore: s.totalScore,
      traits: s.traits,
      completedAt: new Date(now - s.days * 86400_000 + i * 1000).toISOString(),
      assessmentId: s.assessmentId,
      assessmentTitle: s.assessmentTitle,
    }));
    store.setState({ assessmentHistory: history });
  });
  await sleep(400);

  const stored = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('assessmentHistory') || '[]').length;
  });
  log('  localStorage assessmentHistory length =', stored);
  if (stored < 6) throw new Error('history not persisted to localStorage');

  // 3. PersonalDashboard
  log('3. PersonalDashboard');
  await page.goto(VITE + '/dashboard', { waitUntil: 'networkidle' });
  await sleep(1500);
  const dashHtml = await page.locator('body').innerText();
  for (const t of ['个人洞察', '📋', '🔥', '📊', '数据更新于']) {
    if (!dashHtml.includes(t)) throw new Error('dashboard missing token: ' + t);
    log('  ✓ token:', t);
  }
  await page.screenshot({ path: OUT + '/dashboard-top.png', fullPage: false });
  await page.screenshot({ path: OUT + '/dashboard-full.png', fullPage: true });
  log('  saved dashboard-top.png + dashboard-full.png');

  // Verify analysis cache was written
  const cacheKeys = await page.evaluate(() => ({
    hash: !!localStorage.getItem('mindmirror_analysis_history_hash'),
    cache: !!localStorage.getItem('mindmirror_analysis_cache'),
    meta: !!localStorage.getItem('mindmirror_analysis_meta'),
  }));
  log('  cache:', cacheKeys);
  if (!cacheKeys.hash || !cacheKeys.cache || !cacheKeys.meta) {
    throw new Error('AnalysisCache did not persist');
  }

  // 4. History page
  log('4. History');
  await page.goto(VITE + '/history', { waitUntil: 'networkidle' });
  await sleep(1500);
  const histHtml = await page.locator('body').innerText();
  for (const t of ['📋', '🔥', '⭐', '📊', '知觉压力量表', '焦虑自评量表', '大五人格']) {
    if (!histHtml.includes(t)) throw new Error('history missing token: ' + t);
    log('  ✓ token:', t);
  }
  await page.screenshot({ path: OUT + '/history-top.png', fullPage: false });
  await page.screenshot({ path: OUT + '/history-full.png', fullPage: true });
  log('  saved history-top.png + history-full.png');

  // 5. Click "view details" → result page regression check
  log('5. click view details from history');
  const viewBtn = page.locator('a:has-text("查看详情")').first();
  await viewBtn.scrollIntoViewIfNeeded();
  await sleep(200);
  await viewBtn.click();
  await sleep(1500);
  const resultUrl = page.url();
  log('  result url =', resultUrl);
  if (!/\/assessments\//.test(resultUrl)) {
    throw new Error('did not navigate to result page, got ' + resultUrl);
  }
  const resultHtml = await page.locator('body').innerText();
  if (resultHtml.includes('404') || resultHtml.includes('页面未找到')) {
    throw new Error('result page is 404 — resetAssessment() bug regressed');
  }
  // Check for the new design hero on the result page (anxiety-gad7)
  if (
    resultUrl.includes('anxiety-gad7') &&
    !resultHtml.includes('焦虑等级解读') &&
    !resultHtml.includes('症状分析')
  ) {
    throw new Error('GAD-7 result page missing new design tokens');
  }
  log('  ✓ result page renders new design from history click-through');
  await page.screenshot({ path: OUT + '/history-clickthrough-result.png', fullPage: false });

  // 6. de-dupe verification: re-run addToHistory for an existing entry
  log('6. addToHistory de-dupe');
  const before = await page.evaluate(() => {
    return window.__mindmirrorStore.getState().assessmentHistory.length;
  });
  await page.evaluate(() => {
    const store = window.__mindmirrorStore;
    const state = store.getState();
    const r = state.assessmentHistory[0];
    state.addToHistory(r); // re-add the same minute-resolution entry
  });
  await sleep(300);
  const after = await page.evaluate(() => {
    return window.__mindmirrorStore.getState().assessmentHistory.length;
  });
  log(`  history ${before} → ${after} (should stay ${before})`);
  if (after !== before) throw new Error('addToHistory did not dedupe');

  if (errs.length) {
    log('client errors:');
    for (const e of errs) log('  ', e);
  }
  await browser.close();
  log('DONE');
}
run().catch((e) => {
  console.error('[storage-e2e] FAILED:', e.message);
  process.exit(1);
});
