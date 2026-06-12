// scripts/portraits/figures.east-scientist.mjs
// 30 位科技先贤的肖像设计数据
// 复用 common.mjs 的元素和调色板

import {
  mountains, water, moon, branch, bamboo, pavilion, cottage, boat, bridge,
  cloud, bird, plumBranch, orchid, chrysanthemum, chessboard, chessPiece,
  inkstone, scroll, lotus, candle, lantern, inkDot, waterfall, pavilionFree,
} from './common.mjs';

export const FIGURES_EAST_SCIENTIST = [
  // ── A 极端外：发现 / 发明 / 革新 ──
  {
    id: 'cailun', name: '蔡伦', era: 'westernHan', seal: '蔡侯纸',
    motto: ['蔡侯造纸', '衣被天下'], caption: '蔡侯造纸',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${water(p.primary, 440)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 浸泡池 -->
        <g stroke="${ink}" stroke-width="1.4" fill="${p.secondary}" opacity="0.7">
          <rect x="160" y="380" width="160" height="40"/>
          <line x1="160" y1="380" x2="320" y2="380" stroke="${p.ink}"/>
        </g>
        <!-- 树皮纤维 -->
        <g stroke="${ink}" stroke-width="0.8" fill="none" opacity="0.6">
          ${Array.from({ length: 10 }, (_, i) => `<path d="M ${180 + i * 14} 380 q 4 -6 8 0" />`).join('')}
        </g>
        <!-- 立者 -->
        <g transform="translate(180 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 56 L 24 56 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        ${scroll(300, 360, p.ground, p.primary)}`;
    },
  },
  {
    id: 'zhangheng', name: '张衡', era: 'westernHan', seal: '候风仪',
    motto: ['浑天仪象', '候风地动'], caption: '候风地动',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 300, 60)}
        ${moon(p.ground, 380, 110, 18)}
        <!-- 浑天仪 -->
        <g transform="translate(240 320)" stroke="${ink}" stroke-width="1.4" fill="none">
          <circle cx="0" cy="0" r="60" fill="${p.secondary}" opacity="0.4"/>
          <circle cx="0" cy="0" r="50"/>
          <ellipse cx="0" cy="0" rx="60" ry="20" stroke="${p.ink}"/>
          <ellipse cx="0" cy="0" rx="50" ry="40"/>
          <line x1="0" y1="-60" x2="0" y2="60" stroke-width="0.6"/>
          <line x1="-60" y1="0" x2="60" y2="0" stroke-width="0.6"/>
          <circle cx="0" cy="0" r="3" fill="${p.seal}"/>
        </g>
        <!-- 地动仪 -->
        <g transform="translate(140 400)" stroke="${ink}" stroke-width="1.2" fill="${p.primary}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="40" ry="14"/>
          <rect x="-40" y="0" width="80" height="20"/>
          <ellipse cx="0" cy="20" rx="40" ry="14"/>
          ${Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const dx = Math.cos(a) * 40;
            const dy = Math.sin(a) * 14;
            return `<circle cx="${dx}" cy="${dy - 2}" r="3" fill="${p.ground}"/><path d="M ${dx} ${dy - 6} L ${dx - 4} ${dy - 14}" stroke-width="0.6"/>`;
          }).join('')}
        </g>
        <!-- 立者 -->
        <g transform="translate(360 350)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'zu', name: '祖冲之', era: 'tang', seal: '圆周率',
    motto: ['三五四一五', '九二六五四'], caption: '圆率七位',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${candle(80, 380, ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        ${scroll(120, 380, p.ground, p.primary)}
        ${scroll(220, 380, p.ground, p.primary)}
        ${scroll(320, 380, p.ground, p.primary)}
        <!-- 算筹 -->
        <g transform="translate(380 360)" stroke="${ink}" stroke-width="0.6">
          ${Array.from({ length: 12 }, (_, i) => `<line x1="${-6 + (i % 6) * 2}" y1="${-6 + Math.floor(i / 6) * 12}" x2="${6 + (i % 6) * 2}" y2="${-6 + Math.floor(i / 6) * 12}"/>`).join('')}
        </g>
        <!-- 圆 -->
        <circle cx="240" cy="280" r="36" fill="none" stroke="${p.ink}" stroke-width="1.2"/>
        <circle cx="240" cy="280" r="20" fill="none" stroke="${p.ink}" stroke-width="0.8" stroke-dasharray="3 3"/>
        <!-- 坐者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'bi', name: '毕昇', era: 'song', seal: '泥活字',
    motto: ['不以木活字', '胶泥为之'], caption: '泥活字术',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${candle(80, 380, ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 活字板 -->
        <g transform="translate(240 360)" fill="${p.ground}" stroke="${ink}" stroke-width="0.6">
          ${Array.from({ length: 5 }, (_, row) => Array.from({ length: 8 }, (_, col) =>
            `<rect x="${-40 + col * 10}" y="${-15 + row * 10}" width="9" height="9" />`).join('')).join('')}
        </g>
        <!-- 字模堆 -->
        <g transform="translate(380 380)" fill="${p.secondary}" stroke="${ink}" stroke-width="0.6">
          ${Array.from({ length: 6 }, (_, i) => `<rect x="-6" y="${-15 + i * 5}" width="12" height="4"/>`).join('')}
        </g>
        <!-- 坐者 -->
        <g transform="translate(180 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'song', name: '宋应星', era: 'ming', seal: '天工开',
    motto: ['天覆地载', '物穷其理'], caption: '天工开物',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 70, p.ground)}
        <!-- 工厂群 -->
        <g stroke="${ink}" stroke-width="1.2" fill="${p.primary}" opacity="0.85">
          <rect x="80" y="340" width="60" height="80"/>
          <path d="M 80 340 L 110 320 L 140 340 Z" fill="${p.seal}" opacity="0.7"/>
          <rect x="180" y="360" width="60" height="60"/>
          <rect x="280" y="340" width="60" height="80"/>
        </g>
        <!-- 烟囱 -->
        <line x1="120" y1="320" x2="120" y2="280" stroke="${p.ink}" stroke-width="2"/>
        <line x1="220" y1="360" x2="220" y2="300" stroke="${p.ink}" stroke-width="2"/>
        <ellipse cx="220" cy="295" rx="14" ry="6" fill="${p.ground}" opacity="0.7"/>
        <!-- 立者 -->
        <g transform="translate(360 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'xu', name: '徐光启', era: 'ming', seal: '几何原',
    motto: ['欲求超胜', '必须会通'], caption: '农政全书',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${candle(360, 380, ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        ${scroll(120, 380, p.ground, p.primary)}
        ${scroll(220, 380, p.ground, p.primary)}
        ${scroll(320, 380, p.ground, p.primary)}
        <!-- 几何图 -->
        <g transform="translate(360 360)" stroke="${p.ink}" stroke-width="1" fill="none">
          <circle cx="0" cy="0" r="12"/>
          <rect x="-12" y="-12" width="24" height="24"/>
          <line x1="-12" y1="0" x2="12" y2="0"/>
          <line x1="0" y1="-12" x2="0" y2="12"/>
        </g>
        <!-- 农具 -->
        <g transform="translate(100 380)" fill="${p.secondary}" stroke="${p.ink}" stroke-width="0.6">
          <path d="M 0 0 L 0 16 L 8 16 Z"/>
        </g>
        <!-- 坐者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── B 偏外 ──
  {
    id: 'shen', name: '沈括', era: 'song', seal: '梦溪笔',
    motto: ['以不知为不知', '格物致知'], caption: '梦溪笔谈',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 300, 70)}
        ${water(p.primary, 440)}
        ${bamboo(60, 440, 120, p.ink)}
        ${bamboo(420, 440, 110, p.ink)}
        ${cloud(140, 150, 70, p.ground)}
        ${cottage(240, 420, ink)}
        ${candle(280, 380, ink)}
        <!-- 案上笔谈 -->
        <rect x="180" y="396" width="120" height="6" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>
        <!-- 坐者 -->
        <g transform="translate(220 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'guo', name: '郭守敬', era: 'yuan', seal: '授时历',
    motto: ['测验为本', '简仪高表'], caption: '简仪观天',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 280, 60)}
        ${moon(p.ground, 100, 110, 18)}
        ${cloud(360, 150, 70, p.ground)}
        <!-- 简仪 -->
        <g transform="translate(240 360)" stroke="${ink}" stroke-width="1.4" fill="none">
          <rect x="-40" y="20" width="80" height="6" fill="${p.primary}" opacity="0.85"/>
          <line x1="0" y1="-20" x2="0" y2="20"/>
          <ellipse cx="0" cy="-10" rx="30" ry="20"/>
          <line x1="-30" y1="-10" x2="30" y2="-10"/>
          <line x1="0" y1="-30" x2="0" y2="10"/>
        </g>
        <!-- 立者 -->
        <g transform="translate(360 350)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'huang', name: '黄道婆', era: 'yuan', seal: '衣被天',
    motto: ['搅车去籽', '纺车织机'], caption: '衣被天下',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 织机 -->
        <g transform="translate(240 380)" stroke="${ink}" stroke-width="1.4" fill="none">
          <rect x="-50" y="0" width="100" height="40" fill="${p.primary}" opacity="0.5"/>
          <line x1="-50" y1="0" x2="50" y2="0"/>
          <line x1="-50" y1="-30" x2="50" y2="-30"/>
          ${Array.from({ length: 8 }, (_, i) => `<line x1="${-50 + i * 14}" y1="0" x2="${-50 + i * 14}" y2="-30"/>`).join('')}
          <line x1="0" y1="0" x2="0" y2="-50" stroke-width="2"/>
        </g>
        <!-- 坐者 -->
        <g transform="translate(220 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 56 L 24 56 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'li', name: '李时珍', era: 'ming', seal: '本草纲',
    motto: ['医者贵格物', '以身试药'], caption: '本草纲目',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        ${plumBranch(80, 240, 1, ink)}
        <!-- 案 -->
        <rect x="140" y="400" width="200" height="12" fill="${p.primary}" opacity="0.85"/>
        <!-- 药草标本 -->
        <g transform="translate(180 360)" fill="${p.accent}" stroke="${p.ink}" stroke-width="0.6">
          <ellipse cx="0" cy="0" rx="6" ry="3"/>
          <line x1="0" y1="0" x2="0" y2="14"/>
          <ellipse cx="-3" cy="6" rx="3" ry="2"/>
          <ellipse cx="3" cy="10" rx="3" ry="2"/>
        </g>
        <g transform="translate(220 360)" fill="${p.seal}" stroke="${p.ink}" stroke-width="0.6">
          <ellipse cx="0" cy="0" rx="6" ry="3"/>
          <line x1="0" y1="0" x2="0" y2="14"/>
        </g>
        <g transform="translate(260 360)" fill="${p.accent}" stroke="${p.ink}" stroke-width="0.6">
          <ellipse cx="0" cy="0" rx="6" ry="3"/>
          <line x1="0" y1="0" x2="0" y2="14"/>
        </g>
        <!-- 背篓 -->
        <g transform="translate(360 380)" fill="${p.secondary}" stroke="${p.ink}" stroke-width="0.6">
          <path d="M -20 0 L -16 30 L 16 30 L 20 0 Z"/>
          <path d="M -20 0 q 20 -10 40 0" fill="none"/>
        </g>
        <!-- 采药者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'jia', name: '贾思勰', era: 'tang', seal: '齐民要',
    motto: ['顺天时', '量地利'], caption: '齐民要术',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 70, p.ground)}
        <!-- 农田 -->
        <g stroke="${ink}" stroke-width="0.6" fill="${p.secondary}" opacity="0.5">
          <rect x="60" y="380" width="360" height="40"/>
          ${Array.from({ length: 8 }, (_, i) => `<line x1="${60 + i * 45}" y1="380" x2="${60 + i * 45}" y2="420"/>`).join('')}
        </g>
        <!-- 苗 -->
        ${Array.from({ length: 16 }, (_, i) => `<g transform="translate(${80 + i * 22} 380)" stroke="${p.ink}" stroke-width="0.6" fill="none">
          <line x1="0" y1="0" x2="0" y2="-10"/>
          <path d="M 0 -6 q -3 -2 -6 -2" />
          <path d="M 0 -8 q 3 -2 6 -2" />
        </g>`).join('')}
        <!-- 农人 -->
        <g transform="translate(220 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 40 L 22 40 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'xuxiake', name: '徐霞客', era: 'ming', seal: '徐霞客',
    motto: ['朝碧海暮苍梧', '以足代笔'], caption: '游历天下',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 240, 100)}
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 140, 70, p.ground)}
        ${waterfall(160, 280, 90, p.secondary)}
        ${water(p.primary, 440)}
        ${bridge(360, 440, 70, ink)}
        ${bamboo(60, 440, 110, p.ink)}
        ${plumBranch(420, 280, -1, ink)}
        <!-- 行者 -->
        <g transform="translate(220 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 杖 -->
        <line x1="200" y1="380" x2="180" y2="430" stroke="${p.primary}" stroke-width="2"/>
        <!-- 背囊 -->
        <rect x="226" y="370" width="20" height="30" fill="${p.secondary}" stroke="${p.ink}" stroke-width="0.6"/>`;
    },
  },

  // ── C 中段 ──
  {
    id: 'zhang', name: '张仲景', era: 'westernHan', seal: '伤寒论',
    motto: ['勤求古训', '博采众方'], caption: '伤寒论',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${candle(80, 380, ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        ${scroll(120, 380, p.ground, p.primary)}
        ${scroll(220, 380, p.ground, p.primary)}
        ${scroll(320, 380, p.ground, p.primary)}
        ${inkstone(380, 432, p.ink)}
        <!-- 脉枕 -->
        <rect x="320" y="376" width="20" height="6" fill="${p.secondary}" stroke="${p.ink}" stroke-width="0.4"/>
        <!-- 坐者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'huatuo', name: '华佗', era: 'westernHan', seal: '麻沸散',
    motto: ['医者意也', '麻沸开刀'], caption: '麻沸神术',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${candle(360, 380, ink)}
        <!-- 手术台 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 病人 -->
        <g transform="translate(180 360)" fill="${ink}" opacity="0.7">
          <ellipse cx="0" cy="0" rx="9" ry="11"/>
          <path d="M -14 9 L -18 36 L 18 36 L 14 9 Z"/>
        </g>
        <!-- 主刀者 -->
        <g transform="translate(280 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
          <line x1="20" y1="0" x2="38" y2="-6" stroke="${p.ink}" stroke-width="2"/>
        </g>
        <!-- 刀 -->
        <line x1="306" y1="318" x2="320" y2="324" stroke="${p.ink}" stroke-width="1.4"/>
        <line x1="320" y1="324" x2="328" y2="316" stroke="${p.ink}" stroke-width="0.8"/>`;
    },
  },
  {
    id: 'sun', name: '孙思邈', era: 'tang', seal: '千金方',
    motto: ['大医精诚', '普救含灵'], caption: '大医精诚',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 70, p.ground)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        ${lantern(80, 200, p.seal)}
        <!-- 药柜 -->
        <g transform="translate(140 360)" fill="${p.primary}" stroke="${p.ink}" stroke-width="0.8">
          ${Array.from({ length: 6 }, (_, i) => `<rect x="0" y="${i * 10}" width="40" height="9" fill="${p.ground}" stroke="${p.ink}" stroke-width="0.4"/>`).join('')}
        </g>
        <!-- 药臼 -->
        <g transform="translate(360 380)">
          <ellipse cx="0" cy="0" rx="14" ry="6" fill="${p.secondary}" stroke="${p.ink}" stroke-width="0.6"/>
          <ellipse cx="0" cy="-2" rx="10" ry="3" fill="${p.ink}"/>
        </g>
        <!-- 坐者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'pei', name: '裴秀', era: 'westernHan', seal: '制图体',
    motto: ['制图六体', '方寸万里'], caption: '制图六体',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 70, p.ground)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 地图 -->
        <g transform="translate(240 360)">
          <rect x="-80" y="-20" width="160" height="40" fill="${p.ground}" stroke="${p.ink}" stroke-width="0.8"/>
          <path d="M -80 -10 q 30 -8 60 0 q 30 -6 50 4" stroke="${p.primary}" stroke-width="0.5" fill="none"/>
          <path d="M -80 0 q 40 -4 80 0 q 40 4 70 -2" stroke="${p.primary}" stroke-width="0.5" fill="none"/>
          <path d="M -80 10 q 30 -2 60 4 q 30 2 50 -2" stroke="${p.primary}" stroke-width="0.5" fill="none"/>
          <circle cx="-30" cy="-6" r="3" fill="${p.seal}"/>
          <circle cx="20" cy="2" r="3" fill="${p.seal}"/>
          <circle cx="50" cy="10" r="3" fill="${p.seal}"/>
        </g>
        <!-- 坐者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'su', name: '苏颂', era: 'song', seal: '水转仪',
    motto: ['水转之器', '以水为动'], caption: '水转仪象',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 70, p.ground)}
        ${moon(p.ground, 380, 110, 18)}
        ${water(p.primary, 440)}
        <!-- 水转仪象台 -->
        <g transform="translate(240 360)" stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <rect x="-50" y="-60" width="100" height="80"/>
          <path d="M -60 -60 L 0 -90 L 60 -60 Z" fill="${p.seal}" opacity="0.7"/>
          <rect x="-10" y="-30" width="20" height="30" fill="${p.ground}"/>
          ${Array.from({ length: 5 }, (_, i) => `<rect x="${-30 + i * 15}" y="-50" width="10" height="20" fill="${p.accent}" stroke="${p.ink}" stroke-width="0.4"/>`).join('')}
          <!-- 水轮 -->
          <circle cx="0" cy="40" r="14" fill="none" stroke="${p.ink}" stroke-width="1.2"/>
          ${Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return `<line x1="0" y1="40" x2="${Math.cos(a) * 14}" y2="${40 + Math.sin(a) * 14}" stroke-width="0.6"/>`;
          }).join('')}
        </g>
        <!-- 立者 -->
        <g transform="translate(360 350)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'lijie', name: '李诫', era: 'song', seal: '营造式',
    motto: ['经营造作', '有规有矩'], caption: '营造法式',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 70, p.ground)}
        <!-- 殿宇 -->
        <g stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <path d="M 80 280 L 240 240 L 400 280 L 400 360 L 80 360 Z" fill="${p.seal}" opacity="0.5"/>
        </g>
        <!-- 斗拱 -->
        <g transform="translate(160 320)" stroke="${ink}" stroke-width="0.8" fill="${p.secondary}">
          <rect x="-8" y="0" width="16" height="6"/>
          <rect x="-12" y="6" width="24" height="6"/>
          <rect x="-8" y="12" width="16" height="6"/>
        </g>
        <g transform="translate(320 320)" stroke="${ink}" stroke-width="0.8" fill="${p.secondary}">
          <rect x="-8" y="0" width="16" height="6"/>
          <rect x="-12" y="6" width="24" height="6"/>
          <rect x="-8" y="12" width="16" height="6"/>
        </g>
        <!-- 矩尺 -->
        <g transform="translate(220 380)" fill="${p.ground}" stroke="${p.ink}" stroke-width="0.6">
          <path d="M -10 0 L 10 0 L 10 -2 L -10 -2 Z"/>
          <path d="M 0 0 L 0 20 L 2 20 L 2 0 Z"/>
        </g>
        <!-- 立者 -->
        <g transform="translate(180 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── D 偏内 ──
  {
    id: 'bianque', name: '扁鹊', era: 'spring', seal: '望闻切',
    motto: ['望闻问切', '四诊合参'], caption: '望闻问切',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        ${lantern(80, 200, p.seal)}
        <!-- 脉枕 -->
        <rect x="180" y="396" width="40" height="6" fill="${p.secondary}" stroke="${p.ink}" stroke-width="0.6"/>
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 脉者 -->
        <g transform="translate(220 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 病人手 -->
        <ellipse cx="180" cy="396" rx="8" ry="3" fill="${p.primary}"/>`;
    },
  },
  {
    id: 'ge', name: '葛洪', era: 'tang', seal: '抱朴子',
    motto: ['神仙可学', '不死可致'], caption: '抱朴炼丹',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 70, p.ground)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        ${candle(360, 380, ink)}
        <!-- 丹炉 -->
        <g transform="translate(240 400)" stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="36" ry="10"/>
          <rect x="-36" y="0" width="72" height="20"/>
          <ellipse cx="0" cy="20" rx="36" ry="10"/>
          <rect x="-40" y="-12" width="80" height="4" fill="${p.ink}"/>
        </g>
        <!-- 烟 -->
        <g fill="${p.ground}" opacity="0.7">
          <ellipse cx="240" cy="350" rx="30" ry="14"/>
          <ellipse cx="220" cy="330" rx="20" ry="10"/>
        </g>
        <!-- 火 -->
        <g transform="translate(240 420)">
          <path d="M -8 0 q -2 -10 0 -16 q 4 6 0 16 Z" fill="${p.seal}"/>
          <path d="M 0 0 q -2 -12 0 -18 q 4 8 0 18 Z" fill="${p.seal}"/>
          <path d="M 8 0 q -2 -10 0 -16 q 4 6 0 16 Z" fill="${p.seal}"/>
        </g>
        <!-- 坐者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'lidaoyu', name: '郦道元', era: 'tang', seal: '水经注',
    motto: ['山水有灵', '通于经史'], caption: '水经注',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 240, 90)}
        ${mountains(p.secondary, 320, 60)}
        ${water(p.primary, 420)}
        ${waterfall(180, 280, 90, p.secondary)}
        ${boat(360, 420, ink)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        ${plumBranch(80, 280, 1, ink)}
        ${cloud(140, 140, 70, p.ground)}
        <!-- 河边立者 -->
        <g transform="translate(220 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'yi', name: '一行', era: 'tang', seal: '大衍历',
    motto: ['以天为镜', '测子午线'], caption: '大衍测天',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${moon(p.ground, 100, 110, 18)}
        ${cloud(360, 150, 70, p.ground)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 浑仪 -->
        <g transform="translate(240 360)" stroke="${ink}" stroke-width="1.2" fill="none">
          <circle cx="0" cy="0" r="40" fill="${p.secondary}" opacity="0.3"/>
          <ellipse cx="0" cy="0" rx="40" ry="20"/>
          <line x1="-40" y1="0" x2="40" y2="0"/>
          <line x1="0" y1="-40" x2="0" y2="40"/>
          <line x1="0" y1="40" x2="0" y2="60" stroke-width="2"/>
        </g>
        <!-- 立者 -->
        <g transform="translate(360 350)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'qin', name: '秦九韶', era: 'song', seal: '数书九',
    motto: ['数术穷天地', '大衍求一'], caption: '数书九章',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${candle(80, 380, ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        ${scroll(120, 380, p.ground, p.primary)}
        ${scroll(220, 380, p.ground, p.primary)}
        ${scroll(320, 380, p.ground, p.primary)}
        <!-- 算筹 -->
        <g transform="translate(360 360)" stroke="${p.ink}" stroke-width="0.6">
          ${Array.from({ length: 20 }, (_, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            return `<line x1="${-20 + col * 8}" y1="${-10 + row * 6}" x2="${-10 + col * 8}" y2="${-10 + row * 6}"/>`;
          }).join('')}
        </g>
        <!-- 坐者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'luban', name: '鲁班', era: 'spring', seal: '公输般',
    motto: ['工欲善其事', '必利其器'], caption: '工匠祖师',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 工坊 -->
        <rect x="160" y="320" width="160" height="100" fill="${p.primary}" opacity="0.6"/>
        <path d="M 160 320 L 240 290 L 320 320 Z" fill="${p.seal}" opacity="0.7"/>
        <!-- 锯 -->
        <g transform="translate(200 380) rotate(-20)">
          <rect x="0" y="-2" width="40" height="4" fill="${p.ground}" stroke="${p.ink}" stroke-width="0.4"/>
          ${Array.from({ length: 12 }, (_, i) => `<path d="M ${4 + i * 3} 2 L ${4 + i * 3} 6"/>`).join('')}
        </g>
        <!-- 墨斗 -->
        <g transform="translate(280 380)">
          <rect x="-10" y="-4" width="20" height="8" fill="${p.secondary}" stroke="${p.ink}" stroke-width="0.6"/>
          <line x1="10" y1="0" x2="30" y2="0" stroke="${p.ink}" stroke-width="0.6"/>
        </g>
        <!-- 立者 -->
        <g transform="translate(220 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── E 极端内 ──
  {
    id: 'ouye', name: '欧冶子', era: 'spring', seal: '湛卢剑',
    motto: ['铸得三千剑', '一为知己鸣'], caption: '铸剑宗师',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        ${candle(80, 380, ink)}
        <!-- 铸炉 -->
        <g transform="translate(240 400)" stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="40" ry="10"/>
          <rect x="-40" y="0" width="80" height="20"/>
          <ellipse cx="0" cy="20" rx="40" ry="10"/>
        </g>
        <!-- 火 -->
        <g transform="translate(240 420)">
          <path d="M -10 0 q -2 -10 0 -16 q 4 6 0 16 Z" fill="${p.seal}"/>
          <path d="M 0 0 q -2 -14 0 -20 q 4 8 0 20 Z" fill="${p.seal}"/>
          <path d="M 10 0 q -2 -10 0 -16 q 4 6 0 16 Z" fill="${p.seal}"/>
        </g>
        <!-- 剑 -->
        <g transform="translate(360 360)">
          <line x1="0" y1="0" x2="40" y2="0" stroke="${p.ink}" stroke-width="2.4"/>
          <rect x="-4" y="-8" width="8" height="16" fill="${p.seal}"/>
          <circle cx="0" cy="-12" r="3" fill="${p.accent}"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'ganjiang', name: '干将', era: 'spring', seal: '干将莫',
    motto: ['身既死兮神以灵', '魂魄毅为鬼雄'], caption: '以身殉剑',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 70, p.ground)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 炉 -->
        <g transform="translate(180 400)" stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="32" ry="8"/>
          <rect x="-32" y="0" width="64" height="16"/>
          <ellipse cx="0" cy="16" rx="32" ry="8"/>
        </g>
        <!-- 烈焰 -->
        <g transform="translate(180 420)">
          <path d="M -8 0 q -2 -10 0 -16 q 4 6 0 16 Z" fill="${p.seal}"/>
          <path d="M 0 0 q -2 -12 0 -18 q 4 8 0 18 Z" fill="${p.seal}"/>
          <path d="M 8 0 q -2 -10 0 -16 q 4 6 0 16 Z" fill="${p.seal}"/>
        </g>
        <!-- 雌雄剑 -->
        <g transform="translate(320 360)">
          <line x1="0" y1="0" x2="40" y2="-2" stroke="${p.ink}" stroke-width="2"/>
          <line x1="0" y1="6" x2="40" y2="4" stroke="${p.ink}" stroke-width="2"/>
          <rect x="-4" y="-2" width="8" height="14" fill="${p.seal}"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'ma', name: '马钧', era: 'tang', seal: '名巧也',
    motto: ['天下名巧', '以机为用'], caption: '名巧马钧',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 70, p.ground)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 指南车 -->
        <g transform="translate(240 380)" stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <rect x="-50" y="0" width="100" height="40"/>
          <path d="M -50 0 L 0 -20 L 50 0 Z" fill="${p.seal}" opacity="0.7"/>
          <circle cx="-30" cy="40" r="10" fill="${p.ink}"/>
          <circle cx="30" cy="40" r="10" fill="${p.ink}"/>
          <line x1="0" y1="-20" x2="0" y2="-40" stroke-width="1.4"/>
          <path d="M 0 -40 L 8 -32 L 0 -36 L -8 -32 Z" fill="${p.accent}"/>
        </g>
        <!-- 立者 -->
        <g transform="translate(180 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <g transform="translate(360 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'zhu', name: '竺可桢', era: 'qing', seal: '求是',
    motto: ['求是', '以日记测天'], caption: '求是竺公',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 70, p.ground)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 气象仪器 -->
        <g transform="translate(160 400)" stroke="${ink}" stroke-width="0.8" fill="${p.secondary}" opacity="0.85">
          <rect x="-10" y="-40" width="20" height="40"/>
          <ellipse cx="0" cy="-44" rx="12" ry="4" fill="${p.ground}"/>
        </g>
        <g transform="translate(220 400)" stroke="${ink}" stroke-width="0.8" fill="${p.secondary}" opacity="0.85">
          <circle cx="0" cy="-20" r="14" fill="${p.ground}"/>
          <line x1="0" y1="-6" x2="0" y2="0"/>
        </g>
        <!-- 风旗 -->
        <g transform="translate(360 380)">
          <line x1="0" y1="0" x2="0" y2="-40" stroke="${p.ink}" stroke-width="1"/>
          <path d="M 0 -40 L 16 -36 L 0 -32 Z" fill="${p.seal}"/>
        </g>
        <!-- 案上日记 -->
        <rect x="240" y="380" width="100" height="6" fill="${p.ground}" stroke="${p.ink}" stroke-width="0.6"/>
        <!-- 立者 -->
        <g transform="translate(300 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 56 L 24 56 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'mao', name: '茅以升', era: 'qing', seal: '钱塘桥',
    motto: ['桥梁是造福人民', '炸桥保国'], caption: '钱塘江桥',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 280, 70)}
        ${water(p.primary, 440)}
        ${cloud(140, 140, 80, p.ground)}
        ${cloud(360, 150, 60, p.ground)}
        <!-- 钱塘江桥 -->
        <g transform="translate(240 380)" stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <line x1="-160" y1="20" x2="160" y2="20" stroke-width="2"/>
          ${Array.from({ length: 6 }, (_, i) => `<line x1="${-140 + i * 56}" y1="20" x2="${-140 + i * 56}" y2="50" stroke-width="1.4"/>`).join('')}
          <line x1="-160" y1="50" x2="160" y2="50" stroke-width="2"/>
          ${Array.from({ length: 4 }, (_, i) => `<path d="M ${-100 + i * 60} 20 q 4 -10 0 -16" fill="none" stroke-width="0.8"/>`).join('')}
          <ellipse cx="0" cy="20" rx="180" ry="6" fill="${p.ground}" opacity="0.3"/>
        </g>
        <!-- 立者 -->
        <g transform="translate(360 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'zhan', name: '詹天佑', era: 'qing', seal: '京张路',
    motto: ['各出所学', '使国家富强'], caption: '京张铁路',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 240, 90)}
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 140, 70, p.ground)}
        <!-- 长城垛口 -->
        <g stroke="${ink}" stroke-width="1.2" fill="${p.primary}" opacity="0.85">
          <path d="M 0 380 L 0 340 L 20 320 L 20 380 Z"/>
          <path d="M 60 380 L 60 340 L 80 320 L 80 380 Z"/>
          <path d="M 120 380 L 120 340 L 140 320 L 140 380 Z"/>
        </g>
        <!-- 人字形铁路 -->
        <g stroke="${p.ink}" stroke-width="2.4" fill="none">
          <path d="M 0 410 L 100 410 L 200 360 L 280 360"/>
          <path d="M 280 360 L 360 410 L 480 410"/>
        </g>
        <!-- 火车 -->
        <g transform="translate(180 360)" fill="${p.primary}" stroke="${p.ink}" stroke-width="0.8">
          <rect x="-20" y="-10" width="20" height="14"/>
          <rect x="0" y="-6" width="14" height="10"/>
          <line x1="-20" y1="-14" x2="-2" y2="-14"/>
          <line x1="-20" y1="0" x2="-20" y2="-14"/>
          <line x1="-2" y1="0" x2="-2" y2="-14"/>
          <circle cx="-16" cy="6" r="3" fill="${p.ink}"/>
          <circle cx="-6" cy="6" r="3" fill="${p.ink}"/>
          <circle cx="6" cy="6" r="3" fill="${p.ink}"/>
        </g>
        <!-- 立者 -->
        <g transform="translate(360 350)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
];
