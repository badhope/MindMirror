// scripts/portraits/common.mjs
// 通用 SVG 工具：滤镜、调色板、篆刻、题词、版式骨架
// 480 × 640 viewBox，朝代色板 8 张，水墨手绘扰动滤镜，朱砂印章

// ─── 朝代色板 ────────────────────────────────────────────────
// 每一朝给主色 / 副色 / 底色 / 墨色 / 朱砂
export const PALETTES = {
  spring: { // 春秋战国
    primary: '#7a5a2e',
    secondary: '#a47c4a',
    ground: '#f1e4c4',
    ink: '#2a1f12',
    seal: '#9a2a2a',
    accent: '#c4a868',
    label: '春秋',
  },
  warring: { // 战国
    primary: '#5e3a20',
    secondary: '#8a5a30',
    ground: '#ece1c0',
    ink: '#1f1408',
    seal: '#9a2828',
    accent: '#b88a4a',
    label: '战国',
  },
  westernHan: { // 西汉
    primary: '#6a5a45',
    secondary: '#8a7a5a',
    ground: '#ede4cf',
    ink: '#2a2014',
    seal: '#9a3030',
    accent: '#b0a080',
    label: '西汉',
  },
  easternJin: { // 东晋
    primary: '#4e6a4a',
    secondary: '#6a8a5e',
    ground: '#e6ecdc',
    ink: '#1a2a18',
    seal: '#8a2828',
    accent: '#8aaa78',
    label: '东晋',
  },
  tang: { // 唐
    primary: '#b8842a',
    secondary: '#d8a850',
    ground: '#faecc8',
    ink: '#3a2008',
    seal: '#a82828',
    accent: '#e8c878',
    label: '盛唐',
  },
  song: { // 宋
    primary: '#3e6a68',
    secondary: '#5a8a88',
    ground: '#dde9e6',
    ink: '#142a28',
    seal: '#902a2a',
    accent: '#7aaaa8',
    label: '宋',
  },
  yuan: { // 元
    primary: '#686858',
    secondary: '#888878',
    ground: '#ececdf',
    ink: '#1a1a14',
    seal: '#882828',
    accent: '#a8a898',
    label: '元',
  },
  ming: { // 明
    primary: '#8a2424',
    secondary: '#a83838',
    ground: '#f0d8d0',
    ink: '#1a0808',
    seal: '#9a2020',
    accent: '#c45a4a',
    label: '明',
  },
  qing: { // 清
    primary: '#5a3a68',
    secondary: '#7a5a88',
    ground: '#e6dcec',
    ink: '#1a0a20',
    seal: '#8a2848',
    accent: '#9a78a8',
    label: '清',
  },
  // ── 西方色板（v0.4 / v0.5）──
  classical: { // 希腊罗马
    primary: '#5a6a82',
    secondary: '#7a8aa0',
    ground: '#ece4d4',
    ink: '#1a2030',
    seal: '#7a2a3a',
    accent: '#a8b0c0',
    label: '希腊',
  },
  medieval: { // 中世纪 / 经院
    primary: '#6a4a28',
    secondary: '#8a6a48',
    ground: '#e8dec8',
    ink: '#20140a',
    seal: '#8a2020',
    accent: '#a88860',
    label: '经院',
  },
  modernEarly: { // 17-18 世纪启蒙
    primary: '#3e5a4a',
    secondary: '#5a7a6a',
    ground: '#dee8e0',
    ink: '#0e1a18',
    seal: '#7a2a2a',
    accent: '#8aaa90',
    label: '启蒙',
  },
  modernLate: { // 19-20 世纪近代
    primary: '#3a3a5a',
    secondary: '#5a5a7a',
    ground: '#e2e2ec',
    ink: '#0a0a20',
    seal: '#6a2030',
    accent: '#8888a8',
    label: '近代',
  },
};

// ─── 滤镜 ────────────────────────────────────────────────
// 水墨扰动：feTurbulence + feDisplacementMap
// 远景柔化：feGaussianBlur
// 飞白：feComposite 抽稀
export function filters(seed = 1) {
  return `
  <defs>
    <filter id="ink-${seed}" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="${seed}" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4"/>
    </filter>
    <filter id="ink-strong-${seed}" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="${seed + 7}" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.6"/>
    </filter>
    <filter id="wash-${seed}" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="${seed + 3}" result="t"/>
      <feDisplacementMap in="SourceGraphic" in2="t" scale="6"/>
      <feGaussianBlur stdDeviation="0.6"/>
    </filter>
    <filter id="haze-${seed}">
      <feGaussianBlur stdDeviation="2.4"/>
    </filter>
    <filter id="paper-${seed}" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${seed + 11}" result="grain"/>
      <feColorMatrix in="grain" type="matrix"
        values="0 0 0 0 0.45
                0 0 0 0 0.35
                0 0 0 0 0.20
                0 0 0 0.10 0"/>
    </filter>
  </defs>`;
}

// ─── 纸底纹 ────────────────────────────────────────────────
// 米黄洒金纸：底色 + 不规则斑驳 + 边角磨损
export function paper(ground, ink, seed = 1) {
  return `
  <rect x="0" y="0" width="480" height="640" fill="${ground}"/>
  <rect x="0" y="0" width="480" height="640" fill="${ground}" filter="url(#paper-${seed})" opacity="0.55"/>
  <!-- 边角阴影 -->
  <radialGradient id="vignette-${seed}" cx="50%" cy="50%" r="70%">
    <stop offset="60%" stop-color="${ground}" stop-opacity="0"/>
    <stop offset="100%" stop-color="${ink}" stop-opacity="0.18"/>
  </radialGradient>
  <rect x="0" y="0" width="480" height="640" fill="url(#vignette-${seed})"/>
  <!-- 折痕 -->
  <path d="M 0 320 L 480 318" stroke="${ink}" stroke-width="0.4" opacity="0.08"/>
  <path d="M 240 0 L 242 640" stroke="${ink}" stroke-width="0.3" opacity="0.06"/>`;
}

// ─── 边框 ────────────────────────────────────────────────
// 双线细框，角上小篆记
export function frame(primary, ink) {
  return `
  <rect x="14" y="14" width="452" height="612" fill="none" stroke="${primary}" stroke-width="1.4"/>
  <rect x="20" y="20" width="440" height="600" fill="none" stroke="${ink}" stroke-width="0.5" opacity="0.5"/>
  <!-- 四角小纹 -->
  <g stroke="${primary}" stroke-width="0.9" fill="none" opacity="0.7">
    <path d="M 20 38 L 20 20 L 38 20"/>
    <path d="M 442 20 L 460 20 L 460 38"/>
    <path d="M 460 602 L 460 620 L 442 620"/>
    <path d="M 38 620 L 20 620 L 20 602"/>
  </g>`;
}

// ─── 顶装饰：朝代标 + 题词 ────────────────────────────────────────────────
// 朝代: 顶左角小章样式 + 横题
// 题词: 右半横排，墨字，4-7 字一行，可换行
export function header(palette, era, motto) {
  // era 是短句朝代题词 4-7 字
  return `
  <g>
    <!-- 朝代小章：左顶角 -->
    <g transform="translate(34 36)">
      <rect x="0" y="0" width="44" height="22" fill="none" stroke="${palette.seal}" stroke-width="1.6"/>
      <text x="22" y="15" text-anchor="middle" font-family="STKaiti, KaiTi, serif" font-size="11" fill="${palette.seal}" letter-spacing="2" font-weight="600">${era}</text>
    </g>
    <!-- 朝代小印 -->
    <g transform="translate(82 32)">
      <rect x="0" y="0" width="22" height="22" fill="${palette.seal}"/>
      <text x="11" y="16" text-anchor="middle" font-family="serif" font-size="11" fill="${palette.ground}" font-weight="700">镜</text>
    </g>
    <!-- 题词：右半 -->
    <g transform="translate(120 44)">
      <text font-family="STKaiti, KaiTi, serif" font-size="15" fill="${palette.ink}" letter-spacing="3" font-weight="500">
        ${motto.map((line, i) => `<tspan x="0" dy="${i === 0 ? 0 : 22}">${line}</tspan>`).join('')}
      </text>
    </g>
    <!-- 顶分隔细线 -->
    <line x1="34" y1="78" x2="446" y2="78" stroke="${palette.primary}" stroke-width="0.5" opacity="0.6"/>
    <line x1="34" y1="82" x2="446" y2="82" stroke="${palette.primary}" stroke-width="0.3" opacity="0.4"/>
  </g>`;
}

// ─── 底装饰：姓名 + 篆刻朱砂方印 ────────────────────────────────────────────────
// 姓名：左下角，竖排或横排大字
// 印章：右下角朱砂方章
// seal: 3 字（如「道德经」）→ 三竖排；4 字 → 2x2 田字格
export function footer(palette, name, seal) {
  const chars = Array.from(seal);
  let sealInner;
  if (chars.length === 4) {
    // 2x2 田字
    sealInner = `
      <text x="32" y="28" text-anchor="middle" font-family="serif" font-size="20" fill="${palette.ground}" font-weight="900">${chars[0]}</text>
      <text x="32" y="54" text-anchor="middle" font-family="serif" font-size="20" fill="${palette.ground}" font-weight="900">${chars[3]}</text>
      <g transform="rotate(-2 32 32)" opacity="0.95">
        <text x="14" y="22" text-anchor="middle" font-family="serif" font-size="16" fill="${palette.ground}" font-weight="900">${chars[1]}</text>
        <text x="50" y="50" text-anchor="middle" font-family="serif" font-size="16" fill="${palette.ground}" font-weight="900">${chars[2]}</text>
      </g>`;
  } else {
    // 3 字竖排
    sealInner = `
      <text x="32" y="20" text-anchor="middle" font-family="serif" font-size="20" fill="${palette.ground}" font-weight="900">${chars[0] || ''}</text>
      <text x="32" y="40" text-anchor="middle" font-family="serif" font-size="20" fill="${palette.ground}" font-weight="900">${chars[1] || ''}</text>
      <text x="32" y="60" text-anchor="middle" font-family="serif" font-size="20" fill="${palette.ground}" font-weight="900">${chars[2] || ''}</text>`;
  }
  return `
  <g>
    <!-- 底分隔细线 -->
    <line x1="34" y1="500" x2="446" y2="500" stroke="${palette.primary}" stroke-width="0.5" opacity="0.6"/>
    <line x1="34" y1="504" x2="446" y2="504" stroke="${palette.primary}" stroke-width="0.3" opacity="0.4"/>
    <!-- 姓名：左半横排大字 -->
    <g transform="translate(46 540)">
      <text font-family="STKaiti, KaiTi, serif" font-size="38" fill="${palette.ink}" letter-spacing="14" font-weight="700">${name}</text>
      <!-- 姓名小注：右侧小字 -->
      <text x="0" y="40" font-family="STKaiti, KaiTi, serif" font-size="10" fill="${palette.primary}" letter-spacing="3" opacity="0.85">东方文人 · 镜心之镜</text>
    </g>
    <!-- 篆刻朱砂方印：右下角 -->
    <g transform="translate(360 530)">
      <rect x="0" y="0" width="64" height="64" fill="${palette.seal}" filter="url(#ink-${Math.abs(name.length * 13) % 99 + 1})"/>
      <rect x="2" y="2" width="60" height="60" fill="none" stroke="${palette.ground}" stroke-width="0.8" opacity="0.6"/>
      ${sealInner}
    </g>
  </g>`;
}

// ─── SVG 整体骨架 ────────────────────────────────────────────────
export function wrap(content, palette, seed = 1) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 640" width="480" height="640" preserveAspectRatio="xMidYMid meet">
${filters(seed)}
${content}
</svg>`;
}

// ─── 简易 SVG 路径工具 ────────────────────────────────────────────────
// 远山：折线 + 三角
export const mountains = (p, y = 280, h = 60) => `
  <g filter="url(#haze-${Math.abs(p.length * 7) % 99 + 1})" opacity="0.7">
    <path d="M 0 ${y} L 60 ${y - h * 0.6} L 130 ${y - h * 0.85} L 200 ${y - h * 0.5} L 280 ${y - h} L 360 ${y - h * 0.7} L 440 ${y - h * 0.4} L 480 ${y - h * 0.2} L 480 480 L 0 480 Z" fill="${p}" opacity="0.35"/>
    <path d="M 0 ${y + 24} L 80 ${y - h * 0.3 + 24} L 170 ${y - h * 0.55 + 24} L 260 ${y - h * 0.2 + 24} L 340 ${y - h * 0.6 + 24} L 420 ${y - h * 0.25 + 24} L 480 ${y - h * 0.05 + 24} L 480 480 L 0 480 Z" fill="${p}" opacity="0.55"/>
  </g>`;

// 水波：水平线
export const water = (p, y = 440) => `
  <g stroke="${p}" stroke-width="0.8" fill="none" opacity="0.7">
    <path d="M 0 ${y} L 480 ${y}" stroke-dasharray="4 4"/>
    <path d="M 0 ${y + 12} L 480 ${y + 12}" stroke-dasharray="6 6" opacity="0.6"/>
    <path d="M 0 ${y + 24} L 480 ${y + 24}" stroke-dasharray="8 8" opacity="0.45"/>
    <path d="M 0 ${y + 36} L 480 ${y + 36}" stroke-dasharray="12 12" opacity="0.3"/>
  </g>`;

// 圆月
export const moon = (p, x = 380, y = 130, r = 22) => `
  <g>
    <circle cx="${x}" cy="${y}" r="${r + 4}" fill="${p}" opacity="0.18"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${p}" opacity="0.9"/>
  </g>`;

// 树枝
export const branch = (x, y, dir = 1, color = '#3a2010') => `
  <g stroke="${color}" stroke-width="1.6" fill="none" stroke-linecap="round">
    <path d="M ${x} ${y} q ${20 * dir} -10 ${50 * dir} -30"/>
    <path d="M ${x + 30 * dir} ${y - 18} q ${15 * dir} -8 ${30 * dir} -22"/>
    <path d="M ${x + 50 * dir} ${y - 30} q ${8 * dir} -6 ${18 * dir} -18"/>
  </g>`;

// 竹
export const bamboo = (x, y, h = 120, color = '#2a4a28') => `
  <g stroke="${color}" stroke-width="1.8" fill="none" stroke-linecap="round">
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y - h}"/>
    <line x1="${x - 6}" y1="${y - h * 0.3}" x2="${x + 6}" y2="${y - h * 0.3}"/>
    <line x1="${x - 5}" y1="${y - h * 0.55}" x2="${x + 5}" y2="${y - h * 0.55}"/>
    <line x1="${x - 6}" y1="${y - h * 0.8}" x2="${x + 6}" y2="${y - h * 0.8}"/>
    <path d="M ${x} ${y - h * 0.2} q -10 -4 -22 -8" />
    <path d="M ${x} ${y - h * 0.5} q 12 -6 24 -10" />
  </g>`;

// 楼阁
export const pavilion = (x, y, color = '#3a2010', roof = '#8a2424') => `
  <g stroke="${color}" stroke-width="1.2" fill="none">
    <path d="M ${x - 28} ${y - 50} L ${x} ${y - 70} L ${x + 28} ${y - 50} Z" fill="${roof}" opacity="0.85"/>
    <path d="M ${x - 32} ${y - 50} L ${x} ${y - 76} L ${x + 32} ${y - 50}" fill="none"/>
    <line x1="${x - 20}" y1="${y - 50}" x2="${x - 20}" y2="${y - 10}"/>
    <line x1="${x}" y1="${y - 50}" x2="${x}" y2="${y - 10}"/>
    <line x1="${x + 20}" y1="${y - 50}" x2="${x + 20}" y2="${y - 10}"/>
    <line x1="${x - 24}" y1="${y - 10}" x2="${x + 24}" y2="${y - 10}"/>
    <line x1="${x - 28}" y1="${y - 10}" x2="${x + 28}" y2="${y - 10}"/>
  </g>`;

// 茅屋
export const cottage = (x, y, color = '#3a2010') => `
  <g stroke="${color}" stroke-width="1.2" fill="none">
    <path d="M ${x - 30} ${y - 22} L ${x} ${y - 40} L ${x + 30} ${y - 22} L ${x + 24} ${y - 6} L ${x - 24} ${y - 6} Z" fill="${color}" opacity="0.6"/>
    <line x1="${x - 18}" y1="${y - 6}" x2="${x - 18}" y2="${y + 14}"/>
    <line x1="${x + 18}" y1="${y - 6}" x2="${x + 18}" y2="${y + 14}"/>
    <line x1="${x - 30}" y1="${y + 14}" x2="${x + 30}" y2="${y + 14}"/>
    <rect x="${x - 4}" y="${y - 4}" width="8" height="14" fill="${color}" opacity="0.4"/>
  </g>`;

// 船
export const boat = (x, y, color = '#2a1810') => `
  <g stroke="${color}" stroke-width="1.4" fill="none" stroke-linecap="round">
    <path d="M ${x - 30} ${y} Q ${x} ${y + 14} ${x + 30} ${y} L ${x + 22} ${y - 4} L ${x - 22} ${y - 4} Z" fill="${color}" opacity="0.6"/>
    <line x1="${x}" y1="${y - 4}" x2="${x}" y2="${y - 36}"/>
    <path d="M ${x} ${y - 32} L ${x + 4} ${y - 8} L ${x - 4} ${y - 8} Z" fill="${color}" opacity="0.5"/>
  </g>`;

// 桥
export const bridge = (x, y, w = 60, color = '#3a2010') => `
  <g stroke="${color}" stroke-width="1.4" fill="none" stroke-linecap="round">
    <path d="M ${x - w / 2} ${y} Q ${x} ${y - 18} ${x + w / 2} ${y}"/>
    <line x1="${x - w / 2 + 2}" y1="${y - 2}" x2="${x + w / 2 - 2}" y2="${y - 2}"/>
    <line x1="${x - w / 2}" y1="${y}" x2="${x - w / 2 - 4}" y2="${y + 6}"/>
    <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2 + 4}" y2="${y + 6}"/>
  </g>`;

// 云
export const cloud = (x, y, w = 80, color = '#ffffff') => `
  <g fill="${color}" opacity="0.85">
    <ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="6"/>
    <ellipse cx="${x - w * 0.2}" cy="${y - 4}" rx="${w * 0.18}" ry="5"/>
    <ellipse cx="${x + w * 0.18}" cy="${y - 3}" rx="${w * 0.2}" ry="4"/>
  </g>`;

// 飞鸟
export const bird = (x, y, color = '#1a1a1a') => `
  <g stroke="${color}" stroke-width="1" fill="none" stroke-linecap="round">
    <path d="M ${x} ${y} q 4 -3 8 0 q 4 -3 8 0"/>
  </g>`;

// 梅花枝
export const plumBranch = (x, y, dir = 1, color = '#3a2010') => `
  <g stroke="${color}" stroke-width="1.6" fill="none" stroke-linecap="round">
    <path d="M ${x} ${y} q ${18 * dir} -8 ${40 * dir} -20 q ${20 * dir} -10 ${44 * dir} -30"/>
    <circle cx="${x + 18 * dir}" cy="${y - 10}" r="3.5" fill="#c64a4a"/>
    <circle cx="${x + 36 * dir}" cy="${y - 22}" r="3.5" fill="#c64a4a"/>
    <circle cx="${x + 56 * dir}" cy="${y - 32}" r="3.5" fill="#e88a8a"/>
    <circle cx="${x + 72 * dir}" cy="${y - 44}" r="3" fill="#c64a4a"/>
  </g>`;

// 兰花
export const orchid = (x, y, color = '#2a4a28') => `
  <g stroke="${color}" stroke-width="1.3" fill="none" stroke-linecap="round">
    <path d="M ${x} ${y} q -6 -16 4 -36 q 10 16 -4 36"/>
    <path d="M ${x} ${y - 6} q 8 -8 18 -10"/>
    <path d="M ${x} ${y - 18} q 10 -2 22 0"/>
    <path d="M ${x} ${y - 28} q 8 2 18 6"/>
  </g>`;

// 菊花
export const chrysanthemum = (x, y, r = 8, color = '#d4a028') => `
  <g>
    ${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.4}" transform="rotate(${i * 45} ${x} ${y})" fill="${color}" opacity="0.8"/>`).join('')}
    <circle cx="${x}" cy="${y}" r="${r * 0.4}" fill="#a82828"/>
  </g>`;

// 棋盘格
export const chessboard = (x, y, w = 60, h = 60, color = '#3a2010') => `
  <g stroke="${color}" stroke-width="1" fill="none">
    <rect x="${x}" y="${y}" width="${w}" height="${h}"/>
    <line x1="${x + w / 3}" y1="${y}" x2="${x + w / 3}" y2="${y + h}"/>
    <line x1="${x + 2 * w / 3}" y1="${y}" x2="${x + 2 * w / 3}" y2="${y + h}"/>
    <line x1="${x}" y1="${y + h / 3}" x2="${x + w}" y2="${y + h / 3}"/>
    <line x1="${x}" y1="${y + 2 * h / 3}" x2="${x + w}" y2="${y + 2 * h / 3}"/>
    <circle cx="${x + 4}" cy="${y + 4}" r="1.6" fill="${color}"/>
    <circle cx="${x + w - 4}" cy="${y + 4}" r="1.6" fill="${color}"/>
    <circle cx="${x + 4}" cy="${y + h - 4}" r="1.6" fill="${color}"/>
    <circle cx="${x + w - 4}" cy="${y + h - 4}" r="1.6" fill="${color}"/>
  </g>`;

// 棋子
export const chessPiece = (x, y, r = 4, dark = true) => `
  <g>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${dark ? '#1a1a1a' : '#f0e8d0'}" stroke="#3a2010" stroke-width="0.6"/>
  </g>`;

// 砚台
export const inkstone = (x, y, color = '#1a1a1a') => `
  <g>
    <ellipse cx="${x}" cy="${y}" rx="22" ry="6" fill="${color}"/>
    <ellipse cx="${x}" cy="${y - 1}" rx="18" ry="3" fill="#0a0a0a"/>
  </g>`;

// 书卷
export const scroll = (x, y, color = '#f1e4c4', border = '#8a6420') => `
  <g>
    <rect x="${x - 24}" y="${y - 4}" width="48" height="8" fill="${color}" stroke="${border}" stroke-width="0.6"/>
    <line x1="${x - 22}" y1="${y - 1}" x2="${x + 22}" y2="${y - 1}" stroke="${border}" stroke-width="0.4"/>
    <line x1="${x - 22}" y1="${y + 1}" x2="${x + 22}" y2="${y + 1}" stroke="${border}" stroke-width="0.4"/>
  </g>`;

// 莲花
export const lotus = (x, y, r = 10, color = '#e8a8c4') => `
  <g>
    <ellipse cx="${x - r * 0.4}" cy="${y - r * 0.2}" rx="${r * 0.5}" ry="${r * 0.25}" transform="rotate(-30 ${x} ${y})" fill="${color}" opacity="0.85"/>
    <ellipse cx="${x + r * 0.4}" cy="${y - r * 0.2}" rx="${r * 0.5}" ry="${r * 0.25}" transform="rotate(30 ${x} ${y})" fill="${color}" opacity="0.85"/>
    <ellipse cx="${x}" cy="${y - r * 0.4}" rx="${r * 0.4}" ry="${r * 0.5}" fill="${color}"/>
    <ellipse cx="${x}" cy="${y + r * 0.1}" rx="${r * 0.5}" ry="${r * 0.2}" fill="#c88898" opacity="0.6"/>
  </g>`;

// 烛台
export const candle = (x, y, color = '#3a2010') => `
  <g>
    <line x1="${x}" y1="${y - 28}" x2="${x}" y2="${y}" stroke="${color}" stroke-width="2"/>
    <ellipse cx="${x}" cy="${y - 28}" rx="2" ry="3" fill="#e8a028"/>
    <ellipse cx="${x}" cy="${y - 32}" rx="3" ry="4" fill="#f8c848" opacity="0.85"/>
    <rect x="${x - 6}" y="${y}" width="12" height="4" fill="${color}"/>
  </g>`;

// 灯
export const lantern = (x, y, color = '#a82828') => `
  <g>
    <line x1="${x}" y1="${y - 24}" x2="${x}" y2="${y - 14}" stroke="#3a2010" stroke-width="0.8"/>
    <ellipse cx="${x}" cy="${y - 6}" rx="10" ry="10" fill="${color}" opacity="0.85"/>
    <line x1="${x - 10}" y1="${y - 6}" x2="${x + 10}" y2="${y - 6}" stroke="#3a2010" stroke-width="0.6"/>
    <line x1="${x - 8}" y1="${y}" x2="${x + 8}" y2="${y}" stroke="#3a2010" stroke-width="0.6"/>
    <line x1="${x - 6}" y1="${y + 6}" x2="${x + 6}" y2="${y + 6}" stroke="${color}" stroke-width="0.8"/>
  </g>`;

// 墨点
export const inkDot = (x, y, r = 1.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1a1a1a" opacity="0.6"/>`;

// 瀑布
export const waterfall = (x, y, h = 80, color = '#7a9aaa') => `
  <g>
    <path d="M ${x} ${y} L ${x} ${y + h}" stroke="${color}" stroke-width="3" opacity="0.55"/>
    <path d="M ${x - 1} ${y} L ${x - 1} ${y + h}" stroke="#ffffff" stroke-width="0.5" opacity="0.45"/>
    <path d="M ${x + 1} ${y} L ${x + 1} ${y + h}" stroke="#ffffff" stroke-width="0.4" opacity="0.4"/>
    <path d="M ${x - 6} ${y + h} q 6 4 12 0" stroke="${color}" stroke-width="2" fill="none" opacity="0.5"/>
  </g>`;

// 亭子（独立亭）
export const pavilionFree = (x, y, color = '#3a2010', roof = '#8a2424') => `
  <g stroke="${color}" stroke-width="1.2" fill="none">
    <path d="M ${x - 22} ${y - 30} L ${x} ${y - 44} L ${x + 22} ${y - 30} Z" fill="${roof}" opacity="0.85"/>
    <path d="M ${x - 26} ${y - 30} L ${x} ${y - 50} L ${x + 26} ${y - 30}"/>
    <line x1="${x - 16}" y1="${y - 30}" x2="${x - 16}" y2="${y - 6}"/>
    <line x1="${x}" y1="${y - 30}" x2="${x}" y2="${y - 6}"/>
    <line x1="${x + 16}" y1="${y - 30}" x2="${x + 16}" y2="${y - 6}"/>
    <line x1="${x - 20}" y1="${y - 6}" x2="${x + 20}" y2="${y - 6}"/>
  </g>`;

// ── 西式元素（v0.4 / v0.5）───────────────────────────────────────────────

// 月桂枝（古希腊荣誉冠）
export const laurelBranch = (x, y, dir = 1, color = '#3a5a2a') => `
  <g stroke="${color}" stroke-width="1.4" fill="none" stroke-linecap="round">
    <path d="M ${x} ${y} q ${18 * dir} -8 ${40 * dir} -20 q ${20 * dir} -10 ${50 * dir} -34"/>
    ${Array.from({ length: 5 }, (_, i) => `<ellipse cx="${x + (8 + i * 16) * dir}" cy="${y - 6 - i * 6}" rx="6" ry="2.4" transform="rotate(${-20 * dir} ${x + (8 + i * 16) * dir} ${y - 6 - i * 6})" fill="${color}" opacity="0.75"/>`).join('')}
  </g>`;

// 罗马柱
export const pillar = (x, y, h = 140, color = '#7a7a8a') => `
  <g stroke="${color}" stroke-width="1.2" fill="none">
    <rect x="${x - 8}" y="${y - h}" width="16" height="${h - 10}" fill="${color}" opacity="0.4"/>
    <line x1="${x - 10}" y1="${y - h + 4}" x2="${x + 10}" y2="${y - h + 4}" stroke-width="2"/>
    <line x1="${x - 11}" y1="${y - h - 4}" x2="${x + 11}" y2="${y - h - 4}" stroke-width="2.2"/>
    <line x1="${x - 8}" y1="${y - 8}" x2="${x + 8}" y2="${y - 8}"/>
    <line x1="${x - 10}" y1="${y - 4}" x2="${x + 10}" y2="${y - 4}"/>
  </g>`;

// 拱门
export const arch = (x, y, w = 80, color = '#7a5a3a') => `
  <g stroke="${color}" stroke-width="1.6" fill="none">
    <path d="M ${x - w / 2} ${y} L ${x - w / 2} ${y - 60} Q ${x} ${y - 90} ${x + w / 2} ${y - 60} L ${x + w / 2} ${y} Z" fill="${color}" opacity="0.25"/>
    <path d="M ${x - w / 2 + 6} ${y} L ${x - w / 2 + 6} ${y - 60} Q ${x} ${y - 84} ${x + w / 2 - 6} ${y - 60} L ${x + w / 2 - 6} ${y}"/>
    <line x1="${x - w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y}"/>
  </g>`;

// 望远镜
export const telescope = (x, y, dir = 1, color = '#2a2a3a') => `
  <g stroke="${color}" stroke-width="1.4" fill="none">
    <line x1="${x}" y1="${y + 30}" x2="${x + 24 * dir}" y2="${y - 30}" stroke-width="3"/>
    <line x1="${x + 22 * dir}" y1="${y - 28}" x2="${x + 30 * dir}" y2="${y - 36}" stroke-width="4"/>
    <line x1="${x - 2}" y1="${y + 30}" x2="${x + 2}" y2="${y + 30}" stroke-width="2"/>
    <line x1="${x - 4}" y1="${y + 32}" x2="${x + 4}" y2="${y + 32}"/>
  </g>`;

// 鹅毛笔
export const quill = (x, y, dir = -1, color = '#2a2a2a') => `
  <g stroke="${color}" stroke-width="1.4" fill="none" stroke-linecap="round">
    <path d="M ${x} ${y} q ${14 * dir} -10 ${30 * dir} -30 q ${10 * dir} -6 ${20 * dir} -16"/>
    <path d="M ${x + 4 * dir} ${y - 4} q ${10 * dir} -4 ${18 * dir} -10" stroke-width="0.8" opacity="0.7"/>
    <path d="M ${x + 8 * dir} ${y - 12} q ${8 * dir} -4 ${16 * dir} -8" stroke-width="0.8" opacity="0.7"/>
  </g>`;

// 翻开的书
export const bookOpen = (x, y, w = 80, color = '#5a3a20', paper = '#f1e4c4') => `
  <g>
    <path d="M ${x - w / 2} ${y} Q ${x} ${y - 6} ${x + w / 2} ${y} L ${x + w / 2} ${y + 30} Q ${x} ${y + 24} ${x - w / 2} ${y + 30} Z" fill="${paper}" stroke="${color}" stroke-width="1.2"/>
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 26}" stroke="${color}" stroke-width="0.8"/>
    ${Array.from({ length: 4 }, (_, i) => `<line x1="${x - w / 2 + 6}" y1="${y + 6 + i * 6}" x2="${x - 8}" y2="${y + 6 + i * 6}" stroke="${color}" stroke-width="0.5" opacity="0.6"/>`).join('')}
    ${Array.from({ length: 4 }, (_, i) => `<line x1="${x + 8}" y1="${y + 6 + i * 6}" x2="${x + w / 2 - 6}" y2="${y + 6 + i * 6}" stroke="${color}" stroke-width="0.5" opacity="0.6"/>`).join('')}
  </g>`;

// 罗盘
export const compass = (x, y, r = 24, color = '#1a1a2a') => `
  <g stroke="${color}" stroke-width="1.2" fill="none">
    <circle cx="${x}" cy="${y}" r="${r}" fill="#f1e4c4" opacity="0.85"/>
    <circle cx="${x}" cy="${y}" r="${r - 4}"/>
    <line x1="${x}" y1="${y - r + 2}" x2="${x}" y2="${y + r - 2}"/>
    <line x1="${x - r + 2}" y1="${y}" x2="${x + r - 2}" y2="${y}"/>
    <path d="M ${x} ${y - r + 4} L ${x - 4} ${y} L ${x} ${y + r - 4} L ${x + 4} ${y} Z" fill="${color}" opacity="0.8"/>
  </g>`;

// 沙漏
export const hourglass = (x, y, h = 50, color = '#3a2a1a', sand = '#c89a4a') => `
  <g stroke="${color}" stroke-width="1.2" fill="none">
    <path d="M ${x - 14} ${y - h / 2} L ${x + 14} ${y - h / 2} L ${x} ${y} L ${x - 14} ${y + h / 2} L ${x + 14} ${y + h / 2} Z" fill="#f1e4c4" opacity="0.6"/>
    <line x1="${x - 16}" y1="${y - h / 2 - 2}" x2="${x + 16}" y2="${y - h / 2 - 2}" stroke-width="2"/>
    <line x1="${x - 16}" y1="${y + h / 2 + 2}" x2="${x + 16}" y2="${y + h / 2 + 2}" stroke-width="2"/>
    <path d="M ${x - 8} ${y + h / 2 - 4} L ${x + 8} ${y + h / 2 - 4} L ${x} ${y + h / 2 - 1}" fill="${sand}" opacity="0.85"/>
  </g>`;

// 齿轮
export const gear = (x, y, r = 22, color = '#3a3a4a') => `
  <g fill="${color}" opacity="0.85">
    ${Array.from({ length: 8 }, (_, i) => `<rect x="${x - 3}" y="${y - r - 4}" width="6" height="8" transform="rotate(${i * 45} ${x} ${y})"/>`).join('')}
    <circle cx="${x}" cy="${y}" r="${r}"/>
    <circle cx="${x}" cy="${y}" r="${r * 0.45}" fill="#f1e4c4"/>
  </g>`;

// 烧瓶
export const flask = (x, y, h = 60, color = '#7a9aaa', liquid = '#6a8a9a') => `
  <g stroke="${color}" stroke-width="1.2" fill="none">
    <line x1="${x - 4}" y1="${y - h / 2}" x2="${x + 4}" y2="${y - h / 2}"/>
    <path d="M ${x - 4} ${y - h / 2 + 2} L ${x - 4} ${y - 4} Q ${x - 18} ${y + 4} ${x - 18} ${y + h / 4} L ${x + 18} ${y + h / 4} Q ${x + 18} ${y + 4} ${x + 4} ${y - 4} L ${x + 4} ${y - h / 2 + 2} Z" fill="#f1e4c4" opacity="0.6"/>
    <path d="M ${x - 18} ${y + h / 4 - 12} L ${x + 18} ${y + h / 4 - 12} L ${x + 18} ${y + h / 4} L ${x - 18} ${y + h / 4} Z" fill="${liquid}" opacity="0.75"/>
  </g>`;

// 王冠/桂冠（抽象）
export const crown = (x, y, w = 50, color = '#9a7820') => `
  <g stroke="${color}" stroke-width="1.4" fill="none">
    <path d="M ${x - w / 2} ${y + 8} L ${x - w / 3} ${y - 4} L ${x - w / 6} ${y + 4} L ${x} ${y - 8} L ${x + w / 6} ${y + 4} L ${x + w / 3} ${y - 4} L ${x + w / 2} ${y + 8} Z" fill="${color}" opacity="0.7"/>
    <line x1="${x - w / 2 - 2}" y1="${y + 8}" x2="${x + w / 2 + 2}" y2="${y + 8}" stroke-width="2"/>
  </g>`;
