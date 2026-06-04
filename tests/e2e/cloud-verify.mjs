// Verify the redesigned result pages are live on Pages (production build).
import { chromium } from 'playwright';
import { setTimeout as sleep } from 'node:timers/promises';

const URL = 'https://badhope.github.io/MindMirror';
const log = (...a) => console.log('[cloud-e2e]', ...a);

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push('console.error: ' + m.text());
  });

  // 1. Landing
  log('1. landing');
  await page.goto(URL + '/', { waitUntil: 'networkidle' });
  const title = await page.title();
  log('  title =', title);
  if (!title.includes('MindMirror')) throw new Error('landing title wrong');

  // 2. For each assessment, navigate and wait for the SPA chunk to load.
  for (const id of ['anxiety-gad7', 'bigfive', 'stress-test']) {
    log('2. assessment:', id);
    // Wait for the new AssessmentDetail chunk to be fetched.
    const chunkPromise = page.waitForResponse(
      (r) => /\/assets\/AssessmentDetail-.*\.js/.test(r.url()),
      { timeout: 20000 }
    ).catch(() => null);
    await page.goto(URL + '/assessments/' + id, { waitUntil: 'domcontentloaded' });
    const resp = await chunkPromise;
    if (resp) {
      log('  ✓ AssessmentDetail chunk loaded:', resp.url().split('/').pop(), 'status=' + resp.status());
    } else {
      throw new Error('AssessmentDetail chunk did not load for ' + id);
    }
    await sleep(500);
  }

  // 3. Pull a screenshot of the new big-five intro page to prove CSS is live
  log('3. screenshot');
  await page.goto(URL + '/assessments/bigfive', { waitUntil: 'networkidle' });
  await sleep(800);
  await page.screenshot({ path: 'tests/e2e/screenshots/cloud-bigfive-intro.png', fullPage: false });
  log('  saved cloud-bigfive-intro.png');

  if (errs.length) {
    log('client errors:');
    for (const e of errs) log('  ', e);
  }
  await browser.close();
  log('DONE');
}
run().catch((e) => {
  console.error('[cloud-e2e] FAILED:', e.message);
  process.exit(1);
});
