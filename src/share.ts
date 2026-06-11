// 镜心 · 报告 / 答 序列化
// 仅含 answers + domain + currentIndex + locale + theme，不含任何指纹字段

import type { DomainId } from './domain/figures/figure.types';

export type ExportShape = {
  v: 1;
  ts: number;
  domain: DomainId | null;
  currentIndex: number;
  answers: Record<string, number>;
  locale: 'zh' | 'en';
  theme: 'light' | 'dark';
};

export function exportState(s: Omit<ExportShape, 'v' | 'ts'>): ExportShape {
  return {
    v: 1,
    ts: Date.now(),
    domain: s.domain,
    currentIndex: s.currentIndex,
    answers: s.answers,
    locale: s.locale,
    theme: s.theme,
  };
}

// base64url 编码
const toB64 = (s: string) =>
  // 中文走 UTF-8
  btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const fromB64 = (s: string) => {
  const norm = s.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (s.length % 4)) % 4);
  return decodeURIComponent(escape(atob(norm)));
};

export function encodeResume(s: ExportShape): string {
  return toB64(JSON.stringify(s));
}

export function decodeResume(s: string): ExportShape | null {
  try {
    const obj = JSON.parse(fromB64(s));
    if (obj?.v !== 1) return null;
    return obj as ExportShape;
  } catch {
    return null;
  }
}

export function downloadJSON(s: ExportShape, filename = 'mindmirror.json') {
  const blob = new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readJSONFile(file: File): Promise<ExportShape | null> {
  const text = await file.text();
  try {
    const obj = JSON.parse(text);
    if (obj?.v !== 1) return null;
    return obj as ExportShape;
  } catch {
    return null;
  }
}
