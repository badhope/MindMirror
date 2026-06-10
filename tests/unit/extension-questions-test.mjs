/**
 * extension-questions-test.mjs
 *
 * 验证「行为分歧题」的正确性:
 *   1. 每个量表的延伸题存在
 *   2. 延伸题不被计入原量表总分
 *   3. 报告含 behavioralProfile
 *   4. 4 种 archetype 都可触达
 *   5. 空答/部分答不崩溃
 *
 * 运行: node --import tsx tests/unit/extension-questions-test.mjs
 */

import { SSRS_QUESTIONS, SSRS_EXTENSION_QUESTIONS } from '../../src/data/ssrsData.ts';
import { MBI_QUESTIONS, MBI_EXTENSION_QUESTIONS } from '../../src/data/mbiData.ts';
import { SWLS_QUESTIONS, SWLS_EXTENSION_QUESTIONS } from '../../src/data/swlsData.ts';
import {
  RESILIENCE_QUESTIONS,
  RESILIENCE_EXTENSION_QUESTIONS,
} from '../../src/data/resilienceData.ts';

import { generateDetailedSSRSReport, calculateSSRSTraits } from '../../src/services/ssrsScoring.ts';
import { generateDetailedMBIReport, calculateMBITraits } from '../../src/services/mbiScoring.ts';
import { generateDetailedSWLSReport, calculateSWLSTraits } from '../../src/services/swlsScoring.ts';
import {
  generateDetailedResilienceReport,
  calculateResilienceTraits,
} from '../../src/services/resilienceScoring.ts';

import { getQuestionsForAssessment } from '../../src/data/mockData.ts';

const log = (...a) => console.log('[ext-q]', ...a);
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

const allQuestions = [
  ...SSRS_QUESTIONS,
  ...SSRS_EXTENSION_QUESTIONS,
  ...MBI_QUESTIONS,
  ...MBI_EXTENSION_QUESTIONS,
  ...SWLS_QUESTIONS,
  ...SWLS_EXTENSION_QUESTIONS,
  ...RESILIENCE_QUESTIONS,
  ...RESILIENCE_EXTENSION_QUESTIONS,
];

// ============================================================
// 1. 延伸题存在性 + 完整性
// ============================================================
log('\n=== 1. 4 个量表都含延伸题 ===');

eq(SSRS_EXTENSION_QUESTIONS.length, 3, '1.1 SSRS 延伸题 = 3 道');
eq(MBI_EXTENSION_QUESTIONS.length, 3, '1.1 MBI 延伸题 = 3 道');
eq(SWLS_EXTENSION_QUESTIONS.length, 2, '1.1 SWLS 延伸题 = 2 道');
eq(RESILIENCE_EXTENSION_QUESTIONS.length, 3, '1.1 CD-RISC 延伸题 = 3 道');

ok(
  SSRS_EXTENSION_QUESTIONS.every(q => q.trait === 'extension'),
  '1.2 SSRS 延伸题 trait = extension'
);
ok(
  MBI_EXTENSION_QUESTIONS.every(q => q.trait === 'extension'),
  '1.2 MBI 延伸题 trait = extension'
);
ok(
  SWLS_EXTENSION_QUESTIONS.every(q => q.trait === 'extension'),
  '1.2 SWLS 延伸题 trait = extension'
);
ok(
  RESILIENCE_EXTENSION_QUESTIONS.every(q => q.trait === 'extension'),
  '1.2 CD-RISC 延伸题 trait = extension'
);

ok(
  SSRS_EXTENSION_QUESTIONS.every(q => q.text.length > 20),
  '1.3 SSRS 延伸题题干 > 20 字符 (具体场景)'
);
ok(
  MBI_EXTENSION_QUESTIONS.every(q => q.text.length > 20),
  '1.3 MBI 延伸题题干 > 20 字符'
);
ok(
  SWLS_EXTENSION_QUESTIONS.every(q => q.text.length > 10),
  '1.3 SWLS 延伸题题干 > 10 字符'
);
ok(
  RESILIENCE_EXTENSION_QUESTIONS.every(q => q.text.length > 20),
  '1.3 CD-RISC 延伸题题干 > 20 字符'
);

// ID 不重复
const allIds = allQuestions.map(q => q.id);
const uniqueIds = new Set(allIds);
eq(uniqueIds.size, allIds.length, '1.4 所有题 ID 唯一');

// ============================================================
// 2. getQuestionsForAssessment 包含延伸题
// ============================================================
log('\n=== 2. getQuestionsForAssessment 返回主+题库+延伸 ===');

{
  // SSRS: 10 原 + 30 题库 (3×10) + 3 延伸 = 43
  const ssrsAll = getQuestionsForAssessment('social-support');
  eq(ssrsAll.length, 43, '2.1 social-support 总题数 = 43 (10+30+3)');

  // MBI: 15 原 + 22 题库 (7+6+9) + 3 延伸 = 40
  const mbiAll = getQuestionsForAssessment('mbi-burnout');
  eq(mbiAll.length, 40, '2.1 mbi-burnout 总题数 = 40 (15+22+3)');

  // SWLS: 5 原 + 33 题库 (8+6+6+5+4+4) + 2 延伸 = 40
  const swlsAll = getQuestionsForAssessment('life-satisfaction');
  eq(swlsAll.length, 40, '2.1 life-satisfaction 总题数 = 40 (5+33+2)');

  // CD-RISC: 10 原 + 27 题库 (6+5+6+5+5) + 3 延伸 = 40
  const resAll = getQuestionsForAssessment('resilience-cdrisc');
  eq(resAll.length, 40, '2.1 resilience-cdrisc 总题数 = 40 (10+27+3)');
}

// ============================================================
// 3. 延伸题不污染原量表总分
// ============================================================
log('\n=== 3. 延伸题不污染原量表分 ===');

// 3.1 SSRS — 总分不应受延伸题影响
{
  const mainOnly = {};
  for (const q of SSRS_QUESTIONS) mainOnly[q.id] = 2;
  const mainReport = generateDetailedSSRSReport(mainOnly, SSRS_QUESTIONS);

  const withExt = { ...mainOnly };
  // 给延伸题都填 4 (高分)
  for (const q of SSRS_EXTENSION_QUESTIONS) withExt[q.id] = 4;
  const allQuestionsList = [...SSRS_QUESTIONS, ...SSRS_EXTENSION_QUESTIONS];
  const fullReport = generateDetailedSSRSReport(withExt, allQuestionsList);

  eq(fullReport.summary.score, mainReport.summary.score, '3.1 SSRS 加延伸题后总分不变');
}

// 3.2 MBI
{
  const mainOnly = {};
  for (const q of MBI_QUESTIONS) mainOnly[q.id] = 3;
  const mainReport = generateDetailedMBIReport(mainOnly, MBI_QUESTIONS);

  const withExt = { ...mainOnly };
  for (const q of MBI_EXTENSION_QUESTIONS) withExt[q.id] = 4;
  const allQuestionsList = [...MBI_QUESTIONS, ...MBI_EXTENSION_QUESTIONS];
  const fullReport = generateDetailedMBIReport(withExt, allQuestionsList);

  ok(
    Math.abs(fullReport.summary.score - mainReport.summary.score) < 0.01,
    '3.2 MBI 加延伸题后总分不变'
  );
}

// 3.3 SWLS
{
  const mainOnly = {};
  for (const q of SWLS_QUESTIONS) mainOnly[q.id] = 4;
  const mainReport = generateDetailedSWLSReport(mainOnly, SWLS_QUESTIONS);

  const withExt = { ...mainOnly };
  for (const q of SWLS_EXTENSION_QUESTIONS) withExt[q.id] = 4;
  const allQuestionsList = [...SWLS_QUESTIONS, ...SWLS_EXTENSION_QUESTIONS];
  const fullReport = generateDetailedSWLSReport(withExt, allQuestionsList);

  eq(fullReport.summary.score, mainReport.summary.score, '3.3 SWLS 加延伸题后总分不变');
}

// 3.4 CD-RISC
{
  const mainOnly = {};
  for (const q of RESILIENCE_QUESTIONS) mainOnly[q.id] = 2;
  const mainReport = generateDetailedResilienceReport(mainOnly, RESILIENCE_QUESTIONS);

  const withExt = { ...mainOnly };
  for (const q of RESILIENCE_EXTENSION_QUESTIONS) withExt[q.id] = 4;
  const allQuestionsList = [...RESILIENCE_QUESTIONS, ...RESILIENCE_EXTENSION_QUESTIONS];
  const fullReport = generateDetailedResilienceReport(withExt, allQuestionsList);

  eq(fullReport.summary.score, mainReport.summary.score, '3.4 CD-RISC 加延伸题后总分不变');
}

// ============================================================
// 4. 报告含 behavioralProfile
// ============================================================
log('\n=== 4. 报告含 behavioralProfile ===');

{
  const answers = {};
  for (const q of SSRS_QUESTIONS) answers[q.id] = 2;
  for (const q of SSRS_EXTENSION_QUESTIONS) answers[q.id] = 2;
  const report = generateDetailedSSRSReport(answers, [
    ...SSRS_QUESTIONS,
    ...SSRS_EXTENSION_QUESTIONS,
  ]);
  truthy(report.behavioralProfile, '4.1 SSRS 报告含 behavioralProfile');
  truthy(report.behavioralProfile.archetype, '4.1 SSRS 报告含 archetype');
  truthy(report.behavioralProfile.archetypeDesc, '4.1 SSRS 报告含 archetypeDesc');
  eq(report.behavioralProfile.items.length, 3, '4.1 SSRS 报告 items = 3');
}
{
  const answers = {};
  for (const q of MBI_QUESTIONS) answers[q.id] = 3;
  for (const q of MBI_EXTENSION_QUESTIONS) answers[q.id] = 2;
  const report = generateDetailedMBIReport(answers, [...MBI_QUESTIONS, ...MBI_EXTENSION_QUESTIONS]);
  truthy(report.behavioralProfile, '4.2 MBI 报告含 behavioralProfile');
  eq(report.behavioralProfile.items.length, 3, '4.2 MBI 报告 items = 3');
}
{
  const answers = {};
  for (const q of SWLS_QUESTIONS) answers[q.id] = 4;
  for (const q of SWLS_EXTENSION_QUESTIONS) answers[q.id] = 2;
  const report = generateDetailedSWLSReport(answers, [
    ...SWLS_QUESTIONS,
    ...SWLS_EXTENSION_QUESTIONS,
  ]);
  truthy(report.behavioralProfile, '4.3 SWLS 报告含 behavioralProfile');
  eq(report.behavioralProfile.items.length, 2, '4.3 SWLS 报告 items = 2');
}
{
  const answers = {};
  for (const q of RESILIENCE_QUESTIONS) answers[q.id] = 2;
  for (const q of RESILIENCE_EXTENSION_QUESTIONS) answers[q.id] = 2;
  const report = generateDetailedResilienceReport(answers, [
    ...RESILIENCE_QUESTIONS,
    ...RESILIENCE_EXTENSION_QUESTIONS,
  ]);
  truthy(report.behavioralProfile, '4.4 CD-RISC 报告含 behavioralProfile');
  eq(report.behavioralProfile.items.length, 3, '4.4 CD-RISC 报告 items = 3');
}

// ============================================================
// 5. 4 种 archetype 都能触达 (4 个量表 × 4 档 = 16 组合验证)
// ============================================================
log('\n=== 5. archetype 覆盖所有档位 ===');

// 5.1 SSRS: 4 档 (独立内敛/弹性平衡/主动连接/深度依赖)
{
  const allQs = [...SSRS_QUESTIONS, ...SSRS_EXTENSION_QUESTIONS];

  // 全 0 → 独立内敛
  let answers = {};
  for (const q of SSRS_QUESTIONS) answers[q.id] = 2;
  for (const q of SSRS_EXTENSION_QUESTIONS) answers[q.id] = 0;
  let r = generateDetailedSSRSReport(answers, allQs);
  eq(r.behavioralProfile.archetype, '独立内敛型', '5.1 SSRS 延伸全 0 → 独立内敛型');

  // 全 1 → 弹性平衡
  answers = {};
  for (const q of SSRS_QUESTIONS) answers[q.id] = 2;
  for (const q of SSRS_EXTENSION_QUESTIONS) answers[q.id] = 1;
  r = generateDetailedSSRSReport(answers, allQs);
  eq(r.behavioralProfile.archetype, '弹性平衡型', '5.1 SSRS 延伸全 1 → 弹性平衡型');

  // 全 2 → 主动连接
  answers = {};
  for (const q of SSRS_QUESTIONS) answers[q.id] = 2;
  for (const q of SSRS_EXTENSION_QUESTIONS) answers[q.id] = 2;
  r = generateDetailedSSRSReport(answers, allQs);
  eq(r.behavioralProfile.archetype, '主动连接型', '5.1 SSRS 延伸全 2 → 主动连接型');

  // 全 4 → 深度依赖
  answers = {};
  for (const q of SSRS_QUESTIONS) answers[q.id] = 3;
  for (const q of SSRS_EXTENSION_QUESTIONS) answers[q.id] = 4;
  r = generateDetailedSSRSReport(answers, allQs);
  eq(r.behavioralProfile.archetype, '深度依赖型', '5.1 SSRS 延伸全 4 → 深度依赖型');
}

// 5.2 MBI: 4 档
{
  const allQs = [...MBI_QUESTIONS, ...MBI_EXTENSION_QUESTIONS];
  const tests = [
    { ext: 0, expected: '高投入成长型' },
    { ext: 1, expected: '弹性务实型' },
    { ext: 2, expected: '压抑消耗型' },
    { ext: 4, expected: '犬儒耗竭型' },
  ];
  for (const t of tests) {
    const answers = {};
    for (const q of MBI_QUESTIONS) answers[q.id] = 3;
    for (const q of MBI_EXTENSION_QUESTIONS) answers[q.id] = t.ext;
    const r = generateDetailedMBIReport(answers, allQs);
    eq(r.behavioralProfile.archetype, t.expected, `5.2 MBI 延伸全 ${t.ext} → ${t.expected}`);
  }
}

// 5.3 SWLS: 4 档
{
  const allQs = [...SWLS_QUESTIONS, ...SWLS_EXTENSION_QUESTIONS];
  const tests = [
    { ext: 0, expected: '超越满足型' },
    { ext: 1, expected: '稳定满足型' },
    { ext: 2, expected: '不满修正型' },
    { ext: 4, expected: '大失所望型' },
  ];
  for (const t of tests) {
    const answers = {};
    for (const q of SWLS_QUESTIONS) answers[q.id] = 4;
    for (const q of SWLS_EXTENSION_QUESTIONS) answers[q.id] = t.ext;
    const r = generateDetailedSWLSReport(answers, allQs);
    eq(r.behavioralProfile.archetype, t.expected, `5.3 SWLS 延伸全 ${t.ext} → ${t.expected}`);
  }
}

// 5.4 CD-RISC: 4 档
{
  const allQs = [...RESILIENCE_QUESTIONS, ...RESILIENCE_EXTENSION_QUESTIONS];
  const tests = [
    { ext: 0, expected: '高韧性行动型' },
    { ext: 1, expected: '反思恢复型' },
    { ext: 2, expected: '逃避转移型' },
    { ext: 4, expected: '迷茫崩溃型' },
  ];
  for (const t of tests) {
    const answers = {};
    for (const q of RESILIENCE_QUESTIONS) answers[q.id] = 2;
    for (const q of RESILIENCE_EXTENSION_QUESTIONS) answers[q.id] = t.ext;
    const r = generateDetailedResilienceReport(answers, allQs);
    eq(r.behavioralProfile.archetype, t.expected, `5.4 CD-RISC 延伸全 ${t.ext} → ${t.expected}`);
  }
}

// ============================================================
// 6. 边界: 空答/部分答
// ============================================================
log('\n=== 6. 边界: 延伸题空答/部分答 ===');

{
  // 6.1 主量表全答, 延伸题不答
  const answers = {};
  for (const q of SSRS_QUESTIONS) answers[q.id] = 2;
  // 延伸题不填
  const r = generateDetailedSSRSReport(answers, [...SSRS_QUESTIONS, ...SSRS_EXTENSION_QUESTIONS]);
  // 既然一项都没答, behavioralProfile 应为 null
  truthy(r.behavioralProfile === null, '6.1 SSRS 延伸题全空 → behavioralProfile = null');
}

{
  // 6.2 主量表部分答 + 延伸题全答
  const answers = {};
  for (let i = 0; i < 5; i++) answers[SSRS_QUESTIONS[i].id] = 2;
  for (const q of SSRS_EXTENSION_QUESTIONS) answers[q.id] = 2;
  const r = generateDetailedSSRSReport(answers, [...SSRS_QUESTIONS, ...SSRS_EXTENSION_QUESTIONS]);
  truthy(r.summary, '6.2 SSRS 主量表部分答 + 延伸全答 → 报告生成');
  truthy(r.behavioralProfile, '6.2 SSRS 主量表部分答 + 延伸全答 → behavioralProfile 存在');
  eq(r.behavioralProfile.archetype, '主动连接型', '6.2 SSRS 延伸全 2 → 主动连接型');
}

{
  // 6.3 全空
  const r = generateDetailedSSRSReport({}, [...SSRS_QUESTIONS, ...SSRS_EXTENSION_QUESTIONS]);
  truthy(r.summary, '6.3 SSRS 全空 → 不崩溃');
  truthy(r.behavioralProfile === null, '6.3 SSRS 全空 → behavioralProfile = null');
}

// ============================================================
// 7. calculateXxxTraits 排除延伸题
// ============================================================
log('\n=== 7. calculateXxxTraits 排除延伸题 ===');

{
  const mainOnly = {};
  for (const q of SSRS_QUESTIONS) mainOnly[q.id] = 2;
  const t1 = calculateSSRSTraits(mainOnly, SSRS_QUESTIONS);

  const withExt = mainOnly;
  for (const q of SSRS_EXTENSION_QUESTIONS) withExt[q.id] = 4;
  const t2 = calculateSSRSTraits(withExt, [...SSRS_QUESTIONS, ...SSRS_EXTENSION_QUESTIONS]);
  eq(t1[0].score, t2[0].score, '7.1 SSRS calculateSSRSTraits 加延伸题后总分不变');
}

{
  const mainOnly = {};
  for (const q of SWLS_QUESTIONS) mainOnly[q.id] = 4;
  const t1 = calculateSWLSTraits(mainOnly, SWLS_QUESTIONS);

  const withExt = mainOnly;
  for (const q of SWLS_EXTENSION_QUESTIONS) withExt[q.id] = 4;
  const t2 = calculateSWLSTraits(withExt, [...SWLS_QUESTIONS, ...SWLS_EXTENSION_QUESTIONS]);
  eq(t1[0].score, t2[0].score, '7.2 SWLS calculateSWLSTraits 加延伸题后总分不变');
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
