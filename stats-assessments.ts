
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assessmentsDir = path.join(__dirname, 'src/data/assessments');
const files = fs.readdirSync(assessmentsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

interface AssessmentStats {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  questionCount: number;
  difficulty: string;
}

const stats: AssessmentStats[] = [];

console.log('🔍 正在分析测评文件...\n');

files.forEach(file => {
  const filePath = path.join(assessmentsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  try {
    const idMatch = content.match(/id:\s*['"](.+?)['"]/);
    const titleMatch = content.match(/title:\s*['"](.+?)['"]/);
    const categoryMatch = content.match(/category:\s*['"](.+?)['"]/);
    const subcategoryMatch = content.match(/subcategory:\s*['"](.+?)['"]/);
    const difficultyMatch = content.match(/difficulty:\s*['"](.+?)['"]/);
    
    const questionsMatches = content.match(/questions:\s*\[/g);
    let questionCount = 0;
    if (questionsMatches) {
      const questionRegex = /id:\s*['"].+?['"]\s*,\s*type:/g;
      const matches = content.match(questionRegex);
      questionCount = matches ? matches.length : 0;
    }
    
    if (idMatch) {
      stats.push({
        id: idMatch[1],
        title: titleMatch ? titleMatch[1] : 'Unknown',
        category: categoryMatch ? categoryMatch[1] : 'Unknown',
        subcategory: subcategoryMatch ? subcategoryMatch[1] : 'Unknown',
        questionCount,
        difficulty: difficultyMatch ? difficultyMatch[1] : 'Unknown',
      });
    }
  } catch (e) {
    console.log(`⚠️  无法解析 ${file}`);
  }
});

// 分类统计
const categories: Record<string, { count: number; totalQuestions: number; assessments: AssessmentStats[] }> = {};
stats.forEach(assess => {
  if (!categories[assess.category]) {
    categories[assess.category] = { count: 0, totalQuestions: 0, assessments: [] };
  }
  categories[assess.category].count++;
  categories[assess.category].totalQuestions += assess.questionCount;
  categories[assess.category].assessments.push(assess);
});

// 打印报告
console.log('📊 测评统计报告');
console.log('================\n');

console.log(`总测评数: ${stats.length}`);
console.log(`总题目数: ${stats.reduce((sum, a) => sum + a.questionCount, 0)}\n`);

console.log('📁 分类统计:');
console.log('-------------');
Object.entries(categories).sort((a, b) => b[1].count - a[1].count).forEach(([category, data]) => {
  console.log(`${category}: ${data.count}个测评, ${data.totalQuestions}题`);
  data.assessments.forEach(assess => {
    console.log(`  - ${assess.title} (${assess.questionCount}题, ${assess.difficulty})`);
  });
  console.log('');
});

// 题目数量分布
console.log('📝 题目数量分布:');
console.log('---------------');
stats.sort((a, b) => b.questionCount - a.questionCount).forEach(assess => {
  console.log(`${assess.questionCount.toString().padStart(3)}题 | ${assess.title}`);
});

console.log('\n✨ 分析完成！');
