// scripts/portraits/figures.west-scientist.mjs
// 30 位科技巨擘（西方）的肖像设计数据
// 复用 common.mjs 的西方色板（classical/medieval/modernEarly/modernLate）
// 与西式元素（laurelBranch / pillar / arch / telescope / quill / bookOpen /
//              compass / hourglass / gear / flask / crown）
// 与通用工具（mountains / water / moon / cloud / candle）

import {
  laurelBranch, pillar, arch, telescope, quill, bookOpen,
  compass, hourglass, gear, flask, crown, candle,
  mountains, water, moon, cloud,
} from './common.mjs';

export const FIGURES_WEST_SCIENTIST = [
  // ── A 极端外 ──
  {
    id: 'copernicus', name: '哥白尼', era: 'modernEarly', seal: '日心说',
    motto: ['天体运行', '日心之论'], caption: '日心之论',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${moon(p.ground, 380, 110, 18)}
        ${cloud(120, 150, 70, p.ground)}
        <!-- 天体仪 -->
        <g transform="translate(240 320)" stroke="${ink}" stroke-width="1.4" fill="none">
          <circle cx="0" cy="0" r="60" fill="${p.secondary}" opacity="0.4"/>
          <circle cx="0" cy="0" r="50"/>
          <ellipse cx="0" cy="0" rx="60" ry="20" stroke="${p.ink}"/>
          <ellipse cx="0" cy="0" rx="50" ry="40"/>
          <circle cx="0" cy="0" r="6" fill="${p.seal}"/>
          <circle cx="40" cy="0" r="3" fill="${p.accent}"/>
          <circle cx="-30" cy="20" r="3" fill="${p.accent}"/>
          <circle cx="0" cy="-40" r="3" fill="${p.accent}"/>
        </g>
        ${compass(140, 400, 22, p.ink)}
        ${bookOpen(340, 400, 80, p.ink, p.ground)}
        <!-- 站者 -->
        <g transform="translate(180 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        ${laurelBranch(380, 380, -1, p.accent)}`;
    },
  },
  {
    id: 'galileo', name: '伽利略', era: 'modernEarly', seal: '斜塔实验',
    motto: ['以实验为据', '然其所以然'], caption: '斜塔之验',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${moon(p.ground, 100, 110, 18)}
        ${cloud(360, 150, 70, p.ground)}
        <!-- 斜塔 -->
        <g transform="translate(140 460)" fill="${p.primary}" opacity="0.85">
          <path d="M -20 0 L 16 -180 L 30 0 Z" fill="${p.seal}" opacity="0.6"/>
          <rect x="-18" y="0" width="46" height="-10" fill="${p.ink}"/>
        </g>
        ${telescope(360, 360, 1, p.ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 望远镜下的星辰 -->
        <g transform="translate(380 160)" fill="${p.seal}" opacity="0.85">
          <circle cx="0" cy="0" r="2"/>
          <circle cx="-12" cy="6" r="1.5"/>
          <circle cx="14" cy="-4" r="1.5"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        ${laurelBranch(80, 360, 1, p.accent)}`;
    },
  },
  {
    id: 'newton', name: '牛顿', era: 'modernEarly', seal: '万有引力',
    motto: ['苹果落地', '万有之理'], caption: '万有之理',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 140, 80, p.ground)}
        <!-- 苹果树 -->
        <g transform="translate(140 460)">
          <line x1="0" y1="0" x2="-8" y2="-160" stroke="${p.ink}" stroke-width="6"/>
          <line x1="-4" y1="-80" x2="20" y2="-100" stroke="${p.ink}" stroke-width="4"/>
          <line x1="-4" y1="-120" x2="-30" y2="-140" stroke="${p.ink}" stroke-width="4"/>
          <ellipse cx="20" cy="-110" rx="32" ry="24" fill="${p.accent}" opacity="0.85"/>
          <ellipse cx="-30" cy="-150" rx="28" ry="22" fill="${p.accent}" opacity="0.85"/>
          <circle cx="14" cy="-100" r="4" fill="${p.seal}"/>
          <circle cx="-26" cy="-138" r="4" fill="${p.seal}"/>
        </g>
        <!-- 棱镜 -->
        <g transform="translate(360 320)">
          <polygon points="0,-20 16,12 -16,12" fill="${p.accent}" stroke="${p.ink}" stroke-width="1.4" opacity="0.85"/>
          <line x1="-30" y1="-4" x2="0" y2="-4" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="-30" y1="-4" x2="-30" y2="-12" stroke="${p.ink}" stroke-width="1.4"/>
          ${Array.from({ length: 5 }, (_, i) => `<line x1="16" y1="${4 + i * 4}" x2="44" y2="${4 + i * 4}" stroke="${p.seal}" stroke-width="0.8" opacity="${0.5 + i * 0.1}"/>`).join('')}
        </g>
        ${bookOpen(360, 420, 80, p.ink, p.ground)}
        <!-- 坐者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        ${laurelBranch(60, 200, 1, p.accent)}`;
    },
  },
  {
    id: 'einstein', name: '爱因斯坦', era: 'modernLate', seal: '相对论',
    motto: ['E=mc²', '时空之曲'], caption: '时空之曲',
    buildScene(p, ink) {
      return `
        <!-- 远山 -->
        <path d="M 0 360 L 80 280 L 160 320 L 240 240 L 320 310 L 400 270 L 480 340 L 480 480 L 0 480 Z" fill="${p.primary}" opacity="0.6"/>
        <path d="M 0 380 L 100 320 L 200 360 L 300 300 L 400 350 L 480 320 L 480 480 L 0 480 Z" fill="${p.secondary}" opacity="0.7"/>
        ${moon(p.ground, 100, 110, 18)}
        <!-- 相对论公式 -->
        <g transform="translate(360 240)" stroke="${p.seal}" stroke-width="2" fill="none" opacity="0.95">
          <text x="0" y="0" font-family="serif" font-size="20" fill="${p.seal}" font-weight="700">E=mc²</text>
        </g>
        <!-- 钟表（时间） -->
        <g transform="translate(140 360)">
          <circle cx="0" cy="0" r="20" fill="${p.ground}" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="0" y1="0" x2="0" y2="-14" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="0" y1="0" x2="10" y2="0" stroke="${p.ink}" stroke-width="1.4"/>
          <circle cx="0" cy="0" r="2" fill="${p.seal}"/>
        </g>
        ${bookOpen(360, 400, 80, p.ink, p.ground)}
        <!-- 立者 -->
        <g transform="translate(240 380)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
          <!-- 蓬发 -->
          <path d="M -10 -28 q 10 -10 20 0" stroke="${ink}" stroke-width="2" fill="none"/>
        </g>`;
    },
  },
  {
    id: 'curie', name: '居里夫人', era: 'modernLate', seal: '镭之光',
    motto: ['镭光夜荧', '双诺之荣'], caption: '镭之微光',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${flask(160, 400, 70, p.primary, p.seal)}
        ${laurelBranch(80, 380, 1, p.accent)}
        ${laurelBranch(400, 380, -1, p.accent)}
        ${bookOpen(360, 420, 80, p.ink, p.ground)}
        <!-- 镭光 -->
        <g transform="translate(160 360)">
          ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="-30" x2="${Math.cos((i / 6) * Math.PI * 2) * 14}" y2="${-30 + Math.sin((i / 6) * Math.PI * 2) * 14}" stroke="${p.seal}" stroke-width="1.4" opacity="0.8"/>`).join('')}
        </g>
        <!-- 立者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'feynman', name: '费曼', era: 'modernLate', seal: '路径积分',
    motto: ['路径求和', '邦戈鼓手'], caption: '路径之舞',
    buildScene(p, ink) {
      return `
        ${cloud(120, 140, 70, p.ground)}
        ${cloud(360, 150, 60, p.ground)}
        <!-- 路径图（费曼图） -->
        <g transform="translate(140 280)" stroke="${p.ink}" stroke-width="1.4" fill="none">
          <line x1="0" y1="0" x2="40" y2="-30"/>
          <line x1="40" y1="-30" x2="80" y2="0"/>
          <path d="M 0 0 q 20 30 40 30 q 20 0 40 -30" stroke="${p.seal}" stroke-width="1.2" stroke-dasharray="2 2"/>
          <circle cx="0" cy="0" r="3" fill="${p.ink}"/>
          <circle cx="40" cy="-30" r="3" fill="${p.ink}"/>
          <circle cx="80" cy="0" r="3" fill="${p.ink}"/>
        </g>
        ${quill(380, 380, -1, p.ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 鼓（邦戈） -->
        <g transform="translate(360 400)">
          <ellipse cx="0" cy="0" rx="18" ry="6" fill="${p.secondary}" stroke="${p.ink}" stroke-width="1.2"/>
          <ellipse cx="0" cy="-2" rx="14" ry="3" fill="${p.ground}"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── B 偏外 ──
  {
    id: 'kepler', name: '开普勒', era: 'modernEarly', seal: '和谐之律',
    motto: ['三大定律', '宇宙之和'], caption: '天籁之和',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${moon(p.ground, 380, 110, 18)}
        ${cloud(120, 150, 70, p.ground)}
        <!-- 椭圆轨道 -->
        <g transform="translate(240 320)" stroke="${ink}" stroke-width="1.2" fill="none">
          <ellipse cx="0" cy="0" rx="60" ry="30" fill="${p.secondary}" opacity="0.4"/>
          <circle cx="20" cy="0" r="4" fill="${p.seal}"/>
          <circle cx="-40" cy="-12" r="3" fill="${p.accent}"/>
          <circle cx="-30" cy="20" r="2" fill="${p.accent}"/>
        </g>
        ${compass(140, 400, 22, p.ink)}
        ${bookOpen(360, 420, 80, p.ink, p.ground)}
        <!-- 站者 -->
        <g transform="translate(180 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        ${laurelBranch(400, 380, -1, p.accent)}`;
    },
  },
  {
    id: 'leibniz', name: '莱布尼茨', era: 'modernEarly', seal: '单子论',
    motto: ['微积分之创', '最好世界'], caption: '最好世界',
    buildScene(p, ink) {
      return `
        ${pillar(80, 460, 200, p.primary)}
        ${pillar(400, 460, 200, p.primary)}
        ${quill(180, 380, 1, p.ink)}
        ${bookOpen(320, 400, 80, p.ink, p.ground)}
        <!-- 算盘（计算之器） -->
        <g transform="translate(140 380)" fill="${p.secondary}" stroke="${p.ink}" stroke-width="1">
          <rect x="-30" y="-10" width="60" height="20" fill="${p.ground}"/>
          <line x1="-30" y1="0" x2="30" y2="0" stroke="${p.ink}" stroke-width="0.8"/>
          <line x1="-30" y1="-4" x2="30" y2="-4" stroke="${p.ink}" stroke-width="0.6"/>
          ${Array.from({ length: 8 }, (_, i) => `<circle cx="${-26 + i * 7}" cy="-7" r="2" fill="${p.seal}"/>`).join('')}
        </g>
        <!-- 坐者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'darwin', name: '达尔文', era: 'modernLate', seal: '物种起源',
    motto: ['贝格尔之航', '最适者存'], caption: '物种之迁',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(120, 140, 70, p.ground)}
        ${water(p.primary, 440)}
        ${telescope(380, 360, -1, p.ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 植物标本（藤蔓） -->
        <g transform="translate(180 360)" stroke="${p.ink}" stroke-width="1" fill="none">
          <path d="M 0 0 q -10 -20 -4 -40 q 4 -10 14 -16"/>
          <ellipse cx="-4" cy="-40" rx="6" ry="3" transform="rotate(-30 -4 -40)" fill="${p.accent}" opacity="0.85"/>
          <ellipse cx="10" cy="-56" rx="6" ry="3" transform="rotate(20 10 -56)" fill="${p.accent}" opacity="0.85"/>
        </g>
        <!-- 树 -->
        <g transform="translate(360 400)">
          <line x1="0" y1="0" x2="0" y2="-60" stroke="${p.ink}" stroke-width="3"/>
          <ellipse cx="0" cy="-70" rx="20" ry="16" fill="${p.accent}" opacity="0.85"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'faraday', name: '法拉第', era: 'modernLate', seal: '电磁感应',
    motto: ['磁可生电', '圣诞讲座'], caption: '电磁之转',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${candle(360, 380, ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 磁铁（U 形） -->
        <g transform="translate(240 320)">
          <path d="M -30 -40 L -30 0 L -10 0 L -10 -30 L 10 -30 L 10 0 L 30 0 L 30 -40" fill="${p.ink}" stroke="${p.ink}" stroke-width="1.4"/>
          <text x="-20" y="-46" font-family="serif" font-size="12" fill="${p.ink}" font-weight="700">N</text>
          <text x="14" y="-46" font-family="serif" font-size="12" fill="${p.ink}" font-weight="700">S</text>
        </g>
        <!-- 线圈（电流） -->
        <g transform="translate(240 380)" fill="none" stroke="${p.seal}" stroke-width="1.6">
          <path d="M -50 0 L -40 12 L -20 -4 L 0 12 L 20 -4 L 40 12 L 50 0"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(380 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 50 L 22 50 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'planck', name: '普朗克', era: 'modernLate', seal: '量子之始',
    motto: ['能量量子', '以粒为度'], caption: '能量之粒',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${candle(80, 380, ink)}
        ${bookOpen(360, 420, 80, p.ink, p.ground)}
        <!-- 黑体辐射图（曲线） -->
        <g transform="translate(240 320)" fill="none" stroke="${p.ink}" stroke-width="1.4">
          <line x1="-50" y1="20" x2="50" y2="20"/>
          <line x1="-50" y1="20" x2="-50" y2="-40"/>
          <path d="M -50 20 Q -30 -20 0 -32 Q 30 -28 50 16" stroke="${p.seal}" stroke-width="1.8"/>
        </g>
        <!-- 量子（离散点） -->
        <g fill="${p.seal}" opacity="0.85">
          <circle cx="-30" cy="-15" r="2"/>
          <circle cx="-15" cy="-26" r="2"/>
          <circle cx="0" cy="-30" r="2"/>
          <circle cx="15" cy="-26" r="2"/>
          <circle cx="30" cy="-15" r="2"/>
        </g>
        <!-- 坐者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'heisenberg', name: '海森堡', era: 'modernLate', seal: '不确定性',
    motto: ['愈精愈昧', '矩阵之始'], caption: '知之有涯',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${hourglass(380, 400, 60, p.ink, p.seal)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 矩阵 -->
        <g transform="translate(240 300)" fill="none" stroke="${p.ink}" stroke-width="1.4">
          <rect x="-30" y="-30" width="60" height="60"/>
          <line x1="-30" y1="-10" x2="30" y2="-10"/>
          <line x1="-30" y1="10" x2="30" y2="10"/>
          <line x1="-10" y1="-30" x2="-10" y2="30"/>
          <line x1="10" y1="-30" x2="10" y2="30"/>
          <text x="0" y="-16" text-anchor="middle" font-family="serif" font-size="10" fill="${p.seal}">a</text>
          <text x="0" y="4" text-anchor="middle" font-family="serif" font-size="10" fill="${p.seal}">b</text>
          <text x="0" y="24" text-anchor="middle" font-family="serif" font-size="10" fill="${p.seal}">c</text>
        </g>
        <!-- 坐者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── C 中段 ──
  {
    id: 'lavoisier', name: '拉瓦锡', era: 'modernEarly', seal: '氧化之理',
    motto: ['物不生灭', '燃素之破'], caption: '物不生灭',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${flask(140, 380, 60, p.primary, p.seal)}
        ${bookOpen(360, 420, 80, p.ink, p.ground)}
        <!-- 天平 -->
        <g transform="translate(240 360)">
          <line x1="0" y1="-40" x2="0" y2="0" stroke="${p.ink}" stroke-width="2"/>
          <line x1="-30" y1="-30" x2="30" y2="-30" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="0" y1="0" x2="-20" y2="20" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="0" y1="0" x2="20" y2="20" stroke="${p.ink}" stroke-width="1.4"/>
          <ellipse cx="-30" cy="-26" rx="8" ry="3" fill="${p.secondary}"/>
          <ellipse cx="30" cy="-26" rx="8" ry="3" fill="${p.secondary}"/>
          <rect x="-12" y="0" width="24" height="6" fill="${p.ink}"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 380)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 50 L 22 50 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'maxwell', name: '麦克斯韦', era: 'modernLate', seal: '四方程',
    motto: ['光电磁一', '四方程立'], caption: '电磁之统',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${compass(380, 400, 22, p.ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 电磁波（正弦波） -->
        <g transform="translate(240 280)" fill="none" stroke="${p.ink}" stroke-width="1.4">
          <path d="M -80 0 Q -60 -20 -40 0 T 0 0 T 40 0 T 80 0" stroke="${p.seal}" stroke-width="1.8"/>
          <path d="M -80 30 Q -60 10 -40 30 T 0 30 T 40 30 T 80 30" stroke="${p.accent}" stroke-width="1.4" opacity="0.7"/>
        </g>
        <!-- 方程文字 -->
        <g transform="translate(360 280)" font-family="serif" font-size="11" fill="${p.seal}" font-weight="700">
          <text x="0" y="0">∇·E = ρ/ε₀</text>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'mendel', name: '孟德尔', era: 'modernLate', seal: '遗传之律',
    motto: ['豌豆八年', '形色之因'], caption: '豌豆之因',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${quill(380, 380, -1, p.ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 豌豆（多株） -->
        <g transform="translate(360 360)">
          <line x1="-20" y1="40" x2="-20" y2="0" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="0" y1="40" x2="0" y2="-10" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="20" y1="40" x2="20" y2="0" stroke="${p.ink}" stroke-width="1.4"/>
          <ellipse cx="-20" cy="0" rx="6" ry="3" fill="${p.accent}" stroke="${p.ink}" stroke-width="0.6"/>
          <ellipse cx="0" cy="-12" rx="6" ry="3" fill="${p.seal}" stroke="${p.ink}" stroke-width="0.6"/>
          <ellipse cx="20" cy="0" rx="6" ry="3" fill="${p.accent}" stroke="${p.ink}" stroke-width="0.6"/>
          <path d="M -20 0 q 0 20 0 40 M 0 -10 q 0 30 0 50 M 20 0 q 0 20 0 40" fill="none" stroke="${p.ink}" stroke-width="1.4"/>
        </g>
        <!-- 坐者 -->
        <g transform="translate(220 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'hertz', name: '赫兹', era: 'modernLate', seal: '电磁波证',
    motto: ['波之有验', '赫兹之频'], caption: '波之有验',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${candle(380, 380, ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 天线（双球） -->
        <g transform="translate(240 320)" fill="none" stroke="${p.ink}" stroke-width="1.4">
          <line x1="0" y1="0" x2="0" y2="-60"/>
          <circle cx="0" cy="-66" r="8" fill="${p.seal}"/>
          <line x1="-30" y1="0" x2="30" y2="0" stroke="${p.ink}" stroke-width="1.6"/>
          <line x1="-30" y1="0" x2="-30" y2="-30" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="30" y1="0" x2="30" y2="-30" stroke="${p.ink}" stroke-width="1.4"/>
          <circle cx="-30" cy="-36" r="6" fill="${p.accent}"/>
          <circle cx="30" cy="-36" r="6" fill="${p.accent}"/>
        </g>
        <!-- 波纹 -->
        <g transform="translate(240 260)" fill="none" stroke="${p.seal}" stroke-width="1" opacity="0.85">
          <path d="M -30 0 q 30 -16 60 0"/>
          <path d="M -40 8 q 40 -20 80 0" opacity="0.6"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'bohr', name: '玻尔', era: 'modernLate', seal: '原子之模',
    motto: ['分阶之轨', '互补之理'], caption: '原子之阶',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${laurelBranch(80, 380, 1, p.accent)}
        ${laurelBranch(400, 380, -1, p.accent)}
        ${bookOpen(360, 420, 80, p.ink, p.ground)}
        <!-- 原子模型 -->
        <g transform="translate(240 300)" fill="none" stroke="${p.ink}" stroke-width="1.4">
          <circle cx="0" cy="0" r="6" fill="${p.seal}"/>
          <ellipse cx="0" cy="0" rx="30" ry="10" stroke="${p.ink}"/>
          <ellipse cx="0" cy="0" rx="30" ry="10" transform="rotate(60)" stroke="${p.ink}"/>
          <ellipse cx="0" cy="0" rx="30" ry="10" transform="rotate(-60)" stroke="${p.ink}"/>
          <circle cx="30" cy="0" r="3" fill="${p.accent}"/>
          <circle cx="-15" cy="-26" r="3" fill="${p.accent}"/>
          <circle cx="-15" cy="26" r="3" fill="${p.accent}"/>
        </g>
        <!-- 坐者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'wiener', name: '维纳', era: 'modernLate', seal: '控制论',
    motto: ['反馈之环', '神童博士'], caption: '反馈之环',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${gear(380, 360, 18, p.ink)}
        ${gear(420, 320, 12, p.ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 反馈环 -->
        <g transform="translate(240 320)" fill="none" stroke="${p.ink}" stroke-width="1.6">
          <ellipse cx="0" cy="0" rx="50" ry="22" stroke="${p.seal}"/>
          <path d="M -50 0 L -56 0" stroke="${p.seal}" stroke-width="2"/>
          <path d="M -56 0 L -50 -8" stroke="${p.seal}" stroke-width="2"/>
          <text x="0" y="4" text-anchor="middle" font-family="serif" font-size="11" fill="${p.seal}" font-weight="700">反馈</text>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── D 偏内 ──
  {
    id: 'franklin', name: '富兰克林', era: 'modernEarly', seal: '风筝引电',
    motto: ['风筝引天电', '公共之人'], caption: '风筝引电',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 130, 80, p.ground)}
        ${cloud(340, 150, 70, p.ground)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 风筝 -->
        <g transform="translate(240 220)">
          <path d="M -16 0 L 16 0 L 0 30 Z" fill="${p.secondary}" stroke="${p.ink}" stroke-width="1.4"/>
          <path d="M -16 0 L 16 0" stroke="${p.ink}" stroke-width="1.4"/>
          <path d="M 0 -10 L 0 30" stroke="${p.ink}" stroke-width="0.8"/>
          <path d="M 0 30 Q 0 80 0 160" stroke="${p.ink}" stroke-width="0.8" fill="none"/>
          <circle cx="0" cy="0" r="2" fill="${p.seal}"/>
        </g>
        <!-- 钥匙 -->
        <g transform="translate(240 400)" fill="${p.seal}">
          <circle cx="0" cy="0" r="6" stroke="${p.ink}" stroke-width="0.8"/>
          <rect x="6" y="-2" width="40" height="4"/>
          <rect x="40" y="-4" width="4" height="8"/>
        </g>
        <!-- 闪电 -->
        <path d="M 220 130 L 200 200 L 240 180 L 210 250" fill="${p.seal}" opacity="0.85" stroke="${p.ink}" stroke-width="0.6"/>
        <!-- 站者 -->
        <g transform="translate(180 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'edison', name: '爱迪生', era: 'modernLate', seal: '一灯之微',
    motto: ['千次试灯', '百分汗水'], caption: '一灯之微',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${gear(80, 380, 16, p.ink)}
        ${gear(420, 400, 14, p.ink)}
        ${gear(400, 360, 10, p.ink)}
        ${bookOpen(360, 420, 80, p.ink, p.ground)}
        <!-- 灯泡 -->
        <g transform="translate(240 320)">
          <path d="M -16 0 Q -16 -28 0 -28 Q 16 -28 16 0 L 14 14 L -14 14 Z" fill="${p.seal}" opacity="0.7" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="-12" y1="14" x2="12" y2="14" stroke="${p.ink}" stroke-width="2"/>
          <line x1="-10" y1="20" x2="10" y2="20" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="-8" y1="26" x2="8" y2="26" stroke="${p.ink}" stroke-width="1.4"/>
          <path d="M -8 -10 q 8 6 16 0" stroke="${p.ground}" stroke-width="1.4" fill="none"/>
          <!-- 光线 -->
          ${Array.from({ length: 6 }, (_, i) => `<line x1="${Math.cos((i / 6) * Math.PI * 2) * 22}" y1="${-30 + Math.sin((i / 6) * Math.PI * 2) * 22}" x2="${Math.cos((i / 6) * Math.PI * 2) * 30}" y2="${-30 + Math.sin((i / 6) * Math.PI * 2) * 30}" stroke="${p.seal}" stroke-width="1.4" opacity="0.7"/>`).join('')}
        </g>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'nobel', name: '诺贝尔', era: 'modernLate', seal: '炸药之父',
    motto: ['以炸为器', '诺奖之设'], caption: '爆裂之光',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${candle(380, 380, ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 炸药筒 -->
        <g transform="translate(240 360)">
          <rect x="-20" y="-30" width="40" height="60" fill="${p.secondary}" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="-20" y1="-20" x2="20" y2="-20" stroke="${p.ink}" stroke-width="0.6"/>
          <line x1="-20" y1="-10" x2="20" y2="-10" stroke="${p.ink}" stroke-width="0.6"/>
          <line x1="-20" y1="0" x2="20" y2="0" stroke="${p.ink}" stroke-width="0.6"/>
          <line x1="-20" y1="10" x2="20" y2="10" stroke="${p.ink}" stroke-width="0.6"/>
          <line x1="-20" y1="20" x2="20" y2="20" stroke="${p.ink}" stroke-width="0.6"/>
          <text x="0" y="6" text-anchor="middle" font-family="serif" font-size="12" fill="${p.seal}" font-weight="700">N</text>
          <line x1="0" y1="-30" x2="0" y2="-50" stroke="${p.ink}" stroke-width="1.4"/>
          <path d="M -6 -50 L 0 -56 L 6 -50" fill="${p.ink}"/>
        </g>
        <!-- 火花 -->
        <g transform="translate(240 300)">
          ${Array.from({ length: 4 }, (_, i) => `<line x1="${-10 + i * 6}" y1="0" x2="${-6 + i * 4}" y2="-8" stroke="${p.seal}" stroke-width="1.4" opacity="0.85"/>`).join('')}
        </g>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'turing', name: '图灵', era: 'modernLate', seal: '图灵机',
    motto: ['可计算者', '机以测人'], caption: '可计算者',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${gear(400, 380, 14, p.ink)}
        ${gear(440, 340, 10, p.ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 打字机 -->
        <g transform="translate(360 360)">
          <rect x="-30" y="0" width="60" height="20" fill="${p.secondary}" stroke="${p.ink}" stroke-width="1.4"/>
          <rect x="-30" y="-10" width="60" height="10" fill="${p.ink}"/>
          ${Array.from({ length: 6 }, (_, i) => `<rect x="${-26 + i * 10}" y="-12" width="6" height="6" fill="${p.ground}"/>`).join('')}
          <line x1="0" y1="-10" x2="0" y2="-30" stroke="${p.ink}" stroke-width="1.4"/>
          <ellipse cx="0" cy="-32" rx="14" ry="3" fill="${p.ground}"/>
        </g>
        <!-- 0/1 二进制 -->
        <g transform="translate(140 360)" font-family="serif" font-size="12" fill="${p.seal}" font-weight="700">
          <text x="0" y="0">10110</text>
          <text x="0" y="14">01001</text>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'shannon', name: '香农', era: 'modernLate', seal: '信息论',
    motto: ['去芜存菁', '杂耍之癖'], caption: '信息之度',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${quill(380, 380, -1, p.ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 电路图 -->
        <g transform="translate(360 320)" fill="none" stroke="${p.ink}" stroke-width="1.4">
          <line x1="-30" y1="-20" x2="-10" y2="-20"/>
          <line x1="-30" y1="0" x2="-10" y2="0"/>
          <line x1="-30" y1="20" x2="-10" y2="20"/>
          <rect x="-10" y="-30" width="20" height="60" fill="${p.secondary}" opacity="0.6"/>
          <line x1="10" y1="-20" x2="30" y2="-20"/>
          <line x1="10" y1="0" x2="30" y2="0"/>
          <line x1="10" y1="20" x2="30" y2="20"/>
          <circle cx="-10" cy="-20" r="3" fill="${p.ink}"/>
          <circle cx="10" cy="-20" r="3" fill="${p.ink}"/>
        </g>
        <!-- 比特 -->
        <g transform="translate(140 360)" font-family="serif" font-size="11" fill="${p.seal}" font-weight="700">
          <text x="0" y="0">bit = 0/1</text>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'vonneumann', name: '冯·诺依曼', era: 'modernLate', seal: '计算机父',
    motto: ['存算之合', '神童之智'], caption: '存算之合',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${gear(80, 380, 14, p.ink)}
        ${gear(420, 400, 12, p.ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 计算机方框图 -->
        <g transform="translate(360 320)" fill="${p.secondary}" stroke="${p.ink}" stroke-width="1.4">
          <rect x="-30" y="-30" width="60" height="20"/>
          <rect x="-30" y="0" width="28" height="20"/>
          <rect x="2" y="0" width="28" height="20"/>
          <text x="0" y="-16" text-anchor="middle" font-family="serif" font-size="10" fill="${p.ink}" font-weight="700">CPU</text>
          <text x="-16" y="14" text-anchor="middle" font-family="serif" font-size="9" fill="${p.ink}">存</text>
          <text x="16" y="14" text-anchor="middle" font-family="serif" font-size="9" fill="${p.ink}">算</text>
          <line x1="0" y1="-10" x2="0" y2="0" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="-16" y1="20" x2="-16" y2="30" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="16" y1="20" x2="16" y2="30" stroke="${p.ink}" stroke-width="1.4"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -22 50 L 22 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── E 极端内 ──
  {
    id: 'archimedes', name: '阿基米德', era: 'classical', seal: '尤里卡',
    motto: ['浴缸悟理', '勿动吾圆'], caption: '尤里卡',
    buildScene(p, ink) {
      return `
        ${pillar(80, 460, 200, p.primary)}
        ${pillar(400, 460, 200, p.primary)}
        ${arch(240, 460, 220, p.primary)}
        ${crown(140, 280, 50, p.seal)}
        ${bookOpen(360, 420, 80, p.ink, p.ground)}
        <!-- 浴缸水纹 -->
        <g transform="translate(240 400)" fill="none" stroke="${p.secondary}" stroke-width="1.2" opacity="0.85">
          <ellipse cx="0" cy="0" rx="60" ry="14" fill="${p.secondary}" opacity="0.4"/>
          <path d="M -50 -4 q 10 -4 20 0 q 10 4 20 0 q 10 -4 20 0"/>
          <path d="M -56 4 q 14 -4 28 0 q 14 4 28 0 q 14 -4 28 0"/>
        </g>
        <!-- 几何（圆与球） -->
        <g transform="translate(140 380)" fill="none" stroke="${p.seal}" stroke-width="1.4">
          <circle cx="0" cy="0" r="14"/>
          <circle cx="0" cy="0" r="6" fill="${p.seal}" opacity="0.6"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'euler', name: '欧拉', era: 'modernEarly', seal: '最美公式',
    motto: ['e的i派加一', '心算之强'], caption: '心算之强',
    buildScene(p, ink) {
      return `
        ${pillar(80, 460, 200, p.primary)}
        ${pillar(400, 460, 200, p.primary)}
        ${quill(180, 380, 1, p.ink)}
        ${bookOpen(320, 420, 80, p.ink, p.ground)}
        <!-- 公式 e^{iπ}+1=0 -->
        <g transform="translate(240 280)" stroke="${p.seal}" stroke-width="2" fill="${p.seal}">
          <text x="0" y="0" text-anchor="middle" font-family="serif" font-size="18" font-weight="700">e^iπ + 1 = 0</text>
        </g>
        <!-- 公式 e=mc² -->
        <g transform="translate(140 360)" stroke="${p.ink}" stroke-width="1.4" fill="${p.ink}">
          <text x="0" y="0" font-family="serif" font-size="11" font-weight="700">∑ 1/n² = π²/6</text>
        </g>
        <!-- 坐者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'gauss', name: '高斯', era: 'modernLate', seal: '正十七边',
    motto: ['少言多思', '十九岁之解'], caption: '正十七边',
    buildScene(p, ink) {
      return `
        ${pillar(80, 460, 200, p.primary)}
        ${pillar(400, 460, 200, p.primary)}
        ${bookOpen(360, 420, 80, p.ink, p.ground)}
        <!-- 钟表 -->
        <g transform="translate(140 360)">
          <circle cx="0" cy="0" r="22" fill="${p.ground}" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="0" y1="0" x2="0" y2="-14" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="0" y1="0" x2="12" y2="0" stroke="${p.ink}" stroke-width="1.4"/>
          <circle cx="0" cy="0" r="2" fill="${p.seal}"/>
        </g>
        <!-- 正十七边形 -->
        <g transform="translate(240 280)" fill="none" stroke="${p.seal}" stroke-width="1.4">
          ${Array.from({ length: 17 }, (_, i) => {
            const a1 = (i / 17) * Math.PI * 2;
            const a2 = ((i + 1) / 17) * Math.PI * 2;
            return `<line x1="${Math.cos(a1) * 36}" y1="${Math.sin(a1) * 36}" x2="${Math.cos(a2) * 36}" y2="${Math.sin(a2) * 36}"/>`;
          }).join('')}
          <circle cx="0" cy="0" r="36"/>
          <circle cx="0" cy="0" r="3" fill="${p.seal}"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'halley', name: '哈雷', era: 'modernEarly', seal: '彗星之期',
    motto: ['彗星有期', '出版《原理》'], caption: '彗星之期',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${moon(p.ground, 100, 110, 18)}
        ${cloud(360, 150, 70, p.ground)}
        ${telescope(380, 360, -1, p.ink)}
        ${bookOpen(140, 420, 80, p.ink, p.ground)}
        <!-- 彗星 -->
        <g transform="translate(220 200)">
          <circle cx="0" cy="0" r="6" fill="${p.seal}"/>
          <path d="M 0 0 q 20 -20 60 -30 q 30 -8 50 0" stroke="${p.seal}" stroke-width="3" fill="none" opacity="0.6"/>
          <path d="M 0 0 q 20 14 60 14 q 30 0 50 -6" stroke="${p.accent}" stroke-width="1.4" fill="none" opacity="0.6"/>
        </g>
        <!-- 星轨（椭圆） -->
        <g transform="translate(240 320)" fill="none" stroke="${p.secondary}" stroke-width="1" opacity="0.7">
          <ellipse cx="0" cy="0" rx="80" ry="20"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(180 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'cavendish', name: '卡文迪许', era: 'modernEarly', seal: '称量地球',
    motto: ['扭秤测引', '地球之重'], caption: '称量地球',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${flask(140, 400, 60, p.primary, p.seal)}
        ${bookOpen(360, 420, 80, p.ink, p.ground)}
        <!-- 扭秤 -->
        <g transform="translate(240 340)">
          <!-- 木箱 -->
          <rect x="-50" y="-20" width="100" height="60" fill="none" stroke="${p.ink}" stroke-width="1.2" stroke-dasharray="2 2"/>
          <!-- 吊丝 -->
          <line x1="0" y1="-50" x2="0" y2="-20" stroke="${p.ink}" stroke-width="0.6"/>
          <!-- 横杆 -->
          <line x1="-40" y1="-20" x2="40" y2="-20" stroke="${p.ink}" stroke-width="1.4"/>
          <!-- 铅球 -->
          <circle cx="-40" cy="-20" r="6" fill="${p.seal}"/>
          <circle cx="40" cy="-20" r="6" fill="${p.seal}"/>
          <!-- 外侧大铅球 -->
          <circle cx="-40" cy="20" r="14" fill="${p.ink}"/>
          <circle cx="40" cy="20" r="14" fill="${p.ink}"/>
          <!-- 刻度 -->
          <line x1="0" y1="-30" x2="0" y2="-50" stroke="${p.seal}" stroke-width="0.8"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'schrodinger', name: '薛定谔', era: 'modernLate', seal: '生死之猫',
    motto: ['猫之生死', '波函数'], caption: '猫之生死',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 150, 70, p.ground)}
        ${hourglass(380, 400, 60, p.ink, p.seal)}
        ${bookOpen(360, 420, 80, p.ink, p.ground)}
        <!-- 箱中猫（半透半实） -->
        <g transform="translate(240 340)">
          <rect x="-40" y="-20" width="80" height="40" fill="none" stroke="${p.ink}" stroke-width="1.4" stroke-dasharray="3 3"/>
          <!-- 猫影（半虚） -->
          <ellipse cx="0" cy="0" rx="14" ry="10" fill="${p.seal}" opacity="0.4"/>
          <ellipse cx="-10" cy="-10" rx="6" ry="6" fill="${p.ink}" opacity="0.85"/>
          <line x1="-12" y1="-12" x2="-14" y2="-16" stroke="${p.ink}" stroke-width="0.8"/>
          <line x1="-8" y1="-12" x2="-6" y2="-16" stroke="${p.ink}" stroke-width="0.8"/>
          <line x1="14" y1="0" x2="22" y2="-2" stroke="${p.ink}" stroke-width="1.2"/>
          <path d="M 22 -2 q 4 0 6 -2 q -2 4 -2 6" fill="${p.ink}"/>
        </g>
        <!-- ψ 符号 -->
        <g transform="translate(140 280)" stroke="${p.seal}" stroke-width="2" fill="${p.seal}">
          <text x="0" y="0" text-anchor="middle" font-family="serif" font-size="22" font-weight="700">ψ</text>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
];
