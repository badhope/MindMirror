// scripts/render-portraits.mjs
// 用 Playwright 渲染肖像 SVG 为 PNG，方便视觉验证
import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../public/portraits/east-literati');
const OUT = resolve(__dirname, '../.trae/render');

const SAMPLE = [
  'laozi', 'kongzi', 'taoyuanming', 'sushi', 'quyuan', 'liushao',
  'tansitong', 'wangwei', 'zhangdai', 'ouyangxiu', 'gongzizhen', 'lizhi',
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 480, height: 640 } });

for (const id of SAMPLE) {
  const svg = await readFile(resolve(SRC, `${id}.svg`), 'utf8');
  const html = `<!doctype html><html><head><style>body{margin:0;padding:0;background:#f4e6c4;}svg{display:block;}</style></head><body>${svg}</body></html>`;
  await page.setContent(html, { waitUntil: 'load' });
  const img = await page.locator('svg').first();
  await img.screenshot({ path: resolve(OUT, `${id}.png`) });
  console.log(`  ✓ ${id}.png`);
}

await browser.close();
console.log(`\n完成：${SAMPLE.length} 张样本已渲染到 ${OUT}`);
