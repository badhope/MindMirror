// 镜心 · 站内 .md 链接自检
// 跑法：node tests/link-check.mjs
// 扫描所有 .md 文件里的相对 .md 引用（包括 ./xxx.md / ../xxx.md / [text](path.md) / [text](path.md#anchor)），
// 验证被引用的 .md 在仓库内存在。锚点暂不校验（不要求每个标题都精确匹配）。

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// 忽略目录
const IGNORE_DIRS = new Set([
  'node_modules',
  'dist',
  'dist-ssr',
  '.git',
  '.vite',
  '.cache',
  '.parcel-cache',
  'coverage',
  '.trae', // 设计/视觉资料目录，链接频繁且非文档
]);

// 匹配 (text](path.md) 或 (path.md)（path 不以 http: / https: / mailto: / # 开头）
const MD_LINK_RE = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (IGNORE_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      yield* walk(full);
    } else if (st.isFile() && name.endsWith('.md')) {
      yield full;
    }
  }
}

function isExternal(href) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

function isAnchorOnly(href) {
  return href.startsWith('#');
}

function normalizePath(fromFile, href) {
  // 去掉 query / hash 中的 path 部分，hash 留给锚点校验
  const hashIdx = href.indexOf('#');
  const pathPart = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
  if (!pathPart) return null;
  const abs = resolve(dirname(fromFile), pathPart);
  return abs;
}

const findings = [];

for (const file of walk(ROOT)) {
  const rel = file.slice(ROOT.length + 1);
  const text = readFileSync(file, 'utf8');
  let match;
  // 每次 match 必须从开头重新创建正则
  const re = new RegExp(MD_LINK_RE.source, 'g');
  while ((match = re.exec(text)) !== null) {
    const href = match[1].trim();
    if (isExternal(href) || isAnchorOnly(href)) continue;
    if (!href.endsWith('.md') && !href.includes('.md#')) continue;
    const target = normalizePath(file, href);
    if (!target) continue;
    if (!existsSync(target)) {
      findings.push({
        from: rel,
        href,
        target: target.slice(ROOT.length + 1),
        line: text.slice(0, match.index).split('\n').length,
      });
    }
  }
}

console.log(`镜心 · 站内 .md 链接自检 · ${ROOT}\n`);
if (findings.length === 0) {
  console.log('  ✓ 所有站内 .md 引用均可解析');
  process.exit(0);
}

console.log(`  ✗ 发现 ${findings.length} 处断链\n`);
for (const f of findings) {
  console.log(`  · ${f.from}:${f.line}`);
  console.log(`    → [${f.href}]`);
  console.log(`    目标不存在: ${f.target}`);
}
process.exit(1);
