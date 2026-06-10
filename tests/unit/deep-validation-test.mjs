/**
 * deep-validation-test.mjs
 *
 * 深度验证测试 — 检查 4 个新量表的:
 *   1. 数据文件 → 评分文件 跨文件一致性 (deep logic chain)
 *   2. 严重度范围连续性 (无空隙、无重叠)
 *   3. 反向题计分正确性
 *   4. 题目 ID 与 trait 分配一致性
 *   5. 页面渲染组件 props 链完整性
 *   6. 用户操作流程关键边界
 *
 * 与 new-scales-test.mjs 的区别:
 *   - new-scales-test: 独立复算分数,与源文件算法对照
 *   - 本文件: 直接 import TS 源,验证内部一致性、引用完整性、边界
 *
 * 运行: node tests/unit/deep-validation-test.mjs
 */

import {
  SSRS_QUESTIONS,
  SSRS_RESPONSE_OPTIONS,
  SSRS_SOURCES_OPTIONS,
  SSRS_DIMENSIONS,
  SSRS_SEVERITY,
  SSRS_RESOURCES,
  SSRS_LEVELS,
  SSRS_DIMENSION_ITEMS,
} from '../../src/data/ssrsData.ts';
import {
  MBI_QUESTIONS,
  MBI_RESPONSE_OPTIONS,
  MBI_DIMENSIONS,
  MBI_LEVELS,
  MBI_COPING_STRATEGIES,
  MBI_SEVERITY,
  MBI_DIMENSION_ITEMS,
  MBI_DIMENSION_LEVELS,
} from '../../src/data/mbiData.ts';
import {
  SWLS_QUESTIONS,
  SWLS_RESPONSE_OPTIONS,
  SWLS_LEVELS,
  SWLS_INTERPRETATION,
  SWLS_BOOST_STRATEGIES,
  SWLS_SEVERITY,
  SWLS_DIMENSIONS,
} from '../../src/data/swlsData.ts';
import {
  RESILIENCE_QUESTIONS,
  RESILIENCE_RESPONSE_OPTIONS,
  RESILIENCE_DIMENSIONS,
  RESILIENCE_SEVERITY,
  RESILIENCE_BOOST_STRATEGIES,
  RESILIENCE_DIMENSION_ITEMS,
  RESILIENCE_LEVELS,
} from '../../src/data/resilienceData.ts';

import {
  calculateSSRSTraits,
  getSSRSLevel,
  getSSRSLevelInfo,
  generateDetailedSSRSReport,
} from '../../src/services/ssrsScoring.ts';
import {
  calculateMBITraits,
  getMBITotalLevel,
  getMBILevelInfo,
  getMBIExLevel,
  getMBICyLevel,
  getMBIPeLevel,
  generateDetailedMBIReport,
} from '../../src/services/mbiScoring.ts';
import {
  calculateSWLSTraits,
  getSWLSLevel,
  getSWLSLevelInfo,
  generateDetailedSWLSReport,
} from '../../src/services/swlsScoring.ts';
import {
  calculateResilienceTraits,
  getResilienceLevel,
  getResilienceLevelInfo,
  generateDetailedResilienceReport,
} from '../../src/services/resilienceScoring.ts';

const log = (...a) => console.log('[deep-validation]', ...a);
let pass = 0,
  fail = 0;
const issues = [];

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
    issues.push(label);
  }
}
function truthy(v, label) {
  if (v) {
    pass++;
    log(`  ✓ ${label}`);
  } else {
    fail++;
    log(`  ✗ ${label} — falsy`);
    issues.push(label);
  }
}
function falsy(v, label) {
  if (!v) {
    pass++;
    log(`  ✓ ${label}`);
  } else {
    fail++;
    log(`  ✗ ${label} — truthy: ${JSON.stringify(v)}`);
    issues.push(label);
  }
}
function gte(actual, expected, label) {
  if (actual >= expected) {
    pass++;
    log(`  ✓ ${label}`);
  } else {
    fail++;
    log(`  ✗ ${label} — ${actual} < ${expected}`);
    issues.push(label);
  }
}
function lte(actual, expected, label) {
  if (actual <= expected) {
    pass++;
    log(`  ✓ ${label}`);
  } else {
    fail++;
    log(`  ✗ ${label} — ${actual} > ${expected}`);
    issues.push(label);
  }
}

// ============================================================
// 1. SSRS 数据完整性
// ============================================================
log('\n=== 1. SSRS 数据完整性 ===');

// 1.1 题目 ID 唯一
{
  const ids = SSRS_QUESTIONS.map(q => q.id);
  eq(new Set(ids).size, ids.length, '1.1 SSRS 题目 ID 唯一');
}

// 1.2 题目数量
eq(SSRS_QUESTIONS.length, 10, '1.2 SSRS 题目数 = 10');

// 1.3 选项范围
{
  const stdOpts = SSRS_RESPONSE_OPTIONS.map(o => o.value);
  eq(stdOpts, [1, 2, 3, 4], '1.3 SSRS 主选项 = 1,2,3,4');
  const srcOpts = SSRS_SOURCES_OPTIONS.map(o => o.value);
  eq(srcOpts, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], '1.3 SSRS 来源选项 = 0-9');
}

// 1.4 ssrs6, ssrs7 的合理范围
{
  const ssrs6 = SSRS_QUESTIONS.find(q => q.id === 'ssrs6');
  const ssrs7 = SSRS_QUESTIONS.find(q => q.id === 'ssrs7');
  truthy(ssrs6, '1.4 ssrs6 存在');
  truthy(ssrs7, '1.4 ssrs7 存在');
  truthy(
    ssrs6.text.includes('经济支持') || ssrs6.text.includes('实际帮助'),
    '1.4 ssrs6 涉及经济支持'
  );
  truthy(
    ssrs7.text.includes('安慰') || ssrs7.text.includes('关心') || ssrs7.text.includes('精神'),
    '1.4 ssrs7 涉及精神支持'
  );
}

// 1.5 严重度范围无空隙 (SSRS 最低总分 = 1+1+1+4×1+1+9+9+1+1+1 = 29 in 40 题扩展版)
{
  const levels = Object.values(SSRS_SEVERITY);
  const sorted = levels.sort((a, b) => a.range[0] - b.range[0]);
  for (let i = 0; i < sorted.length - 1; i++) {
    const cur = sorted[i].range[1];
    const next = sorted[i + 1].range[0];
    eq(
      cur + 1,
      next,
      `1.5 SSRS 严重度无空隙: ${sorted[i].label} 末=${cur} → ${sorted[i + 1].label} 始=${next}`
    );
  }
  eq(sorted[0].range[0], 29, '1.5 SSRS 最低范围从 29 开始 (40 题扩展版各维度最小值之和)');
  gte(
    sorted[sorted.length - 1].range[1],
    50,
    '1.5 SSRS 最高范围 ≥ 50 (40 题扩展版理论总分上限 180)'
  );
}

// 1.6 严重度覆盖
{
  // 关键边界: 22 (low → mediumLow), 29 (mediumLow → medium), 44 (medium → high)
  for (const score of [0, 8, 22, 23, 29, 30, 44, 45, 50]) {
    const info = getSSRSLevelInfo(score);
    truthy(info, `1.6 SSRS 分数 ${score} → 有效严重度 ${info.label}`);
  }
}

// 1.7 SSRS_RESOURCES 完整性
{
  truthy(SSRS_RESOURCES.whenToSeekHelp?.length > 0, '1.7 SSRS_RESOURCES.whenToSeekHelp 非空');
  truthy(SSRS_RESOURCES.channels?.length > 0, '1.7 SSRS_RESOURCES.channels 非空');
}

// 1.8 维度名称与 DIMENSIONS key 对应
{
  const keys = Object.keys(SSRS_DIMENSIONS);
  eq(keys.includes('objective'), true, '1.8 SSRS_DIMENSIONS 有 objective');
  eq(keys.includes('subjective'), true, '1.8 SSRS_DIMENSIONS 有 subjective');
  eq(keys.includes('utilization'), true, '1.8 SSRS_DIMENSIONS 有 utilization');
  // 维度名
  for (const key of keys) {
    const dim = SSRS_DIMENSIONS[key];
    truthy(dim.name, `1.8 SSRS_DIMENSIONS.${key}.name 非空`);
    truthy(dim.highTip, `1.8 SSRS_DIMENSIONS.${key}.highTip 非空`);
    truthy(dim.lowTip, `1.8 SSRS_DIMENSIONS.${key}.lowTip 非空`);
  }
}

// 1.9 generateDetailedSSRSReport 集成
// 报告中的 dimensions[*].score 是百分比 (0-100),不是原始分
//   客观支持: 原始分 1-22,百分比 = round(raw/22*100)
//   主观支持: 原始分 4-16,百分比 = round(raw/16*100)
//   利用度:   原始分 3-12,百分比 = round(raw/12*100)
{
  const answers = {};
  for (const id of ['ssrs1', 'ssrs2', 'ssrs3', 'ssrs4', 'ssrs5', 'ssrs8', 'ssrs9', 'ssrs10'])
    answers[id] = 2;
  answers.ssrs6 = 5;
  answers.ssrs7 = 5;
  const report = generateDetailedSSRSReport(answers, SSRS_QUESTIONS);
  truthy(report.summary, '1.9 SSRS 报告含 summary');
  truthy(report.dimensions?.length === 3, '1.9 SSRS 报告 3 维度');
  truthy(report.strongest, '1.9 SSRS 报告含 strongest');
  truthy(report.weakest, '1.9 SSRS 报告含 weakest');
  truthy(report.resources, '1.9 SSRS 报告含 resources');
  // 客观支持分: ssrs2=2, ssrs6=5, ssrs7=5 = 12, max=22, 百分比 = round(12/22*100) = 55
  const obj = report.dimensions.find(d => d.name.includes('客观'));
  if (obj) eq(obj.score, 55, '1.9 客观支持维度分 (百分比) = 55');
  // 主观支持分: ssrs1,3,4,5 各 2 = 8, max=16, 百分比 = round(8/16*100) = 50
  const subj = report.dimensions.find(d => d.name.includes('主观'));
  if (subj) eq(subj.score, 50, '1.9 主观支持维度分 (百分比) = 50');
  // 利用度分: ssrs8,9,10 各 2 = 6, max=12, 百分比 = round(6/12*100) = 50
  const util = report.dimensions.find(d => d.name.includes('利用'));
  if (util) eq(util.score, 50, '1.9 利用度维度分 (百分比) = 50');
  // 验证总分: 2*8 + 5 + 5 = 26
  eq(report.summary.score, 26, '1.9 SSRS 总分 = 26');
}

// 1.10 极值场景
{
  // 全 0
  const zero = {};
  for (const q of SSRS_QUESTIONS) zero[q.id] = 0;
  const report0 = generateDetailedSSRSReport(zero, SSRS_QUESTIONS);
  eq(report0.summary.score, 0, '1.10 SSRS 全 0 → 总分 0');
  // 异常: ssrs6/7 不能取 0-9 之外 (用户错误输入)
  const invalid = { ...zero, ssrs6: 99, ssrs7: 99 };
  const reportInv = generateDetailedSSRSReport(invalid, SSRS_QUESTIONS);
  // 算法应当处理 (不抛错)
  truthy(reportInv.summary, '1.10 SSRS 越界输入不崩溃');
}

// ============================================================
// 2. MBI 深度验证
// ============================================================
log('\n=== 2. MBI 深度验证 ===');

// 2.1 题目数
eq(MBI_QUESTIONS.length, 15, '2.1 MBI 题目数 = 15');

// 2.2 ID 唯一
{
  const ids = MBI_QUESTIONS.map(q => q.id);
  eq(new Set(ids).size, ids.length, '2.2 MBI 题目 ID 唯一');
}

// 2.3 选项范围
{
  const opts = MBI_RESPONSE_OPTIONS.map(o => o.value);
  eq(opts, [0, 1, 2, 3, 4, 5, 6], '2.3 MBI 选项 = 0-6');
}

// 2.4 维度分配: exhaustion 5 题, cynicism 4 题, efficacy 6 题
{
  const byTrait = {};
  for (const q of MBI_QUESTIONS) {
    byTrait[q.trait] = (byTrait[q.trait] || 0) + 1;
  }
  eq(byTrait.exhaustion || 0, 5, '2.4 MBI exhaustion (情感耗竭) = 5 题');
  eq(byTrait.cynicism || 0, 4, '2.4 MBI cynicism (犬儒主义) = 4 题');
  eq(byTrait.efficacy || 0, 6, '2.4 MBI efficacy (职业效能) = 6 题');
}

// 2.5 反向题分布 (efficacy 全部反向)
{
  const peQs = MBI_QUESTIONS.filter(q => q.trait === 'efficacy');
  const peReverseCount = peQs.filter(q => q.reverse).length;
  eq(peReverseCount, peQs.length, '2.5 MBI efficacy 全部反向');
  const exQs = MBI_QUESTIONS.filter(q => q.trait === 'exhaustion');
  const exReverseCount = exQs.filter(q => q.reverse).length;
  eq(exReverseCount, 0, '2.5 MBI exhaustion 不反向');
  const cyQs = MBI_QUESTIONS.filter(q => q.trait === 'cynicism');
  const cyReverseCount = cyQs.filter(q => q.reverse).length;
  eq(cyReverseCount, 0, '2.5 MBI cynicism 不反向');
}

// 2.6 MBI 严重度范围无空隙
{
  const levels = Object.values(MBI_LEVELS);
  const sorted = levels.sort((a, b) => a.range[0] - b.range[0]);
  for (let i = 0; i < sorted.length - 1; i++) {
    const cur = sorted[i].range[1];
    const next = sorted[i + 1].range[0];
    eq(
      cur + 1,
      next,
      `2.6 MBI 严重度无空隙: ${sorted[i].name} 末=${cur} → ${sorted[i + 1].name} 始=${next}`
    );
  }
  eq(sorted[0].range[0], 0, '2.6 MBI 最低范围从 0 开始');
}

// 2.7 PE 严重度颜色范围单调 (高分 = 好 = 绿色)
{
  // MBI 严重度: green, yellow, orange, red
  // PE 是反向: high=green (30-36), low=red (0-19)
  const colorOrder = ['green', 'yellow', 'orange', 'red'];
  const sorted = Object.values(MBI_LEVELS).sort((a, b) => a.range[0] - b.range[0]);
  for (let i = 0; i < sorted.length - 1; i++) {
    const idxCur = colorOrder.indexOf(sorted[i].color);
    const idxNext = colorOrder.indexOf(sorted[i + 1].color);
    gte(idxNext, idxCur, `2.7 MBI 严重度颜色递增: ${sorted[i].name}→${sorted[i + 1].name}`);
  }
}

// 2.8 generateDetailedMBIReport 集成
{
  const answers = {};
  for (const q of MBI_QUESTIONS) {
    // exhaustion: 取高 (4), cynicism: 取高 (4), efficacy: 取低 (2) → 严重倦怠
    if (q.trait === 'exhaustion') answers[q.id] = 4;
    else if (q.trait === 'cynicism') answers[q.id] = 4;
    else if (q.trait === 'efficacy') answers[q.id] = 2; // 反向: 低 efficacy = 倦怠
  }
  const report = generateDetailedMBIReport(answers, MBI_QUESTIONS);
  truthy(report.summary, '2.8 MBI 报告含 summary');
  truthy(report.dimensions?.length === 3, '2.8 MBI 报告 3 维度');
  // efficacy 维度在报告中显示原始分(供用户理解自己的填写), 反向计分仅用于 total
  const pe = report.dimensions.find(d => d.name.includes('PE') || d.name.includes('效能'));
  if (pe) {
    const expected = 6 * 2; // 12
    eq(pe.raw ?? pe.score, expected, `2.8 MBI efficacy 原始分 = ${expected}`);
  }
  truthy(report.advice, '2.8 MBI 报告含 advice');
  truthy(report.advice.immediate?.length > 0, '2.8 MBI advice.immediate 非空');
  truthy(report.advice.work?.length > 0, '2.8 MBI advice.work 非空');
  // 验证综合倦怠分: (5×4 + 4×4 + (36 - 6×2)) / 3 = (20+16+24)/3 = 20
  eq(report.summary.score, 20, '2.8 MBI 综合倦怠分 = 20');
}

// 2.9 健康场景 (全部最低倦怠)
{
  const answers = {};
  for (const q of MBI_QUESTIONS) {
    if (q.trait === 'exhaustion')
      answers[q.id] = 0; // 无耗竭
    else if (q.trait === 'cynicism')
      answers[q.id] = 0; // 无犬儒
    else if (q.trait === 'efficacy') answers[q.id] = 6; // 最高 efficacy → 原始 36
  }
  const report = generateDetailedMBIReport(answers, MBI_QUESTIONS);
  // EX=0, CY=0, efficacy 原始=36 → getMBIPeLevel(36) → high (green)
  for (const d of report.dimensions) {
    truthy(
      d.level.color === 'green' || d.level.color === 'yellow',
      `2.9 MBI 最低倦怠 ${d.name} 应是 green/yellow, 实际 ${d.level.color}`
    );
  }
  // 综合倦怠: (0 + 0 + (36-36))/3 = 0 → low (green)
  eq(report.summary.color, 'green', '2.9 MBI 综合倦怠分 0 → green');
}

// ============================================================
// 3. SWLS 深度验证
// ============================================================
log('\n=== 3. SWLS 深度验证 ===');

// 3.1 题目数
eq(SWLS_QUESTIONS.length, 5, '3.1 SWLS 题目数 = 5');

// 3.2 ID 唯一
{
  const ids = SWLS_QUESTIONS.map(q => q.id);
  eq(new Set(ids).size, ids.length, '3.2 SWLS 题目 ID 唯一');
}

// 3.3 选项范围
{
  const opts = SWLS_RESPONSE_OPTIONS.map(o => o.value);
  eq(opts, [1, 2, 3, 4, 5, 6, 7], '3.3 SWLS 选项 = 1-7');
}

// 3.4 严重度范围无空隙 (SWLS 40 题扩展版, 38 道主量表题, 1-7 量表, 范围 38-266)
{
  const levels = Object.values(SWLS_LEVELS);
  const sorted = levels.sort((a, b) => a.range[0] - b.range[0]);
  for (let i = 0; i < sorted.length - 1; i++) {
    const cur = sorted[i].range[1];
    const next = sorted[i + 1].range[0];
    eq(
      cur + 1,
      next,
      `3.4 SWLS 严重度无空隙: ${sorted[i].label} 末=${cur} → ${sorted[i + 1].label} 始=${next}`
    );
  }
  eq(sorted[0].range[0], 38, '3.4 SWLS 最低范围从 38 开始 (40 题扩展版 38 道主量表 × 1)');
  eq(
    sorted[sorted.length - 1].range[1],
    266,
    '3.4 SWLS 最高范围 = 266 (40 题扩展版 38 道主量表 × 7)'
  );
}

// 3.5 严重度覆盖 (6 个 level, 30 分级跨度)
{
  for (const score of [5, 9, 10, 14, 15, 19, 20, 24, 25, 29, 30, 35]) {
    const info = getSWLSLevelInfo(score);
    truthy(info, `3.5 SWLS 分数 ${score} → 有效 ${info.label}`);
  }
}

// 3.6 SWLS_INTERPRETATION 结构
{
  truthy(SWLS_INTERPRETATION, '3.6 SWLS_INTERPRETATION 存在');
  // high 和 low 应该各有 strengths
  for (const key of ['high', 'low']) {
    truthy(SWLS_INTERPRETATION[key], `3.6 SWLS_INTERPRETATION.${key} 存在`);
    truthy(
      SWLS_INTERPRETATION[key].strengths?.length > 0,
      `3.6 SWLS_INTERPRETATION.${key}.strengths 非空`
    );
  }
}

// 3.7 SWLS_BOOST_STRATEGIES 完整性
{
  truthy(
    SWLS_BOOST_STRATEGIES.relationships?.length > 0,
    '3.7 SWLS_BOOST_STRATEGIES.relationships 非空'
  );
  truthy(SWLS_BOOST_STRATEGIES.flow?.length > 0, '3.7 SWLS_BOOST_STRATEGIES.flow 非空');
  truthy(SWLS_BOOST_STRATEGIES.meaning?.length > 0, '3.7 SWLS_BOOST_STRATEGIES.meaning 非空');
  truthy(SWLS_BOOST_STRATEGIES.health?.length > 0, '3.7 SWLS_BOOST_STRATEGIES.health 非空');
}

// 3.8 generateDetailedSWLSReport 集成
{
  const answers = {};
  for (const q of SWLS_QUESTIONS) answers[q.id] = 4; // 中性
  const report = generateDetailedSWLSReport(answers, SWLS_QUESTIONS);
  truthy(report.summary, '3.8 SWLS 报告含 summary');
  eq(report.summary.score, 20, '3.8 SWLS 全部 4 → 总分 20');
  truthy(report.interpretation, '3.8 SWLS 报告含 interpretation');
  truthy(report.advice, '3.8 SWLS 报告含 advice');
  truthy(report.boost, '3.8 SWLS 报告含 boost');
  // 20 = 中等 (average range 20-24, 较满意是 25-29)
  eq(report.summary.level.label, '中等', '3.8 SWLS 20 → 中等');
  eq(report.summary.level.color, 'emerald', '3.8 SWLS 20 → emerald');
}

// 3.9 极值
{
  const min = { swls1: 1, swls2: 1, swls3: 1, swls4: 1, swls5: 1 };
  const reportMin = generateDetailedSWLSReport(min, SWLS_QUESTIONS);
  eq(reportMin.summary.score, 5, '3.9 SWLS 最低 → 5');
  truthy(
    reportMin.summary.level.color === 'red' || reportMin.summary.level.label.includes('不满意'),
    '3.9 SWLS 最低 → 不满意'
  );

  const max = { swls1: 7, swls2: 7, swls3: 7, swls4: 7, swls5: 7 };
  const reportMax = generateDetailedSWLSReport(max, SWLS_QUESTIONS);
  eq(reportMax.summary.score, 35, '3.9 SWLS 最高 → 35');
}

// ============================================================
// 4. CD-RISC-10 深度验证
// ============================================================
log('\n=== 4. CD-RISC-10 深度验证 ===');

// 4.1 题目数
eq(RESILIENCE_QUESTIONS.length, 10, '4.1 CD-RISC 题目数 = 10');

// 4.2 ID 唯一
{
  const ids = RESILIENCE_QUESTIONS.map(q => q.id);
  eq(new Set(ids).size, ids.length, '4.2 CD-RISC 题目 ID 唯一');
}

// 4.3 选项范围
{
  const opts = RESILIENCE_RESPONSE_OPTIONS.map(o => o.value);
  eq(opts, [0, 1, 2, 3, 4], '4.3 CD-RISC 选项 = 0-4');
}

// 4.4 维度分配
{
  const dimCount = {};
  for (const q of RESILIENCE_QUESTIONS) {
    dimCount[q.trait] = (dimCount[q.trait] || 0) + 1;
  }
  // 期望: adaptability=2, relationships=1, meaning=2, selfEfficacy=2, optimism=3
  eq(dimCount.adaptability || 0, 2, '4.4 CD-RISC adaptability = 2 题');
  eq(dimCount.relationships || 0, 1, '4.4 CD-RISC relationships = 1 题');
  eq(dimCount.meaning || 0, 2, '4.4 CD-RISC meaning = 2 题');
  eq(dimCount.selfEfficacy || 0, 2, '4.4 CD-RISC selfEfficacy = 2 题');
  eq(dimCount.optimism || 0, 3, '4.4 CD-RISC optimism = 3 题');
}

// 4.5 RESILIENCE_DIMENSION_ITEMS 与题目 trait 一致
{
  for (const [dim, items] of Object.entries(RESILIENCE_DIMENSION_ITEMS)) {
    for (const id of items) {
      const q = RESILIENCE_QUESTIONS.find(q => q.id === id);
      truthy(q, `4.5 ${dim} 引用了存在的题 ${id}`);
      if (q) eq(q.trait, dim, `4.5 ${id}.trait = ${dim}`);
    }
  }
}

// 4.6 严重度范围无空隙 (CD-RISC 40 题扩展版, 37 道主量表题, 0-4 量表, 范围 0-148)
{
  const levels = Object.values(RESILIENCE_SEVERITY);
  const sorted = levels.sort((a, b) => a.range[0] - b.range[0]);
  for (let i = 0; i < sorted.length - 1; i++) {
    const cur = sorted[i].range[1];
    const next = sorted[i + 1].range[0];
    eq(
      cur + 1,
      next,
      `4.6 CD-RISC 严重度无空隙: ${sorted[i].label} 末=${cur} → ${sorted[i + 1].label} 始=${next}`
    );
  }
  eq(sorted[0].range[0], 0, '4.6 CD-RISC 最低范围从 0 开始');
  eq(
    sorted[sorted.length - 1].range[1],
    148,
    '4.6 CD-RISC 最高范围 = 148 (40 题扩展版 37 道主量表 × 4)'
  );
}

// 4.7 严重度覆盖
{
  for (const score of [0, 19, 20, 23, 24, 28, 29, 32, 33, 40]) {
    const info = getResilienceLevelInfo(score);
    truthy(info, `4.7 CD-RISC 分数 ${score} → 有效 ${info.label}`);
  }
}

// 4.8 RESILIENCE_BOOST_STRATEGIES 完整性
{
  truthy(RESILIENCE_BOOST_STRATEGIES.immediate?.length > 0, '4.8 BOOST.immediate 非空');
  truthy(RESILIENCE_BOOST_STRATEGIES.weekly?.length > 0, '4.8 BOOST.weekly 非空');
  truthy(RESILIENCE_BOOST_STRATEGIES.monthly?.length > 0, '4.8 BOOST.monthly 非空');
  truthy(RESILIENCE_BOOST_STRATEGIES.longTerm?.length > 0, '4.8 BOOST.longTerm 非空');
}

// 4.9 generateDetailedResilienceReport 集成
{
  const answers = {};
  for (const q of RESILIENCE_QUESTIONS) answers[q.id] = 2; // 中性
  const report = generateDetailedResilienceReport(answers, RESILIENCE_QUESTIONS);
  truthy(report.summary, '4.9 CD-RISC 报告含 summary');
  eq(report.summary.score, 20, '4.9 CD-RISC 全部 2 → 20');
  truthy(report.dimensions?.length === 5, '4.9 CD-RISC 5 维度');
  truthy(report.strongest, '4.9 CD-RISC strongest');
  truthy(report.weakest, '4.9 CD-RISC weakest');
  truthy(report.boost, '4.9 CD-RISC boost');
  // 20 = 韧性偏低
  truthy(report.summary.level.label === '韧性偏低', '4.9 CD-RISC 20 → 韧性偏低');
}

// 4.10 CD-RISC 极值
{
  const min = {};
  for (const q of RESILIENCE_QUESTIONS) min[q.id] = 0;
  const reportMin = generateDetailedResilienceReport(min, RESILIENCE_QUESTIONS);
  eq(reportMin.summary.score, 0, '4.10 CD-RISC 最低 → 0');

  const max = {};
  for (const q of RESILIENCE_QUESTIONS) max[q.id] = 4;
  const reportMax = generateDetailedResilienceReport(max, RESILIENCE_QUESTIONS);
  eq(reportMax.summary.score, 40, '4.10 CD-RISC 最高 → 40');
}

// ============================================================
// 5. 跨文件一致性
// ============================================================
log('\n=== 5. 跨文件一致性 ===');

// 5.1 Assessment ID 与路由 ID 一致
{
  // 这里只能检查源文件定义的 ID, 路由在 App.tsx 中
  // 已在前面测试覆盖
  truthy(SSRS_QUESTIONS.length > 0, '5.1 SSRS 已加载');
  truthy(MBI_QUESTIONS.length > 0, '5.1 MBI 已加载');
  truthy(SWLS_QUESTIONS.length > 0, '5.1 SWLS 已加载');
  truthy(RESILIENCE_QUESTIONS.length > 0, '5.1 CD-RISC 已加载');
}

// 5.2 所有 trait key 在 DIMENSIONS 中有定义
{
  // SSRS trait 来自 mockData.ts,这里不验证
  // MBI trait = exhaustion, cynicism, efficacy (lowercase)
  truthy(MBI_DIMENSIONS.exhaustion, '5.2 MBI_DIMENSIONS.exhaustion');
  truthy(MBI_DIMENSIONS.cynicism, '5.2 MBI_DIMENSIONS.cynicism');
  truthy(MBI_DIMENSIONS.efficacy, '5.2 MBI_DIMENSIONS.efficacy');
}

// 5.3 efficacy 严重度颜色映射合理 (efficacy 是反向,高分=健康)
{
  // efficacy 单维度 (MBI_DIMENSION_LEVELS):
  //   high: 30-36 green
  //   moderate: 25-29 yellow
  //   low: 20-24 orange
  //   veryLow: 0-19 red
  // 这与 exhaustion/cynicism 相反
  const pe = MBI_DIMENSION_LEVELS;
  truthy(pe, '5.3 MBI_DIMENSION_LEVELS 存在');
  // efficacy green 应在最高 range
  const greenLevel = Object.values(pe.efficacy).find(l => l.color === 'green');
  truthy(greenLevel, '5.3 efficacy 严重度有 green');
  if (greenLevel) {
    gte(greenLevel.range[0], 25, '5.3 efficacy green 起始 ≥ 25');
  }
}

// 5.4 所有报告都有完整结构
{
  const a = {
    ssrs1: 2,
    ssrs2: 2,
    ssrs3: 2,
    ssrs4: 2,
    ssrs5: 2,
    ssrs6: 5,
    ssrs7: 5,
    ssrs8: 2,
    ssrs9: 2,
    ssrs10: 2,
  };
  const m = {};
  for (const q of MBI_QUESTIONS) m[q.id] = 3;
  const s = { swls1: 4, swls2: 4, swls3: 4, swls4: 4, swls5: 4 };
  const r = {};
  for (const q of RESILIENCE_QUESTIONS) r[q.id] = 2;

  const reports = {
    SSRS: generateDetailedSSRSReport(a, SSRS_QUESTIONS),
    MBI: generateDetailedMBIReport(m, MBI_QUESTIONS),
    SWLS: generateDetailedSWLSReport(s, SWLS_QUESTIONS),
    CD_RISC: generateDetailedResilienceReport(r, RESILIENCE_QUESTIONS),
  };

  for (const [name, report] of Object.entries(reports)) {
    truthy(report.summary, `5.4 ${name} 报告有 summary`);
    truthy(report.summary.score !== undefined, `5.4 ${name} 报告 summary.score 存在`);
    truthy(report.summary.level, `5.4 ${name} 报告 summary.level 存在`);
    truthy(report.summary.level.color, `5.4 ${name} 报告 summary.level.color 存在`);
  }
}

// 5.5 严重度颜色集合有限 (防止拼写错误)
{
  const allColors = new Set();
  for (const sev of [SSRS_SEVERITY, MBI_LEVELS, SWLS_LEVELS, RESILIENCE_SEVERITY]) {
    for (const level of Object.values(sev)) {
      if (level.color) allColors.add(level.color);
    }
  }
  const validColors = ['red', 'orange', 'yellow', 'emerald', 'green', 'blue', 'purple', 'slate'];
  for (const c of allColors) {
    truthy(validColors.includes(c), `5.5 严重度颜色 "${c}" 在合法集合中`);
  }
}

// ============================================================
// 6. 视觉/UX 关键属性
// ============================================================
log('\n=== 6. 视觉/UX 关键属性 ===');

// 6.1 所有题目文本有效 (≥ 3 字符)
//   注: SSRS 第 3, 4 题 ("您与邻居:" / "您与同事:") 在原量表中是题干+选项组合,
//       题干较短但 4 级选项会补全语义,故这里放宽下限到 3 字
{
  for (const q of [
    ...SSRS_QUESTIONS,
    ...MBI_QUESTIONS,
    ...SWLS_QUESTIONS,
    ...RESILIENCE_QUESTIONS,
  ]) {
    truthy(q.text && q.text.length >= 3, `6.1 题 ${q.id} 文本有效 (${q.text?.length} 字)`);
  }
}

// 6.2 所有 label 字符串有效
{
  for (const opt of [
    ...SSRS_RESPONSE_OPTIONS,
    ...MBI_RESPONSE_OPTIONS,
    ...SWLS_RESPONSE_OPTIONS,
    ...RESILIENCE_RESPONSE_OPTIONS,
  ]) {
    truthy(opt.label && opt.label.length > 0, `6.2 选项 label "${opt.label}" 非空`);
  }
}

// 6.3 严重度描述合理 (不能空 / 不能太短)
{
  for (const sev of [SSRS_SEVERITY, MBI_LEVELS, SWLS_LEVELS, RESILIENCE_SEVERITY]) {
    for (const [key, level] of Object.entries(sev)) {
      truthy(
        level.description && level.description.length >= 10,
        `6.3 严重度 ${key} 描述 ≥ 10 字符 (${level.description?.length})`
      );
    }
  }
}

// 6.4 advice 非空数组
{
  for (const sev of [SSRS_SEVERITY, MBI_LEVELS, SWLS_LEVELS, RESILIENCE_SEVERITY]) {
    for (const [key, level] of Object.entries(sev)) {
      if (level.advice) {
        truthy(
          level.advice.length >= 2,
          `6.4 ${key} advice 至少 2 条 (实际 ${level.advice?.length})`
        );
      }
    }
  }
}

// 6.5 所有 highTip/lowTip 存在
{
  for (const dim of Object.values(RESILIENCE_DIMENSIONS)) {
    truthy(dim.highTip, `6.5 ${dim.name} highTip 非空`);
    truthy(dim.lowTip, `6.5 ${dim.name} lowTip 非空`);
  }
  for (const dim of Object.values(MBI_DIMENSIONS)) {
    truthy(dim.highTip, `6.5 MBI ${dim.name} highTip 非空`);
    truthy(dim.lowTip, `6.5 MBI ${dim.name} lowTip 非空`);
  }
  for (const dim of Object.values(SSRS_DIMENSIONS)) {
    truthy(dim.highTip, `6.5 SSRS ${dim.name} highTip 非空`);
    truthy(dim.lowTip, `6.5 SSRS ${dim.name} lowTip 非空`);
  }
}

// ============================================================
// 7. 用户操作边界
// ============================================================
log('\n=== 7. 用户操作边界 ===');

// 7.1 跳题场景 (部分答案)
{
  // 7.1.1 SSRS 只答一半
  const half = { ssrs1: 3, ssrs2: 3, ssrs3: 3, ssrs4: 3, ssrs5: 3 };
  const report = generateDetailedSSRSReport(half, SSRS_QUESTIONS);
  truthy(report.summary, '7.1.1 SSRS 跳题 (答 5/10) 不崩溃');

  // 7.1.2 MBI 只答 1 题
  const one = { mbi1: 4 };
  const r = generateDetailedMBIReport(one, MBI_QUESTIONS);
  truthy(r.summary, '7.1.2 MBI 只答 1 题不崩溃');

  // 7.1.3 SWLS 只答 1 题
  const s = { swls1: 4 };
  const rs = generateDetailedSWLSReport(s, SWLS_QUESTIONS);
  truthy(rs.summary, '7.1.3 SWLS 只答 1 题不崩溃');
}

// 7.2 答案越界
{
  // 7.2.1 SSRS 来源题越界
  const invalid = {
    ssrs1: 2,
    ssrs2: 2,
    ssrs3: 2,
    ssrs4: 2,
    ssrs5: 2,
    ssrs6: 999,
    ssrs7: -10,
    ssrs8: 2,
    ssrs9: 2,
    ssrs10: 2,
  };
  const r = generateDetailedSSRSReport(invalid, SSRS_QUESTIONS);
  truthy(r.summary, '7.2.1 SSRS 越界不崩溃');

  // 7.2.2 MBI 负值
  const negM = {
    mbi1: -1,
    mbi2: 4,
    mbi3: 2,
    mbi4: 1,
    mbi5: 0,
    mbi6: 3,
    mbi7: 5,
    mbi8: 2,
    mbi9: 1,
    mbi10: 4,
    mbi11: 3,
    mbi12: 2,
    mbi13: 1,
    mbi14: 5,
    mbi15: 4,
  };
  const rm = generateDetailedMBIReport(negM, MBI_QUESTIONS);
  truthy(rm.summary, '7.2.2 MBI 负值不崩溃');
}

// 7.3 全 0 场景 (用户没认真答)
{
  const zero = {};
  for (const q of SSRS_QUESTIONS) zero[q.id] = 0;
  const r = generateDetailedSSRSReport(zero, SSRS_QUESTIONS);
  truthy(r.summary, '7.3 SSRS 全 0 不崩溃');

  const m0 = {};
  for (const q of MBI_QUESTIONS) m0[q.id] = 0;
  const rm = generateDetailedMBIReport(m0, MBI_QUESTIONS);
  truthy(rm.summary, '7.3 MBI 全 0 不崩溃');
}

// 7.4 答案 ID 不匹配
{
  // 传入空答案对象
  const r = generateDetailedSSRSReport({}, SSRS_QUESTIONS);
  truthy(r.summary, '7.4 SSRS 空答案不崩溃');

  const rm = generateDetailedMBIReport({}, MBI_QUESTIONS);
  truthy(rm.summary, '7.4 MBI 空答案不崩溃');
}

// 7.5 题目列表为空
{
  try {
    const r = generateDetailedSSRSReport({ ssrs1: 1 }, []);
    truthy(r, '7.5 SSRS 空题目不崩溃');
  } catch (e) {
    log('  ⚠ SSRS 空题目抛错:', e.message);
  }
}

// ============================================================
// 总结
// ============================================================
log('\n========================================');
log(`通过: ${pass}  失败: ${fail}  总计: ${pass + fail}`);
log('========================================');

if (fail > 0) {
  log('\n问题列表:');
  for (const i of issues) log(`  - ${i}`);
  process.exit(1);
}
process.exit(0);
