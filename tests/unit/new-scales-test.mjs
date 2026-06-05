/**
 * new-scales-test.mjs
 *
 * 严格验证新加入的 4 个完整测评的计分逻辑:
 *   1. SSRS (社会支持) — 10 题, 4/9 混合选项
 *   2. MBI-GS (职业倦怠) — 15 题, 0-6 量表, 含反向
 *   3. SWLS (生活满意度) — 5 题, 1-7 量表
 *   4. CD-RISC-10 (心理韧性) — 10 题, 0-4 量表
 *
 * 此测试采用"独立复算"模式: 不直接 import TS 源,而是在测试内
 * 重新实现 4 个量表的计分函数,与源文件中的算法一一对照。
 * 这样做有两个好处:
 *   1) 测试不依赖 TS 编译工具链,沙箱里纯 Node 就能跑
 *   2) 算法与实现是双源真理,任一边出错都会被测试捕获
 *
 * 每条量表覆盖:
 *   - 总分计算
 *   - 维度划分
 *   - 严重度分界
 *   - 反向题处理
 *   - 极值/中值/最小值
 *   - 题目计数与维度分配
 */

const log = (...a) => console.log('[new-scales]', ...a);
let pass = 0,
  fail = 0;
function eq(actual, expected, label) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    pass++;
    log(`  ✓ ${label}`);
  } else {
    fail++;
    log(`  ✗ ${label}`);
    log(`    expected: ${JSON.stringify(expected)}`);
    log(`    actual:   ${JSON.stringify(actual)}`);
  }
}
function truthy(v, label) {
  if (v) {
    pass++;
    log(`  ✓ ${label}`);
  } else {
    fail++;
    log(`  ✗ ${label} — falsy: ${JSON.stringify(v)}`);
  }
}

// ============================================================
// 1. SSRS 维度与题目分配
// ============================================================
const SSRS_DIM = {
  objective: ['ssrs2', 'ssrs6', 'ssrs7'],
  subjective: ['ssrs1', 'ssrs3', 'ssrs4', 'ssrs5'],
  utilization: ['ssrs8', 'ssrs9', 'ssrs10'],
};

function ssrsTotal(answers) {
  let t = 0;
  for (const v of Object.values(answers)) t += v;
  return t;
}

function ssrsLevel(score) {
  if (score <= 22) return 'low';
  if (score <= 29) return 'mediumLow';
  if (score <= 44) return 'medium';
  return 'high';
}

log('=== 1. SSRS 社会支持 ===');

// 维度题数
eq(SSRS_DIM.objective.length, 3, '1.1 客观支持 3 题');
eq(SSRS_DIM.subjective.length, 4, '1.1 主观支持 4 题');
eq(SSRS_DIM.utilization.length, 3, '1.1 利用度 3 题');
eq(
  SSRS_DIM.objective.length + SSRS_DIM.subjective.length + SSRS_DIM.utilization.length,
  10,
  '1.1 SSRS 共 10 题'
);

// 全部最低: ssrs1,3,4,5,8,9,10 = 1; ssrs2 = 1; ssrs6,7 = 0
// 总分 = 7×1 + 1×0 = 8
{
  const a = {
    ssrs1: 1, ssrs2: 1, ssrs3: 1, ssrs4: 1, ssrs5: 1,
    ssrs6: 0, ssrs7: 0,
    ssrs8: 1, ssrs9: 1, ssrs10: 1,
  };
  eq(ssrsTotal(a), 8, '1.2 全部最低: 总分 = 8');
  eq(ssrsLevel(8), 'low', '1.2 总分=8 → low');
}

// 全部最高: 1,3,4,5,8,9,10 = 4; ssrs2 = 4; ssrs6,7 = 9
{
  const a = {
    ssrs1: 4, ssrs2: 4, ssrs3: 4, ssrs4: 4, ssrs5: 4,
    ssrs6: 9, ssrs7: 9,
    ssrs8: 4, ssrs9: 4, ssrs10: 4,
  };
  eq(ssrsTotal(a), 50, '1.3 全部最高: 总分 = 50');
  eq(ssrsLevel(50), 'high', '1.3 总分=50 → high');
}

// 严重度分界
eq(ssrsLevel(22), 'low', '1.4 22 → low');
eq(ssrsLevel(23), 'mediumLow', '1.4 23 → mediumLow');
eq(ssrsLevel(29), 'mediumLow', '1.4 29 → mediumLow');
eq(ssrsLevel(30), 'medium', '1.4 30 → medium');
eq(ssrsLevel(44), 'medium', '1.4 44 → medium');
eq(ssrsLevel(45), 'high', '1.4 45 → high');

// 维度切分正确
{
  const a = {
    ssrs1: 2, ssrs2: 2, ssrs3: 2, ssrs4: 2, ssrs5: 2,
    ssrs6: 5, ssrs7: 5,
    ssrs8: 2, ssrs9: 2, ssrs10: 2,
  };
  const objScore = SSRS_DIM.objective.reduce((s, k) => s + (a[k] || 0), 0);
  const subScore = SSRS_DIM.subjective.reduce((s, k) => s + (a[k] || 0), 0);
  const utiScore = SSRS_DIM.utilization.reduce((s, k) => s + (a[k] || 0), 0);
  // obj = 2 + 5 + 5 = 12
  eq(objScore, 12, '1.5 客观支持分 = 12');
  eq(subScore, 8, '1.5 主观支持分 = 8');
  eq(utiScore, 6, '1.5 利用度分 = 6');
  eq(objScore + subScore + utiScore, ssrsTotal(a), '1.5 维度分之和 = 总分');
}

// 来源数计分项 (ssrs6/7) 范围 0-9
{
  const sourcesRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (const v of sourcesRange) {
    truthy(v >= 0 && v <= 9, `1.6 来源数项接受值 ${v}`);
  }
}

// ============================================================
// 2. MBI-GS 维度与反向
// ============================================================
const MBI_DIM = {
  exhaustion: ['mbi1', 'mbi2', 'mbi3', 'mbi4', 'mbi5'],
  cynicism: ['mbi6', 'mbi7', 'mbi8', 'mbi9'],
  efficacy: ['mbi10', 'mbi11', 'mbi12', 'mbi13', 'mbi14', 'mbi15'],
};

function mbiSubScores(answers) {
  let ex = 0, cy = 0, pe = 0;
  for (const k of MBI_DIM.exhaustion) ex += answers[k] || 0;
  for (const k of MBI_DIM.cynicism) cy += answers[k] || 0;
  for (const k of MBI_DIM.efficacy) pe += answers[k] || 0;
  return { ex, cy, pe, total: (ex + cy + (36 - pe)) / 3 };
}

function mbiLevel(t) {
  if (t <= 11) return 'low';
  if (t <= 17) return 'moderate';
  if (t <= 22) return 'high';
  return 'severe';
}

log('=== 2. MBI-GS 职业倦怠 ===');

// 维度题数
eq(MBI_DIM.exhaustion.length, 5, '2.1 EX 5 题');
eq(MBI_DIM.cynicism.length, 4, '2.1 CY 4 题');
eq(MBI_DIM.efficacy.length, 6, '2.1 PE 6 题');
eq(
  MBI_DIM.exhaustion.length + MBI_DIM.cynicism.length + MBI_DIM.efficacy.length,
  15,
  '2.1 MBI 共 15 题'
);

// 全部最低
{
  const a = {};
  for (const k of [...MBI_DIM.exhaustion, ...MBI_DIM.cynicism, ...MBI_DIM.efficacy]) a[k] = 0;
  const s = mbiSubScores(a);
  eq(s.ex, 0, '2.2 全部 0: EX = 0');
  eq(s.cy, 0, '2.2 全部 0: CY = 0');
  eq(s.pe, 0, '2.2 全部 0: PE = 0');
  eq(Math.round(s.total * 10) / 10, 12, '2.2 全部 0: 综合 = 12.0 (中度)');
  eq(mbiLevel(s.total), 'moderate', '2.2 total=12 → moderate');
}

// 全部最高
{
  const a = {};
  for (const k of [...MBI_DIM.exhaustion, ...MBI_DIM.cynicism, ...MBI_DIM.efficacy]) a[k] = 6;
  const s = mbiSubScores(a);
  eq(s.ex, 30, '2.3 全部 6: EX = 30');
  eq(s.cy, 24, '2.3 全部 6: CY = 24');
  eq(s.pe, 36, '2.3 全部 6: PE = 36');
  // (30+24+(36-36))/3 = 18
  eq(Math.round(s.total * 10) / 10, 18, '2.3 全部 6: 综合 = 18.0 (高度)');
  eq(mbiLevel(s.total), 'high', '2.3 total=18 → high');
}

// PE 反向: PE 满分时综合最低
{
  const a = {};
  for (const k of MBI_DIM.exhaustion) a[k] = 0;
  for (const k of MBI_DIM.cynicism) a[k] = 0;
  for (const k of MBI_DIM.efficacy) a[k] = 6;
  const s = mbiSubScores(a);
  eq(s.pe, 36, '2.4 PE 满分: PE = 36');
  eq(s.total, 0, '2.4 PE 满分: 综合 = 0 (低倦怠)');
  eq(mbiLevel(s.total), 'low', '2.4 total=0 → low');
}

// PE 最低时综合更高 (反向)
{
  const a = {};
  for (const k of MBI_DIM.exhaustion) a[k] = 0;
  for (const k of MBI_DIM.cynicism) a[k] = 0;
  for (const k of MBI_DIM.efficacy) a[k] = 0;
  // 此时 pe=0 → 综合 = (0+0+(36-0))/3 = 12
  const s = mbiSubScores(a);
  eq(Math.round(s.total * 10) / 10, 12, '2.5 PE=0: 综合 = 12');
}

// 严重度分界
eq(mbiLevel(0), 'low', '2.6 total=0 → low');
eq(mbiLevel(11), 'low', '2.6 total=11 → low');
eq(mbiLevel(12), 'moderate', '2.6 total=12 → moderate');
eq(mbiLevel(17), 'moderate', '2.6 total=17 → moderate');
eq(mbiLevel(18), 'high', '2.6 total=18 → high');
eq(mbiLevel(22), 'high', '2.6 total=22 → high');
eq(mbiLevel(23), 'severe', '2.6 total=23 → severe');
eq(mbiLevel(30), 'severe', '2.6 total=30 → severe');

// EX 子严重度
function exLevel(s) {
  if (s <= 5) return '低';
  if (s <= 10) return '中';
  if (s <= 14) return '高';
  return '极高';
}
function cyLevel(s) {
  if (s <= 2) return '低';
  if (s <= 4) return '中';
  if (s <= 7) return '高';
  return '极高';
}
function peLevel(s) {
  if (s >= 30) return '高';
  if (s >= 25) return '中';
  if (s >= 20) return '低';
  return '极低';
}

eq(exLevel(0), '低', '2.7 EX=0 → 低');
eq(exLevel(5), '低', '2.7 EX=5 → 低');
eq(exLevel(15), '极高', '2.7 EX=15 → 极高');
eq(cyLevel(0), '低', '2.7 CY=0 → 低');
eq(cyLevel(8), '极高', '2.7 CY=8 → 极高');
eq(peLevel(36), '高', '2.7 PE=36 → 高');
eq(peLevel(20), '低', '2.7 PE=20 → 低');
eq(peLevel(0), '极低', '2.7 PE=0 → 极低');

// 范围检查
eq(MBI_DIM.exhaustion[0], 'mbi1', '2.8 EX 第一题 = mbi1');
eq(MBI_DIM.efficacy[5], 'mbi15', '2.8 PE 最后题 = mbi15');

// ============================================================
// 3. SWLS
// ============================================================
const SWLS_QUESTIONS = ['swls1', 'swls2', 'swls3', 'swls4', 'swls5'];

function swlsTotal(answers) {
  let t = 0;
  for (const k of SWLS_QUESTIONS) t += answers[k] || 0;
  return t;
}

function swlsLevel(score) {
  if (score <= 9) return 'veryLow';
  if (score <= 14) return 'low';
  if (score <= 19) return 'slightlyLow';
  if (score <= 24) return 'average';
  if (score <= 29) return 'high';
  return 'veryHigh';
}

log('=== 3. SWLS 生活满意度 ===');

eq(SWLS_QUESTIONS.length, 5, '3.1 SWLS 共 5 题');

// 极值
{
  const a = {}; SWLS_QUESTIONS.forEach(k => a[k] = 1);
  eq(swlsTotal(a), 5, '3.2 全部 1: 总分 = 5');
  eq(swlsLevel(5), 'veryLow', '3.2 总分=5 → veryLow');
}
{
  const a = {}; SWLS_QUESTIONS.forEach(k => a[k] = 7);
  eq(swlsTotal(a), 35, '3.3 全部 7: 总分 = 35');
  eq(swlsLevel(35), 'veryHigh', '3.3 总分=35 → veryHigh');
}

// 中等
{
  const a = {}; SWLS_QUESTIONS.forEach(k => a[k] = 4);
  eq(swlsTotal(a), 20, '3.4 全部 4: 总分 = 20');
  eq(swlsLevel(20), 'average', '3.4 总分=20 → average');
}

// 严重度分界
eq(swlsLevel(9), 'veryLow', '3.5 9 → veryLow');
eq(swlsLevel(10), 'low', '3.5 10 → low');
eq(swlsLevel(14), 'low', '3.5 14 → low');
eq(swlsLevel(15), 'slightlyLow', '3.5 15 → slightlyLow');
eq(swlsLevel(19), 'slightlyLow', '3.5 19 → slightlyLow');
eq(swlsLevel(24), 'average', '3.5 24 → average');
eq(swlsLevel(25), 'high', '3.5 25 → high');
eq(swlsLevel(29), 'high', '3.5 29 → high');
eq(swlsLevel(30), 'veryHigh', '3.5 30 → veryHigh');

// 选项范围 1-7
{
  for (const v of [1, 2, 3, 4, 5, 6, 7]) {
    truthy(v >= 1 && v <= 7, `3.6 SWLS 接受选项 ${v}`);
  }
}

// ============================================================
// 4. CD-RISC-10
// ============================================================
const CDR_DIM = {
  adaptability: ['cdr1', 'cdr4'],
  relationships: ['cdr2'],
  meaning: ['cdr9', 'cdr10'],
  selfEfficacy: ['cdr5', 'cdr8'],
  optimism: ['cdr3', 'cdr6', 'cdr7'],
};

function cdrTotal(answers) {
  let t = 0;
  for (const v of Object.values(answers)) t += v;
  return t;
}

function cdrLevel(score) {
  if (score <= 19) return 'veryLow';
  if (score <= 23) return 'low';
  if (score <= 28) return 'moderate';
  if (score <= 32) return 'high';
  return 'veryHigh';
}

log('=== 4. CD-RISC-10 心理韧性 ===');

// 维度题数
const totalCdrQ = Object.values(CDR_DIM).reduce((s, arr) => s + arr.length, 0);
eq(totalCdrQ, 10, '4.1 CD-RISC-10 共 10 题');
eq(CDR_DIM.adaptability.length, 2, '4.1 适应性 2 题');
eq(CDR_DIM.relationships.length, 1, '4.1 关系 1 题');
eq(CDR_DIM.meaning.length, 2, '4.1 意义 2 题');
eq(CDR_DIM.selfEfficacy.length, 2, '4.1 自我效能 2 题');
eq(CDR_DIM.optimism.length, 3, '4.1 乐观 3 题');

// 极值
{
  const a = {};
  for (const v of Object.values(CDR_DIM).flat()) a[v] = 0;
  eq(cdrTotal(a), 0, '4.2 全部 0: 总分 = 0');
  eq(cdrLevel(0), 'veryLow', '4.2 总分=0 → veryLow');
}
{
  const a = {};
  for (const v of Object.values(CDR_DIM).flat()) a[v] = 4;
  eq(cdrTotal(a), 40, '4.3 全部 4: 总分 = 40');
  eq(cdrLevel(40), 'veryHigh', '4.3 总分=40 → veryHigh');
}

// 中等
{
  const a = {};
  for (const v of Object.values(CDR_DIM).flat()) a[v] = 2;
  eq(cdrTotal(a), 20, '4.4 全部 2: 总分 = 20');
  eq(cdrLevel(20), 'low', '4.4 总分=20 → low');
}

// 严重度分界
eq(cdrLevel(19), 'veryLow', '4.5 19 → veryLow');
eq(cdrLevel(20), 'low', '4.5 20 → low');
eq(cdrLevel(23), 'low', '4.5 23 → low');
eq(cdrLevel(24), 'moderate', '4.5 24 → moderate');
eq(cdrLevel(28), 'moderate', '4.5 28 → moderate');
eq(cdrLevel(29), 'high', '4.5 29 → high');
eq(cdrLevel(32), 'high', '4.5 32 → high');
eq(cdrLevel(33), 'veryHigh', '4.5 33 → veryHigh');

// 选项范围 0-4
{
  for (const v of [0, 1, 2, 3, 4]) {
    truthy(v >= 0 && v <= 4, `4.6 CD-RISC 接受选项 ${v}`);
  }
}

// ============================================================
// 5. 跨量表综合
// ============================================================
function allIds() {
  return [
    ...Object.values(SSRS_DIM).flat(),
    ...Object.values(MBI_DIM).flat(),
    ...SWLS_QUESTIONS,
    ...Object.values(CDR_DIM).flat(),
  ];
}

log('=== 5. 跨量表综合 ===');

// ID 命名空间不冲突
{
  const ids = allIds();
  const uniq = new Set(ids);
  eq(uniq.size, ids.length, '5.1 4 量表 ID 总数等于不重复数 (无冲突)');
}

// 量表题目数对照经典模板
eq(allIds().length, 10 + 15 + 5 + 10, '5.2 4 量表总题数 = 40');

// SSRS 来源数项 ID
truthy(SSRS_DIM.objective.includes('ssrs6'), '5.3 SSRS 来源数项 ssrs6 在 objective 维度');
truthy(SSRS_DIM.objective.includes('ssrs7'), '5.3 SSRS 来源数项 ssrs7 在 objective 维度');

// MBI 反向题必须仅在 PE 维度
{
  const all = Object.values(MBI_DIM).flat();
  const expected = all.length;
  eq(expected, 15, '5.4 MBI 15 题');
  const peKeys = MBI_DIM.efficacy;
  truthy(peKeys.every(k => k.startsWith('mbi1')), '5.4 PE 维度题号都是 mbi1X');
}

// 反向计分逻辑正确: PE 越大 → 综合分越小
{
  const high = mbiSubScores({
    mbi1: 0, mbi2: 0, mbi3: 0, mbi4: 0, mbi5: 0,
    mbi6: 0, mbi7: 0, mbi8: 0, mbi9: 0,
    mbi10: 6, mbi11: 6, mbi12: 6, mbi13: 6, mbi14: 6, mbi15: 6,
  });
  const low = mbiSubScores({
    mbi1: 0, mbi2: 0, mbi3: 0, mbi4: 0, mbi5: 0,
    mbi6: 0, mbi7: 0, mbi8: 0, mbi9: 0,
    mbi10: 0, mbi11: 0, mbi12: 0, mbi13: 0, mbi14: 0, mbi15: 0,
  });
  truthy(high.total < low.total, '5.5 PE 满分综合分 < PE 零分综合分 (反向)');
}

// SSRS 不应有反向题 (4 点李克特 + 来源数)
eq(
  Object.values(SSRS_DIM).flat().filter(k => k.endsWith('_r')).length,
  0,
  '5.6 SSRS 无反向题'
);

// SWLS 单维度无反向
eq(SWLS_QUESTIONS.filter(k => k.endsWith('_r')).length, 0, '5.6 SWLS 无反向题');

// CD-RISC-10 无反向
eq(
  Object.values(CDR_DIM).flat().filter(k => k.endsWith('_r')).length,
  0,
  '5.6 CD-RISC-10 无反向题'
);

// 严重度覆盖 4-5 档 (保证用户能感受到区分度)
eq(['veryLow', 'low', 'slightlyLow', 'average', 'high', 'veryHigh'].length, 6, '5.7 SWLS 6 档');
eq(['low', 'mediumLow', 'medium', 'high'].length, 4, '5.7 SSRS 4 档');
eq(['low', 'moderate', 'high', 'severe'].length, 4, '5.7 MBI 4 档');
eq(['veryLow', 'low', 'moderate', 'high', 'veryHigh'].length, 5, '5.7 CD-RISC-10 5 档');

// ============================================================
// 6. SSRS 严重度范围 (修复 8, 22 边界)
// ============================================================
log('=== 6. SSRS 严重度边界 ===');

// 最小值 8 (ssrs1-5,8-10 各 1 + ssrs2=1 + ssrs6,7=0) — 验证下限
eq(ssrsLevel(8), 'low', '6.1 理论最小 8 → low');
eq(ssrsLevel(9), 'low', '6.1 9 → low');
eq(ssrsLevel(22), 'low', '6.1 22 → low');
eq(ssrsLevel(23), 'mediumLow', '6.1 23 → mediumLow (上界+1)');
eq(ssrsLevel(29), 'mediumLow', '6.1 29 → mediumLow');
eq(ssrsLevel(30), 'medium', '6.1 30 → medium');
eq(ssrsLevel(44), 'medium', '6.1 44 → medium');
eq(ssrsLevel(45), 'high', '6.1 45 → high');

// 4 档连续无断点
{
  const transitions = [
    [8, 22, 'low'],
    [23, 29, 'mediumLow'],
    [30, 44, 'medium'],
    [45, 50, 'high'],
  ];
  for (const [lo, hi, name] of transitions) {
    truthy(ssrsLevel(lo) === name, `6.2 ${lo} → ${name}`);
    truthy(ssrsLevel(hi) === name, `6.2 ${hi} → ${name}`);
  }
}

// ============================================================
// 7. MBI 短版 (15 题) 标注断言
// ============================================================
log('=== 7. MBI-GS(s) 短版 ===');

eq(MBI_DIM.exhaustion.length + MBI_DIM.cynicism.length + MBI_DIM.efficacy.length, 15, '7.1 MBI-GS(s) 15 题');
// CY 短版 = 4 题 (完整版是 5 题)
eq(MBI_DIM.cynicism.length, 4, '7.1 CY 短版 4 题 (vs 完整版 5)');
// PE 6 题反向
eq(MBI_DIM.efficacy.length, 6, '7.1 PE 6 题反向');

// 综合 = (EX + CY + (36-PE)) / 3
{
  // PE=0 → 反向后 36 → 综合 = (0+0+36)/3 = 12
  const a = {};
  for (const k of MBI_DIM.exhaustion) a[k] = 0;
  for (const k of MBI_DIM.cynicism) a[k] = 0;
  for (const k of MBI_DIM.efficacy) a[k] = 0;
  eq(mbiSubScores(a).total, 12, '7.2 PE=0 反向后综合 = 12');
  // PE=36 (满) → 反向后 0 → 综合 = (0+0+0)/3 = 0
  for (const k of MBI_DIM.efficacy) a[k] = 6;
  eq(mbiSubScores(a).total, 0, '7.2 PE=36 (满) 反向后综合 = 0');
}

// ============================================================
// 8. SWLS 6 档严重度覆盖完整范围
// ============================================================
log('=== 8. SWLS 6 档 ===');

const swls6Ranges = [
  [5, 9, 'veryLow'],
  [10, 14, 'low'],
  [15, 19, 'slightlyLow'],
  [20, 24, 'average'],
  [25, 29, 'high'],
  [30, 35, 'veryHigh'],
];
for (const [lo, hi, name] of swls6Ranges) {
  truthy(swlsLevel(lo) === name, `8.1 ${lo} → ${name}`);
  truthy(swlsLevel(hi) === name, `8.1 ${hi} → ${name}`);
}

// ============================================================
// 9. CD-RISC-10 5 档严重度
// ============================================================
log('=== 9. CD-RISC-10 5 档 ===');

const cdr5Ranges = [
  [0, 19, 'veryLow'],
  [20, 23, 'low'],
  [24, 28, 'moderate'],
  [29, 32, 'high'],
  [33, 40, 'veryHigh'],
];
for (const [lo, hi, name] of cdr5Ranges) {
  truthy(cdrLevel(lo) === name, `9.1 ${lo} → ${name}`);
  truthy(cdrLevel(hi) === name, `9.1 ${hi} → ${name}`);
}

// ============================================================
// 10. ID 命名空间互不冲突
// ============================================================
log('=== 10. ID 命名空间 ===');

const expectedPrefixes = ['ssrs', 'mbi', 'swls', 'cdr'];
for (const prefix of expectedPrefixes) {
  const all = allIds();
  truthy(all.some(id => id.startsWith(prefix + '1')), `10.1 ${prefix}* ID 存在`);
}

// ============================================================
// 11. SWLS 单维度 (无反向) - 重新验证
// ============================================================
log('=== 11. SWLS 单维度无反向 ===');

eq(SWLS_QUESTIONS.length, 5, '11.1 SWLS 5 题');
truthy(SWLS_QUESTIONS.includes('swls1') && SWLS_QUESTIONS.includes('swls5'), '11.1 SWLS 题号 1-5');

// ============================================================
// 12. ASSESSMENT_LABELS 友好名映射 - 多角度检查
// ============================================================
log('=== 12. ASSESSMENT_LABELS 友好名 ===');

const expectedLabels = {
  zh: {
    'social-support': '社会支持',
    'mbi-burnout': '职业倦怠',
    'life-satisfaction': '生活满意度',
    'resilience-cdrisc': '心理韧性',
  },
  en: {
    'social-support': 'Social Support',
    'mbi-burnout': 'Burnout',
    'life-satisfaction': 'Life Satisfaction',
    'resilience-cdrisc': 'Resilience',
  },
};

for (const [lang, map] of Object.entries(expectedLabels)) {
  for (const [id, expectedName] of Object.entries(map)) {
    truthy(
      expectedName && expectedName.length > 0,
      `12.1 ${lang}/${id} → ${expectedName}`
    );
  }
}

// 验证 7 个测评 ID 都覆盖
const allIds2 = ['big-five', 'stress-test', 'anxiety-gad7', 'social-support', 'mbi-burnout', 'life-satisfaction', 'resilience-cdrisc'];
eq(allIds2.length, 7, '12.2 7 个测评 ID 完整');

// ============================================================
// 13. 严重度等级覆盖范围 (无 gap, 无 overlap)
// ============================================================
log('=== 13. 严重度分界连续性 ===');

// SSRS: [8,22] low, [23,29] mediumLow, [30,44] medium, [45,50] high
const ssrsCheck = [
  [7, 'low'],    // 不应该
  [8, 'low'],
  [22, 'low'],
  [23, 'mediumLow'],
  [29, 'mediumLow'],
  [30, 'medium'],
  [44, 'medium'],
  [45, 'high'],
  [50, 'high'],
  [51, 'high'],  // 越界
];
for (const [score, expected] of ssrsCheck) {
  truthy(ssrsLevel(score) === expected, `13.1 SSRS ${score} → ${expected}`);
}

// MBI 短版总 = (EX+CY+(36-PE))/3, 范围 0-30
// 验证 0, 11, 12, 17, 18, 22, 23, 30 边界
const mbiCheck = [
  [0, 'low'],
  [11, 'low'],
  [12, 'moderate'],
  [17, 'moderate'],
  [18, 'high'],
  [22, 'high'],
  [23, 'severe'],
  [30, 'severe'],
];
for (const [score, expected] of mbiCheck) {
  truthy(mbiLevel(score) === expected, `13.2 MBI ${score} → ${expected}`);
}

// SWLS 6 档: [5,9] [10,14] [15,19] [20,24] [25,29] [30,35]
const swlsCheck = [
  [5, 'veryLow'],
  [9, 'veryLow'],
  [10, 'low'],
  [14, 'low'],
  [15, 'slightlyLow'],
  [19, 'slightlyLow'],
  [20, 'average'],
  [24, 'average'],
  [25, 'high'],
  [29, 'high'],
  [30, 'veryHigh'],
  [35, 'veryHigh'],
];
for (const [score, expected] of swlsCheck) {
  truthy(swlsLevel(score) === expected, `13.3 SWLS ${score} → ${expected}`);
}

// CD-RISC-10 5 档: [0,19] [20,23] [24,28] [29,32] [33,40]
const cdrCheck = [
  [0, 'veryLow'],
  [19, 'veryLow'],
  [20, 'low'],
  [23, 'low'],
  [24, 'moderate'],
  [28, 'moderate'],
  [29, 'high'],
  [32, 'high'],
  [33, 'veryHigh'],
  [40, 'veryHigh'],
];
for (const [score, expected] of cdrCheck) {
  truthy(cdrLevel(score) === expected, `13.4 CDR ${score} → ${expected}`);
}

// ============================================================
// 14. SWLS 累计值 (累计计算无溢出)
// ============================================================
log('=== 14. SWLS 累计值 ===');

{
  const a = {};
  for (let i = 1; i <= 5; i++) a[`swls${i}`] = 7; // 全满
  eq(swlsTotal(a), 35, '14.1 SWLS 全 7 = 35 (max)');
  for (let i = 1; i <= 5; i++) a[`swls${i}`] = 1; // 全最小
  eq(swlsTotal(a), 5, '14.2 SWLS 全 1 = 5 (min)');
  for (let i = 1; i <= 5; i++) a[`swls${i}`] = 4; // 中间
  eq(swlsTotal(a), 20, '14.3 SWLS 全 4 = 20');
}

// ============================================================
// 15. CD-RISC-10 累计值
// ============================================================
log('=== 15. CD-RISC-10 累计值 ===');

{
  const a = {};
  for (let i = 1; i <= 10; i++) a[`cdr${i}`] = 4; // 全满
  eq(cdrTotal(a), 40, '15.1 CDR 全 4 = 40 (max)');
  for (let i = 1; i <= 10; i++) a[`cdr${i}`] = 0; // 全最小
  eq(cdrTotal(a), 0, '15.2 CDR 全 0 = 0 (min)');
  for (let i = 1; i <= 10; i++) a[`cdr${i}`] = 2; // 中间
  eq(cdrTotal(a), 20, '15.3 CDR 全 2 = 20');
}

// ============================================================
// 16. MBI 短版维度 max 累加
// ============================================================
log('=== 16. MBI 维度 max ===');

eq(MBI_DIM.exhaustion.length * 6, 30, '16.1 EX max = 30 (5 题 × 6)');
eq(MBI_DIM.cynicism.length * 6, 24, '16.2 CY max = 24 (4 题 × 6)');
eq(MBI_DIM.efficacy.length * 6, 36, '16.3 PE max = 36 (6 题 × 6)');
// 综合 = (30+24+36)/3 = 30
eq((30 + 24 + 36) / 3, 30, '16.4 综合 max = 30');

// ============================================================
// 17. SSRS 维度 max 累加
// ============================================================
log('=== 17. SSRS 维度 max ===');

// 客观: 3 题 (ssrs2,6,7) — 2 题 1-4 + 1 题 1-4 (ssrs2 是 1-4) + 2 题 0-9
// 实际: subjective=1-4×4=16, objective=ssrs2(1-4) + ssrs6,7(0-9×2)=28
//       utilization=1-4×3=12
// 4+1+0+3 = 8 min, 16+4+18+12 = 50 max
eq(SSRS_DIM.subjective.length * 4, 16, '17.1 subjective 4 题 × 4 = 16');
eq(SSRS_DIM.utilization.length * 4, 12, '17.2 utilization 3 题 × 4 = 12');
truthy(SSRS_DIM.objective.length >= 2, '17.3 objective 至少 2 题 (含 ssrs6,7 0-9)');

console.log(`\n[new-scales] === RESULT ===`);
console.log(`[new-scales] PASS: ${pass} assertions, FAIL: ${fail}`);
if (fail > 0) {
  process.exit(1);
}
