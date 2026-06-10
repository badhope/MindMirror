/**
 * Visual smoke for the redesigned GAD-7 result page.
 *
 * Strategy: instead of walking through 28 quiz questions one by one
 * (slow + brittle), we inject mock answers + a result directly into
 * the zustand store via window.__mindmirrorStore (exposed by
 * main.tsx in dev mode), then navigate to the result.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const VITE = 'http://localhost:5173/MindMirror';
const OUT = 'tests/e2e/screenshots';
mkdirSync(OUT, { recursive: true });

const log = (...a) => console.log('[gad7-ui]', ...a);

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const errs = [];
  page.on('pageerror', e => errs.push(`pageerror: ${e.message}`));
  page.on('console', m => {
    if (m.type() === 'error') errs.push(`console.error: ${m.text()}`);
  });

  log('open assessment page first to bootstrap the SPA');
  await page.goto(VITE + '/assessments/anxiety-gad7', { waitUntil: 'networkidle' });
  await sleep(1500);

  log('injecting mock store state for GAD-7 result (moderate anxiety)');
  await page.evaluate(() => {
    const store = window.__mindmirrorStore;
    if (!store) throw new Error('__mindmirrorStore not on window — main.tsx dev hook missing?');

    // 28 questions: first 4 score=3 (severe), rest score=2 (moderate).
    const answers = {};
    for (let i = 0; i < 28; i++) {
      answers['gad7-q' + (i + 1)] = i < 4 ? 3 : 2;
    }
    const totalScore = 28 * 2 + 4; // 60 — orange / moderate band

    store.setState({
      currentAssessment: {
        id: 'anxiety-gad7',
        name: '焦虑自评量表 (GAD-7)',
        description: 'GAD-7',
        type: 'anxiety',
        questions: Array.from({ length: 28 }, (_, i) => ({
          id: 'gad7-q' + (i + 1),
          text: '示例问题 ' + (i + 1) + ': 在过去的两周里,你有多少时间被这种感受困扰?',
          trait: i % 2 === 0 ? 'negative' : 'positive',
        })),
      },
      answers,
      result: { totalScore, traits: [] },
      currentStep: 'result',
    });
  });
  await sleep(1500);

  // Verify the new design tokens rendered
  const html = await page.locator('body').innerText();
  const expected = ['焦虑等级解读', '题目得分热力图', '建议与资源', '下一步,试试这些'];
  for (const needle of expected) {
    if (!html.includes(needle)) {
      throw new Error('design token missing: "' + needle + '"');
    }
    log('  ✓ present:', needle);
  }

  // Capture screenshots
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await page.screenshot({ path: OUT + '/gad7-result-top.png', fullPage: false });
  log('  saved gad7-result-top.png');

  await page.screenshot({ path: OUT + '/gad7-result-full.png', fullPage: true });
  log('  saved gad7-result-full.png');

  for (const s of [
    { name: 'hero', y: 0 },
    { name: 'level-legend', y: 700 },
    { name: 'heatmap', y: 1100 },
    { name: 'symptoms', y: 2900 },
    { name: 'primary-symptom', y: 3500 },
    { name: 'tabs', y: 3900 },
    { name: 'cta', y: 5000 },
  ]) {
    await page.evaluate(y => window.scrollTo(0, y), s.y);
    await sleep(500);
    await page.screenshot({ path: OUT + '/gad7-' + s.name + '.png', fullPage: false });
    log('  saved gad7-' + s.name + '.png');
  }

  for (const tab of ['健康习惯', '专业资源', '应对策略']) {
    await page.evaluate(() => window.scrollTo(0, 3900));
    await sleep(300);
    const tabBtn = page.locator('button[role="tab"]:has-text("' + tab + '")').first();
    if (await tabBtn.count()) {
      await tabBtn.click();
      await sleep(700);
      await page.screenshot({ path: OUT + '/gad7-tab-' + tab + '.png', fullPage: false });
      log('  saved gad7-tab-' + tab + '.png');
    } else {
      log('  tab', tab, 'not found');
    }
  }

  if (errs.length > 0) {
    log('console/page errors observed:');
    for (const e of errs) log('  ', e);
  }

  await browser.close();
  log('DONE');
}

run().catch(e => {
  console.error('[gad7-ui] FAILED:', e.message);
  process.exit(1);
});
