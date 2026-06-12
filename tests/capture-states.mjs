// 镜心 · 多状态截图
//
// 输出：.trae/render/states/{phase}-{theme}.png
//   prologue-light.png   / prologue-dark.png
//   way-light.png        / way-dark.png
//   reflection-light.png / reflection-dark.png
//
// 跑法：node tests/capture-states.mjs

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const PORT = 4173;
const BASE = process.env.E2E_BASE || `http://127.0.0.1:${PORT}/`;
const OUT_DIR = resolve('.trae/render/states');
mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORT = { width: 1440, height: 900 };

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return;
    } catch {
      /* not ready */
    }
    await sleep(400);
  }
  throw new Error(`预览服务 ${url} 启动超时`);
}

/** 注入 ~30 题答案到 store 并跳到 reflection */
async function injectAnswersAndFinish(page) {
  await page.waitForFunction(() => {
    // 等待 useStore 已挂到 window（默认没有挂，这里走 localStorage 注入）
    return true;
  });
  // 通过 localStorage 注入：答 30+ 题让 canFinish=true
  await page.evaluate(() => {
    // 找 30 个 item ids 注入
    const k = 'mindmirror-v1';
    const ans = {};
    for (let i = 1; i <= 30; i++) {
      ans[`el-${String(i).padStart(3, '0')}`] = (i * 3) % 6;
    }
    const s = {
      state: {
        phase: 'way',
        domain: 'east-literati',
        currentIndex: 47, // 跳到末题
        answers: ans,
        locale: 'zh',
        theme: 'light',
        report: null,
      },
      version: 0,
    };
    localStorage.setItem(k, JSON.stringify(s));
  });
  await page.reload({ waitUntil: 'networkidle' });
  // 末题点出镜
  await page.waitForSelector('[data-testid="btn-finish"]:not([disabled])', { timeout: 8_000 });
  await page.locator('[data-testid="btn-finish"]').click();
  await page.waitForSelector('[data-figure="primary"]', { timeout: 8_000 });
  await page.waitForFunction(
    () => document.querySelectorAll('[data-figure="alternate"]').length >= 4,
    { timeout: 8_000 }
  );
  await page.waitForTimeout(800);
}

async function captureOne(browser, { phase, theme }) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    locale: 'zh-CN',
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
  });
  page.on('dialog', d => d.accept());

  try {
    // 设置主题：使用 localStorage 注入（在导航前生效）
    await page.addInitScript(t => {
      try {
        localStorage.setItem('mindmirror-v1.theme', t);
      } catch {
        /* noop */
      }
    }, theme);

    await page.goto(BASE, { waitUntil: 'networkidle' });

    if (phase === 'prologue') {
      await page.waitForSelector('[data-testid="btn-enter"]', { timeout: 8_000 });
      await page.waitForTimeout(900);
    } else if (phase === 'way') {
      // 入镜 → 选域 → 开始
      await page.locator('[data-testid="btn-enter"]').click();
      await page.waitForSelector('[data-domain="east-literati"]', { timeout: 5_000 });
      await page.locator('[data-domain="east-literati"]').click();
      await page.waitForSelector('[data-testid="btn-start"]', { timeout: 5_000 });
      await page.locator('[data-testid="btn-start"]').click();
      await page.waitForSelector('[data-testid="way-prompt"]', { timeout: 8_000 });
      await page.waitForTimeout(800);
    } else if (phase === 'reflection') {
      await injectAnswersAndFinish(page);
    } else {
      throw new Error(`未知 phase: ${phase}`);
    }

    const out = join(OUT_DIR, `${phase}-${theme}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log(`  ✓ ${phase}-${theme}.png`);
  } finally {
    await page.close();
    await ctx.close();
  }
  return errors;
}

async function main() {
  console.log('▶ 启动 vite preview @', PORT);
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  });
  preview.stdout.on('data', () => {});
  preview.stderr.on('data', () => {});

  let exitCode = 0;
  let browser;
  try {
    await waitForServer(BASE, 30_000);
    console.log('  ✓ preview 就绪');
    browser = await chromium.launch({ headless: true });

    const allErrors = [];
    const targets = [];
    for (const phase of ['prologue', 'way', 'reflection']) {
      for (const theme of ['light', 'dark']) {
        targets.push({ phase, theme });
      }
    }
    for (const t of targets) {
      try {
        const errs = await captureOne(browser, t);
        if (errs.length) {
          console.log(`    ⚠ ${t.phase}-${t.theme} 控制台错误：`);
          for (const e of errs) console.log('       ' + e);
          allErrors.push({ ...t, errs });
        }
      } catch (e) {
        exitCode = 1;
        console.error(`  ✗ ${t.phase}-${t.theme}: ${e.message || e}`);
        allErrors.push({ ...t, errs: [String(e.message || e)] });
      }
    }
    if (allErrors.length > 0) {
      console.log('\n── 错误汇总');
      for (const a of allErrors) {
        console.log(`  · ${a.phase}-${a.theme}: ${a.errs.length} 条`);
      }
    }
  } catch (e) {
    exitCode = 1;
    console.error('流程失败：', e.message || e);
  } finally {
    if (browser) await browser.close();
    preview.kill('SIGTERM');
    await sleep(500);
  }

  if (exitCode !== 0) process.exit(exitCode);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
