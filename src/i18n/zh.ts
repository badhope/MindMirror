// 镜心 · 中文 UI 字典
// 静态字典，覆盖 TopBar / Prologue / Path / Way / Reflection 五处
// 题目文言 / 人物小传 / 解读骨不在此处（属于内容文案，未来可在 figure/items 数据中加 i18n 字段）

export const zh = {
  ui: {
    appName: '镜心',
    sealChar: '镜',
    returnHome: '返首页',
    returnHomeConfirm: '返首页将清空所答，确定？',
    resetConfirm: '再来一次将清空所答，确定？',
    toggleLang: 'EN',
    phase: {
      prologue: '入镜',
      path: '选域',
      way: '行问',
      reflection: '映照',
    },
  },
  prologue: {
    title: '镜心',
    seal: '镜',
    enter: '入镜',
    privacy: '所答仅存汝之本地，镜心不联网。',
    verses: [
      [
        { text: '镜心', gloss: '一面问己之镜。' },
        {
          text: '你若在千古之中，能与何人对坐？',
          gloss: '答以形，答以神，答以一段并行于时间里的同频共振。',
        },
      ],
      [
        { text: '镜中自有千古', gloss: '不必外求，汝答即是照。' },
        { text: '他人之影非汝，亦非非汝。', gloss: '问汝若他，他会如何处世？' },
      ],
      [
        { text: '入镜', gloss: '三分钟，三千年。' },
        {
          text: '借古人三千年的影子，映汝一念之端。',
          gloss: '所答无对错，唯以诚为要。',
        },
      ],
    ],
  },
  path: {
    title: '选域',
    prompt: '汝欲入何方？',
    region: { east: '东方', west: '西方' },
    domains: {
      'east-literati': { name: '文人墨客', sub: '诗人、词人、散文家、思想家' },
      'east-statesman': { name: '治国能臣', sub: '宰相、将相、变法、孤忠' },
      'east-scientist': { name: '科技先贤', sub: '天文、算学、医药、工学' },
      'west-philosopher': { name: '文哲巨擘', sub: '希腊、欧陆、英美思想家' },
      'west-scientist': { name: '科学与思想', sub: '近代科学奠基人与思想者' },
    },
    start: '开始',
    pending: '待补',
    picked: '既已择定，便入其问。',
    peopleCount: (n: number) => `${n} 人`,
  },
  way: {
    question: (n: number, total: number) => `第 ${n} 问 / 共 ${total}`,
    answered: (n: number, total: number) => `已答 ${n} / ${total}`,
    optionsLabel: '选项',
    prev: '上一问',
    next: '下一问',
    finish: '出镜',
    finishTitle: (n: number) => `再答 ${n} 题即可出镜`,
  },
  reflection: {
    sealLabel: '镜 中 之 人',
    score: (pct: number) => `同道 ${pct}%`,
    samePath: '同道',
    twelve: '十二维',
    rowFormat: (user: string, fig: string, comment: string) =>
      `汝 ${user} · 古人 ${fig} ——${comment}`,
    changeDomain: '换一个域',
    reset: '再来一次',
    lowConfidence: '（汝所答尚少，此映照为略影；若欲更明，再答若干题即可。）',
    share: '分享镜照',
    exportJSON: '导出 JSON',
    importJSON: '导入 JSON',
    copyResume: '复制续答链接',
    anecdote: '其人小传',
    shareCopied: '已复制',
    imported: '已导入',
    importFail: '导入失败：非有效文件',
  },
  share: {
    title: '一面问己之镜',
    text: '我照了一镜，汝亦来照一照。',
  },
};

export type Dict = typeof zh;
