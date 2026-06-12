// scripts/gen-portraits.mjs
// 编排：调用 common.mjs + 多域 figures，为各域人物生成 480×640 精致 SVG 肖像
// 输出: public/portraits/<domain>/<id>.svg

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FIGURES } from './portraits/figures.mjs';
import { FIGURES_EAST_STATEMAN } from './portraits/figures.east-statesman.mjs';
import { FIGURES_EAST_SCIENTIST } from './portraits/figures.east-scientist.mjs';
import { FIGURES_WEST_PHILOSOPHER } from './portraits/figures.west-philosopher.mjs';
import { FIGURES_WEST_SCIENTIST } from './portraits/figures.west-scientist.mjs';
import { PALETTES, paper, frame, header, footer, wrap } from './portraits/common.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../public/portraits');

const DOMAINS = [
  { id: 'east-literati', figures: FIGURES },
  { id: 'east-statesman', figures: FIGURES_EAST_STATEMAN },
  { id: 'east-scientist', figures: FIGURES_EAST_SCIENTIST },
  { id: 'west-philosopher', figures: FIGURES_WEST_PHILOSOPHER },
  { id: 'west-scientist', figures: FIGURES_WEST_SCIENTIST },
];

async function buildOne(fig) {
  const palette = PALETTES[fig.era];
  if (!palette) {
    throw new Error(`Unknown era palette: ${fig.era} for ${fig.id}`);
  }
  const seed = Math.abs(fig.id.length * 7 + fig.name.length * 11) % 997 + 3;
  const scene = fig.buildScene(palette, palette.ink);
  const body = `
${paper(palette.ground, palette.ink, seed)}
${frame(palette.primary, palette.ink)}
${header(palette, palette.label, fig.motto)}
<!-- 场景区 -->
<g>${scene}</g>
${footer(palette, fig.name, fig.seal)}
<!-- 副标：人物小注 -->
<g transform="translate(46 600)">
  <text font-family="STKaiti, KaiTi, serif" font-size="10" fill="${palette.primary}" letter-spacing="2" opacity="0.7">${fig.caption} · 镜心选镜</text>
</g>`;
  return wrap(body, palette, seed);
}

async function main() {
  let total = 0;
  for (const { id: domain, figures } of DOMAINS) {
    const outDir = resolve(ROOT, domain);
    await mkdir(outDir, { recursive: true });
    for (const fig of figures) {
      const svg = await buildOne(fig);
      const out = resolve(outDir, `${fig.id}.svg`);
      await writeFile(out, svg, 'utf8');
      total++;
      console.log(`  ✓ [${domain}] ${fig.id.padEnd(16)} ${fig.name}  →  ${fig.seal}`);
    }
  }
  console.log(`\n完成：${total} 张精致肖像已写入 ${ROOT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
