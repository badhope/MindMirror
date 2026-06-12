// scripts/portraits/figures.east-statesman.mjs
// 30 位治国能臣的肖像设计数据
// 复用 common.mjs 的元素和调色板

import {
  mountains, water, moon, branch, bamboo, pavilion, cottage, boat, bridge,
  cloud, bird, plumBranch, orchid, chrysanthemum, chessboard, chessPiece,
  inkstone, scroll, lotus, candle, lantern, inkDot, waterfall, pavilionFree,
} from './common.mjs';

export const FIGURES_EAST_STATEMAN = [
  // ── A 极端外：变法 + 果决 + 刚毅 ──
  {
    id: 'shangyang',
    name: '商鞅',
    era: 'warring',
    seal: '商君法',
    motto: ['城门立木', '以法强国'],
    caption: '徙木立信',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 340, 50)}
        <!-- 城门 -->
        <g stroke="${ink}" stroke-width="1.8" fill="${p.primary}" opacity="0.85">
          <rect x="160" y="280" width="160" height="160"/>
          <rect x="200" y="340" width="80" height="100" fill="${p.ink}"/>
          <line x1="160" y1="280" x2="160" y2="180" stroke-width="2.2"/>
          <line x1="320" y1="280" x2="320" y2="180" stroke-width="2.2"/>
          <path d="M 160 180 L 200 150 L 240 180 L 280 150 L 320 180" fill="${p.seal}" opacity="0.7"/>
        </g>
        <!-- 立木 -->
        <line x1="380" y1="280" x2="380" y2="420" stroke="${p.ink}" stroke-width="3"/>
        <ellipse cx="380" cy="280" rx="6" ry="4" fill="${p.accent}"/>
        <!-- 立者 -->
        <g transform="translate(380 440)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 40 L 22 40 L 16 12 Z"/>
        </g>
        ${scroll(100, 380, p.ground, p.primary)}`;
    },
  },
  {
    id: 'fanju',
    name: '范雎',
    era: 'warring',
    seal: '远交近攻',
    motto: ['绨袍恋恋', '相机而动'],
    caption: '远交近攻',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${water(p.primary, 440)}
        ${boat(360, 420, ink)}
        <!-- 沙盘地图 -->
        <rect x="80" y="360" width="200" height="80" fill="${p.primary}" opacity="0.85"/>
        <g stroke="${p.ground}" stroke-width="0.5" fill="none" opacity="0.7">
          <path d="M 100 380 q 20 -10 40 0 q 30 -8 60 4 q 30 -6 50 4"/>
          <path d="M 100 410 q 30 -4 60 2 q 40 -2 70 0"/>
          <circle cx="140" cy="400" r="3" fill="${p.seal}"/>
          <circle cx="220" cy="395" r="3" fill="${p.seal}"/>
        </g>
        <!-- 主者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <line x1="240" y1="360" x2="200" y2="380" stroke="${p.ink}" stroke-width="1.4"/>
        <circle cx="200" cy="380" r="2" fill="${p.ink}"/>`;
    },
  },
  {
    id: 'lisi',
    name: '李斯',
    era: 'warring',
    seal: '仓颉篇',
    motto: ['书同文字', '车同轨'],
    caption: '篆书定形',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${candle(360, 380, ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        <rect x="60" y="414" width="360" height="4" fill="${p.ink}" opacity="0.5"/>
        ${inkstone(380, 432, p.ink)}
        <!-- 简册成山 -->
        ${Array.from({ length: 4 }, (_, i) => `<g transform="translate(${100 + i * 60} 380)">
          <rect x="0" y="0" width="50" height="6" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>
          <rect x="0" y="8" width="50" height="6" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>
          <line x1="2" y1="2" x2="48" y2="2" stroke="${p.primary}" stroke-width="0.3"/>
          <line x1="2" y1="10" x2="48" y2="10" stroke="${p.primary}" stroke-width="0.3"/>
        </g>`).join('')}
        <!-- 执笔 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <line x1="190" y1="358" x2="220" y2="370" stroke="${p.ink}" stroke-width="1.4"/>
        <line x1="220" y1="370" x2="232" y2="362" stroke="${p.accent}" stroke-width="2"/>`;
    },
  },
  {
    id: 'zhangqiu',
    name: '张居正',
    era: 'ming',
    seal: '一条鞭',
    motto: ['考成严核', '丈田均赋'],
    caption: '万历中兴',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 300, 60)}
        ${candle(80, 380, ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        ${Array.from({ length: 5 }, (_, i) => `<rect x="${90 + i * 56}" y="350" width="44" height="50" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.8"/>`).join('')}
        ${scroll(140, 388, p.ground, p.primary)}
        ${scroll(280, 388, p.ground, p.primary)}
        <!-- 主者 -->
        <g transform="translate(220 290)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 70 L 24 70 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'kangyouwei',
    name: '康有为',
    era: 'qing',
    seal: '公车上书',
    motto: ['变者天道', '公车伏阙'],
    caption: '百日维新',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 150, 80, p.ground)}
        ${cloud(320, 160, 70, p.ground)}
        <!-- 宫墙 -->
        <rect x="80" y="280" width="320" height="160" fill="${p.primary}" opacity="0.6"/>
        <rect x="80" y="278" width="320" height="6" fill="${p.seal}" opacity="0.7"/>
        <!-- 伏阙者 -->
        <g transform="translate(240 350)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 56 L 22 56 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        <!-- 万言书 -->
        <g transform="translate(160 410)" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6">
          <rect x="0" y="0" width="50" height="6"/>
          <line x1="2" y1="2" x2="48" y2="2" stroke-width="0.3"/>
          <line x1="2" y1="4" x2="48" y2="4" stroke-width="0.3"/>
        </g>`;
    },
  },
  {
    id: 'wangmeng',
    name: '王猛',
    era: 'warring',
    seal: '扪虱谈',
    motto: ['扪虱而谈', '关中大治'],
    caption: '扪虱论天',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${bamboo(80, 440, 120, p.ink)}
        ${bamboo(420, 440, 110, p.ink)}
        <!-- 案 -->
        <rect x="140" y="400" width="200" height="12" fill="${p.primary}" opacity="0.85"/>
        ${scroll(180, 388, p.ground, p.primary)}
        ${scroll(280, 388, p.ground, p.primary)}
        <!-- 坐者 -->
        <g transform="translate(220 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 56 L 24 56 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 扪虱手 -->
        <line x1="234" y1="320" x2="240" y2="306" stroke="${ink}" stroke-width="2"/>
        <circle cx="240" cy="306" r="1.4" fill="${p.seal}"/>`;
    },
  },

  // ── B 偏外 ──
  {
    id: 'guanzhong',
    name: '管仲',
    era: 'spring',
    seal: '老马识途',
    motto: ['仓廪实则知礼', '九合诸侯'],
    caption: '九合诸侯',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        <!-- 集市 -->
        <g stroke="${ink}" stroke-width="0.8" fill="${p.secondary}" opacity="0.7">
          <rect x="80" y="380" width="40" height="40"/>
          <rect x="130" y="380" width="40" height="40"/>
          <rect x="180" y="380" width="40" height="40"/>
          <rect x="230" y="380" width="40" height="40"/>
          <line x1="80" y1="380" x2="270" y2="380"/>
        </g>
        <!-- 老马 -->
        <g transform="translate(340 380)" fill="${p.primary}" stroke="${ink}" stroke-width="1.4">
          <ellipse cx="0" cy="0" rx="32" ry="12"/>
          <ellipse cx="28" cy="-6" rx="12" ry="9"/>
          <line x1="-22" y1="6" x2="-24" y2="20"/>
          <line x1="-6" y1="10" x2="-8" y2="22"/>
          <line x1="14" y1="10" x2="12" y2="22"/>
          <line x1="24" y1="6" x2="26" y2="22"/>
        </g>
        <!-- 立者 -->
        <g transform="translate(380 350)" fill="${ink}" opacity="0.9">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 50 L 22 50 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'yanying',
    name: '晏婴',
    era: 'spring',
    seal: '二桃杀士',
    motto: ['使楚不辱', '机敏善辩'],
    caption: '使楚不辱',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${bamboo(60, 440, 130, p.ink)}
        ${bamboo(420, 440, 120, p.ink)}
        <!-- 樾木 -->
        <g transform="translate(240 360)">
          <ellipse cx="0" cy="0" rx="80" ry="22" fill="${p.accent}" opacity="0.5"/>
          <line x1="0" y1="0" x2="0" y2="40" stroke="${p.ink}" stroke-width="2"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(180 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 56 L 24 56 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <g transform="translate(300 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 56 L 24 56 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'zhuge',
    name: '诸葛亮',
    era: 'westernHan',
    seal: '出师表',
    motto: ['鞠躬尽瘁', '死而后已'],
    caption: '草庐隆中',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 280, 80)}
        ${bamboo(60, 440, 130, p.ink)}
        ${bamboo(100, 440, 110, p.ink)}
        ${bamboo(380, 440, 130, p.ink)}
        ${bamboo(420, 440, 110, p.ink)}
        ${cloud(140, 140, 70, p.ground)}
        ${cottage(240, 420, ink)}
        <!-- 草庐内坐者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        ${scroll(200, 396, p.ground, p.primary)}
        ${candle(280, 380, ink)}`;
    },
  },
  {
    id: 'fanzhongyan',
    name: '范仲淹',
    era: 'song',
    seal: '先忧后乐',
    motto: ['先天下之忧', '后天下之乐'],
    caption: '岳阳楼记',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 240, 90)}
        ${water(p.primary, 420)}
        ${pavilion(240, 380, ink, p.primary)}
        <!-- 登楼者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        ${moon(p.ground, 380, 120, 18)}
        ${cloud(140, 150, 70, p.ground)}`;
    },
  },
  {
    id: 'yuefei',
    name: '岳飞',
    era: 'song',
    seal: '精忠报国',
    motto: ['还我河山', '壮志饥餐'],
    caption: '精忠报国',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 280, 70)}
        ${cloud(140, 140, 70, p.ground)}
        <!-- 战马 -->
        <g transform="translate(160 400)" fill="${p.ink}" stroke="${p.primary}" stroke-width="1.4">
          <ellipse cx="0" cy="0" rx="36" ry="14"/>
          <ellipse cx="32" cy="-8" rx="14" ry="10"/>
          <line x1="-22" y1="8" x2="-24" y2="22"/>
          <line x1="-4" y1="12" x2="-6" y2="22"/>
          <line x1="16" y1="10" x2="14" y2="22"/>
          <line x1="28" y1="6" x2="30" y2="22"/>
          <line x1="30" y1="-16" x2="36" y2="-24"/>
        </g>
        <!-- 立马将军 -->
        <g transform="translate(180 350)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -20 12 L -26 60 L 26 60 L 20 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 枪 -->
        <line x1="200" y1="330" x2="220" y2="220" stroke="${p.ink}" stroke-width="2.2"/>
        <!-- 旗 -->
        <g transform="translate(220 220)">
          <path d="M 0 0 L 24 -4 L 30 8 L 0 12 Z" fill="${p.seal}" opacity="0.85"/>
        </g>`;
    },
  },
  {
    id: 'linze',
    name: '林则徐',
    era: 'qing',
    seal: '虎门销烟',
    motto: ['苟利国家', '岂因祸福'],
    caption: '虎门销烟',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${water(p.primary, 440)}
        <!-- 海滩 -->
        <path d="M 0 460 L 60 440 L 120 450 L 200 430 L 280 445 L 360 432 L 440 450 L 480 440 L 480 480 L 0 480 Z" fill="${p.secondary}" opacity="0.4"/>
        <!-- 销烟池 -->
        <g stroke="${ink}" stroke-width="1.4" fill="${p.ink}" opacity="0.85">
          <ellipse cx="160" cy="410" rx="50" ry="10"/>
          <ellipse cx="160" cy="404" rx="50" ry="6" fill="${p.seal}"/>
          <ellipse cx="320" cy="410" rx="50" ry="10"/>
          <ellipse cx="320" cy="404" rx="50" ry="6" fill="${p.seal}"/>
        </g>
        <!-- 烟 -->
        <g fill="${p.ground}" opacity="0.7">
          <ellipse cx="160" cy="380" rx="40" ry="14"/>
          <ellipse cx="320" cy="380" rx="40" ry="14"/>
          <ellipse cx="180" cy="360" rx="20" ry="10"/>
        </g>
        <!-- 立者 -->
        <g transform="translate(240 350)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── C 中段 ──
  {
    id: 'xiaohe',
    name: '萧何',
    era: 'westernHan',
    seal: '月下追信',
    motto: ['月下追韩信', '治关中'],
    caption: '月下追韩信',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 300, 60)}
        ${moon(p.ground, 360, 120, 22)}
        ${cloud(140, 150, 60, p.ground)}
        <!-- 道路 -->
        <path d="M 60 420 Q 240 400 420 420" stroke="${p.primary}" stroke-width="6" fill="none" opacity="0.55"/>
        <!-- 骑马追者 -->
        <g transform="translate(180 400)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="-2" rx="11" ry="14"/>
          <path d="M -16 10 L -22 30 L 22 30 L 16 10 Z"/>
          <ellipse cx="0" cy="-18" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        <g transform="translate(180 420)" fill="${p.ink}" stroke="${p.primary}" stroke-width="1.4">
          <ellipse cx="0" cy="0" rx="30" ry="10"/>
          <ellipse cx="26" cy="-4" rx="12" ry="8"/>
          <line x1="-20" y1="6" x2="-22" y2="16"/>
          <line x1="-2" y1="8" x2="-4" y2="18"/>
          <line x1="14" y1="6" x2="12" y2="18"/>
          <line x1="24" y1="4" x2="26" y2="16"/>
        </g>`;
    },
  },
  {
    id: 'fangxuanling',
    name: '房玄龄',
    era: 'tang',
    seal: '房谋杜断',
    motto: ['孜孜为国', '修五代史'],
    caption: '房谋杜断',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${candle(80, 380, ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        ${Array.from({ length: 6 }, (_, i) => `<rect x="${90 + i * 50}" y="350" width="40" height="50" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.8"/>`).join('')}
        ${scroll(140, 388, p.ground, p.primary)}
        <!-- 执笔者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <line x1="190" y1="358" x2="220" y2="370" stroke="${p.ink}" stroke-width="1.4"/>
        <line x1="220" y1="370" x2="232" y2="362" stroke="${p.accent}" stroke-width="2"/>`;
    },
  },
  {
    id: 'weizheng',
    name: '魏徵',
    era: 'tang',
    seal: '以人为镜',
    motto: ['敢谏直声', '十渐不终'],
    caption: '以人为镜',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        <!-- 殿 -->
        <g stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.7">
          <path d="M 80 280 L 240 250 L 400 280 L 400 360 L 80 360 Z" fill="${p.seal}" opacity="0.4"/>
          <line x1="80" y1="360" x2="80" y2="420"/>
          <line x1="400" y1="360" x2="400" y2="420"/>
          <line x1="80" y1="420" x2="400" y2="420"/>
        </g>
        <!-- 谏者 -->
        <g transform="translate(180 350)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
          <line x1="20" y1="0" x2="40" y2="-10" stroke="${ink}" stroke-width="2"/>
        </g>
        <!-- 笏板 -->
        <rect x="200" y="280" width="6" height="40" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>`;
    },
  },
  {
    id: 'wentianxiang',
    name: '文天祥',
    era: 'song',
    seal: '正气歌',
    motto: ['人生自古谁无死', '留取丹心照汗青'],
    caption: '正气浩然',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 80, p.ground)}
        ${cloud(320, 150, 70, p.ground)}
        <!-- 囚车 -->
        <g stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.8">
          <rect x="180" y="320" width="120" height="80"/>
          <line x1="180" y1="320" x2="180" y2="280"/>
          <line x1="300" y1="320" x2="300" y2="280"/>
          <line x1="200" y1="320" x2="200" y2="300"/>
          <line x1="240" y1="320" x2="240" y2="300"/>
          <line x1="280" y1="320" x2="280" y2="300"/>
          <circle cx="200" cy="420" r="12" fill="${p.ink}"/>
          <circle cx="280" cy="420" r="12" fill="${p.ink}"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 280)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'haigui',
    name: '海瑞',
    era: 'ming',
    seal: '治安疏',
    motto: ['天下事无不可言', '备棺上疏'],
    caption: '备棺上疏',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${candle(360, 380, ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        ${scroll(120, 380, p.ground, p.primary)}
        ${scroll(220, 380, p.ground, p.primary)}
        ${scroll(320, 380, p.ground, p.primary)}
        <!-- 棺材 -->
        <g stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <rect x="380" y="400" width="40" height="50"/>
          <ellipse cx="400" cy="400" rx="20" ry="6" fill="${p.secondary}"/>
        </g>
        <!-- 跪者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 60 L 22 60 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'liangqichao',
    name: '梁启超',
    era: 'qing',
    seal: '饮冰室',
    motto: ['十年饮冰', '难凉热血'],
    caption: '饮冰室主',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 70, p.ground)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        ${Array.from({ length: 4 }, (_, i) => `<g transform="translate(${100 + i * 60} 360)">
          <rect x="0" y="0" width="50" height="40" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>
          <line x1="2" y1="6" x2="48" y2="6" stroke-width="0.3"/>
          <line x1="2" y1="14" x2="48" y2="14" stroke-width="0.3"/>
          <line x1="2" y1="22" x2="48" y2="22" stroke-width="0.3"/>
          <line x1="2" y1="30" x2="48" y2="30" stroke-width="0.3"/>
        </g>`).join('')}
        <!-- 坐者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── D 偏内 ──
  {
    id: 'zhangliang',
    name: '张良',
    era: 'westernHan',
    seal: '圯桥授书',
    motto: ['愿弃人间事', '赤松子游'],
    caption: '圯桥授书',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${water(p.primary, 440)}
        ${bridge(240, 440, 70, ink)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 老人 -->
        <g transform="translate(160 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 60 L 22 60 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        <!-- 张良跪接 -->
        <g transform="translate(320 380)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="10" ry="13"/>
          <path d="M -14 10 L -20 36 L 20 36 L 14 10 Z"/>
          <ellipse cx="0" cy="-15" rx="8" ry="10" fill="${p.primary}"/>
        </g>
        <!-- 鞋 -->
        <ellipse cx="320" cy="424" rx="6" ry="3" fill="${p.secondary}"/>`;
    },
  },
  {
    id: 'direnjie',
    name: '狄仁杰',
    era: 'tang',
    seal: '神探断狱',
    motto: ['一年断狱', '复唐之功'],
    caption: '神探狄公',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${lantern(80, 200, p.seal)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 案卷 -->
        ${Array.from({ length: 5 }, (_, i) => `<g transform="translate(${90 + i * 56} 360)">
          <rect x="0" y="0" width="44" height="40" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6"/>
          <line x1="2" y1="6" x2="42" y2="6" stroke-width="0.3"/>
          <line x1="2" y1="14" x2="42" y2="14" stroke-width="0.3"/>
          <line x1="2" y1="22" x2="42" y2="22" stroke-width="0.3"/>
        </g>`).join('')}
        <!-- 惊堂木 -->
        <rect x="370" y="406" width="14" height="6" fill="${p.seal}"/>
        <!-- 坐者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'xujie',
    name: '徐阶',
    era: 'ming',
    seal: '斗严嵩',
    motto: ['隐忍待时', '扳倒严嵩'],
    caption: '智斗严嵩',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${candle(360, 380, ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        ${scroll(120, 380, p.ground, p.primary)}
        ${scroll(220, 380, p.ground, p.primary)}
        ${scroll(320, 380, p.ground, p.primary)}
        <!-- 弹劾奏本 -->
        <g transform="translate(360 380)" fill="${p.seal}" stroke="${p.primary}" stroke-width="0.6">
          <rect x="0" y="0" width="40" height="20"/>
          <line x1="2" y1="6" x2="38" y2="6" stroke-width="0.3"/>
          <line x1="2" y1="12" x2="38" y2="12" stroke-width="0.3"/>
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
    id: 'zhangzhidong',
    name: '张之洞',
    era: 'qing',
    seal: '中体西用',
    motto: ['中体西用', '汉阳造'],
    caption: '洋务名臣',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 140, 80, p.ground)}
        <!-- 学堂 -->
        <g stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <rect x="80" y="320" width="100" height="100"/>
          <path d="M 80 320 L 130 280 L 180 320" fill="${p.seal}" opacity="0.7"/>
        </g>
        <!-- 工厂烟囱 -->
        <g stroke="${ink}" stroke-width="1.4" fill="${p.secondary}" opacity="0.85">
          <rect x="300" y="320" width="80" height="100"/>
          <rect x="320" y="280" width="14" height="50"/>
          <rect x="350" y="280" width="14" height="50"/>
        </g>
        <!-- 烟 -->
        <g fill="${p.ground}" opacity="0.6">
          <ellipse cx="327" cy="270" rx="14" ry="6"/>
          <ellipse cx="357" cy="270" rx="14" ry="6"/>
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
    id: 'lihongzhang',
    name: '李鸿章',
    era: 'qing',
    seal: '淮军相',
    motto: ['一代人办一代事', '签马关'],
    caption: '签马关约',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${water(p.primary, 440)}
        ${boat(380, 420, ink)}
        <!-- 案 -->
        <rect x="60" y="380" width="280" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 条约 -->
        <g transform="translate(120 360)" fill="${p.ground}" stroke="${p.primary}" stroke-width="0.6">
          <rect x="0" y="0" width="180" height="20"/>
          <line x1="2" y1="6" x2="178" y2="6" stroke-width="0.3"/>
          <line x1="2" y1="12" x2="178" y2="12" stroke-width="0.3"/>
          <rect x="60" y="-6" width="60" height="14" fill="${p.seal}"/>
        </g>
        <!-- 执笔者 -->
        <g transform="translate(180 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 笔 -->
        <line x1="140" y1="360" x2="178" y2="368" stroke="${p.ink}" stroke-width="1.4"/>`;
    },
  },
  {
    id: 'zhou',
    name: '周公',
    era: 'spring',
    seal: '制礼作乐',
    motto: ['周监于二代', '郁郁文哉'],
    caption: '制礼作乐',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 280, 80)}
        ${cloud(140, 140, 80, p.ground)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        <!-- 殿 -->
        <g stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <path d="M 80 280 L 240 250 L 400 280 L 400 360 L 80 360 Z" fill="${p.seal}" opacity="0.4"/>
        </g>
        <!-- 编钟 -->
        <g transform="translate(160 360)">
          ${Array.from({ length: 6 }, (_, i) => `<rect x="${-30 + i * 12}" y="${-30 - i * 4}" width="8" height="${30 + i * 4}" fill="${p.accent}" stroke="${p.ink}" stroke-width="0.6"/>`).join('')}
        </g>
        <!-- 站者 -->
        <g transform="translate(240 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── E 极端内 ──
  {
    id: 'yi',
    name: '伊尹',
    era: 'warring',
    seal: '调鼎鼐',
    motto: ['调和鼎鼐', '燮理阴阳'],
    caption: '调鼎元勋',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        <!-- 鼎 -->
        <g stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <ellipse cx="240" cy="380" rx="80" ry="14"/>
          <rect x="160" y="380" width="160" height="60"/>
          <ellipse cx="240" cy="440" rx="80" ry="14"/>
          <line x1="180" y1="380" x2="180" y2="360"/>
          <line x1="240" y1="380" x2="240" y2="360"/>
          <line x1="300" y1="380" x2="300" y2="360"/>
          <path d="M 175 360 L 165 340 L 195 340 Z"/>
          <path d="M 235 360 L 225 340 L 255 340 Z"/>
          <path d="M 295 360 L 285 340 L 315 340 Z"/>
        </g>
        <!-- 站者 -->
        <g transform="translate(240 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'fanli',
    name: '范蠡',
    era: 'spring',
    seal: '陶朱公',
    motto: ['飞鸟尽良弓藏', '三致千金'],
    caption: '三致千金',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 280, 80)}
        ${water(p.primary, 440)}
        ${boat(160, 420, ink)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        ${cloud(140, 140, 70, p.ground)}
        ${moon(p.ground, 380, 120, 18)}
        <!-- 船中人 -->
        <g transform="translate(160 400)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 50 L 22 50 L 16 12 Z"/>
          <ellipse cx="0" cy="-16" rx="9" ry="11" fill="${p.primary}"/>
        </g>
        <!-- 金锭 -->
        <g transform="translate(380 360)" fill="${p.accent}" stroke="${p.ink}" stroke-width="0.6">
          <path d="M 0 0 L 24 -4 L 30 8 L 0 12 Z"/>
          <ellipse cx="14" cy="2" rx="10" ry="2"/>
        </g>`;
    },
  },
  {
    id: 'zuo',
    name: '左宗棠',
    era: 'qing',
    seal: '抬棺出关',
    motto: ['抬棺出关', '收复新疆'],
    caption: '抬棺西征',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 240, 90)}
        ${mountains(p.secondary, 320, 60)}
        ${cloud(140, 140, 80, p.ground)}
        ${cloud(320, 150, 70, p.ground)}
        <!-- 棺材 -->
        <g stroke="${ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <rect x="140" y="360" width="80" height="50"/>
          <ellipse cx="180" cy="360" rx="40" ry="6" fill="${p.secondary}"/>
        </g>
        <!-- 马上将军 -->
        <g transform="translate(280 400)" fill="${p.ink}" stroke="${p.primary}" stroke-width="1.4">
          <ellipse cx="0" cy="0" rx="36" ry="14"/>
          <ellipse cx="32" cy="-8" rx="14" ry="10"/>
          <line x1="-22" y1="8" x2="-24" y2="22"/>
          <line x1="-4" y1="12" x2="-6" y2="22"/>
          <line x1="16" y1="10" x2="14" y2="22"/>
          <line x1="28" y1="6" x2="30" y2="22"/>
        </g>
        <g transform="translate(260 350)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -20 12 L -26 60 L 26 60 L 20 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'sunyatsen',
    name: '孙中山',
    era: 'qing',
    seal: '三民主义',
    motto: ['天下为公', '驱除鞑虏'],
    caption: '天下为公',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 320, 50)}
        ${cloud(140, 140, 80, p.ground)}
        ${cloud(320, 150, 70, p.ground)}
        <!-- 讲台 -->
        <rect x="100" y="380" width="280" height="40" fill="${p.primary}" opacity="0.85"/>
        <rect x="100" y="380" width="280" height="6" fill="${p.seal}"/>
        <!-- 三民旗 -->
        <g transform="translate(160 250)">
          <line x1="0" y1="0" x2="0" y2="80" stroke="${p.ink}" stroke-width="1.4"/>
          <path d="M 0 0 L 30 -4 L 36 8 L 0 12 Z" fill="${p.seal}" opacity="0.85"/>
        </g>
        <g transform="translate(240 250)">
          <line x1="0" y1="0" x2="0" y2="80" stroke="${p.ink}" stroke-width="1.4"/>
          <path d="M 0 0 L 30 -4 L 36 8 L 0 12 Z" fill="${p.ground}" opacity="0.85"/>
        </g>
        <g transform="translate(320 250)">
          <line x1="0" y1="0" x2="0" y2="80" stroke="${p.ink}" stroke-width="1.4"/>
          <path d="M 0 0 L 30 -4 L 36 8 L 0 12 Z" fill="${p.accent}" opacity="0.85"/>
        </g>
        <!-- 立者 -->
        <g transform="translate(240 350)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
          <line x1="20" y1="0" x2="40" y2="-10" stroke="${ink}" stroke-width="2"/>
        </g>`;
    },
  },
  {
    id: 'liubow',
    name: '刘伯温',
    era: 'ming',
    seal: '烧饼歌',
    motto: ['三分天下诸葛', '一统江山刘基'],
    caption: '烧饼预言',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 300, 60)}
        ${candle(80, 380, ink)}
        <!-- 案 -->
        <rect x="60" y="400" width="360" height="14" fill="${p.primary}" opacity="0.85"/>
        ${scroll(120, 380, p.ground, p.primary)}
        ${scroll(220, 380, p.ground, p.primary)}
        ${scroll(320, 380, p.ground, p.primary)}
        <!-- 烧饼 -->
        <circle cx="380" cy="408" r="14" fill="${p.accent}" stroke="${p.ink}" stroke-width="0.6"/>
        <circle cx="380" cy="408" r="3" fill="${p.ink}"/>
        <!-- 观天者 -->
        <g transform="translate(220 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 60 L 24 60 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        ${moon(p.ground, 380, 110, 18)}`;
    },
  },
  {
    id: 'jiang',
    name: '姜尚',
    era: 'spring',
    seal: '直钩钓',
    motto: ['愿者上钩', '渭水之遇'],
    caption: '渭水垂钓',
    buildScene(p, ink) {
      return `
        ${mountains(p.secondary, 280, 80)}
        ${water(p.primary, 440)}
        ${bamboo(60, 440, 110, p.ink)}
        ${bamboo(420, 440, 100, p.ink)}
        ${cloud(140, 140, 70, p.ground)}
        <!-- 渭水边坐者 -->
        <g transform="translate(220 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
        </g>
        <!-- 钓竿 -->
        <line x1="240" y1="360" x2="380" y2="320" stroke="${p.primary}" stroke-width="1.4"/>
        <!-- 直钩 -->
        <line x1="380" y1="320" x2="380" y2="332" stroke="${p.ink}" stroke-width="1.6"/>
        <line x1="380" y1="332" x2="386" y2="338" stroke="${p.ink}" stroke-width="0.8"/>`;
    },
  },
];
