import { getAssessmentById, standardAssessmentList } from './src/data/assessments'

console.log('=== 测试 getAssessmentById 函数 ===')
console.log('standardAssessmentList 长度:', standardAssessmentList.length)
console.log('standardAssessmentList 的 id:', standardAssessmentList.map(a => a.id).slice(0, 10))

const testIds = ['sbti-personality', 'iq-ravens', 'eq-goleman', 'ocean-bigfive', 'sbti']

testIds.forEach(id => {
  const assessment = getAssessmentById(id)
  console.log(`测试 id="${id}":`, assessment ? `✅ 找到: ${assessment.title}` : '❌ 未找到')
})

console.log('\n=== 测试完成 ===')
