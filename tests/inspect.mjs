// 纯 Node 测试 - 不依赖 playwright
// 启动一个 puppeteer-like 的 headless chrome 来测试
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// 直接读取 dist/index.html 检查所有引用资源
const html = readFileSync('dist/index.html', 'utf8');
console.log('--- index.html 资源引用 ---');
const refs = html.match(/(?:src|href)="([^"]+)"/g) || [];
refs.forEach(r => console.log('  ', r));

// 检查 SW 缓存策略
const sw = readFileSync('dist/sw.js', 'utf8');
console.log('\n--- sw.js 缓存策略 ---');
const caches = sw.match(/CACHE\s*=\s*['"]([^'"]+)['"]/g) || [];
caches.forEach(c => console.log('  ', c));

// 检查 main.tsx 入口
const main = readFileSync('src/main.tsx', 'utf8');
console.log('\n--- main.tsx ---');
console.log(main);
