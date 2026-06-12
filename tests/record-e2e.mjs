// 镜心 · E2E 录制脚本
//
// 流程：启动 preview → 录屏 + 关键节点截图
// 跑法：node tests/record-e2e.mjs
// 输出：
//   .trae/render/full-flow.webm     —— 完整流程录屏
//   .trae/render/prologue.png
//   .trae/render/path.png
//   .trae/render/way-3.png         (答到第 3 题时)
//   .trae/render/way-30.png        (答到第 30 题 / 出镜时)
//   .trae/render/reflection.png

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, statSync, copyFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const PORT = 4173;
const BASE = process.env.E2E_BASE || `http://127.0.0.1:${PORT}/`;
const OUT_DIR = resolve('.trae/render');
const VIDEO_DIR = resolve('.trae/render/_video');
mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(VIDEO_DIR, { recursive: true });

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

async function main() {
  // 1. 启动 preview
  console.log('▶ 启动 vite preview @', PORT);
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  });
  let previewLog = '';
  preview.stdout.on('data', d => {
    previewLog += d.toString();
  });
  preview.stderr.on('data', d => {
    previewLog += d.toString();
  });

  // 等到响应
  try {
    await waitForServer(BASE, 30_000);
    console.log('  ✓ preview 就绪');
  } catch (e) {
    preview.kill('SIGTERM');
    throw e;
  }

  let exitCode = 0;
  const browser = await chromium.launch({ headless: true });
  try {
    // 2. 录屏 context
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: VIDEO_DIR, size: { width: 1440, height: 900 } },
      locale: 'zh-CN',
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('pageerror', e => consoleErrors.push(`pageerror: ${e.message}`));
    page.on('console', m => {
      if (m.type() === 'error') consoleErrors.push(`console.error: ${m.text()}`);
    });
    page.on('dialog', d => d.accept());

    // 3. prologue 截图
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="btn-enter"]', { timeout: 10_000 });
    await page.waitForTimeout(900); // 等淡入
    await page.screenshot({ path: join(OUT_DIR, 'prologue.png'), fullPage: true });
    console.log('  ✓ prologue.png');

    // 4. 入镜 → path
    await page.locator('[data-testid="btn-enter"]').click();
    await page.waitForSelector('[data-domain="east-literati"]', { timeout: 8_000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: join(OUT_DIR, 'path.png'), fullPage: true });
    console.log('  ✓ path.png');

    // 5. 选域 + 开始
    await page.locator('[data-domain="east-literati"]').click();
    await page.waitForSelector('[data-testid="btn-start"]', { timeout: 5_000 });
    await page.locator('[data-testid="btn-start"]').click();
    await page.waitForSelector('[data-testid="way-prompt"]', { timeout: 8_000 });
    await page.waitForTimeout(800);

    // 6. 答 48 题（轮询点同位置）
    const TOTAL = 48;
    // 0-based index of "after answering Nth question"  (i = N-1)
    const SNAPSHOT_AT = { 2: 'way-3.png', 29: 'way-30.png' };
    for (let i = 0; i < TOTAL; i++) {
      const opts = page.locator('[data-role="option"]');
      const cnt = await opts.count();
      if (cnt === 0) throw new Error(`第 ${i + 1} 题未找到选项`);
      await opts.nth(i % cnt).click();
      // 截图节点（取刚答完该题的画面，下一题之前）
      if (SNAPSHOT_AT[i]) {
        await page.waitForTimeout(400);
        const name = SNAPSHOT_AT[i];
        await page.screenshot({ path: join(OUT_DIR, name), fullPage: true });
        console.log(`  ✓ ${name}`);
      }
      const next = page.locator('[data-testid="btn-next"]');
      const finish = page.locator('[data-testid="btn-finish"]');
      if ((await next.count()) > 0) {
        await next.click();
      } else if ((await finish.count()) > 0) {
        await finish.click();
        break;
      }
      await page.waitForTimeout(80);
    }
    // 若 loop 未达 48 题则补点出镜
    const finishLast = page.locator('[data-testid="btn-finish"]');
    if ((await finishLast.count()) > 0) {
      try {
        await finishLast.click({ timeout: 2000 });
      } catch {
        /* 已被点掉 */
      }
    }

    // 7. reflection
    await page.waitForSelector('[data-figure="primary"]', { timeout: 8_000 });
    await page.waitForFunction(
      () => document.querySelectorAll('[data-figure="alternate"]').length >= 4,
      { timeout: 8_000 }
    );
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(OUT_DIR, 'reflection.png'), fullPage: true });
    console.log('  ✓ reflection.png');

    await page.close();
    await context.close();

    if (consoleErrors.length > 0) {
      console.log('\n── 控制台错误');
      for (const e of consoleErrors) console.log('  · ' + e);
    }
  } catch (e) {
    exitCode = 1;
    console.error('录制失败：', e.message || e);
  } finally {
    await browser.close();
    preview.kill('SIGTERM');
    // 给 vite 一点时间退出
    await sleep(500);
  }

  // 8. 找最新 webm → full-flow.webm
  const fs = await import('node:fs/promises');
  const files = await fs.readdir(VIDEO_DIR);
  const webm = files
    .filter(f => f.endsWith('.webm'))
    .map(f => ({ f, m: statSync(join(VIDEO_DIR, f)).mtimeMs }))
    .sort((a, b) => b.m - a.m);
  if (webm.length === 0) {
    console.error('未找到录屏文件');
    process.exit(exitCode || 1);
  }
  const src = join(VIDEO_DIR, webm[0].f);
  const dst = join(OUT_DIR, 'full-flow.webm');
  copyFileSync(src, dst);
  console.log(`\n✓ 录屏已保存：${dst}`);

  if (exitCode !== 0) process.exit(exitCode);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
