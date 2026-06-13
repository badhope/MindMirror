// 终极测试：用 JSDOM 渲染 React 并验证 phase 切换
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'http://127.0.0.1:4173/MindMirror/',
  runScripts: 'dangerously',
  resources: 'usable',
});

console.log('JSDOM init');
console.log('document.body:', dom.window.document.body.innerHTML.slice(0, 200));
