// 严格测试：点击入镜按钮后的实际行为
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4173/MindMirror/';

const browser = await chromium.launch();
const page = await browser.newPage();

const errors = [];
const consoleErrors = [];
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
page.on('console', m => {
  if (m.type() === 'error') consoleErrors.push(`console.error: ${m.text()}`);
});
page.on('response', r => {
  if (r.status() >= 400) console.log(`HTTP ${r.status()}: ${r.url()}`);
});

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

console.log('--- 启动页 ---');
const title = await page.title();
console.log('title:', title);
const h1 = await page.locator('h1').first().textContent().catch(() => 'NO H1');
console.log('h1:', h1);

const enterBtn = page.getByRole('button', { name: /入镜|开始|启程|照己|照一照/i }).first();
const enterBtnCount = await enterBtn.count();
console.log('入镜按钮数量:', enterBtnCount);

if (enterBtnCount === 0) {
  console.log('所有按钮:');
  const allBtns = await page.locator('button').allTextContents();
  allBtns.forEach(b => console.log('  -', b));
}

console.log('\n--- 点击入镜 ---');
await enterBtn.click();
await page.waitForTimeout(500);

console.log('--- 点击后页面状态 ---');
const url = page.url();
console.log('url:', url);
const mainHTML = await page.locator('main').innerHTML();
console.log('main HTML 长度:', mainHTML.length);
console.log('main HTML 前 500 字符:', mainHTML.slice(0, 500));
const mainOpacity = await page.locator('main').evaluate(el => getComputedStyle(el).opacity);
console.log('main opacity:', mainOpacity);
const mainDisplay = await page.locator('main').evaluate(el => getComputedStyle(el).display);
console.log('main display:', mainDisplay);

const h1After = await page.locator('h1').first().textContent().catch(() => 'NO H1');
console.log('h1 after:', h1After);

console.log('\n--- 错误信息 ---');
console.log('pageerror:', errors);
console.log('console.error:', consoleErrors);

await page.screenshot({ path: 'tests/debug-click.png', fullPage: true });
console.log('截图保存到 tests/debug-click.png');

await browser.close();
