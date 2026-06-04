/**
 * Visual smoke for the redesigned Big Five result page.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const VITE = 'http://localhost:5173/MindMirror';
const OUT = 'tests/e2e/screenshots';
mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log('[bigfive-ui]', ...a);

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push(`console.error: ${m.text()}`);
  });

  log('open Big Five page');
  await page.goto(VITE + '/assessments/bigfive', { waitUntil: 'networkidle' });
  await sleep(1500);

  log('injecting mock store state for Big Five result');
  await page.evaluate(() => {
    const store = window.__mindmirrorStore;
    if (!store) throw new Error('store not on window');
    const answers = {};
    for (let i = 0; i < 60; i++) answers['q' + (i + 1)] = i % 5 === 0 ? 5 : 3;
    store.setState({
      answers,
      result: {
        id: 'mock-bf-1',
        totalScore: 65,
        traits: [
          { name: '开放性', score: 78, description: '富于想象、寻求变化' },
          { name: '尽责性', score: 42, description: '条理、自律性一般' },
          { name: '外向性', score: 67, description: '好社交、活跃' },
          { name: '宜人性', score: 55, description: '热心、信任' },
          { name: '情绪稳定性', score: 38, description: '容易焦虑、情绪波动' },
        ],
        completedAt: new Date().toISOString(),
        assessmentId: 'bigfive',
        assessmentTitle: '大五人格',
      },
      currentStep: 'result',
    });
  });
  await sleep(1500);

  const html = await page.locator('body').innerText();
  const expected = ['五大维度画像', '下一步,试试这些', '应用与建议'];
  for (const n of expected) {
    if (!html.includes(n)) throw new Error('design token missing: ' + n);
    log('  ✓ present:', n);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
  await page.screenshot({ path: OUT + '/bigfive-result-top.png', fullPage: false });
  await page.screenshot({ path: OUT + '/bigfive-result-full.png', fullPage: true });
  log('  saved bigfive-result-top.png / -full.png');

  for (const s of [
    { name: 'hero', y: 0 },
    { name: 'five-traits', y: 900 },
    { name: 'strengths', y: 2700 },
    { name: 'tabs', y: 3400 },
    { name: 'cta', y: 5000 },
  ]) {
    await page.evaluate((y) => window.scrollTo(0, y), s.y);
    await sleep(400);
    await page.screenshot({ path: OUT + '/bigfive-' + s.name + '.png', fullPage: false });
    log('  saved bigfive-' + s.name + '.png');
  }

  for (const tab of ['职业推荐', '关系风格', '个人成长']) {
    const tabBtn = page.locator('button[role="tab"]:has-text("' + tab + '")').first();
    if (await tabBtn.count()) {
      await page.evaluate(() => window.scrollTo(0, 3400));
      await sleep(300);
      await tabBtn.click();
      await sleep(700);
      await page.screenshot({ path: OUT + '/bigfive-tab-' + tab + '.png', fullPage: false });
      log('  saved bigfive-tab-' + tab + '.png');
    }
  }

  if (errs.length) for (const e of errs) log('  ', e);
  await browser.close();
  log('DONE');
}
run().catch((e) => {
  console.error('[bigfive-ui] FAILED:', e.message);
  process.exit(1);
});
