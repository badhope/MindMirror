// scripts/portraits/figures.west-philosopher.mjs
// 30 位西方哲学家的肖像设计数据
// 复用 common.mjs 的西方色板（classical/medieval/modernEarly/modernLate）
// 与西式元素（laurelBranch / pillar / arch / telescope / quill / bookOpen /
//              compass / hourglass / gear / flask / crown）

import {
  laurelBranch, pillar, arch, telescope, quill, bookOpen,
  compass, hourglass, gear, flask, crown, candle,
} from './common.mjs';

export const FIGURES_WEST_PHILOSOPHER = [
  // ── A 极端外 ──
  {
    id: 'socrates',
    name: '苏格拉底',
    era: 'classical',
    seal: '知我无知',
    motto: ['产婆术', '饮鸩从容'],
    caption: '雅典之问',
    buildScene(p, ink) {
      return `
        ${pillar(100, 460, 200, p.primary)}
        ${pillar(380, 460, 200, p.primary)}
        ${arch(240, 460, 220, p.primary)}
        ${laurelBranch(140, 380, 1, p.accent)}
        ${laurelBranch(340, 380, -1, p.accent)}
        <!-- 杯（鸩） -->
        <g transform="translate(380 380)" fill="${p.seal}" stroke="${ink}" stroke-width="1">
          <ellipse cx="0" cy="0" rx="10" ry="3"/>
          <path d="M -10 0 L -8 14 L 8 14 L 10 0 Z" fill="${p.ink}" opacity="0.7"/>
        </g>
        <!-- 站立辩者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 60 L 26 60 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>
        <line x1="260" y1="370" x2="290" y2="354" stroke="${ink}" stroke-width="1.6"/>
        <circle cx="290" cy="354" r="2" fill="${p.seal}"/>`;
    },
  },
  {
    id: 'plato',
    name: '柏拉图',
    era: 'classical',
    seal: '理念世界',
    motto: ['学园', '洞喻'],
    caption: '学园立教',
    buildScene(p, ink) {
      return `
        ${pillar(80, 460, 220, p.primary)}
        ${pillar(180, 460, 220, p.primary)}
        ${pillar(300, 460, 220, p.primary)}
        ${pillar(400, 460, 220, p.primary)}
        <!-- 几何（理念） -->
        <g transform="translate(240 280)" stroke="${p.seal}" stroke-width="1.6" fill="none" opacity="0.85">
          <polygon points="0,-30 26,15 -26,15"/>
          <line x1="0" y1="-30" x2="0" y2="15"/>
          <line x1="-26" y1="15" x2="26" y2="15"/>
        </g>
        ${laurelBranch(60, 200, 1, p.accent)}
        ${laurelBranch(420, 200, -1, p.accent)}
        ${bookOpen(240, 400, 100, p.ink, p.ground)}
        <!-- 站者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'aristotle',
    name: '亚里士多德',
    era: 'classical',
    seal: '吾爱真理',
    motto: ['吕克昂', '逍遥学'],
    caption: '逍遥讲学',
    buildScene(p, ink) {
      return `
        ${pillar(80, 460, 220, p.primary)}
        ${pillar(400, 460, 220, p.primary)}
        <!-- 讲台 -->
        <rect x="180" y="400" width="120" height="50" fill="${p.primary}" opacity="0.85"/>
        <rect x="180" y="400" width="120" height="6" fill="${p.seal}"/>
        ${bookOpen(240, 380, 80, p.ink, p.ground)}
        ${laurelBranch(100, 380, 1, p.accent)}
        ${laurelBranch(380, 380, -1, p.accent)}
        <!-- 讲授者 -->
        <g transform="translate(240 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 60 L 26 60 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
          <line x1="-22" y1="0" x2="-44" y2="-10" stroke="${ink}" stroke-width="1.6"/>
        </g>
        <!-- 学生 -->
        <g transform="translate(140 360)" fill="${ink}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="9" ry="12"/>
          <path d="M -14 10 L -20 40 L 20 40 L 14 10 Z"/>
        </g>
        <g transform="translate(340 360)" fill="${ink}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="9" ry="12"/>
          <path d="M -14 10 L -20 40 L 20 40 L 14 10 Z"/>
        </g>`;
    },
  },
  {
    id: 'voltaire',
    name: '伏尔泰',
    era: 'modernEarly',
    seal: '碾碎丑类',
    motto: ['思想自由', '宽容之心'],
    caption: '沙龙雄辩',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 200, p.primary)}
        ${pillar(420, 460, 200, p.primary)}
        ${quill(200, 400, 1, p.ink)}
        ${bookOpen(300, 380, 90, p.ink, p.ground)}
        <!-- 桌 -->
        <rect x="160" y="420" width="160" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 沙龙主人 -->
        <g transform="translate(240 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 60 L 26 60 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
          <line x1="20" y1="0" x2="42" y2="-8" stroke="${ink}" stroke-width="1.6"/>
        </g>
        <ellipse cx="248" cy="-12" rx="3" ry="2" fill="${p.seal}"/>`;
    },
  },
  {
    id: 'nietzsche',
    name: '尼采',
    era: 'modernLate',
    seal: '上帝已死',
    motto: ['超人哲学', '永恒轮回'],
    caption: '山巅之锤',
    buildScene(p, ink) {
      return `
        <!-- 远山 -->
        <path d="M 0 360 L 80 280 L 160 320 L 240 240 L 320 310 L 400 270 L 480 340 L 480 480 L 0 480 Z" fill="${p.primary}" opacity="0.6"/>
        <path d="M 0 380 L 100 320 L 200 360 L 300 300 L 400 350 L 480 320 L 480 480 L 0 480 Z" fill="${p.secondary}" opacity="0.7"/>
        ${crown(240, 200, 50, p.seal)}
        <!-- 闪电 -->
        <path d="M 220 200 L 200 250 L 240 240 L 210 290 L 260 230 L 230 250" fill="${p.accent}" opacity="0.9" stroke="${p.ink}" stroke-width="1"/>
        <!-- 站者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 60 L 26 60 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'sartre',
    name: '萨特',
    era: 'modernLate',
    seal: '存在先于本质',
    motto: ['自由之重', '拒领诺奖'],
    caption: '咖啡馆主',
    buildScene(p, ink) {
      return `
        ${pillar(80, 460, 200, p.primary)}
        ${pillar(400, 460, 200, p.primary)}
        ${bookOpen(140, 400, 80, p.ink, p.ground)}
        ${quill(360, 380, -1, p.ink)}
        <!-- 桌 -->
        <rect x="180" y="420" width="120" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 烟斗 -->
        <g transform="translate(310 360)">
          <ellipse cx="0" cy="0" rx="6" ry="4" fill="${p.ink}"/>
          <line x1="6" y1="0" x2="20" y2="0" stroke="${p.ink}" stroke-width="2"/>
        </g>
        <!-- 写作者 -->
        <g transform="translate(240 330)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
          <line x1="-20" y1="6" x2="-40" y2="0" stroke="${ink}" stroke-width="1.6"/>
        </g>`;
    },
  },

  // ── B 偏外 ──
  {
    id: 'descartes',
    name: '笛卡尔',
    era: 'modernEarly',
    seal: '我思故我在',
    motto: ['普遍怀疑', '坐标之法'],
    caption: '炉火之思',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 200, p.primary)}
        ${pillar(420, 460, 200, p.primary)}
        <!-- 桌 -->
        <rect x="160" y="400" width="160" height="14" fill="${p.primary}" opacity="0.85"/>
        ${quill(180, 380, 1, p.ink)}
        ${bookOpen(300, 380, 80, p.ink, p.ground)}
        <!-- 几何图（坐标） -->
        <g transform="translate(380 290)" stroke="${p.seal}" stroke-width="1.6" fill="none" opacity="0.85">
          <line x1="-20" y1="0" x2="20" y2="0"/>
          <line x1="0" y1="-20" x2="0" y2="20"/>
          <path d="M -20 16 Q 0 -10 20 -16"/>
        </g>
        <!-- 坐者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'kant',
    name: '康德',
    era: 'modernEarly',
    seal: '敢于认知',
    motto: ['哥尼斯堡', '三大批判'],
    caption: '准时散步',
    buildScene(p, ink) {
      return `
        <!-- 街景建筑 -->
        <g transform="translate(60 320)" fill="${p.primary}" opacity="0.85">
          <rect x="0" y="0" width="80" height="140"/>
          <path d="M 0 0 L 40 -30 L 80 0 Z" fill="${p.seal}"/>
        </g>
        <g transform="translate(340 320)" fill="${p.primary}" opacity="0.85">
          <rect x="0" y="0" width="80" height="140"/>
          <path d="M 0 0 L 40 -30 L 80 0 Z" fill="${p.seal}"/>
        </g>
        <!-- 时钟塔 -->
        <g transform="translate(220 240)">
          <rect x="0" y="0" width="40" height="120" fill="${p.secondary}" opacity="0.85"/>
          <circle cx="20" cy="20" r="18" fill="${p.ground}" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="20" y1="20" x2="20" y2="6" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="20" y1="20" x2="30" y2="20" stroke="${p.ink}" stroke-width="1.4"/>
          <line x1="18" y1="-10" x2="22" y2="-10" stroke="${p.ink}" stroke-width="2"/>
        </g>
        ${bookOpen(160, 400, 70, p.ink, p.ground)}
        <!-- 散步者 -->
        <g transform="translate(180 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 50 L 22 50 L 16 12 Z"/>
          <ellipse cx="0" cy="-18" rx="9" ry="11" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'hegel',
    name: '黑格尔',
    era: 'modernEarly',
    seal: '绝对精神',
    motto: ['凡是合理性', '辩证之法'],
    caption: '讲坛辩证',
    buildScene(p, ink) {
      return `
        ${pillar(80, 460, 220, p.primary)}
        ${pillar(400, 460, 220, p.primary)}
        <!-- 讲台 -->
        <rect x="160" y="400" width="160" height="50" fill="${p.primary}" opacity="0.85"/>
        <rect x="160" y="400" width="160" height="6" fill="${p.seal}"/>
        ${bookOpen(240, 380, 80, p.ink, p.ground)}
        ${candle(140, 400, ink)}
        ${candle(340, 400, ink)}
        <!-- 辩者 -->
        <g transform="translate(240 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 60 L 26 60 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
          <line x1="-22" y1="0" x2="-44" y2="-12" stroke="${ink}" stroke-width="1.8"/>
        </g>`;
    },
  },
  {
    id: 'marx',
    name: '马克思',
    era: 'modernLate',
    seal: '改变世界',
    motto: ['阶级斗争', '剩余价值'],
    caption: '大英图书馆',
    buildScene(p, ink) {
      return `
        <!-- 工厂烟囱 -->
        <g transform="translate(60 280)" fill="${p.primary}" opacity="0.85">
          <rect x="0" y="40" width="100" height="120"/>
          <rect x="20" y="0" width="14" height="50"/>
          <rect x="50" y="0" width="14" height="50"/>
          <rect x="80" y="0" width="14" height="50"/>
        </g>
        <g fill="${p.ground}" opacity="0.6">
          <ellipse cx="74" cy="-10" rx="14" ry="6"/>
          <ellipse cx="104" cy="-10" rx="14" ry="6"/>
          <ellipse cx="134" cy="-10" rx="14" ry="6"/>
        </g>
        ${gear(360, 320, 22, p.ink)}
        ${gear(400, 360, 14, p.ink)}
        ${bookOpen(200, 400, 90, p.ink, p.ground)}
        <!-- 桌 -->
        <rect x="180" y="420" width="120" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 写作者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
          <line x1="-20" y1="6" x2="-40" y2="0" stroke="${ink}" stroke-width="1.6"/>
        </g>`;
    },
  },
  {
    id: 'wittgenstein',
    name: '维特根斯坦',
    era: 'modernLate',
    seal: '可言与不可言',
    motto: ['逻辑哲学', '语言之限'],
    caption: '梯上之思',
    buildScene(p, ink) {
      return `
        <!-- 楼梯 -->
        <g stroke="${p.ink}" stroke-width="2" fill="${p.primary}" opacity="0.85">
          <rect x="60" y="380" width="40" height="80"/>
          <rect x="100" y="340" width="40" height="120"/>
          <rect x="140" y="300" width="40" height="160"/>
          <rect x="180" y="260" width="40" height="200"/>
        </g>
        <!-- 几何 -->
        <g transform="translate(340 280)" stroke="${p.seal}" stroke-width="1.6" fill="none" opacity="0.85">
          <polygon points="0,-30 26,15 -26,15"/>
          <line x1="0" y1="-30" x2="0" y2="15"/>
        </g>
        ${bookOpen(300, 400, 80, p.ink, p.ground)}
        <!-- 沉思者 -->
        <g transform="translate(360 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 60 L 26 60 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'camus',
    name: '加缪',
    era: 'modernLate',
    seal: '反抗荒诞',
    motto: ['西西弗神', '局外之人'],
    caption: '海边推石',
    buildScene(p, ink) {
      return `
        <!-- 海平线 -->
        <g stroke="${p.primary}" stroke-width="0.8" fill="none" opacity="0.7">
          <path d="M 0 380 L 480 380" stroke-dasharray="4 4"/>
          <path d="M 0 392 L 480 392" stroke-dasharray="6 6" opacity="0.6"/>
          <path d="M 0 404 L 480 404" stroke-dasharray="8 8" opacity="0.45"/>
        </g>
        ${hourglass(380, 320, 50, p.ink, p.accent)}
        ${bookOpen(140, 400, 80, p.ink, p.ground)}
        <!-- 圆石 -->
        <ellipse cx="240" cy="450" rx="40" ry="14" fill="${p.ink}" opacity="0.85"/>
        <ellipse cx="240" cy="450" rx="34" ry="10" fill="${p.primary}" opacity="0.7"/>
        <!-- 推石者 -->
        <g transform="translate(180 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 60 L 26 60 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
          <line x1="20" y1="0" x2="40" y2="20" stroke="${ink}" stroke-width="1.8"/>
        </g>`;
    },
  },

  // ── C 中段 ──
  {
    id: 'bacon',
    name: '培根',
    era: 'modernEarly',
    seal: '知识即力量',
    motto: ['破除偶像', '实验之学'],
    caption: '实验之炉',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 200, p.primary)}
        ${pillar(420, 460, 200, p.primary)}
        ${flask(140, 360, 70, p.ink, p.primary)}
        ${flask(340, 360, 70, p.ink, p.seal)}
        <!-- 桌 -->
        <rect x="80" y="420" width="320" height="14" fill="${p.primary}" opacity="0.85"/>
        ${bookOpen(240, 380, 80, p.ink, p.ground)}
        <!-- 实验者 -->
        <g transform="translate(240 320)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'locke',
    name: '洛克',
    era: 'modernEarly',
    seal: '白板之心',
    motto: ['经验之源', '天赋之权'],
    caption: '花园之思',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 200, p.primary)}
        ${pillar(420, 460, 200, p.primary)}
        <!-- 花园树木 -->
        <g transform="translate(120 360)" fill="${p.secondary}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="30" ry="22"/>
          <rect x="-3" y="0" width="6" height="40" fill="${p.ink}"/>
        </g>
        <g transform="translate(360 360)" fill="${p.secondary}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="30" ry="22"/>
          <rect x="-3" y="0" width="6" height="40" fill="${p.ink}"/>
        </g>
        ${quill(200, 380, 1, p.ink)}
        ${bookOpen(300, 390, 80, p.ink, p.ground)}
        <!-- 桌 -->
        <rect x="180" y="420" width="120" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 写作者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'hume',
    name: '休谟',
    era: 'modernEarly',
    seal: '习惯是人生',
    motto: ['怀疑之论', '人性之研'],
    caption: '书房之灯',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 200, p.primary)}
        ${pillar(420, 460, 200, p.primary)}
        ${candle(360, 380, ink)}
        ${bookOpen(140, 400, 80, p.ink, p.ground)}
        <!-- 桌 -->
        <rect x="80" y="420" width="320" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 沉思者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'heidegger',
    name: '海德格尔',
    era: 'modernLate',
    seal: '林中路',
    motto: ['向死而生', '存在之问'],
    caption: '黑森林小屋',
    buildScene(p, ink) {
      return `
        <!-- 远山 -->
        <path d="M 0 360 L 80 280 L 160 320 L 240 240 L 320 310 L 400 270 L 480 340 L 480 480 L 0 480 Z" fill="${p.primary}" opacity="0.6"/>
        <!-- 小屋 -->
        <g transform="translate(200 380)" fill="${p.primary}" opacity="0.85" stroke="${ink}" stroke-width="1.4">
          <path d="M -36 -10 L 0 -38 L 36 -10 L 30 30 L -30 30 Z"/>
          <rect x="-6" y="0" width="12" height="30" fill="${p.ink}"/>
        </g>
        ${laurelBranch(120, 360, 1, p.accent)}
        ${laurelBranch(360, 360, -1, p.accent)}
        ${bookOpen(240, 410, 80, p.ink, p.ground)}
        <!-- 沉思者 -->
        <g transform="translate(160 380)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 50 L 22 50 L 16 12 Z"/>
          <ellipse cx="0" cy="-18" rx="9" ry="11" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'habermas',
    name: '哈贝马斯',
    era: 'modernLate',
    seal: '交往理性',
    motto: ['公共领域', '商谈伦理'],
    caption: '咖啡馆辩',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 200, p.primary)}
        ${pillar(420, 460, 200, p.primary)}
        ${quill(160, 380, 1, p.ink)}
        ${bookOpen(320, 400, 80, p.ink, p.ground)}
        <!-- 桌 -->
        <rect x="160" y="420" width="160" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 咖啡杯 -->
        <g transform="translate(380 400)">
          <ellipse cx="0" cy="0" rx="8" ry="3" fill="${p.ink}"/>
          <path d="M -8 0 L -7 8 L 7 8 L 8 0 Z" fill="${p.ink}"/>
          <ellipse cx="0" cy="-2" rx="6" ry="2" fill="${p.accent}"/>
        </g>
        <!-- 论者 -->
        <g transform="translate(220 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="12" ry="15"/>
          <path d="M -18 12 L -24 50 L 24 50 L 18 12 Z"/>
          <ellipse cx="0" cy="-18" rx="10" ry="12" fill="${p.primary}"/>
          <line x1="20" y1="0" x2="38" y2="-6" stroke="${ink}" stroke-width="1.6"/>
        </g>`;
    },
  },
  {
    id: 'rawls',
    name: '罗尔斯',
    era: 'modernLate',
    seal: '公平即正义',
    motto: ['无知之幕', '差异原则'],
    caption: '讲堂之论',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 220, p.primary)}
        ${pillar(400, 460, 220, p.primary)}
        <!-- 黑板 -->
        <rect x="80" y="220" width="320" height="120" fill="${p.ink}" opacity="0.8"/>
        <text x="240" y="290" text-anchor="middle" font-family="serif" font-size="20" fill="${p.ground}" font-weight="700">Veil of Ignorance</text>
        ${candle(140, 380, ink)}
        ${bookOpen(300, 400, 80, p.ink, p.ground)}
        <!-- 桌 -->
        <rect x="80" y="420" width="320" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 讲授者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
          <line x1="-22" y1="0" x2="-40" y2="-6" stroke="${ink}" stroke-width="1.6"/>
        </g>`;
    },
  },

  // ── D 偏内 ──
  {
    id: 'seneca',
    name: '塞涅卡',
    era: 'classical',
    seal: '向死而生',
    motto: ['斯多葛学', '命运之思'],
    caption: '罗马之柱',
    buildScene(p, ink) {
      return `
        ${pillar(100, 460, 220, p.primary)}
        ${pillar(380, 460, 220, p.primary)}
        ${arch(240, 460, 220, p.primary)}
        ${laurelBranch(140, 380, 1, p.accent)}
        ${laurelBranch(340, 380, -1, p.accent)}
        ${bookOpen(240, 400, 80, p.ink, p.ground)}
        <!-- 坐者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'augustine',
    name: '奥古斯丁',
    era: 'medieval',
    seal: '我信以求知',
    motto: ['忏悔之录', '上帝之城'],
    caption: '圣奥之思',
    buildScene(p, ink) {
      return `
        <!-- 教堂拱门 -->
        <g transform="translate(240 460)" fill="${p.primary}" opacity="0.85" stroke="${ink}" stroke-width="1.4">
          <path d="M -100 0 L -100 -160 Q 0 -240 100 -160 L 100 0 Z"/>
          <path d="M -76 0 L -76 -150 Q 0 -220 76 -150 L 76 0" fill="${p.ground}" opacity="0.4"/>
          <line x1="0" y1="-220" x2="0" y2="0" stroke-width="1.4"/>
        </g>
        ${candle(140, 380, ink)}
        ${candle(340, 380, ink)}
        ${bookOpen(240, 400, 80, p.ink, p.ground)}
        <!-- 跪者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 36 L 22 36 L 16 12 Z"/>
          <ellipse cx="0" cy="-18" rx="9" ry="11" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'pascal',
    name: '帕斯卡',
    era: 'modernEarly',
    seal: '人是苇草',
    motto: ['思想之录', '帕斯卡赌'],
    caption: '计算之思',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 200, p.primary)}
        ${pillar(420, 460, 200, p.primary)}
        ${bookOpen(140, 400, 80, p.ink, p.ground)}
        <!-- 算盘 -->
        <g transform="translate(340 400)" stroke="${p.ink}" stroke-width="1.4" fill="${p.primary}" opacity="0.85">
          <rect x="-30" y="-12" width="60" height="24"/>
          <line x1="-30" y1="-4" x2="30" y2="-4"/>
          <line x1="-30" y1="4" x2="30" y2="4"/>
          ${Array.from({ length: 5 }, (_, i) => `<circle cx="${-22 + i * 11}" cy="-8" r="2.4" fill="${p.accent}"/>`).join('')}
          ${Array.from({ length: 5 }, (_, i) => `<circle cx="${-22 + i * 11}" cy="8" r="2.4" fill="${p.accent}"/>`).join('')}
        </g>
        <!-- 桌 -->
        <rect x="80" y="420" width="320" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 沉思者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'kierkegaard',
    name: '克尔凯郭尔',
    era: 'modernEarly',
    seal: '信仰之跃',
    motto: ['恐惧与战栗', '人生三阶'],
    caption: '哥本哈根街',
    buildScene(p, ink) {
      return `
        <!-- 街景建筑 -->
        <g transform="translate(40 320)" fill="${p.primary}" opacity="0.85">
          <rect x="0" y="0" width="80" height="140"/>
          <path d="M 0 0 L 40 -30 L 80 0 Z" fill="${p.seal}"/>
        </g>
        <g transform="translate(140 320)" fill="${p.primary}" opacity="0.85">
          <rect x="0" y="0" width="60" height="140"/>
          <path d="M 0 0 L 30 -26 L 60 0 Z" fill="${p.seal}"/>
        </g>
        <g transform="translate(320 320)" fill="${p.primary}" opacity="0.85">
          <rect x="0" y="0" width="60" height="140"/>
          <path d="M 0 0 L 30 -26 L 60 0 Z" fill="${p.seal}"/>
        </g>
        <g transform="translate(400 320)" fill="${p.primary}" opacity="0.85">
          <rect x="0" y="0" width="80" height="140"/>
          <path d="M 0 0 L 40 -30 L 80 0 Z" fill="${p.seal}"/>
        </g>
        ${laurelBranch(220, 200, 0, p.accent)}
        ${bookOpen(240, 400, 80, p.ink, p.ground)}
        <!-- 孤独踽行者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 50 L 22 50 L 16 12 Z"/>
          <ellipse cx="0" cy="-18" rx="9" ry="11" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'bergson',
    name: '柏格森',
    era: 'modernLate',
    seal: '绵延之流',
    motto: ['生命之流', '创造进化'],
    caption: '讲堂之钟',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 220, p.primary)}
        ${pillar(400, 460, 220, p.primary)}
        ${hourglass(140, 320, 80, p.ink, p.accent)}
        ${bookOpen(320, 400, 80, p.ink, p.ground)}
        <!-- 桌 -->
        <rect x="80" y="420" width="320" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 讲授者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'levinas',
    name: '列维纳斯',
    era: 'modernLate',
    seal: '他者之面',
    motto: ['面容之思', '为他之责'],
    caption: '面容之书',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 200, p.primary)}
        ${pillar(420, 460, 200, p.primary)}
        ${candle(380, 380, ink)}
        ${bookOpen(160, 400, 80, p.ink, p.ground)}
        <!-- 他者面容 -->
        <g transform="translate(360 320)" fill="${ink}" opacity="0.85">
          <ellipse cx="0" cy="0" rx="18" ry="22"/>
          <circle cx="-6" cy="-2" r="1.6" fill="${p.ground}"/>
          <circle cx="6" cy="-2" r="1.6" fill="${p.ground}"/>
          <path d="M -4 8 Q 0 12 4 8" fill="none" stroke="${p.ground}" stroke-width="0.8"/>
        </g>
        <!-- 桌 -->
        <rect x="80" y="420" width="320" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 沉思者 -->
        <g transform="translate(220 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },

  // ── E 极端内 ──
  {
    id: 'epicurus',
    name: '伊壁鸠鲁',
    era: 'classical',
    seal: '无扰之乐',
    motto: ['友谊至上', '花园之教'],
    caption: '静园之友',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 200, p.primary)}
        ${pillar(420, 460, 200, p.primary)}
        ${laurelBranch(120, 360, 1, p.accent)}
        ${laurelBranch(360, 360, -1, p.accent)}
        ${bookOpen(240, 400, 80, p.ink, p.ground)}
        <!-- 葡萄藤 -->
        <g stroke="${p.accent}" stroke-width="1.4" fill="none">
          <path d="M 60 360 q 20 -8 40 -4 q 20 8 40 -2"/>
          <circle cx="80" cy="356" r="3" fill="${p.seal}"/>
          <circle cx="100" cy="350" r="3" fill="${p.seal}"/>
          <circle cx="120" cy="354" r="3" fill="${p.seal}"/>
        </g>
        <g stroke="${p.accent}" stroke-width="1.4" fill="none">
          <path d="M 320 360 q 20 8 40 4 q 20 -8 40 2"/>
          <circle cx="340" cy="356" r="3" fill="${p.seal}"/>
          <circle cx="360" cy="350" r="3" fill="${p.seal}"/>
          <circle cx="380" cy="354" r="3" fill="${p.seal}"/>
        </g>
        <!-- 静坐者 -->
        <g transform="translate(240 360)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="11" ry="14"/>
          <path d="M -16 12 L -22 36 L 22 36 L 16 12 Z"/>
          <ellipse cx="0" cy="-18" rx="9" ry="11" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'machiavelli',
    name: '马基雅维利',
    era: 'medieval',
    seal: '权术之真',
    motto: ['君主之论', '德与运'],
    caption: '城堡之笔',
    buildScene(p, ink) {
      return `
        <!-- 城堡 -->
        <g transform="translate(60 320)" fill="${p.primary}" opacity="0.85" stroke="${ink}" stroke-width="1.4">
          <rect x="0" y="20" width="100" height="120"/>
          <path d="M 0 20 L 0 0 L 14 0 L 14 20 Z"/>
          <path d="M 32 20 L 32 0 L 46 0 L 46 20 Z"/>
          <path d="M 64 20 L 64 0 L 78 0 L 78 20 Z"/>
          <path d="M 86 20 L 86 0 L 100 0 L 100 20 Z"/>
          <rect x="20" y="60" width="14" height="20" fill="${p.ink}"/>
          <rect x="66" y="60" width="14" height="20" fill="${p.ink}"/>
        </g>
        <g transform="translate(320 320)" fill="${p.primary}" opacity="0.85" stroke="${ink}" stroke-width="1.4">
          <rect x="0" y="20" width="100" height="120"/>
          <path d="M 0 20 L 0 0 L 14 0 L 14 20 Z"/>
          <path d="M 32 20 L 32 0 L 46 0 L 46 20 Z"/>
          <path d="M 64 20 L 64 0 L 78 0 L 78 20 Z"/>
          <path d="M 86 20 L 86 0 L 100 0 L 100 20 Z"/>
        </g>
        ${candle(140, 380, ink)}
        ${bookOpen(300, 400, 80, p.ink, p.ground)}
        <!-- 桌 -->
        <rect x="180" y="420" width="120" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 写者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
          <line x1="-20" y1="6" x2="-40" y2="0" stroke="${ink}" stroke-width="1.6"/>
        </g>`;
    },
  },
  {
    id: 'hobbes',
    name: '霍布斯',
    era: 'modernEarly',
    seal: '利维坦',
    motto: ['自然状态', '主权之约'],
    caption: '王冠之书',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 200, p.primary)}
        ${pillar(420, 460, 200, p.primary)}
        ${crown(140, 200, 50, p.seal)}
        ${bookOpen(320, 400, 80, p.ink, p.ground)}
        ${candle(220, 400, ink)}
        <!-- 桌 -->
        <rect x="80" y="420" width="320" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 沉思者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'schopenhauer',
    name: '叔本华',
    era: 'modernLate',
    seal: '意志与表象',
    motto: ['世界之苦', '卷毛之友'],
    caption: '书斋之灯',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 200, p.primary)}
        ${pillar(420, 460, 200, p.primary)}
        ${candle(360, 380, ink)}
        ${bookOpen(140, 400, 80, p.ink, p.ground)}
        <!-- 桌 -->
        <rect x="80" y="420" width="320" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 沉思者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'benjamin',
    name: '本雅明',
    era: 'modernLate',
    seal: '星丛之思',
    motto: ['机械复制', '拱廊之街'],
    caption: '书海之椅',
    buildScene(p, ink) {
      return `
        ${pillar(60, 460, 220, p.primary)}
        ${pillar(420, 460, 220, p.primary)}
        <!-- 书架 -->
        <g transform="translate(60 240)" fill="${p.primary}" opacity="0.85" stroke="${ink}" stroke-width="0.8">
          <rect x="0" y="0" width="100" height="200"/>
          <line x1="0" y1="50" x2="100" y2="50"/>
          <line x1="0" y1="100" x2="100" y2="100"/>
          <line x1="0" y1="150" x2="100" y2="150"/>
        </g>
        ${Array.from({ length: 18 }, (_, i) => `<rect x="${65 + (i % 6) * 13}" y="${250 + Math.floor(i / 6) * 50}" width="10" height="40" fill="${p.ink}" opacity="0.7"/>`).join('')}
        <g transform="translate(320 240)" fill="${p.primary}" opacity="0.85" stroke="${ink}" stroke-width="0.8">
          <rect x="0" y="0" width="100" height="200"/>
          <line x1="0" y1="50" x2="100" y2="50"/>
          <line x1="0" y1="100" x2="100" y2="100"/>
          <line x1="0" y1="150" x2="100" y2="150"/>
        </g>
        ${Array.from({ length: 18 }, (_, i) => `<rect x="${325 + (i % 6) * 13}" y="${250 + Math.floor(i / 6) * 50}" width="10" height="40" fill="${p.ink}" opacity="0.7"/>`).join('')}
        ${bookOpen(240, 400, 80, p.ink, p.ground)}
        ${quill(380, 380, -1, p.ink)}
        <!-- 桌 -->
        <rect x="160" y="420" width="160" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 读著者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
  {
    id: 'foucault',
    name: '福柯',
    era: 'modernLate',
    seal: '知识考古',
    motto: ['规训与惩罚', '权力之眼'],
    caption: '监狱之柱',
    buildScene(p, ink) {
      return `
        <!-- 监狱柱（Panopticon 意象）-->
        <g stroke="${ink}" stroke-width="2" fill="${p.primary}" opacity="0.85">
          <rect x="80" y="260" width="14" height="200"/>
          <rect x="160" y="260" width="14" height="200"/>
          <rect x="306" y="260" width="14" height="200"/>
          <rect x="386" y="260" width="14" height="200"/>
        </g>
        <line x1="60" y1="260" x2="420" y2="260" stroke="${p.ink}" stroke-width="2"/>
        <line x1="60" y1="460" x2="420" y2="460" stroke="${p.ink}" stroke-width="2"/>
        ${candle(140, 380, ink)}
        ${bookOpen(320, 400, 80, p.ink, p.ground)}
        <!-- 桌 -->
        <rect x="180" y="420" width="120" height="14" fill="${p.primary}" opacity="0.85"/>
        <!-- 沉思者 -->
        <g transform="translate(240 340)" fill="${ink}" opacity="0.95">
          <ellipse cx="0" cy="0" rx="13" ry="16"/>
          <path d="M -20 14 L -26 50 L 26 50 L 20 14 Z"/>
          <ellipse cx="0" cy="-20" rx="11" ry="13" fill="${p.primary}"/>
        </g>`;
    },
  },
];
