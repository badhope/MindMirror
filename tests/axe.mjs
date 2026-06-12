// 镜心 · axe-core 无障碍扫描
// 跑法：node tests/axe.mjs
// 前置：vite preview 已在 4173 端口运行（CI 脚本里 npx vite preview --port 4173 --base ./）

import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// axe-core 不一定在 dependencies 里；从 node_modules 兜底解析
let axeSource;
try {
  axeSource = readFileSync(
    require.resolve('axe-core/axe.min.js'),
    'utf8'
  );
} catch (e) {
  console.error('axe-core 未安装。请先运行：npm install --no-save axe-core@^4.10.0');
  process.exit(1);
}

const BASE = process.env.AXE_BASE || 'http://127.0.0.1:4173/';
const REPORT_DIR = 'tests/axe-reports';
mkdirSync(REPORT_DIR, { recursive: true });

// 扫描路径：启动页 + 走一遍入镜 → 选域 → 映照（4 步关键路径）
const SCENES = [
  { name: 'prologue', setup: null },
  {
    name: 'path',
    setup: async page => {
      await page.locator('button').filter({ hasText: /入镜|开始|启程|照己|照一照/i }).first().click();
      await page.waitForTimeout(500);
    },
  },
  {
    name: 'way',
    setup: async page => {
      const card = page.locator('[data-domain="east-literati"]').first();
      if (await card.count()) await card.click();
      const start = page.getByRole('button', { name: /开始/ }).first();
      if (await start.count()) await start.click();
      await page.waitForTimeout(700);
    },
  },
];

const VIEWPORTS = [
  { width: 1280, height: 800, name: 'desktop' },
  { width: 375, height: 812, name: 'mobile' },
];

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

async function scanScene(browser, viewport, scene) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    locale: 'zh-CN',
  });
  const page = await context.newPage();

  // 自动接受 confirm
  page.on('dialog', dialog => dialog.accept());

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900); // 等淡入完成

  if (scene.setup) {
    await scene.setup(page);
  }

  // 注入 axe-core
  await page.addScriptTag({ content: axeSource });

  // 跑 axe
  const result = await page.evaluate(async tags => {
    // @ts-ignore
    return await window.axe.run(document, {
      runOnly: { type: 'tag', values: tags },
      resultTypes: ['violations', 'incomplete', 'passes'],
    });
  }, TAGS);

  await context.close();
  return result;
}

(async () => {
  console.log(`镜心 · axe-core a11y 扫描 · ${BASE}\n`);

  const browser = await chromium.launch();
  const summary = [];

  for (const viewport of VIEWPORTS) {
    for (const scene of SCENES) {
      const result = await scanScene(browser, viewport, scene);
      const violations = result.violations || [];
      const incomplete = result.incomplete || [];
      const reportPath = join(REPORT_DIR, `${viewport.name}-${scene.name}.json`);
      writeFileSync(
        reportPath,
        JSON.stringify({ viewport, scene: scene.name, violations, incomplete }, null, 2)
      );

      const criticalOrSerious = violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      const tag = `[${viewport.name}/${scene.name}]`;
      if (criticalOrSerious.length === 0) {
        console.log(`  ✓ ${tag}  无 critical/serious 违规 (${violations.length} minor / ${incomplete.length} 待复核)`);
      } else {
        console.log(`  ✗ ${tag}  ${criticalOrSerious.length} critical/serious 违规`);
        for (const v of criticalOrSerious) {
          console.log(`     · [${v.impact}] ${v.id} — ${v.help}`);
          for (const node of v.nodes.slice(0, 3)) {
            console.log(`       target: ${node.target.join(' ')}`);
          }
        }
      }
      summary.push({
        viewport: viewport.name,
        scene: scene.name,
        violations: violations.length,
        criticalSerious: criticalOrSerious.length,
        incomplete: incomplete.length,
      });
    }
  }

  await browser.close();

  // 写总览
  writeFileSync(
    join(REPORT_DIR, 'summary.json'),
    JSON.stringify(summary, null, 2)
  );

  // 终判：任何 critical/serious 即 fail
  const totalFail = summary.reduce((acc, s) => acc + s.criticalSerious, 0);
  console.log(`\n── 总览：critical/serious 违规 ${totalFail} 处`);
  if (totalFail > 0) {
    console.log(`  报告已写入 ${REPORT_DIR}/`);
    process.exit(1);
  }
  console.log('  axe 扫描通过 ✓');
})();
