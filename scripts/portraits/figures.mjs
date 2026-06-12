// scripts/portraits/figures.mjs
// 31 位东方文人墨客的肖像设计数据
// 每位：朝代色板、著名场景意象、签名题词、篆刻内容、人物剪影指令

import {
  mountains, water, moon, branch, bamboo, pavilion, cottage, boat, bridge,
  cloud, bird, plumBranch, orchid, chrysanthemum, chessboard, chessPiece,
  inkstone, scroll, lotus, candle, lantern, inkDot, waterfall, pavilionFree,
} from './common.mjs';

// 每位人物提供 buildScene(ink, palette) -> 场景 SVG 字符串
// 人物剪影由 gen-portraits.mjs 统一渲染（朝代服色），这里只决定姿态

export const FIGURES = [
  // ── 老子 · 西出函谷骑青牛 ───────────────────────────
  {
    id: 'laozi',
    name: '老子',
    era: 'spring',
    seal: '道德经',
    motto: ['紫气东来', '函谷关西'],
    caption: '骑青牛西去',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 80)}
        ${water(p.primary, 440)}
        ${cloud(120, 150, 60, p.ground)}
        ${cloud(360, 130, 50, p.ground)}
        ${bird(180, 110, ink)}
        ${bird(220, 120, ink)}
        <!-- 青牛 -->
        <g transform="translate(200 360)" stroke="${ink}" stroke-width="1.4" fill="${p.secondary}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="36" ry="14"/>
          <ellipse cx="32" cy="-8" rx="14" ry="10"/>
          <line x1="36" y1="-14" x2="42" y2="-22"/>
          <line x1="-30" y1="6" x2="-32" y2="20"/>
          <line x1="-12" y1="12" x2="-14" y2="22"/>
          <line x1="14" y1="12" x2="12" y2="22"/>
          <line x1="28" y1="6" x2="30" y2="22"/>
          <path d="M 32 -18 q 8 -2 14 0" fill="none"/>
        </g>
        <!-- 长袍老者 -->
        <g transform="translate(220 280)" fill="${ink}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="14" ry="18"/>
          <path d="M -22 14 L -28 70 L 28 70 L 22 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.ink}"/>
          <path d="M -10 -22 q 10 -8 20 0" fill="${p.ink}"/>
          <line x1="-8" y1="-16" x2="-6" y2="-12" stroke="${p.ground}" stroke-width="0.8"/>
          <line x1="8" y1="-16" x2="6" y2="-12" stroke="${p.ground}" stroke-width="0.8"/>
        </g>`;
    },
  },

  // ── 庄子 · 梦蝶 ───────────────────────────
  {
    id: 'zhuangzi',
    name: '庄子',
    era: 'warring',
    seal: '南华经',
    motto: ['庄周梦蝶', '物我两忘'],
    caption: '梦为蝴蝶',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 350, 50)}
        <!-- 卧姿者 -->
        <g transform="translate(150 380)" fill="${p.ink}" opacity="0.85">
          <path d="M -30 0 L 30 -4 L 50 6 L 50 18 L -30 18 Z"/>
          <ellipse cx="40" cy="-8" rx="12" ry="10" fill="${p.primary}"/>
          <ellipse cx="42" cy="-12" rx="2" ry="1" fill="${p.ground}"/>
        </g>
        <!-- 大蝶飞舞 -->
        <g transform="translate(310 200)" opacity="0.9">
          <path d="M 0 0 q -16 -22 -32 -8 q 4 -20 18 -16 q 8 -10 14 6 q 6 -16 14 -6 q 14 -4 18 16 q -16 -14 -32 8 Z" fill="${p.seal}" stroke="${ink}" stroke-width="0.6"/>
          <ellipse cx="0" cy="0" rx="2" ry="10" fill="${ink}"/>
        </g>
        <g transform="translate(220 140) scale(0.6)" opacity="0.7">
          <path d="M 0 0 q -16 -22 -32 -8 q 4 -20 18 -16 q 8 -10 14 6 q 6 -16 14 -6 q 14 -4 18 16 q -16 -14 -32 8 Z" fill="${p.accent}" stroke="${ink}" stroke-width="0.6"/>
        </g>
        <g transform="translate(380 280) scale(0.5)" opacity="0.7">
          <path d="M 0 0 q -16 -22 -32 -8 q 4 -20 18 -16 q 8 -10 14 6 q 6 -16 14 -6 q 14 -4 18 16 q -16 -14 -32 8 Z" fill="${p.seal}" stroke="${ink}" stroke-width="0.6"/>
        </g>
        ${grass(180, 460, p.primary)}`;
    },
  },

  // ── 墨子 · 止楚攻宋 ───────────────────────────
  {
    id: 'mozi',
    name: '墨子',
    era: 'warring',
    seal: '墨子行',
    motto: ['兼爱非攻', '步履天下'],
    caption: '止楚攻宋',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 340, 60)}
        ${road(40, 440, 400, p.primary)}
        ${bird(120, 130, ink)}
        ${bird(150, 145, ink)}
        <!-- 步履者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -18 12 L -24 56 L 24 56 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
          <line x1="-14" y1="40" x2="-22" y2="60" stroke="${p.primary}" stroke-width="3"/>
          <line x1="14" y1="40" x2="22" y2="62" stroke="${p.primary}" stroke-width="3"/>
        </g>
        <!-- 简牍 -->
        <g transform="translate(160 360)" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.8" opacity="0.85">
          <rect x="0" y="0" width="50" height="6"/>
          <line x1="2" y1="2" x2="48" y2="2" stroke-width="0.4"/>
          <line x1="2" y1="4" x2="48" y2="4" stroke-width="0.4"/>
        </g>`;
    },
  },

  // ── 韩非子 · 孤愤 ───────────────────────────
  {
    id: 'hanfeizi',
    name: '韩非子',
    era: 'warring',
    seal: '韩非子',
    motto: ['孤愤著书', '法家集大成'],
    caption: '孤愤难鸣',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 350, 40)}
        ${inkstone(240, 440, p.ink)}
        <!-- 案 -->
        <rect x="100" y="380" width="280" height="14" fill="${p.primary}" opacity="0.8"/>
        <rect x="100" y="394" width="280" height="4" fill="${p.ink}" opacity="0.5"/>
        <!-- 竹简成卷 -->
        <g transform="translate(140 360)" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.8" opacity="0.9">
          <rect x="0" y="0" width="80" height="6"/>
          <line x1="2" y1="2" x2="78" y2="2" stroke-width="0.3"/>
          <line x1="2" y1="4" x2="78" y2="4" stroke-width="0.3"/>
          <rect x="0" y="8" width="80" height="6"/>
          <line x1="2" y1="10" x2="78" y2="10" stroke-width="0.3"/>
          <rect x="0" y="16" width="80" height="6"/>
          <line x1="2" y1="18" x2="78" y2="18" stroke-width="0.3"/>
        </g>
        <!-- 坐姿者 -->
        <g transform="translate(290 320)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -16 12 L -22 50 L 22 50 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        <!-- 笔 -->
        <line x1="200" y1="358" x2="218" y2="368" stroke="${p.ink}" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="218" y1="368" x2="226" y2="362" stroke="${p.accent}" stroke-width="1.6" stroke-linecap="round"/>`;
    },
  },

  // ── 李贽 · 童心说 ───────────────────────────
  {
    id: 'lizhi',
    name: '李贽',
    era: 'ming',
    seal: '童心说',
    motto: ['童心即真', '焚书自适'],
    caption: '童心是道',
    buildScene(p, ink) {
      return `
        ${lantern(80, 180, p.seal)}
        ${lantern(400, 180, p.seal)}
        ${cloud(240, 130, 80, p.ground)}
        <!-- 案 -->
        <rect x="80" y="400" width="320" height="14" fill="${p.primary}" opacity="0.8"/>
        <rect x="80" y="414" width="320" height="4" fill="${p.ink}" opacity="0.5"/>
        ${scroll(180, 380, p.ground, p.primary)}
        ${scroll(300, 380, p.ground, p.primary)}
        <!-- 烛 -->
        ${candle(380, 380, p.ink)}
        <!-- 坐姿者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -18 14 L -24 60 L 24 60 L 18 14 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
          <ellipse cx="0" cy="20" rx="6" ry="3" fill="${p.seal}" opacity="0.7"/>
        </g>`;
    },
  },

  // ── 王安石 · 变法 ───────────────────────────
  {
    id: 'wanganshi',
    name: '王安石',
    era: 'song',
    seal: '变法相',
    motto: ['天变不足畏', '祖宗不足法'],
    caption: '熙宁变法',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 340, 50)}
        <!-- 案上卷轴 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.8"/>
        <rect x="60" y="414" width="360" height="4" fill="${p.ink}" opacity="0.5"/>
        <g transform="translate(120 360)" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.8">
          <rect x="0" y="0" width="60" height="6"/>
          <rect x="0" y="8" width="60" height="6"/>
          <rect x="0" y="16" width="60" height="6"/>
          <line x1="2" y1="2" x2="58" y2="2" stroke-width="0.3"/>
          <line x1="2" y1="10" x2="58" y2="10" stroke-width="0.3"/>
          <line x1="2" y1="18" x2="58" y2="18" stroke-width="0.3"/>
        </g>
        ${scroll(300, 380, p.ground, p.primary)}
        ${inkstone(360, 432, p.ink)}
        <!-- 站姿宰相 -->
        <g transform="translate(220 310)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -20 14 L -28 76 L 28 76 L 20 14 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
          <rect x="-3" y="-32" width="6" height="6" fill="${p.seal}"/>
        </g>
        <!-- 笏板 -->
        <rect x="245" y="280" width="6" height="40" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>`;
    },
  },

  // ── 荀子 · 性恶 ───────────────────────────
  {
    id: 'xunzi',
    name: '荀子',
    era: 'warring',
    seal: '性恶论',
    motto: ['性恶本真', '化性起伪'],
    caption: '劝学论性',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 330, 50)}
        <!-- 讲席 -->
        <ellipse cx="240" cy="450" rx="120" ry="14" fill="${p.primary}" opacity="0.7"/>
        <!-- 听众（剪影） -->
        ${Array.from({ length: 5 }, (_, i) => silhouette(160 + i * 50, 410, p.ink, 0.5)).join('')}
        <!-- 师者席 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="14" ry="18"/>
          <path d="M -22 14 L -30 80 L 30 80 L 22 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>
        <!-- 简 -->
        <rect x="100" y="430" width="280" height="6" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>`;
    },
  },

  // ── 屈原 · 汨罗 ───────────────────────────
  {
    id: 'quyuan',
    name: '屈原',
    era: 'warring',
    seal: '离骚经',
    motto: ['路漫漫其修远', '吾将上下求索'],
    caption: '汨罗投江',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 70)}
        ${water(p.primary, 380)}
        ${water(p.primary, 420)}
        <!-- 远岸 -->
        <path d="M 380 360 q 30 -8 60 -4" stroke="${p.ink}" stroke-width="0.8" fill="none" opacity="0.7"/>
        <!-- 投江者 -->
        <g transform="translate(220 360)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
          <line x1="-20" y1="20" x2="-40" y2="40" stroke="${ink}" stroke-width="2"/>
        </g>
        <!-- 粽叶飘零 -->
        <g transform="translate(120 400)" opacity="0.85">
          <path d="M 0 0 q 8 -8 16 -4 q -2 6 -8 6 q 4 4 0 8 q -6 -2 -8 -10 Z" fill="${p.accent}" stroke="${p.primary}" stroke-width="0.6"/>
        </g>
        <g transform="translate(340 410)" opacity="0.85">
          <path d="M 0 0 q 8 -8 16 -4 q -2 6 -8 6 q 4 4 0 8 q -6 -2 -8 -10 Z" fill="${p.accent}" stroke="${p.primary}" stroke-width="0.6"/>
        </g>
        ${moon(p.ground, 400, 110, 18)}`;
    },
  },

  // ── 柳宗元 · 永州独钓 ───────────────────────────
  {
    id: 'liuzongyuan',
    name: '柳宗元',
    era: 'tang',
    seal: '永州八记',
    motto: ['千山鸟飞绝', '独钓寒江雪'],
    caption: '独钓江雪',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 280, 90)}
        ${mountains(p.secondary, 350, 60)}
        ${water(p.primary, 440)}
        ${boat(240, 420, ink)}
        <!-- 钓者 -->
        <g transform="translate(240 400)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="9" ry="12"/>
          <path d="M -14 10 L -18 36 L 18 36 L 14 10 Z"/>
          <ellipse cx="0" cy="-14" rx="8" ry="10" fill="${p.primary}"/>
        </g>
        <!-- 钓竿 -->
        <line x1="240" y1="380" x2="320" y2="350" stroke="${p.primary}" stroke-width="1.2"/>
        <line x1="320" y1="350" x2="340" y2="370" stroke="${p.ink}" stroke-width="0.4"/>
        <!-- 飞雪 -->
        ${Array.from({ length: 14 }, (_, i) => inkDot(40 + i * 32, 140 + (i * 17) % 80)).join('')}
        ${Array.from({ length: 10 }, (_, i) => inkDot(60 + i * 38, 220 + (i * 23) % 60)).join('')}`;
    },
  },

  // ── 王阳明 · 龙场悟道 ───────────────────────────
  {
    id: 'wangyangming',
    name: '王阳明',
    era: 'ming',
    seal: '心即理',
    motto: ['知行合一', '致良知'],
    caption: '龙场悟道',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 70)}
        ${candle(380, 380, ink)}
        <!-- 石案 -->
        <ellipse cx="240" cy="440" rx="100" ry="12" fill="${p.primary}" opacity="0.7"/>
        <ellipse cx="240" cy="440" rx="90" ry="8" fill="${p.ink}" opacity="0.5"/>
        <!-- 蒲团坐者 -->
        <ellipse cx="240" cy="408" rx="40" ry="6" fill="${p.seal}" opacity="0.6"/>
        <g transform="translate(240 350)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -22 14 L -32 56 L 32 56 L 22 14 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 心中有光 -->
        <circle cx="240" cy="320" r="6" fill="${p.seal}" opacity="0.7"/>
        <circle cx="240" cy="320" r="14" fill="none" stroke="${p.seal}" stroke-width="0.5" opacity="0.4"/>
        ${bamboo(80, 440, 100, p.ink)}`;
    },
  },

  // ── 朱熹 · 理学讲席 ───────────────────────────
  {
    id: 'zhuxi',
    name: '朱熹',
    era: 'song',
    seal: '朱子学',
    motto: ['格物致知', '理在气先'],
    caption: '白鹿洞讲',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 280, 60)}
        ${pavilion(240, 360, ink, p.primary)}
        <!-- 讲席 -->
        <rect x="80" y="400" width="320" height="8" fill="${p.primary}" opacity="0.7"/>
        <!-- 师者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -18 14 L -24 50 L 24 50 L 18 14 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 弟子 -->
        ${Array.from({ length: 6 }, (_, i) => silhouette(120 + i * 48, 410, p.ink, 0.55)).join('')}
        ${scroll(160, 396, p.ground, p.primary)}`;
    },
  },

  // ── 王夫之 · 船山书院 ───────────────────────────
  {
    id: 'wangfuzhi',
    name: '王夫之',
    era: 'ming',
    seal: '船山学',
    motto: ['六经责我', '开生面'],
    caption: '船山著述',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 300, 80)}
        ${water(p.primary, 440)}
        ${cottage(150, 420, ink)}
        ${cottage(330, 420, ink)}
        <!-- 案上书卷成山 -->
        <rect x="80" y="380" width="320" height="12" fill="${p.primary}" opacity="0.8"/>
        ${Array.from({ length: 4 }, (_, i) => `<rect x="${110 + i * 50}" y="${350 - i * 6}" width="40" height="30" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.8"/>`).join('')}
        <!-- 坐者 -->
        <g transform="translate(240 320)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── 谭嗣同 · 横刀向天 ───────────────────────────
  {
    id: 'tansitong',
    name: '谭嗣同',
    era: 'qing',
    seal: '仁学志',
    motto: ['我自横刀', '向天笑'],
    caption: '变法流血',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(120, 140, 100, p.ground)}
        ${cloud(320, 150, 80, p.ground)}
        <!-- 站者：顶天立地 -->
        <g transform="translate(240 300)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 90 L 24 90 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 剑横 -->
        <g transform="translate(240 320)">
          <line x1="-50" y1="0" x2="50" y2="0" stroke="${p.ink}" stroke-width="2.6"/>
          <rect x="-4" y="-8" width="8" height="16" fill="${p.seal}"/>
          <circle cx="0" cy="-12" r="3" fill="${p.accent}"/>
        </g>
        <!-- 血梅飘零 -->
        <g>
          ${Array.from({ length: 8 }, (_, i) => `<circle cx="${100 + i * 36}" cy="${200 + (i * 13) % 60}" r="2.5" fill="${p.seal}" opacity="0.7"/>`).join('')}
        </g>`;
    },
  },

  // ── 孔子 · 杏坛讲学 ───────────────────────────
  {
    id: 'kongzi',
    name: '孔子',
    era: 'spring',
    seal: '至圣先师',
    motto: ['有教无类', '学而不厌'],
    caption: '杏坛讲学',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${plumBranch(60, 200, 1, ink)}
        ${plumBranch(420, 200, -1, ink)}
        <!-- 杏坛 -->
        <ellipse cx="240" cy="448" rx="100" ry="12" fill="${p.primary}" opacity="0.7"/>
        <ellipse cx="240" cy="450" rx="120" ry="6" fill="${p.ink}" opacity="0.3"/>
        <!-- 师者席 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="14" ry="18"/>
          <path d="M -22 14 L -30 80 L 30 80 L 22 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
          <path d="M -12 -22 q 12 -8 24 0" fill="${p.ink}"/>
        </g>
        <!-- 弟子围坐 -->
        ${Array.from({ length: 6 }, (_, i) => {
          const angle = -Math.PI / 6 + (i / 5) * (Math.PI / 3);
          const x = 240 + Math.cos(angle) * 110;
          const y = 420 + Math.sin(angle) * 30;
          return silhouette(x, y, p.ink, 0.7);
        }).join('')}
        ${scroll(160, 396, p.ground, p.primary)}`;
    },
  },

  // ── 孟子 · 辩 ───────────────────────────
  {
    id: 'mengzi',
    name: '孟子',
    era: 'warring',
    seal: '亚圣言',
    motto: ['浩然之气', '舍生取义'],
    caption: '性善辩难',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 310, 60)}
        <!-- 辩席 -->
        <rect x="60" y="420" width="360" height="10" fill="${p.primary}" opacity="0.7"/>
        <!-- 左辩者 -->
        <g transform="translate(140 360)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 56 L 24 56 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
          <line x1="20" y1="20" x2="40" y2="6" stroke="${ink}" stroke-width="2"/>
        </g>
        <!-- 右辩者 -->
        <g transform="translate(340 360)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 56 L 24 56 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 中间孟子 -->
        <g transform="translate(240 320)" fill="${ink}" opacity="1">
          <ellipse cx="0" cy="0" rx="14" ry="18"/>
          <path d="M -22 14 L -30 80 L 30 80 L 22 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
          <line x1="-30" y1="0" x2="-46" y2="20" stroke="${ink}" stroke-width="2"/>
        </g>
        <line x1="0" y1="430" x2="480" y2="430" stroke="${p.ink}" stroke-width="0.4" opacity="0.5"/>`;
    },
  },

  // ── 陶渊明 · 采菊东篱 ───────────────────────────
  {
    id: 'taoyuanming',
    name: '陶渊明',
    era: 'easternJin',
    seal: '五柳先生',
    motto: ['采菊东篱', '悠然见南山'],
    caption: '归园田居',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 260, 100)}
        ${mountains(p.secondary, 340, 70)}
        ${cloud(80, 130, 70, p.ground)}
        ${cloud(380, 140, 60, p.ground)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 篱笆 -->
        <g stroke="${p.primary}" stroke-width="1" opacity="0.85">
          <line x1="100" y1="430" x2="180" y2="430"/>
          <line x1="100" y1="420" x2="100" y2="460"/>
          <line x1="130" y1="416" x2="130" y2="464"/>
          <line x1="160" y1="416" x2="160" y2="464"/>
          <line x1="180" y1="430" x2="180" y2="460"/>
        </g>
        <!-- 菊 -->
        ${chrysanthemum(200, 430, 8, p.accent)}
        ${chrysanthemum(220, 442, 6, p.accent)}
        ${chrysanthemum(250, 430, 7, p.accent)}
        ${chrysanthemum(280, 442, 6, p.accent)}
        ${chrysanthemum(310, 432, 8, p.accent)}
        <!-- 提篮者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <ellipse cx="220" cy="420" rx="14" ry="6" fill="${p.secondary}" opacity="0.7"/>`;
    },
  },

  // ── 王维 · 辋川弹琴 ───────────────────────────
  {
    id: 'wangwei',
    name: '王维',
    era: 'tang',
    seal: '诗佛名',
    motto: ['独坐幽篁里', '弹琴复长啸'],
    caption: '辋川琴声',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 240, 90)}
        ${mountains(p.secondary, 330, 50)}
        ${bamboo(80, 440, 140, p.ink)}
        ${bamboo(110, 440, 120, p.ink)}
        ${bamboo(400, 440, 130, p.ink)}
        ${bamboo(370, 440, 100, p.ink)}
        ${moon(p.ground, 380, 120, 20)}
        ${cloud(180, 150, 60, p.ground)}
        <!-- 坐石者 -->
        <ellipse cx="240" cy="430" rx="36" ry="10" fill="${p.primary}" opacity="0.8"/>
        <g transform="translate(240 380)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 琴横膝上 -->
        <g transform="translate(240 420)">
          <rect x="-26" y="-3" width="52" height="6" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.8" rx="2"/>
          <line x1="-22" y1="0" x2="22" y2="0" stroke="${p.ink}" stroke-width="0.3"/>
          <line x1="-22" y1="-1" x2="22" y2="-1" stroke="${p.ink}" stroke-width="0.3"/>
          <line x1="-22" y1="1" x2="22" y2="1" stroke="${p.ink}" stroke-width="0.3"/>
          <circle cx="-22" cy="0" r="1.4" fill="${p.seal}"/>
          <circle cx="22" cy="0" r="1.4" fill="${p.seal}"/>
        </g>`;
    },
  },

  // ── 韩愈 · 师说 ───────────────────────────
  {
    id: 'hanyu',
    name: '韩愈',
    era: 'tang',
    seal: '昌黎伯',
    motto: ['师者所以传道', '文以载道'],
    caption: '师道尊严',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 300, 60)}
        ${cloud(120, 140, 70, p.ground)}
        <!-- 案上书卷 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.8"/>
        ${scroll(120, 390, p.ground, p.primary)}
        ${scroll(240, 390, p.ground, p.primary)}
        ${scroll(360, 390, p.ground, p.primary)}
        ${inkstone(380, 432, p.ink)}
        <!-- 执笔者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 64 L 26 64 L 20 14 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 笔 -->
        <line x1="190" y1="360" x2="220" y2="370" stroke="${p.ink}" stroke-width="1.6"/>
        <line x1="220" y1="370" x2="232" y2="362" stroke="${p.accent}" stroke-width="2"/>`;
    },
  },

  // ── 欧阳修 · 醉翁 ───────────────────────────
  {
    id: 'ouyangxiu',
    name: '欧阳修',
    era: 'song',
    seal: '醉翁意',
    motto: ['醉翁之意', '不在酒'],
    caption: '醉翁山水',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 250, 90)}
        ${mountains(p.secondary, 330, 60)}
        ${waterfall(180, 280, 90, p.secondary)}
        ${water(p.primary, 440)}
        ${cloud(320, 130, 60, p.ground)}
        ${bridge(240, 440, 80, ink)}
        ${pavilionFree(380, 400, ink, p.primary)}
        <!-- 持杯者 -->
        <g transform="translate(160 380)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 50 L 22 50 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        <ellipse cx="180" cy="380" rx="6" ry="3" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>
        <line x1="178" y1="378" x2="178" y2="372" stroke="${p.ink}" stroke-width="0.6"/>
        <!-- 酒坛 -->
        <ellipse cx="320" cy="430" rx="14" ry="6" fill="${p.seal}"/>
        <ellipse cx="320" cy="424" rx="10" ry="4" fill="${p.seal}"/>`;
    },
  },

  // ── 司马迁 · 史记 ───────────────────────────
  {
    id: 'simaqian',
    name: '司马迁',
    era: 'westernHan',
    seal: '太史公',
    motto: ['究天人之际', '通古今之变'],
    caption: '史迁著书',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 300, 60)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.8"/>
        <rect x="60" y="414" width="360" height="4" fill="${p.ink}" opacity="0.5"/>
        <!-- 简册成山 -->
        ${Array.from({ length: 5 }, (_, i) => `<g transform="translate(${100 + i * 56} 380)">
          <rect x="0" y="0" width="48" height="6" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>
          <rect x="0" y="8" width="48" height="6" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>
          <line x1="2" y1="2" x2="46" y2="2" stroke="${p.primary}" stroke-width="0.3"/>
          <line x1="2" y1="10" x2="46" y2="10" stroke="${p.primary}" stroke-width="0.3"/>
        </g>`).join('')}
        <!-- 坐者 -->
        <g transform="translate(240 310)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 64 L 26 64 L 20 14 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 笔 -->
        <line x1="210" y1="350" x2="232" y2="362" stroke="${p.ink}" stroke-width="1.6"/>
        <line x1="232" y1="362" x2="244" y2="354" stroke="${p.accent}" stroke-width="2"/>`;
    },
  },

  // ── 杜甫 · 茅屋为秋风所破 ───────────────────────────
  {
    id: 'dufu',
    name: '杜甫',
    era: 'tang',
    seal: '诗圣名',
    motto: ['安得广厦', '千万间'],
    caption: '茅屋为秋风破',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(120, 150, 80, p.ground)}
        ${cloud(320, 160, 60, p.ground)}
        <!-- 茅屋破漏 -->
        ${cottage(240, 400, ink)}
        <!-- 飞舞茅草 -->
        <g>
          ${Array.from({ length: 6 }, (_, i) => `<path d="M ${80 + i * 50} ${280 + (i * 7) % 30} l 12 -3 l -6 6 l -10 -2" fill="${p.secondary}" stroke="${p.ink}" stroke-width="0.5" opacity="0.7"/>`).join('')}
        </g>
        <!-- 茅屋中人 -->
        <g transform="translate(240 350)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 50 L 22 50 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        <!-- 秋风扫叶 -->
        <g opacity="0.6">
          ${Array.from({ length: 5 }, (_, i) => `<path d="M ${60 + i * 80} ${400 + (i * 13) % 40} q 4 -3 8 0" stroke="${p.primary}" stroke-width="0.6" fill="none"/>`).join('')}
        </g>`;
    },
  },

  // ── 白居易 · 琵琶行 ───────────────────────────
  {
    id: 'baijuyi',
    name: '白居易',
    era: 'tang',
    seal: '乐天诗',
    motto: ['同是天涯', '沦落人'],
    caption: '浔阳江头',
    buildScene(p, ink) {
      return `
        ${water(p.primary, 360)}
        ${water(p.primary, 420)}
        ${boat(160, 360, ink)}
        ${boat(360, 380, ink)}
        ${moon(p.ground, 380, 110, 22)}
        ${cloud(140, 160, 60, p.ground)}
        <!-- 船上听琴者 -->
        <g transform="translate(160 340)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 50 L 22 50 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        <!-- 对船弹琴者 -->
        <g transform="translate(360 360)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 50 L 22 50 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        <!-- 琵琶 -->
        <g transform="translate(370 380) rotate(-25)">
          <ellipse cx="0" cy="0" rx="8" ry="6" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.8"/>
          <line x1="-2" y1="-4" x2="14" y2="-2" stroke="${p.ink}" stroke-width="1.2"/>
          <line x1="-2" y1="0" x2="14" y2="2" stroke="${p.ink}" stroke-width="0.4"/>
        </g>`;
    },
  },

  // ── 苏轼 · 赤壁 ───────────────────────────
  {
    id: 'sushi',
    name: '苏轼',
    era: 'song',
    seal: '东坡居',
    motto: ['大江东去', '浪淘尽'],
    caption: '赤壁怀古',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 240, 90)}
        ${mountains(p.secondary, 320, 60)}
        ${water(p.primary, 420)}
        ${water(p.primary, 460)}
        ${moon(p.ground, 400, 100, 24)}
        ${cloud(160, 150, 70, p.ground)}
        ${boat(240, 400, ink)}
        <!-- 船上三人：苏子 + 二客 -->
        <g transform="translate(220 380)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -20 38 L 20 38 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        <g transform="translate(254 384)" fill="${ink}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="8" ry="11"/>
          <path d="M -12 9 L -16 30 L 16 30 L 12 9 Z"/>
        </g>
        <g transform="translate(282 384)" fill="${ink}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="8" ry="11"/>
          <path d="M -12 9 L -16 30 L 16 30 L 12 9 Z"/>
        </g>
        <!-- 杯 -->
        <ellipse cx="220" cy="378" rx="4" ry="2" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.5"/>
        <line x1="216" y1="376" x2="216" y2="372" stroke="${p.ink}" stroke-width="0.5"/>`;
    },
  },

  // ── 陆游 · 沈园 ───────────────────────────
  {
    id: 'luyou',
    name: '陆游',
    era: 'song',
    seal: '放翁心',
    motto: ['山重水复', '又一村'],
    caption: '沈园春色',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 280, 70)}
        ${water(p.primary, 440)}
        ${plumBranch(80, 280, 1, ink)}
        ${plumBranch(420, 280, -1, ink)}
        ${bridge(240, 440, 70, ink)}
        ${pavilionFree(380, 400, ink, p.primary)}
        <!-- 拄杖者 -->
        <g transform="translate(180 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 60 L 22 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <line x1="200" y1="380" x2="200" y2="430" stroke="${p.primary}" stroke-width="2"/>
        <circle cx="200" cy="380" r="3" fill="${p.primary}"/>`;
    },
  },

  // ── 张岱 · 湖心亭看雪 ───────────────────────────
  {
    id: 'zhangdai',
    name: '张岱',
    era: 'ming',
    seal: '陶庵梦',
    motto: ['雾凇沆砀', '天与云'],
    caption: '湖心亭看雪',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${water(p.primary, 440)}
        ${pavilion(240, 400, ink, p.primary)}
        <!-- 飞雪 -->
        ${Array.from({ length: 28 }, (_, i) => inkDot(30 + (i * 17) % 440, 100 + (i * 13) % 200)).join('')}
        ${Array.from({ length: 18 }, (_, i) => inkDot(40 + (i * 23) % 420, 240 + (i * 11) % 100)).join('')}
        <!-- 亭中二人对坐 -->
        <g transform="translate(220 380)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="9" ry="12"/>
          <path d="M -14 9 L -18 30 L 18 30 L 14 9 Z"/>
        </g>
        <g transform="translate(260 380)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="9" ry="12"/>
          <path d="M -14 9 L -18 30 L 18 30 L 14 9 Z"/>
        </g>
        <!-- 炉 -->
        <ellipse cx="240" cy="392" rx="6" ry="2" fill="${p.seal}"/>
        <ellipse cx="240" cy="389" rx="3" ry="2" fill="${p.accent}" opacity="0.85"/>`;
    },
  },

  // ── 曾国藩 · 家书 ───────────────────────────
  {
    id: 'zengguofan',
    name: '曾国藩',
    era: 'qing',
    seal: '文正公',
    motto: ['养得胸中', '大阵法'],
    caption: '家书抵万金',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 300, 60)}
        ${candle(80, 380, ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.8"/>
        <rect x="60" y="414" width="360" height="4" fill="${p.ink}" opacity="0.5"/>
        ${scroll(120, 380, p.ground, p.primary)}
        ${scroll(220, 380, p.ground, p.primary)}
        ${scroll(320, 380, p.ground, p.primary)}
        ${inkstone(380, 432, p.ink)}
        <!-- 坐者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 64 L 26 64 L 20 14 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 执笔 -->
        <line x1="190" y1="358" x2="220" y2="370" stroke="${p.ink}" stroke-width="1.6"/>
        <line x1="220" y1="370" x2="232" y2="362" stroke="${p.accent}" stroke-width="2"/>`;
    },
  },

  // ── 李渔 · 闲情偶寄 ───────────────────────────
  {
    id: 'liyu',
    name: '李渔',
    era: 'qing',
    seal: '闲情寄',
    motto: ['随时即景', '就事论事'],
    caption: '闲情偶寄',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 290, 60)}
        ${chrysanthemum(100, 420, 9, p.accent)}
        ${chrysanthemum(120, 440, 7, p.accent)}
        ${chrysanthemum(380, 420, 9, p.accent)}
        ${chrysanthemum(400, 440, 7, p.accent)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 案 -->
        <rect x="140" y="400" width="200" height="12" fill="${p.primary}" opacity="0.8"/>
        ${chessboard(240, 388, 40, 20, ink)}
        ${chessPiece(248, 392, 2, true)}
        ${chessPiece(258, 392, 2, false)}
        ${chessPiece(232, 396, 2, true)}
        ${chessPiece(252, 396, 2, false)}
        <!-- 坐者 -->
        <g transform="translate(220 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── 袁枚 · 随园 ───────────────────────────
  {
    id: 'yuanmei',
    name: '袁枚',
    era: 'qing',
    seal: '随园主',
    motto: ['性灵说', '自成一家'],
    caption: '随园诗话',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 260, 70)}
        ${mountains(p.secondary, 340, 50)}
        ${bamboo(60, 440, 130, p.ink)}
        ${bamboo(100, 440, 110, p.ink)}
        ${bamboo(400, 440, 130, p.ink)}
        ${bamboo(370, 440, 110, p.ink)}
        ${lantern(80, 200, p.seal)}
        ${lantern(400, 200, p.seal)}
        <!-- 案上梅花 -->
        <rect x="140" y="400" width="200" height="12" fill="${p.primary}" opacity="0.8"/>
        <g transform="translate(240 380)">
          <line x1="0" y1="0" x2="0" y2="20" stroke="${p.ink}" stroke-width="1.4"/>
          <circle cx="-3" cy="-2" r="3" fill="${p.seal}"/>
          <circle cx="3" cy="2" r="3" fill="${p.seal}"/>
          <circle cx="-2" cy="6" r="3" fill="${p.seal}"/>
          <circle cx="4" cy="12" r="3" fill="${p.seal}"/>
        </g>
        <!-- 坐者 -->
        <g transform="translate(220 330)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── 纳兰性德 · 词 ───────────────────────────
  {
    id: 'nalanxingde',
    name: '纳兰性德',
    era: 'qing',
    seal: '饮水词',
    motto: ['人生若只', '如初见'],
    caption: '饮水词人',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${water(p.primary, 440)}
        ${moon(p.ground, 380, 110, 22)}
        ${cloud(140, 150, 70, p.ground)}
        ${plumBranch(60, 280, 1, ink)}
        <!-- 独立者 -->
        <g transform="translate(240 350)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -18 12 L -22 70 L 22 70 L 18 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        <!-- 词笺飘空 -->
        <g transform="translate(120 200)">
          <rect x="0" y="0" width="40" height="6" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>
          <line x1="2" y1="2" x2="38" y2="2" stroke="${p.primary}" stroke-width="0.3"/>
          <line x1="2" y1="4" x2="38" y2="4" stroke="${p.primary}" stroke-width="0.3"/>
        </g>
        <g transform="translate(340 220)">
          <rect x="0" y="0" width="40" height="6" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>
        </g>`;
    },
  },

  // ── 李清照 · 寻觅（数据文件 id 为 liushao）───────────────────────────
  {
    id: 'liushao',
    name: '李清照',
    era: 'song',
    seal: '易安词',
    motto: ['寻寻觅觅', '冷冷清清'],
    caption: '窗下寻觅',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 70, p.ground)}
        <!-- 窗棂 -->
        <g stroke="${ink}" stroke-width="1.4" fill="${p.ground}" opacity="0.6">
          <rect x="80" y="180" width="320" height="240" fill="${p.ground}" opacity="0.4"/>
          <line x1="80" y1="300" x2="400" y2="300"/>
          <line x1="240" y1="180" x2="240" y2="420"/>
        </g>
        <!-- 窗外梅 -->
        ${plumBranch(60, 240, 1, ink)}
        <!-- 窗内帘 -->
        <g opacity="0.7">
          <path d="M 100 200 q 10 30 -5 60" stroke="${p.seal}" stroke-width="3" fill="none"/>
          <path d="M 130 200 q 10 30 -5 60" stroke="${p.seal}" stroke-width="3" fill="none"/>
        </g>
        <!-- 窗内倚者 -->
        <g transform="translate(280 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -18 12 L -22 60 L 22 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        ${chrysanthemum(140, 420, 7, p.accent)}
        ${chrysanthemum(160, 432, 6, p.accent)}`;
    },
  },

  // ── 龚自珍 · 己亥 ───────────────────────────
  {
    id: 'gongzizhen',
    name: '龚自珍',
    era: 'qing',
    seal: '定庵诗',
    motto: ['落红不是', '无情物'],
    caption: '己亥杂诗',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 280, 70)}
        ${cloud(140, 140, 80, p.ground)}
        ${bamboo(80, 440, 130, p.ink)}
        ${bamboo(420, 440, 110, p.ink)}
        <!-- 落红 -->
        <g>
          ${Array.from({ length: 14 }, (_, i) => {
            const x = 60 + (i * 31) % 380;
            const y = 200 + (i * 17) % 200;
            return `<ellipse cx="${x}" cy="${y}" rx="3" ry="2" fill="${p.seal}" opacity="0.75" transform="rotate(${i * 23 % 90} ${x} ${y})"/>`;
          }).join('')}
        </g>
        <!-- 立马者 -->
        <g transform="translate(180 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -18 12 L -22 60 L 22 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        <!-- 马 -->
        <g transform="translate(280 380)" stroke="${ink}" stroke-width="1.4" fill="${p.secondary}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="32" ry="12"/>
          <ellipse cx="28" cy="-6" rx="12" ry="9"/>
          <line x1="-22" y1="6" x2="-24" y2="20"/>
          <line x1="-6" y1="10" x2="-8" y2="22"/>
          <line x1="14" y1="10" x2="12" y2="22"/>
          <line x1="24" y1="6" x2="26" y2="22"/>
          <path d="M 30 -16 q 6 -2 10 0"/>
        </g>
        <line x1="220" y1="370" x2="220" y2="420" stroke="${p.primary}" stroke-width="1.2"/>`;
    },
  },
];

// 辅助：剪影
function silhouette(x, y, ink, scale = 0.7) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${ink}" opacity="0.7">
    <ellipse cx="0" cy="0" rx="9" ry="11"/>
    <path d="M -14 9 L -18 36 L 18 36 L 14 9 Z"/>
  </g>`;
}

// 辅助：路
function road(x, y, w, color) {
  return `<path d="M ${x} ${y} L ${x + 20} ${y + 14} L ${x + w - 20} ${y + 14} L ${x + w} ${y}" stroke="${color}" stroke-width="6" fill="none" opacity="0.55"/>`;
}

// 辅助：草
function grass(x, y, color) {
  return `<g stroke="${color}" stroke-width="0.8" fill="none">
    <line x1="${x - 6}" y1="${y}" x2="${x - 8}" y2="${y - 8}"/>
    <line x1="${x - 2}" y1="${y}" x2="${x - 4}" y2="${y - 6}"/>
    <line x1="${x + 2}" y1="${y}" x2="${x}" y2="${y - 7}"/>
    <line x1="${x + 6}" y1="${y}" x2="${x + 4}" y2="${y - 6}"/>
    <line x1="${x + 10}" y1="${y}" x2="${x + 8}" y2="${y - 8}"/>
  </g>`;
}
