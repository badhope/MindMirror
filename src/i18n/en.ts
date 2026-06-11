// 镜心 · 英文 UI 字典
// 典雅英译，与中文半文言语调相配

import type { Dict } from './zh';

// 显式声明为 Dict 类型（不依赖 typeof 推导，让字符串可自由翻译）
export const en: Dict = {
  ui: {
    appName: 'Mirror',
    sealChar: '鏡',
    returnHome: 'Home',
    returnHomeConfirm: 'Return to home will clear all answers. Continue?',
    resetConfirm: 'Starting over will clear all answers. Continue?',
    toggleLang: '中',
    phase: {
      prologue: 'Entry',
      path: 'Domain',
      way: 'Inquiry',
      reflection: 'Mirror',
    },
  },
  prologue: {
    title: 'Mirror',
    seal: '鏡',
    enter: 'Enter',
    privacy: 'Your answers stay on your device. Mirror never goes online.',
    verses: [
      [
        { text: 'Mirror', gloss: 'A glass for asking thyself.' },
        {
          text: 'Among three thousand years, who might sit with thee?',
          gloss: 'Answer in form, in spirit, in a parallel resonance of time.',
        },
      ],
      [
        { text: 'Three thousand years live in the glass', gloss: 'Seek not without; thy answer is the reflection.' },
        { text: 'Their shadow is not thou, yet not-not-thou.', gloss: 'Ask: if thou wert he, how wouldst thou live?' },
      ],
      [
        { text: 'Enter', gloss: 'Three minutes, three millennia.' },
        {
          text: 'Borrow the shadows of the ancients to mirror one thought of thine.',
          gloss: 'No right or wrong — only sincerity.',
        },
      ],
    ],
  },
  path: {
    title: 'Choose Domain',
    prompt: 'Whither wouldst thou go?',
    region: { east: 'East', west: 'West' },
    domains: {
      'east-literati': { name: 'Literati', sub: 'Poets, lyricists, essayists, thinkers' },
      'east-statesman': { name: 'Statesmen', sub: 'Chancellors, generals, reformers, loyal hearts' },
      'east-scientist': { name: 'Scientists', sub: 'Astronomy, math, medicine, engineering' },
      'west-philosopher': { name: 'Philosophers', sub: 'Greek, continental, Anglo-American thought' },
      'west-scientist': { name: 'Scientists & Ideas', sub: 'Founders of modern science and thought' },
    },
    start: 'Begin',
    pending: 'Forthcoming',
    picked: 'Once chosen, walk into its questions.',
    peopleCount: (n: number) => `${n} figures`,
  },
  way: {
    question: (n: number, total: number) => `Question ${n} / ${total}`,
    answered: (n: number, total: number) => `Answered ${n} / ${total}`,
    optionsLabel: 'Options',
    prev: 'Back',
    next: 'Next',
    finish: 'Reveal',
    finishTitle: (n: number) => `Answer ${n} more to reveal`,
  },
  reflection: {
    sealLabel: 'THY MIRROR',
    score: (pct: number) => `Affinity ${pct}%`,
    samePath: 'Kindred Spirits',
    twelve: 'Twelve Vectors',
    rowFormat: (user: string, fig: string, comment: string) =>
      `Thou ${user} · Ancient ${fig} ——${comment}`,
    changeDomain: 'Change Domain',
    reset: 'Begin Anew',
    lowConfidence: '(Few answers given — this is but a faint reflection. Answer more for a clearer mirror.)',
    share: 'Share Mirror',
    exportJSON: 'Export JSON',
    importJSON: 'Import JSON',
    copyResume: 'Copy Resume Link',
    anecdote: 'Brief Life',
    shareCopied: 'Copied',
    imported: 'Imported',
    importFail: 'Import failed: invalid file',
  },
  share: {
    title: 'A mirror for asking thyself',
    text: 'I took a mirror — come take one too.',
  },
};
