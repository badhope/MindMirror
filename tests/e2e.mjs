// 镜心 · E2E 全流程模拟
// 跑法：npx playwright test tests/e2e.mjs
// 覆盖：启动页 → 入镜 → 选域 → 答 48 题 → 出镜 → 映照 → 复位

import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.E2E_BASE || 'http://127.0.0.1:4173/MindMirror/';
const SHOTS = 'tests/e2e-shots';
mkdirSync(SHOTS, { recursive: true });

const REPORT = [];
const FAIL = [];

function step(name, fn) {
  return async (page, ctx) => {
    process.stdout.write(`  ${name} … `);
    try {
      await fn(page, ctx);
      console.log('OK');
      REPORT.push({ name, ok: true });
    } catch (e) {
      console.log('FAIL');
      console.log('    ' + (e.message || e));
      FAIL.push({ name, err: String(e.message || e) });
      REPORT.push({ name, ok: false, err: String(e.message || e) });
    }
  };
}

const SCENES = {
  prologue: '入镜',
  path: '选域',
  way: '答题',
  reflection: '映照',
};

async function run(browserName, viewport, locale) {
  console.log(`\n── ${browserName} · ${viewport.width}x${viewport.height} · ${locale}`);
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport,
    locale: locale === 'zh' ? 'zh-CN' : 'en-US',
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  page.on('pageerror', e => FAIL.push({ name: `${viewport.width} pageerror`, err: e.message }));
  page.on('console', m => {
    if (m.type() === 'error') FAIL.push({ name: `${viewport.width} console.error`, err: m.text() });
  });
  // 自动接受 confirm 对话框（reset 等场景）
  page.on('dialog', dialog => dialog.accept());

  // 0. 启动
  await step('00 启动', async () => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    // 等启动页淡出（fade-in 完成 ~1.5s）
    await page.waitForSelector('button:has-text("入镜")', { timeout: 5000 });
    // 关键：标题
    const title = await page.title();
    if (!title || title.length < 4) throw new Error('title 无内容');
  })(page);

  await page.waitForTimeout(900); // 等淡入完成（700ms 动效 + 余量）
  await page.screenshot({ path: join(SHOTS, `${viewport.width}-00-boot.png`), fullPage: true });

  // 1. 入镜按钮
  await step('01 入镜：点入镜按钮', async () => {
    // 等待 React 挂载
    await page.waitForSelector('button', { timeout: 8000 });
    // 找含"入镜"或"开始"或"照"或"启"的按钮
    const btn = page.getByRole('button', { name: /入镜|开始|启程|照己|照一照/i }).first();
    await btn.waitFor({ timeout: 5000 });
    await btn.click();
    // 等页面进入 path
    await page.waitForTimeout(400);
  })(page);

  await page.screenshot({ path: join(SHOTS, `${viewport.width}-01-path.png`), fullPage: true });

  // 2. 选域：点第一张 ready 域
  await step('02 选域：点东方文人墨客', async () => {
    const card = page.locator('[data-domain="east-literati"]').first();
    await card.waitFor({ timeout: 5000 });
    await card.click();
    // 点开始
    const start = page.getByRole('button', { name: /开始/ }).first();
    await start.waitFor({ timeout: 5000 });
    await start.click();
    // 等 Way 页完全淡入
    await page.waitForSelector('[data-testid="way-prompt"]', { timeout: 5000 });
    await page.waitForTimeout(900);
  })(page);

  await page.screenshot({ path: join(SHOTS, `${viewport.width}-02-way-start.png`), fullPage: true });

  // 3. 答 48 题：每题轮询点同一位置（option index = currentIndex % 6）模拟"无偏好"
  await step('03 答题：循环 48 题', async () => {
    for (let i = 0; i < 48; i++) {
      // 找当前题目的 6 个选项按钮
      const opts = page.locator('[data-role="option"]');
      const cnt = await opts.count();
      if (cnt === 0) {
        throw new Error(`第 ${i + 1} 题未找到任何选项`);
      }
      await opts.nth(i % cnt).click();
      // 找"下一题"按钮
      const next = page.locator('[data-testid="btn-next"]').first();
      if (await next.count()) {
        await next.click();
      } else {
        // 最后一题，找"出镜"
        const finish = page.locator('[data-testid="btn-finish"]').first();
        await finish.click();
      }
      await page.waitForTimeout(60);
    }
    // 48 题答完，再点出镜
    const finish = page.locator('[data-testid="btn-finish"]').first();
    if (await finish.count()) {
      await finish.click();
    }
    await page.waitForTimeout(500);
  })(page);

  // 4. 出镜：自动进入映照
  await step('04 出镜：进入映照页', async () => {
    await page.waitForSelector('[data-figure="primary"]', { timeout: 5000 });
    // 等所有同道卡完成布局
    await page.waitForFunction(
      () => document.querySelectorAll('[data-figure="alternate"]').length >= 4,
      { timeout: 5000 }
    );
    await page.waitForTimeout(500); // 等动画
  })(page);

  await page.screenshot({ path: join(SHOTS, `${viewport.width}-04-reflection.png`), fullPage: true });

  // 5. 验证映照
  await step('05 映照：主镜 + 同道 + 12 维', async () => {
    // 雷达图存在
    const radar = page.locator('[data-testid="trait-radar"]');
    const radarCount = await radar.count();
    if (radarCount === 0) throw new Error('雷达图未找到');
    // 雷达图有 12 个文字节点（trait 名称）
    const labels = await radar.locator('text').count();
    if (labels < 12) throw new Error(`雷达图 trait 标签数不足: ${labels}`);
    // 同道至少 4 张
    const alts = await page.locator('[data-figure="alternate"]').count();
    if (alts < 4) throw new Error(`同道卡数不足: ${alts} (期望 ≥4)`);
  })(page);

  // 6. 复位
  await step('06 复位：再来一次', async () => {
    const reset = page.getByRole('button', { name: /再来|重测|复位|重新|从头/i }).first();
    if (await reset.count()) {
      await reset.click();
      await page.waitForTimeout(500);
      // 应回到入镜页
      const rujing = await page.getByRole('button', { name: /入镜/ }).count();
      if (rujing === 0) throw new Error('复位后未回到入镜页');
    } else {
      throw new Error('未找到复位按钮');
    }
  })(page);

  await page.screenshot({ path: join(SHOTS, `${viewport.width}-06-reset.png`), fullPage: true });

  // 7. 中途刷新应保留作答
  await step('07 刷新保留', async () => {
    // 再走一遍到第 5 题
    await page.locator('button:has-text("入镜")').click();
    await page.waitForTimeout(300);
    await page.locator('[data-domain="east-literati"]').click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("开始")').click();
    await page.waitForTimeout(300);
    // 答 5 题
    for (let i = 0; i < 5; i++) {
      await page.locator('[data-role="option"]').nth(i % 6).click();
      const ne = await page.locator('[data-testid="btn-next"]').count();
      if (ne) await page.locator('[data-testid="btn-next"]').click();
      await page.waitForTimeout(20);
    }
    // 刷新
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    // 应当在 way 页
    const prompt = await page.locator('[data-testid="way-prompt"]').count();
    if (prompt === 0) throw new Error('刷新后丢失了 way 页');
    // 已答进度应保留
    const progressAfter = await page.locator('[data-testid="way-progress-text"]').textContent();
    if (!progressAfter.includes('已答 5')) {
      throw new Error(`刷新后进度丢失已答 5: ${progressAfter}`);
    }
    // 上一问应可见且可点击（前 5 题都已答，可向前翻看）
    const prevCount = await page.locator('[data-testid="btn-prev"]:not([disabled])').count();
    if (prevCount === 0) throw new Error('刷新后"上一问"按钮仍禁用');
  })(page);

  // 8. 刷新在映照页
  await step('08 刷新保留映照', async () => {
    // 把 48 题全答完
    for (let i = 5; i < 48; i++) {
      const optExists = await page.locator('[data-role="option"]').count();
      if (optExists === 0) break;
      await page.locator('[data-role="option"]').nth(i % 6).click();
      const ne = await page.locator('[data-testid="btn-next"]').count();
      const fe = await page.locator('[data-testid="btn-finish"]').count();
      if (ne) await page.locator('[data-testid="btn-next"]').click();
      else if (fe) { await page.locator('[data-testid="btn-finish"]').click(); break; }
      await page.waitForTimeout(20);
    }
    await page.waitForSelector('[data-figure="primary"]', { timeout: 5000 });
    const primaryBefore = await page.locator('[data-figure="primary"]').textContent();
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const primaryAfter = await page.locator('[data-figure="primary"]').count();
    if (primaryAfter === 0) throw new Error('刷新后未恢复映照页');
    const primaryName = await page.locator('[data-figure="primary"]').textContent();
    if (primaryName !== primaryBefore) {
      throw new Error(`刷新后主镜人物变了: before=${primaryBefore} after=${primaryName}`);
    }
  })(page);

  // 9. 移动端窄屏：雷达图不溢出
  if (viewport.width <= 375) {
    await step('09 窄屏雷达图不溢出', async () => {
      // 已在映照页
      const radar = page.locator('[data-testid="trait-radar"]').first();
      const box = await radar.boundingBox();
      if (!box) throw new Error('雷达图未找到');
      if (box.x < 0) throw new Error(`雷达图左侧溢出: x=${box.x}`);
      if (box.x + box.width > viewport.width) {
        throw new Error(`雷达图右侧溢出: x+width=${box.x + box.width} > ${viewport.width}`);
      }
    })(page);
  }

  // 10. 30 题阈值：少于 30 题不能出镜
  await step('10 30 题阈值', async () => {
    // 通过 storage 注入：仅答 5 题
    await page.evaluate(() => {
      const k = 'mindmirror-v1';
      const raw = localStorage.getItem(k);
      if (!raw) return;
      const s = JSON.parse(raw);
      s.state = s.state || {};
      const items = Object.keys(s.state.answers || {}).slice(0, 5);
      const ans = {};
      items.forEach((id, i) => (ans[id] = i % 6));
      s.state.phase = 'way';
      s.state.domain = 'east-literati';
      s.state.currentIndex = 47; // 跳到最后一题
      s.state.answers = ans;
      s.state.report = null;
      localStorage.setItem(k, JSON.stringify(s));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    // 在最后一题
    const finish = page.locator('[data-testid="btn-finish"]').first();
    if (await finish.count() === 0) throw new Error('应可见出镜按钮');
    // 但仅答 5 题，所以应禁用
    const isDisabled = await finish.evaluate(b => b.disabled);
    if (!isDisabled) throw new Error('仅 5 题时出镜按钮应禁用');
    // 验证 tooltip 提示再答几道
    const title = await finish.getAttribute('title');
    if (!title || !title.includes('再答')) {
      throw new Error(`出镜按钮应有 tooltip 提示剩余题数: ${title}`);
    }
  })(page);

  // 11. 语言切换：EN/中
  await step('11 语言切换', async () => {
    const toggle = page.getByRole('button', { name: /^EN$|^中$/ }).first();
    if (await toggle.count() > 0) {
      const phaseBefore = await page.locator('[data-testid="topbar-phase"]').textContent();
      await toggle.click();
      await page.waitForTimeout(100);
      const phaseAfter = await page.locator('[data-testid="topbar-phase"]').textContent();
      if (phaseBefore === phaseAfter) {
        throw new Error('点击 EN/中 后 phase 指示器未变');
      }
    } else {
      throw new Error('未找到 EN/中 切换');
    }
  })(page);

  await browser.close();
}

(async () => {
  console.log(`镜心 · E2E · ${BASE}`);
  await run('desktop', { width: 1280, height: 800 }, 'zh');
  await run('tablet', { width: 768, height: 1024 }, 'zh');
  await run('mobile', { width: 375, height: 812 }, 'zh');
  await run('mobile-narrow', { width: 320, height: 568 }, 'zh');

  console.log('\n── 总览');
  let ok = 0, fail = 0;
  for (const r of REPORT) {
    if (r.ok) ok++; else fail++;
  }
  console.log(`OK ${ok} / FAIL ${fail}`);
  if (fail > 0) {
    console.log('\n── 失败详情');
    for (const f of FAIL) console.log(`  · ${f.name}: ${f.err}`);
    process.exit(1);
  }
})();
