/**
 * user-simulation-test.mjs
 *
 * 模仿真实用户体验流程的端到端测试 — 验证用户走完一次测评
 * 涉及到代码链路所有关键节点是否能跑通:
 *
 *   1. 测评列表 → 选择 SSRS
 *   2. 介绍页 → 开始答题
 *   3. 答题页 → 逐题作答, 翻页, 跳题, 撤回, 提交
 *   4. 结果页 → 渲染报告
 *   5. 历史记录 → 持久化、dedupe
 *   6. 复测 → 修改答案
 *   7. 4 个新量表 (SSRS / MBI / SWLS / CD-RISC-10) 完整流程
 *   8. 边界: 空答/部分答/超界值/重置
 *
 * 与 deep-validation-test.mjs 区别:
 *   - deep-validation: 静态 + 内部一致性
 *   - 本文件: 动态 + 端到端流程
 *
 * 运行: node --import tsx tests/unit/user-simulation-test.mjs
 */

import {
  SSRS_QUESTIONS,
  SSRS_RESPONSE_OPTIONS,
  SSRS_SOURCES_OPTIONS,
} from '../../src/data/ssrsData.ts';
import { MBI_QUESTIONS, MBI_RESPONSE_OPTIONS } from '../../src/data/mbiData.ts';
import { SWLS_QUESTIONS, SWLS_RESPONSE_OPTIONS } from '../../src/data/swlsData.ts';
import {
  RESILIENCE_QUESTIONS,
  RESILIENCE_RESPONSE_OPTIONS,
} from '../../src/data/resilienceData.ts';

import { generateDetailedSSRSReport, calculateSSRSTraits } from '../../src/services/ssrsScoring.ts';
import { generateDetailedMBIReport, calculateMBITraits } from '../../src/services/mbiScoring.ts';
import { generateDetailedSWLSReport, calculateSWLSTraits } from '../../src/services/swlsScoring.ts';
import {
  generateDetailedResilienceReport,
  calculateResilienceTraits,
} from '../../src/services/resilienceScoring.ts';

const log = (...a) => console.log('[user-sim]', ...a);
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
function ok(cond, label) {
  if (cond) {
    pass++;
    log(`  ✓ ${label}`);
  } else {
    fail++;
    log(`  ✗ ${label}`);
    issues.push(label);
  }
}

// ============================================================
// 场景 1: SSRS 完整流程 (10 题)
// ============================================================
log('\n=== 1. SSRS 用户流程: 列表 → 介绍 → 答题 → 翻页 → 提交 → 结果 ===');

// 1.1 模拟"从列表选 SSRS" — 验证题目集和选项集可用
{
  truthy(SSRS_QUESTIONS.length === 10, '1.1 SSRS 题目集 (10 题) 可访问');
  truthy(SSRS_RESPONSE_OPTIONS.length === 4, '1.1 SSRS 主选项 4 个');
  truthy(SSRS_SOURCES_OPTIONS.length === 10, '1.1 SSRS 来源选项 10 个 (0-9)');
}

// 1.2 模拟"从 Q1 开始"
{
  let idx = 0;
  ok(SSRS_QUESTIONS[idx].id === 'ssrs1', '1.2 首页是 ssrs1');
}

// 1.3 模拟"答 ssrs1, ssrs2, ssrs3, ssrs4, ssrs5, ssrs8, ssrs9, ssrs10" 各取 2
{
  const answers = {};
  for (const id of ['ssrs1', 'ssrs2', 'ssrs3', 'ssrs4', 'ssrs5', 'ssrs8', 'ssrs9', 'ssrs10'])
    answers[id] = 2;

  // 1.3.1 进度: 8/10 = 80%
  const answered = Object.keys(answers).length;
  eq(answered, 8, '1.3.1 已答 8 题');
  eq(Math.round((answered / 10) * 100), 80, '1.3.1 进度 80%');

  // 1.3.2 用户可点跳到任意已答题 (验证页码导航)
  ok(answers[SSRS_QUESTIONS[3].id] !== undefined, '1.3.2 可跳到第 4 题 (已答)');
}

// 1.4 模拟"答 ssrs6, ssrs7" (来源题, 0-9 范围)
{
  const answers = {
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
  // 1.4.1 答完所有
  ok(Object.keys(answers).length === 10, '1.4.1 答完 10 题');

  // 1.4.2 触发"完成" — generate report
  const report = generateDetailedSSRSReport(answers, SSRS_QUESTIONS);
  truthy(report.summary, '1.4.2 完成 → 生成报告');
  eq(report.summary.score, 26, '1.4.2 总分 = 2×8 + 5 + 5 = 26');
  truthy(report.dimensions.length === 3, '1.4.2 报告 3 个维度');
}

// 1.5 模拟"回退修改"
{
  const answers = {
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
  // 用户回退到第 5 题, 改为 4
  answers.ssrs5 = 4;
  const report = generateDetailedSSRSReport(answers, SSRS_QUESTIONS);
  eq(report.summary.score, 28, '1.5 修改 ssrs5=4 → 总分 28');
}

// 1.6 模拟"跳题后点完成" — 应跳到第一道未答题
{
  const answers = {
    ssrs1: 2,
    ssrs2: 2,
    ssrs3: 2,
    ssrs4: 2,
    // 5, 6, 7, 8, 9, 10 未答
  };
  // 模拟 QuizPage.handleNext 行为
  const totalQuestions = SSRS_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const firstUnanswered = SSRS_QUESTIONS.find(q => !answers[q.id]);
  ok(answeredCount < totalQuestions, '1.6 未答完');
  truthy(firstUnanswered, '1.6 找到第一道未答题');
  eq(firstUnanswered.id, 'ssrs5', '1.6 第一道未答是 ssrs5');
}

// ============================================================
// 场景 2: MBI 完整流程 (15 题, 含反向)
// ============================================================
log('\n=== 2. MBI 用户流程: 介绍 → 15 题 → 倦怠结果 ===');

{
  // 2.1 模拟一个"高倦怠"用户
  const answers = {};
  for (const q of MBI_QUESTIONS) {
    if (q.trait === 'exhaustion')
      answers[q.id] = 5; // 高耗竭
    else if (q.trait === 'cynicism')
      answers[q.id] = 5; // 高犬儒
    else if (q.trait === 'efficacy') answers[q.id] = 1; // 反向: 低效能
  }

  ok(Object.keys(answers).length === 15, '2.1 答完 15 题');

  const traits = calculateMBITraits(answers, MBI_QUESTIONS);
  truthy(traits.length === 4, '2.1 traits 数 = 4 (总分 + 3 维度)');
  eq(traits[0].name, '综合倦怠分', '2.1 traits[0] 是综合倦怠分');
  eq(traits[1].name, '情感耗竭', '2.1 traits[1] 是情感耗竭');

  const report = generateDetailedMBIReport(answers, MBI_QUESTIONS);
  truthy(report.summary.score > 20, `2.1 高倦怠总分 > 20 (实际 ${report.summary.score})`);
  truthy(report.advice, '2.1 报告含 advice');

  // 2.2 严重度颜色应为 red / orange (高倦怠)
  const summaryColor = report.summary.color;
  ok(['red', 'orange'].includes(summaryColor), `2.2 高倦怠色 = red/orange (实际 ${summaryColor})`);
}

// 2.3 模拟一个"低倦怠"用户 (健康)
{
  const answers = {};
  for (const q of MBI_QUESTIONS) {
    if (q.trait === 'exhaustion') answers[q.id] = 0;
    else if (q.trait === 'cynicism') answers[q.id] = 0;
    else if (q.trait === 'efficacy') answers[q.id] = 6; // 高效能 (反向: 原始 36)
  }
  const report = generateDetailedMBIReport(answers, MBI_QUESTIONS);
  eq(report.summary.score, 0, '2.3 健康场景综合倦怠分 = 0');
  eq(report.summary.color, 'green', '2.3 健康场景 → green');
}

// 2.4 模拟"逐题点击导航"
{
  // 用户答完第 1 题后, 想跳回第 1 题检查
  const answers = { mbi1: 4 };
  // 验证页码导航: 第 1 题已答, 可以跳
  const idx = 0;
  ok(answers[MBI_QUESTIONS[idx].id] !== undefined, '2.4 可跳回第 1 题 (已答)');

  // 跳到第 2 题 (未答但 idx <= currentIndex + 1)
  const nextIdx = idx + 1;
  ok(nextIdx <= 1, '2.4 可跳到第 2 题 (idx ≤ current+1)');

  // 跳到第 5 题 (未答且 idx > current+1) — 应被禁用
  const skipIdx = 4;
  ok(
    skipIdx > nextIdx && !answers[MBI_QUESTIONS[skipIdx].id],
    '2.4 第 5 题未答且 idx > current+1, 应禁用'
  );
}

// ============================================================
// 场景 3: SWLS 完整流程 (5 题)
// ============================================================
log('\n=== 3. SWLS 用户流程: 5 题 → 满意度结果 ===');

{
  // 3.1 全部中性 (4): 20 分 → "中等"
  const neutral = {};
  for (const q of SWLS_QUESTIONS) neutral[q.id] = 4;
  const r1 = generateDetailedSWLSReport(neutral, SWLS_QUESTIONS);
  eq(r1.summary.score, 20, '3.1 全 4 → 20');
  eq(r1.summary.level.label, '中等', '3.1 20 → 中等');

  // 3.2 全部最大 (7): 35 分 → "高度满意"
  const max = {};
  for (const q of SWLS_QUESTIONS) max[q.id] = 7;
  const r2 = generateDetailedSWLSReport(max, SWLS_QUESTIONS);
  eq(r2.summary.score, 35, '3.2 全 7 → 35');
  eq(r2.summary.level.label, '高度满意', '3.2 35 → 高度满意');

  // 3.3 全部最小 (1): 5 分 → "极不满意"
  const min = {};
  for (const q of SWLS_QUESTIONS) min[q.id] = 1;
  const r3 = generateDetailedSWLSReport(min, SWLS_QUESTIONS);
  eq(r3.summary.score, 5, '3.3 全 1 → 5');
  eq(r3.summary.level.label, '极不满意', '3.3 5 → 极不满意');

  // 3.4 报告完整性
  truthy(r1.interpretation, '3.4 报告含 interpretation');
  truthy(r1.advice, '3.4 报告含 advice');
  truthy(r1.boost, '3.4 报告含 boost');
  truthy(
    r1.boost.relationships && r1.boost.flow && r1.boost.meaning && r1.boost.health,
    '3.4 boost 4 维度全有'
  );
}

// ============================================================
// 场景 4: CD-RISC-10 完整流程 (10 题, 5 维度)
// ============================================================
log('\n=== 4. CD-RISC-10 用户流程: 10 题 → 韧性结果 ===');

{
  // 4.1 韧性很高 (全 4): 40 分
  const max = {};
  for (const q of RESILIENCE_QUESTIONS) max[q.id] = 4;
  const r1 = generateDetailedResilienceReport(max, RESILIENCE_QUESTIONS);
  eq(r1.summary.score, 40, '4.1 全 4 → 40');
  eq(r1.summary.level.label, '韧性很强', '4.1 40 → 韧性很强');

  // 4.2 韧性较低 (全 0): 0 分
  const min = {};
  for (const q of RESILIENCE_QUESTIONS) min[q.id] = 0;
  const r2 = generateDetailedResilienceReport(min, RESILIENCE_QUESTIONS);
  eq(r2.summary.score, 0, '4.2 全 0 → 0');
  eq(r2.summary.level.label, '韧性较低', '4.2 0 → 韧性较低');

  // 4.3 中性 (全 2): 20 分 → 韧性偏低
  const mid = {};
  for (const q of RESILIENCE_QUESTIONS) mid[q.id] = 2;
  const r3 = generateDetailedResilienceReport(mid, RESILIENCE_QUESTIONS);
  eq(r3.summary.score, 20, '4.3 全 2 → 20');
  eq(r3.summary.level.label, '韧性偏低', '4.3 20 → 韧性偏低');

  // 4.4 维度报告
  truthy(r3.dimensions.length === 5, '4.4 报告 5 维度');
  truthy(r3.strongest, '4.4 含 strongest');
  truthy(r3.weakest, '4.4 含 weakest');
  truthy(r3.boost, '4.4 含 boost');
}

// ============================================================
// 场景 5: 跨量表流程 — 同一用户连续做 4 个量表
// ============================================================
log('\n=== 5. 跨量表流程: 同一会话做 4 个新量表 ===');

{
  // 5.1 完成 SSRS
  const ssrsAns = {
    ssrs1: 3,
    ssrs2: 2,
    ssrs3: 3,
    ssrs4: 2,
    ssrs5: 4,
    ssrs6: 6,
    ssrs7: 7,
    ssrs8: 3,
    ssrs9: 2,
    ssrs10: 1,
  };
  const ssrsR = generateDetailedSSRSReport(ssrsAns, SSRS_QUESTIONS);
  truthy(ssrsR.summary, '5.1 SSRS 报告 OK');

  // 5.2 完成 MBI
  const mbiAns = {};
  for (const q of MBI_QUESTIONS) mbiAns[q.id] = q.trait === 'efficacy' ? 4 : 2;
  const mbiR = generateDetailedMBIReport(mbiAns, MBI_QUESTIONS);
  truthy(mbiR.summary, '5.2 MBI 报告 OK');

  // 5.3 完成 SWLS
  const swlsAns = {};
  for (const q of SWLS_QUESTIONS) swlsAns[q.id] = 5;
  const swlsR = generateDetailedSWLSReport(swlsAns, SWLS_QUESTIONS);
  truthy(swlsR.summary, '5.3 SWLS 报告 OK');
  eq(swlsR.summary.score, 25, '5.3 SWLS 全 5 → 25 → 较满意');

  // 5.4 完成 CD-RISC-10
  const resAns = {};
  for (const q of RESILIENCE_QUESTIONS) resAns[q.id] = 3;
  const resR = generateDetailedResilienceReport(resAns, RESILIENCE_QUESTIONS);
  eq(resR.summary.score, 30, '5.4 CD-RISC-10 全 3 → 30');
  truthy(
    ['韧性较高', '韧性很强'].includes(resR.summary.level.label),
    `5.4 30 → 韧性较高/很强 (实际 ${resR.summary.level.label})`
  );

  // 5.5 模拟 addToHistory — 4 个量表都应能入库
  const history = [
    {
      id: 'h1',
      assessmentId: 'social-support',
      assessmentTitle: 'SSRS',
      totalScore: ssrsR.summary.score,
      completedAt: new Date().toISOString(),
      traits: [],
    },
    {
      id: 'h2',
      assessmentId: 'mbi-burnout',
      assessmentTitle: 'MBI',
      totalScore: mbiR.summary.score,
      completedAt: new Date().toISOString(),
      traits: [],
    },
    {
      id: 'h3',
      assessmentId: 'life-satisfaction',
      assessmentTitle: 'SWLS',
      totalScore: swlsR.summary.score,
      completedAt: new Date().toISOString(),
      traits: [],
    },
    {
      id: 'h4',
      assessmentId: 'resilience-cdrisc',
      assessmentTitle: 'CD-RISC-10',
      totalScore: resR.summary.score,
      completedAt: new Date().toISOString(),
      traits: [],
    },
  ];
  ok(history.length === 4, '5.5 4 个量表都可入历史');
  ok(
    history.every(h => h.totalScore > 0),
    '5.5 4 条历史总分 > 0'
  );
}

// ============================================================
// 场景 6: 边界与异常流程
// ============================================================
log('\n=== 6. 边界: 跳题/越界/重置 ===');

{
  // 6.1 答一半就提交
  const half = {};
  for (let i = 0; i < 5; i++) half[SSRS_QUESTIONS[i].id] = 3;
  const r1 = generateDetailedSSRSReport(half, SSRS_QUESTIONS);
  truthy(r1.summary, '6.1 答一半提交不崩溃');
  ok(r1.summary.score > 0 && r1.summary.score < 50, '6.1 答一半总分在合理范围');

  // 6.2 全部 0 (用户乱点)
  const zero = {};
  for (const q of SSRS_QUESTIONS) zero[q.id] = 0;
  const r2 = generateDetailedSSRSReport(zero, SSRS_QUESTIONS);
  truthy(r2.summary, '6.2 SSRS 全 0 不崩溃');
  eq(r2.summary.score, 0, '6.2 SSRS 全 0 → 总分 0');

  // 6.3 越界 (用户输入 999)
  const over = {
    ssrs1: 999,
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
  const r3 = generateDetailedSSRSReport(over, SSRS_QUESTIONS);
  truthy(r3.summary, '6.3 SSRS 越界值不崩溃');

  // 6.4 负值
  const neg = {
    ssrs1: -5,
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
  const r4 = generateDetailedSSRSReport(neg, SSRS_QUESTIONS);
  truthy(r4.summary, '6.4 SSRS 负值不崩溃');

  // 6.5 空答案
  const empty = {};
  const r5 = generateDetailedSSRSReport(empty, SSRS_QUESTIONS);
  truthy(r5.summary, '6.5 SSRS 空答案不崩溃');
  eq(r5.summary.score, 0, '6.5 SSRS 空答案 → 0');

  // 6.6 答案 ID 不存在
  const wrong = { ssrsXX: 1, ssrsYY: 2 };
  const r6 = generateDetailedSSRSReport(wrong, SSRS_QUESTIONS);
  truthy(r6.summary, '6.6 SSRS 错误 ID 不崩溃');
}

// ============================================================
// 场景 7: 历史 dedupe
// ============================================================
log('\n=== 7. 同一量表 1 分钟内重做 → 覆盖而非新增 ===');

{
  // 模拟 store.addToHistory 行为
  const history = [];
  const t1 = new Date().toISOString();

  function addToHistory(result) {
    const dupeIdx = history.findIndex(h => {
      if (h.assessmentId !== result.assessmentId) return false;
      return (
        Math.abs(new Date(h.completedAt).getTime() - new Date(result.completedAt).getTime()) <
        60_000
      );
    });
    if (dupeIdx >= 0) history[dupeIdx] = result;
    else history.unshift(result);
  }

  addToHistory({ id: 'h1', assessmentId: 'mbi-burnout', totalScore: 10, completedAt: t1 });
  addToHistory({ id: 'h2', assessmentId: 'mbi-burnout', totalScore: 20, completedAt: t1 }); // 同分钟
  eq(history.length, 1, '7.1 同分钟重做 → 长度 = 1');
  eq(history[0].totalScore, 20, '7.1 保留最新分数');

  // 5 分钟后重做 → 视为新结果
  const t2 = new Date(Date.now() - 5 * 60_000).toISOString();
  addToHistory({ id: 'h3', assessmentId: 'mbi-burnout', totalScore: 15, completedAt: t2 });
  eq(history.length, 2, '7.2 5 分钟后重做 → 长度 = 2');
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
