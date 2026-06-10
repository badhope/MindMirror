// 题库扩展测试 — 验证 40 题扩展版本的题量、计分、严重度、行为档案
// 覆盖:
//   1) 4 个量表总题数 (主+题库+延伸) 与 totalQuestions 字段一致
//   2) 题库题目与主量表 trait 一致,无孤立 trait
//   3) 题库题目 ID 唯一,无重复
//   4) 反向题配置合理
//   5) 评分随题库扩展而变化 (主量表 vs 主+题库)
//   6) 严重度函数在 40 题下能正确分级
//   7) 极值不崩 (全 0 / 全 max)
import { strict as assert } from 'assert';

// 直接以 module 形式 import (node --import tsx 自动转译)
const { getQuestionsForAssessment } = await import('../../src/data/mockData.ts');
const { generateDetailedSSRSReport, getSSRSLevel } =
  await import('../../src/services/ssrsScoring.ts');
const { generateDetailedMBIReport, getMBITotalLevel } =
  await import('../../src/services/mbiScoring.ts');
const { generateDetailedSWLSReport, getSWLSLevel } =
  await import('../../src/services/swlsScoring.ts');
const { generateDetailedResilienceReport, getResilienceLevel } =
  await import('../../src/services/resilienceScoring.ts');
const {
  SSRS_SUBJECTIVE_BANK,
  SSRS_OBJECTIVE_BANK,
  SSRS_UTILIZATION_BANK,
  SSRS_QUESTIONS,
  SSRS_EXTENSION_QUESTIONS,
} = await import('../../src/data/ssrsData.ts');
const {
  MBI_QUESTIONS,
  MBI_EXHAUSTION_BANK,
  MBI_CYNICISM_BANK,
  MBI_EFFICACY_BANK,
  MBI_EXTENSION_QUESTIONS,
} = await import('../../src/data/mbiData.ts');
const {
  SWLS_QUESTIONS,
  SWLS_RELATIONSHIPS_BANK,
  SWLS_HEALTH_BANK,
  SWLS_ACHIEVEMENT_BANK,
  SWLS_GROWTH_BANK,
  SWLS_MEANING_BANK,
  SWLS_DAILY_BANK,
  SWLS_EXTENSION_QUESTIONS,
} = await import('../../src/data/swlsData.ts');
const {
  RESILIENCE_QUESTIONS,
  RESILIENCE_ADAPTABILITY_BANK,
  RESILIENCE_RELATIONSHIPS_BANK,
  RESILIENCE_MEANING_BANK,
  RESILIENCE_SELF_EFFICACY_BANK,
  RESILIENCE_OPTIMISM_BANK,
  RESILIENCE_EXTENSION_QUESTIONS,
} = await import('../../src/data/resilienceData.ts');

let passed = 0;
let failed = 0;

function ok(cond, msg) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ ${msg}`);
  }
}

function eq(actual, expected, msg) {
  ok(actual === expected, `${msg} (实际=${actual}, 期望=${expected})`);
}

console.log('\n=== 1. 题库题数正确 ===');
{
  // SSRS 题库
  eq(SSRS_SUBJECTIVE_BANK.length, 10, '1.1 SSRS_SUBJECTIVE_BANK = 10');
  eq(SSRS_OBJECTIVE_BANK.length, 10, '1.2 SSRS_OBJECTIVE_BANK = 10');
  eq(SSRS_UTILIZATION_BANK.length, 10, '1.3 SSRS_UTILIZATION_BANK = 10');
  eq(SSRS_QUESTIONS.length, 10, '1.4 SSRS_QUESTIONS 主量表 = 10');
  eq(SSRS_EXTENSION_QUESTIONS.length, 3, '1.5 SSRS_EXTENSION_QUESTIONS = 3');

  // MBI 题库
  eq(MBI_EXHAUSTION_BANK.length, 7, '1.6 MBI_EXHAUSTION_BANK = 7');
  eq(MBI_CYNICISM_BANK.length, 6, '1.7 MBI_CYNICISM_BANK = 6');
  eq(MBI_EFFICACY_BANK.length, 9, '1.8 MBI_EFFICACY_BANK = 9');
  eq(MBI_QUESTIONS.length, 15, '1.9 MBI_QUESTIONS 主量表 = 15');
  eq(MBI_EXTENSION_QUESTIONS.length, 3, '1.10 MBI_EXTENSION_QUESTIONS = 3');

  // SWLS 题库
  eq(SWLS_RELATIONSHIPS_BANK.length, 8, '1.11 SWLS_RELATIONSHIPS_BANK = 8');
  eq(SWLS_HEALTH_BANK.length, 6, '1.12 SWLS_HEALTH_BANK = 6');
  eq(SWLS_ACHIEVEMENT_BANK.length, 6, '1.13 SWLS_ACHIEVEMENT_BANK = 6');
  eq(SWLS_GROWTH_BANK.length, 5, '1.14 SWLS_GROWTH_BANK = 5');
  eq(SWLS_MEANING_BANK.length, 4, '1.15 SWLS_MEANING_BANK = 4');
  eq(SWLS_DAILY_BANK.length, 4, '1.16 SWLS_DAILY_BANK = 4');
  eq(SWLS_QUESTIONS.length, 5, '1.17 SWLS_QUESTIONS 主量表 = 5');
  eq(SWLS_EXTENSION_QUESTIONS.length, 2, '1.18 SWLS_EXTENSION_QUESTIONS = 2');

  // CD-RISC 题库
  eq(RESILIENCE_ADAPTABILITY_BANK.length, 6, '1.19 RESILIENCE_ADAPTABILITY_BANK = 6');
  eq(RESILIENCE_RELATIONSHIPS_BANK.length, 5, '1.20 RESILIENCE_RELATIONSHIPS_BANK = 5');
  eq(RESILIENCE_MEANING_BANK.length, 6, '1.21 RESILIENCE_MEANING_BANK = 6');
  eq(RESILIENCE_SELF_EFFICACY_BANK.length, 5, '1.22 RESILIENCE_SELF_EFFICACY_BANK = 5');
  eq(RESILIENCE_OPTIMISM_BANK.length, 5, '1.23 RESILIENCE_OPTIMISM_BANK = 5');
  eq(RESILIENCE_QUESTIONS.length, 10, '1.24 RESILIENCE_QUESTIONS 主量表 = 10');
  eq(RESILIENCE_EXTENSION_QUESTIONS.length, 3, '1.25 RESILIENCE_EXTENSION_QUESTIONS = 3');
}

console.log('\n=== 2. getQuestionsForAssessment 返回完整题量 ===');
{
  const ssrs = getQuestionsForAssessment('social-support');
  const mbi = getQuestionsForAssessment('mbi-burnout');
  const swls = getQuestionsForAssessment('life-satisfaction');
  const res = getQuestionsForAssessment('resilience-cdrisc');

  eq(ssrs.length, 43, '2.1 SSRS 总题数 = 43 (10+30+3)');
  eq(mbi.length, 40, '2.2 MBI 总题数 = 40 (15+22+3)');
  eq(swls.length, 40, '2.3 SWLS 总题数 = 40 (5+33+2)');
  eq(res.length, 40, '2.4 CD-RISC 总题数 = 40 (10+27+3)');

  // 所有题量 ≥ 20
  ok(ssrs.length >= 20, '2.5 SSRS ≥ 20 题');
  ok(mbi.length >= 20, '2.6 MBI ≥ 20 题');
  ok(swls.length >= 20, '2.7 SWLS ≥ 20 题');
  ok(res.length >= 20, '2.8 CD-RISC ≥ 20 题');
}

console.log('\n=== 3. 题目 ID 唯一 ===');
{
  const checkUnique = (questions, label) => {
    const ids = new Set(questions.map(q => q.id));
    ok(ids.size === questions.length, `3.${label} 题目 ID 唯一 (${ids.size}/${questions.length})`);
  };
  checkUnique(getQuestionsForAssessment('social-support'), 'SSRS');
  checkUnique(getQuestionsForAssessment('mbi-burnout'), 'MBI');
  checkUnique(getQuestionsForAssessment('life-satisfaction'), 'SWLS');
  checkUnique(getQuestionsForAssessment('resilience-cdrisc'), 'CD-RISC');
}

console.log('\n=== 4. trait 字段与主量表一致 (无孤立 trait) ===');
{
  const checkTrait = (allQuestions, validTraits, label) => {
    const invalid = allQuestions.filter(q => !validTraits.has(q.trait));
    ok(invalid.length === 0, `4.${label} 所有题目 trait 在有效集合中`);
  };
  // SSRS
  checkTrait(
    [
      ...SSRS_QUESTIONS,
      ...SSRS_SUBJECTIVE_BANK,
      ...SSRS_OBJECTIVE_BANK,
      ...SSRS_UTILIZATION_BANK,
      ...SSRS_EXTENSION_QUESTIONS,
    ],
    new Set(['subjective', 'objective', 'utilization', 'extension']),
    'SSRS'
  );
  // MBI
  checkTrait(
    [
      ...MBI_QUESTIONS,
      ...MBI_EXHAUSTION_BANK,
      ...MBI_CYNICISM_BANK,
      ...MBI_EFFICACY_BANK,
      ...MBI_EXTENSION_QUESTIONS,
    ],
    new Set(['exhaustion', 'cynicism', 'efficacy', 'extension']),
    'MBI'
  );
  // SWLS
  checkTrait(
    [
      ...SWLS_QUESTIONS,
      ...SWLS_RELATIONSHIPS_BANK,
      ...SWLS_HEALTH_BANK,
      ...SWLS_ACHIEVEMENT_BANK,
      ...SWLS_GROWTH_BANK,
      ...SWLS_MEANING_BANK,
      ...SWLS_DAILY_BANK,
      ...SWLS_EXTENSION_QUESTIONS,
    ],
    new Set(['satisfaction', 'extension']),
    'SWLS'
  );
  // CD-RISC
  checkTrait(
    [
      ...RESILIENCE_QUESTIONS,
      ...RESILIENCE_ADAPTABILITY_BANK,
      ...RESILIENCE_RELATIONSHIPS_BANK,
      ...RESILIENCE_MEANING_BANK,
      ...RESILIENCE_SELF_EFFICACY_BANK,
      ...RESILIENCE_OPTIMISM_BANK,
      ...RESILIENCE_EXTENSION_QUESTIONS,
    ],
    new Set(['adaptability', 'relationships', 'meaning', 'selfEfficacy', 'optimism', 'extension']),
    'CD-RISC'
  );
}

console.log('\n=== 5. 反向题存在性 ===');
{
  // SWLS 应该至少有反向题 (检测顺从偏差)
  const swlsAll = [
    ...SWLS_QUESTIONS,
    ...SWLS_RELATIONSHIPS_BANK,
    ...SWLS_HEALTH_BANK,
    ...SWLS_ACHIEVEMENT_BANK,
    ...SWLS_GROWTH_BANK,
    ...SWLS_MEANING_BANK,
    ...SWLS_DAILY_BANK,
  ];
  const swlsReverse = swlsAll.filter(q => q.reverse === true);
  ok(swlsReverse.length >= 3, `5.1 SWLS 至少有 3 道反向题 (实际=${swlsReverse.length})`);

  // CD-RISC 题库应该有反向题
  const resBanks = [
    ...RESILIENCE_ADAPTABILITY_BANK,
    ...RESILIENCE_RELATIONSHIPS_BANK,
    ...RESILIENCE_MEANING_BANK,
    ...RESILIENCE_SELF_EFFICACY_BANK,
    ...RESILIENCE_OPTIMISM_BANK,
  ];
  const resReverse = resBanks.filter(q => q.reverse === true);
  ok(resReverse.length >= 3, `5.2 CD-RISC 题库至少有 3 道反向题 (实际=${resReverse.length})`);

  // MBI 题库应该有反向题 (PE 题库)
  const mbiReverse = [...MBI_EFFICACY_BANK, ...MBI_CYNICISM_BANK, ...MBI_EXHAUSTION_BANK].filter(
    q => q.reverse === true
  );
  ok(mbiReverse.length >= 1, `5.3 MBI 题库至少有 1 道反向题 (实际=${mbiReverse.length})`);
}

console.log('\n=== 6. 评分随题库扩展而正确变化 ===');
{
  // SSRS: 主量表只 vs 主+题库 (10 vs 40),低支持回答
  const answersLow = {};
  for (const q of [
    ...SSRS_QUESTIONS,
    ...SSRS_SUBJECTIVE_BANK,
    ...SSRS_OBJECTIVE_BANK,
    ...SSRS_UTILIZATION_BANK,
  ]) {
    if (q.id === 'ssrs6' || q.id === 'ssrs7' || q.id === 'ssrs26' || q.id === 'ssrs27') {
      answersLow[q.id] = 0; // 0-9 量表的最低
    } else {
      answersLow[q.id] = 1; // 1-4 量表的最低
    }
  }
  const ssrsReport = generateDetailedSSRSReport(
    answersLow,
    getQuestionsForAssessment('social-support')
  );
  ok(ssrsReport.summary.score < 80, `6.1 SSRS 低支持总分 < 80 (实际=${ssrsReport.summary.score})`);
  ok(
    ssrsReport.summary.maxScore === 180,
    `6.2 SSRS maxScore = 180 (实际=${ssrsReport.summary.maxScore})`
  );

  // SWLS: 全部 1 (最低)
  const swlsLow = {};
  for (const q of [
    ...SWLS_QUESTIONS,
    ...SWLS_RELATIONSHIPS_BANK,
    ...SWLS_HEALTH_BANK,
    ...SWLS_ACHIEVEMENT_BANK,
    ...SWLS_GROWTH_BANK,
    ...SWLS_MEANING_BANK,
    ...SWLS_DAILY_BANK,
  ]) {
    swlsLow[q.id] = q.reverse ? 7 : 1;
  }
  const swlsReport = generateDetailedSWLSReport(
    swlsLow,
    getQuestionsForAssessment('life-satisfaction')
  );
  ok(swlsReport.summary.score <= 72, `6.3 SWLS 全 1 → 极不满意 (实际=${swlsReport.summary.score})`);
  ok(
    swlsReport.summary.maxScore === 266,
    `6.4 SWLS maxScore = 266 (实际=${swlsReport.summary.maxScore})`
  );

  // CD-RISC: 全部 0
  const resLow = {};
  for (const q of [
    ...RESILIENCE_QUESTIONS,
    ...RESILIENCE_ADAPTABILITY_BANK,
    ...RESILIENCE_RELATIONSHIPS_BANK,
    ...RESILIENCE_MEANING_BANK,
    ...RESILIENCE_SELF_EFFICACY_BANK,
    ...RESILIENCE_OPTIMISM_BANK,
  ]) {
    resLow[q.id] = q.reverse ? 4 : 0;
  }
  const resReport = generateDetailedResilienceReport(
    resLow,
    getQuestionsForAssessment('resilience-cdrisc')
  );
  ok(
    resReport.summary.score <= 70,
    `6.5 CD-RISC 全 0 → 韧性较低 (实际=${resReport.summary.score})`
  );
  ok(
    resReport.summary.maxScore === 148,
    `6.6 CD-RISC maxScore = 148 (实际=${resReport.summary.maxScore})`
  );

  // MBI: 全部 max (高倦怠)
  const mbiHigh = {};
  for (const q of [
    ...MBI_QUESTIONS,
    ...MBI_EXHAUSTION_BANK,
    ...MBI_CYNICISM_BANK,
    ...MBI_EFFICACY_BANK,
  ]) {
    mbiHigh[q.id] = 6;
  }
  const mbiReport = generateDetailedMBIReport(mbiHigh, getQuestionsForAssessment('mbi-burnout'));
  // 综合 = (72+60+0)/3 = 44 → 高度
  ok(mbiReport.summary.score > 40, `6.7 MBI 全 max → 高倦怠 (实际=${mbiReport.summary.score})`);
}

console.log('\n=== 7. 严重度函数在 40 题下能正确分级 ===');
{
  // SSRS: 0/低/中/高 边界
  const low = getSSRSLevel(40); // ≤80
  const medLow = getSSRSLevel(100); // 81-106
  const med = getSSRSLevel(150); // 107-161
  const high = getSSRSLevel(175); // ≥162
  eq(low.level, 'low', '7.1 SSRS score 40 → low');
  eq(medLow.level, 'mediumLow', '7.2 SSRS score 100 → mediumLow');
  eq(med.level, 'medium', '7.3 SSRS score 150 → medium');
  eq(high.level, 'high', '7.4 SSRS score 175 → high');

  // MBI: 百分比版
  const mbiLow = getMBITotalLevel(10, 74); // 13.5% → low
  const mbiHigh = getMBITotalLevel(50, 74); // 67.6% → high
  const mbiSev = getMBITotalLevel(70, 74); // 94.6% → severe
  eq(mbiLow.level, 'low', '7.5 MBI 10/74 → low');
  eq(mbiHigh.level, 'high', '7.6 MBI 50/74 → high');
  eq(mbiSev.level, 'severe', '7.7 MBI 70/74 → severe');

  // SWLS: 百分比版
  const swlsLow = getSWLSLevel(100, 266); // 37.6% → low
  const swlsHigh = getSWLSLevel(220, 266); // 82.7% → high
  const swlsVHigh = getSWLSLevel(250, 266); // 94% → veryHigh
  eq(swlsLow.level, 'low', '7.8 SWLS 100/266 → low');
  eq(swlsHigh.level, 'high', '7.9 SWLS 220/266 → high');
  eq(swlsVHigh.level, 'veryHigh', '7.10 SWLS 250/266 → veryHigh');

  // CD-RISC: 百分比版
  const resLow = getResilienceLevel(50, 148); // 33.8% → veryLow
  const resHigh = getResilienceLevel(120, 148); // 81% → high
  const resVHigh = getResilienceLevel(140, 148); // 94.6% → veryHigh
  eq(resLow.level, 'veryLow', '7.11 CD-RISC 50/148 → veryLow');
  eq(resHigh.level, 'high', '7.12 CD-RISC 120/148 → high');
  eq(resVHigh.level, 'veryHigh', '7.13 CD-RISC 140/148 → veryHigh');
}

console.log('\n=== 8. 极值不崩 ===');
{
  // SSRS: 全空
  const ssrsEmpty = generateDetailedSSRSReport({}, getQuestionsForAssessment('social-support'));
  ok(ssrsEmpty.summary !== null, '8.1 SSRS 全空不崩');

  // MBI: 全空
  const mbiEmpty = generateDetailedMBIReport({}, getQuestionsForAssessment('mbi-burnout'));
  ok(mbiEmpty.summary !== null, '8.2 MBI 全空不崩');

  // SWLS: 全空
  const swlsEmpty = generateDetailedSWLSReport({}, getQuestionsForAssessment('life-satisfaction'));
  ok(swlsEmpty.summary !== null, '8.3 SWLS 全空不崩');

  // CD-RISC: 全空
  const resEmpty = generateDetailedResilienceReport(
    {},
    getQuestionsForAssessment('resilience-cdrisc')
  );
  ok(resEmpty.summary !== null, '8.4 CD-RISC 全空不崩');
}

console.log('\n=== 9. 题库与主量表 trait 一致性 (扩展不破坏因子结构) ===');
{
  // SSRS: subjective bank 全是 subjective trait
  const subjAllSubjective = SSRS_SUBJECTIVE_BANK.every(q => q.trait === 'subjective');
  ok(subjAllSubjective, '9.1 SSRS_SUBJECTIVE_BANK 全是 subjective trait');

  // MBI: 每个 bank 内 trait 一致
  const exAllExhaustion = MBI_EXHAUSTION_BANK.every(q => q.trait === 'exhaustion');
  const cyAllCynicism = MBI_CYNICISM_BANK.every(q => q.trait === 'cynicism');
  const peAllEfficacy = MBI_EFFICACY_BANK.every(q => q.trait === 'efficacy');
  ok(exAllExhaustion, '9.2 MBI_EXHAUSTION_BANK trait 一致');
  ok(cyAllCynicism, '9.3 MBI_CYNICISM_BANK trait 一致');
  ok(peAllEfficacy, '9.4 MBI_EFFICACY_BANK trait 一致');

  // CD-RISC: 每个 bank trait 一致
  const resBanks = [
    { bank: RESILIENCE_ADAPTABILITY_BANK, expected: 'adaptability' },
    { bank: RESILIENCE_RELATIONSHIPS_BANK, expected: 'relationships' },
    { bank: RESILIENCE_MEANING_BANK, expected: 'meaning' },
    { bank: RESILIENCE_SELF_EFFICACY_BANK, expected: 'selfEfficacy' },
    { bank: RESILIENCE_OPTIMISM_BANK, expected: 'optimism' },
  ];
  resBanks.forEach((b, i) => {
    const allCorrect = b.bank.every(q => q.trait === b.expected);
    ok(allCorrect, `9.${5 + i} CD-RISC bank "${b.expected}" trait 一致`);
  });
}

console.log(`\n========================================`);
console.log(`[bank-test] 通过: ${passed}  失败: ${failed}  总计: ${passed + failed}`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
