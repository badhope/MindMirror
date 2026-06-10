/**
 * Visual smoke for the redesigned Stress (PSS-10) result page.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const VITE = 'http://localhost:5173/MindMirror';
const OUT = 'tests/e2e/screenshots';
mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log('[stress-ui]', ...a);

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', e => errs.push(`pageerror: ${e.message}`));
  page.on('console', m => {
    if (m.type() === 'error') errs.push(`console.error: ${m.text()}`);
  });

  log('open Stress page');
  await page.goto(VITE + '/assessments/stress-test', { waitUntil: 'networkidle' });
  await sleep(1500);

  log('injecting mock store state for Stress result');
  await page.evaluate(() => {
    const store = window.__mindmirrorStore;
    if (!store) throw new Error('store not on window');
    const answers = {};
    for (let i = 0; i < 30; i++) answers['q' + (i + 1)] = i % 4 === 0 ? 4 : 2;
    store.setState({
      answers,
      result: {
        id: 'mock-st-1',
        totalScore: 72,
        traits: [
          { name: '压力感受', score: 75, description: '常感到压力' },
          { name: '工作压力', score: 80, description: '工作强度较大' },
          { name: '关系压力', score: 55, description: '关系中偶有摩擦' },
          { name: '健康压力', score: 65, description: '健康习惯不够好' },
          { name: '财务压力', score: 40, description: '财务压力可控' },
          { name: '应对能力', score: 60, description: '具备一定应对能力' },
        ],
        completedAt: new Date().toISOString(),
        assessmentId: 'stress-test',
        assessmentTitle: '压力测试',
      },
      currentStep: 'result',
    });
  });
  await sleep(1500);

  const html = await page.locator('body').innerText();
  const expected = ['压力等级解读', '压力详细表现', '各维度得分', '下一步,试试这些'];
  for (const n of expected) {
    if (!html.includes(n)) throw new Error('design token missing: ' + n);
    log('  ✓ present:', n);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
  await page.screenshot({ path: OUT + '/stress-result-top.png', fullPage: false });
  await page.screenshot({ path: OUT + '/stress-result-full.png', fullPage: true });
  log('  saved stress-result-top.png / -full.png');

  for (const s of [
    { name: 'hero', y: 0 },
    { name: 'level-legend', y: 700 },
    { name: 'signs', y: 1300 },
    { name: 'dimensions', y: 2000 },
    { name: 'top-dimensions', y: 2900 },
    { name: 'cta', y: 5000 },
  ]) {
    await page.evaluate(y => window.scrollTo(0, y), s.y);
    await sleep(400);
    await page.screenshot({ path: OUT + '/stress-' + s.name + '.png', fullPage: false });
    log('  saved stress-' + s.name + '.png');
  }

  for (const tab of ['健康习惯', '专业资源', '应对策略']) {
    const tabBtn = page.locator('button[role="tab"]:has-text("' + tab + '")').first();
    if (await tabBtn.count()) {
      await page.evaluate(() => window.scrollTo(0, 4200));
      await sleep(300);
      await tabBtn.click();
      await sleep(700);
      await page.screenshot({ path: OUT + '/stress-tab-' + tab + '.png', fullPage: false });
      log('  saved stress-tab-' + tab + '.png');
    }
  }

  if (errs.length) for (const e of errs) log('  ', e);
  await browser.close();
  log('DONE');
}
run().catch(e => {
  console.error('[stress-ui] FAILED:', e.message);
  process.exit(1);
});
