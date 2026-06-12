// 镜心 · C22 多尺寸截图
//
// 视口 × phase 矩阵（3 × 3 = 9 张）
// 视口：320×568 (iPhone SE) / 768×1024 (iPad) / 1440×900 (Desktop)
// phase：prologue / way / reflection
// 输出：.trae/render/multi/{viewport-name}--{phase}.png
// 报告：.trae/render/multi/report.md
//
// 跑法：node tests/multi-shot.mjs

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const PORT = 4173;
const BASE = process.env.E2E_BASE || `http://127.0.0.1:${PORT}/`;
const OUT_DIR = resolve('.trae/render/multi');
mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: 'mobile-320x568', width: 320, height: 568, dpr: 2 },
  { name: 'tablet-768x1024', width: 768, height: 1024, dpr: 1 },
  { name: 'desktop-1440x900', width: 1440, height: 900, dpr: 1 },
];
const PHASES = ['prologue', 'way', 'reflection'];

// 关键选择器（按 phase）
const KEY_SELECTORS = {
  prologue: ['[data-testid="btn-enter"]', 'h1#prologue-title', '.jx-seal-large'],
  way: ['[data-testid="way-prompt"]', '[data-role="option"]', '[data-testid="way-nav"]'],
  reflection: ['[data-figure="primary"]', '[data-testid="trait-radar"]', '[data-figure="alternate"]'],
};

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

/** 通过 localStorage 注入 30+ 题答案，跳到 reflection */
async function seedAnswersToReflection(page) {
  await page.evaluate(() => {
    const k = 'mindmirror-v1';
    const ans = {};
    for (let i = 1; i <= 30; i++) {
      ans[`el-${String(i).padStart(3, '0')}`] = (i * 3) % 6;
    }
    const s = {
      state: {
        phase: 'way',
        domain: 'east-literati',
        currentIndex: 47,
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
  await page.waitForSelector('[data-testid="btn-finish"]:not([disabled])', { timeout: 8_000 });
  await page.locator('[data-testid="btn-finish"]').click();
  await page.waitForSelector('[data-figure="primary"]', { timeout: 8_000 });
  await page.waitForFunction(
    () => document.querySelectorAll('[data-figure="alternate"]').length >= 4,
    { timeout: 8_000 }
  );
  await page.waitForTimeout(800);
}

async function setPhase(page, phase) {
  if (phase === 'prologue') {
    // 显式 reset 到 prologue
    await page.evaluate(() => {
      const k = 'mindmirror-v1';
      localStorage.setItem(
        k,
        JSON.stringify({
          state: {
            phase: 'prologue',
            domain: null,
            currentIndex: 0,
            answers: {},
            locale: 'zh',
            theme: 'light',
            report: null,
          },
          version: 0,
        })
      );
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="btn-enter"]', { timeout: 8_000 });
    await page.waitForTimeout(900);
    return;
  }
  if (phase === 'way') {
    // 入镜 → 选域 → 开始
    await page.locator('[data-testid="btn-enter"]').click();
    await page.waitForSelector('[data-domain="east-literati"]', { timeout: 5_000 });
    await page.locator('[data-domain="east-literati"]').click();
    await page.waitForSelector('[data-testid="btn-start"]', { timeout: 5_000 });
    await page.locator('[data-testid="btn-start"]').click();
    await page.waitForSelector('[data-testid="way-prompt"]', { timeout: 8_000 });
    await page.waitForTimeout(800);
    return;
  }
  if (phase === 'reflection') {
    await seedAnswersToReflection(page);
    return;
  }
  throw new Error(`未知 phase: ${phase}`);
}

/** 检查 overflow 与选择器可见性 */
async function inspect(page, phase) {
  const result = await page.evaluate(sel => {
    const docEl = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    const vw = docEl.clientWidth;
    const overflow = {
      docScrollW: docEl.scrollWidth,
      bodyScrollW: body.scrollWidth,
      rootScrollW: root ? root.scrollWidth : 0,
      vw,
    };
    const selectors = {};
    for (const s of sel) {
      const el = document.querySelector(s);
      if (!el) {
        selectors[s] = { exists: false };
        continue;
      }
      const r = el.getBoundingClientRect();
      const visible = r.width > 0 && r.height > 0;
      const inViewport = r.left >= 0 && r.right <= vw + 1;
      const overflowing = r.right > vw + 1 || r.left < -1;
      selectors[s] = {
        exists: true,
        visible,
        inViewport,
        x: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        height: Math.round(r.height),
        overflowing,
      };
    }
    return { overflow, selectors };
  }, KEY_SELECTORS[phase]);
  return result;
}

async function shootOne(browser, vp, phase) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    locale: 'zh-CN',
  });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push(`pageerror: ${e.message}`));
  page.on('console', m => {
    if (m.type() === 'error') consoleErrors.push(`console.error: ${m.text()}`);
  });
  page.on('dialog', d => d.accept());

  let out = null;
  try {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await setPhase(page, phase);

    const fname = `${vp.name}--${phase}.png`;
    out = join(OUT_DIR, fname);
    await page.screenshot({ path: out, fullPage: true });

    const report = await inspect(page, phase);
    // 水平 overflow 计数
    const overflowCount =
      report.overflow.docScrollW > report.overflow.vw
        ? report.overflow.docScrollW - report.overflow.vw
        : 0;
    // 选择器状态
    const selectorSummary = {};
    for (const [s, v] of Object.entries(report.selectors)) {
      selectorSummary[s] = v;
    }
    return {
      ok: true,
      file: out,
      size: statSync(out).size,
      overflowCount,
      docScrollW: report.overflow.docScrollW,
      vw: report.overflow.vw,
      selectorSummary,
      consoleErrors,
    };
  } catch (e) {
    return {
      ok: false,
      file: out,
      err: String(e.message || e),
      consoleErrors,
    };
  } finally {
    await page.close();
    await ctx.close();
  }
}

function buildMarkdown(rows) {
  let md = '# C22 · 多尺寸截图报告\n\n';
  md += `生成时间：${new Date().toISOString()}\n\n`;
  md += `视口：${VIEWPORTS.map(v => `${v.name} (${v.width}×${v.height})`).join('、')}\n\n`;
  md += `phase：${PHASES.join('、')}\n\n`;

  md += '## 总览矩阵\n\n';
  md += '| 视口 | phase | 文件 | 大小 (KB) | overflow (px) | 状态 |\n';
  md += '| --- | --- | --- | ---: | ---: | --- |\n';
  for (const r of rows) {
    const fname = r.file ? r.file.split('/').pop() : '(失败)';
    const sizeKb = r.size ? (r.size / 1024).toFixed(1) : '—';
    const overflow = r.overflowCount != null ? String(r.overflowCount) : '—';
    const status = r.ok ? '✅' : '❌';
    md += `| ${r.viewport} | ${r.phase} | ${fname} | ${sizeKb} | ${overflow} | ${status} |\n`;
  }
  md += '\n';

  md += '## 关键选择器可见性\n\n';
  for (const r of rows) {
    if (!r.ok || !r.selectorSummary) continue;
    md += `### ${r.viewport} · ${r.phase}\n\n`;
    md += '| 选择器 | 存在 | 可见 | 在视口 | 是否溢出 | x/right/width×height |\n';
    md += '| --- | :-: | :-: | :-: | :-: | --- |\n';
    for (const [s, v] of Object.entries(r.selectorSummary)) {
      if (!v.exists) {
        md += `| \`${s}\` | ✗ | — | — | — | — |\n`;
        continue;
      }
      md += `| \`${s}\` | ✓ | ${v.visible ? '✓' : '✗'} | ${v.inViewport ? '✓' : '✗'} | ${v.overflowing ? '⚠ 溢出' : 'ok'} | ${v.x}/${v.right}/${v.width}×${v.height} |\n`;
    }
    md += '\n';
  }

  md += '## 失败项详情\n\n';
  const failed = rows.filter(r => !r.ok || (r.consoleErrors && r.consoleErrors.length > 0));
  if (failed.length === 0) {
    md += '_无失败项。_\n';
  } else {
    for (const r of failed) {
      md += `### ${r.viewport} · ${r.phase}\n\n`;
      if (r.err) md += `- 错误：${r.err}\n`;
      if (r.consoleErrors && r.consoleErrors.length > 0) {
        md += '- 控制台错误：\n';
        for (const e of r.consoleErrors) md += `  - ${e}\n`;
      }
      md += '\n';
    }
  }

  return md;
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
  const rows = [];
  let browser;
  try {
    await waitForServer(BASE, 30_000);
    console.log('  ✓ preview 就绪');
    browser = await chromium.launch({ headless: true });

    for (const vp of VIEWPORTS) {
      for (const phase of PHASES) {
        const r = await shootOne(browser, vp, phase);
        rows.push({ viewport: vp.name, phase, ...r });
        if (r.ok) {
          const sizeKb = (r.size / 1024).toFixed(1);
          console.log(`  ✓ ${vp.name} · ${phase}  (${sizeKb} KB, overflow=${r.overflowCount}px)`);
          if (r.consoleErrors && r.consoleErrors.length > 0) {
            for (const e of r.consoleErrors) console.log('     · ' + e);
          }
        } else {
          exitCode = 1;
          console.error(`  ✗ ${vp.name} · ${phase}: ${r.err}`);
          if (r.consoleErrors && r.consoleErrors.length > 0) {
            for (const e of r.consoleErrors) console.error('     · ' + e);
          }
        }
      }
    }

    const md = buildMarkdown(rows);
    const mdPath = join(OUT_DIR, 'report.md');
    writeFileSync(mdPath, md, 'utf8');
    console.log(`\n✓ 报告：${mdPath}`);
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
