#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

// 解析题目类型
const QUESTION_TYPES = [
  'single', 'multiple', 'likert-5', 'likert-4', 'likert-3',
  'likert-6', 'likert-6-reverse', 'scale', 'ranking'
]

function analyzeFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // 提取题目数组
    const questionsMatch = content.match(/questions:\s*\[([\s\S]*?)\](?:,|\s*$)/)
    if (!questionsMatch) {
      return { hasQuestions: false }
    }
    
    // 简单统计题目数量
    const questionCount = (content.match(/\{[^\}]*id:\s*["']/g) || []).length
    
    // 分析题目类型
    const types: Record<string, number> = {}
    QUESTION_TYPES.forEach(type => {
      const regex = new RegExp(`type:\\s*["']${type}["']`, 'g')
      const count = (content.match(regex) || []).length
      if (count > 0) {
        types[type] = count
      }
    })
    
    // 检查是否有专业版题目
    const hasProfessional = content.includes('professionalQuestions')
    const hasNormal = content.includes('normal:')
    const hasAdvanced = content.includes('advanced:')
    
    // 提取评分
    const qualityMatch = content.match(/quality:\s*["']([^"']+)["']/)
    const quality = qualityMatch ? qualityMatch[1] : '未知'
    
    // 提取类别和子类别
    const categoryMatch = content.match(/category:\s*["']([^"']+)["']/)
    const subcategoryMatch = content.match(/subcategory:\s*["']([^"']+)["']/)
    
    return {
      hasQuestions: true,
      questionCount,
      types,
      hasProfessional,
      hasNormal,
      hasAdvanced,
      quality,
      category: categoryMatch ? categoryMatch[1] : '未分类',
      subcategory: subcategoryMatch ? subcategoryMatch[1] : '未细分'
    }
  } catch (e) {
    console.error(`Error analyzing ${filePath}:`, e)
    return { hasQuestions: false, error: String(e) }
  }
}

async function main() {
  const assessmentsDir = '/workspace/src/data/assessments'
  const files = fs.readdirSync(assessmentsDir)
  
  const results: Record<string, any> = {}
  
  console.log('\n📊 题库分析报告\n' + '='.repeat(60))
  
  for (const file of files) {
    if (!file.endsWith('.ts') || file === 'index.ts') continue
    
    const filePath = path.join(assessmentsDir, file)
    const analysis = analyzeFile(filePath)
    const assessmentId = file.replace('.ts', '')
    results[assessmentId] = analysis
    
    if (analysis.hasQuestions) {
      const typeSummary = Object.entries(analysis.types)
        .map(([type, count]) => `${type}:${count}`)
        .join(', ') || '未检测到'
      
      console.log(`\n📝 ${assessmentId}`)
      console.log(`   类别: ${analysis.category} / ${analysis.subcategory}`)
      console.log(`   题量: ${analysis.questionCount}题`)
      console.log(`   类型: ${typeSummary}`)
      console.log(`   质量: ${analysis.quality}`)
      console.log(`   模式: ${[
        analysis.hasNormal ? '标准版' : '',
        analysis.hasAdvanced ? '进阶版' : '',
        analysis.hasProfessional ? '专业版' : ''
      ].filter(Boolean).join(', ') || '单版本'}`)
    }
  }
  
  // 生成摘要
  console.log('\n' + '='.repeat(60))
  console.log('\n📈 总体统计\n')
  
  const totalQuestions = Object.values(results)
    .filter(r => r.hasQuestions)
    .reduce((sum, r) => sum + (r.questionCount || 0), 0)
  
  const categories: Record<string, number> = {}
  Object.values(results).forEach(r => {
    if (r.category) {
      categories[r.category] = (categories[r.category] || 0) + 1
    }
  })
  
  console.log(`总测评数: ${Object.values(results).filter(r => r.hasQuestions).length}`)
  console.log(`总题目数: ${totalQuestions}题`)
  console.log('\n类别分布:')
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count}个`)
  })
  
  // 写入JSON报告
  fs.writeFileSync(
    '/workspace/analysis-report.json',
    JSON.stringify(results, null, 2)
  )
  
  console.log('\n✅ 分析完成，详细报告已保存到 analysis-report.json')
}

main().catch(console.error)
