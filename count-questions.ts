
// 快速统计所有测评题目
import fs from 'fs';
import path from 'path';

const assessmentsDir = path.join('/workspace/src/data/assessments');
const entertainmentDir = path.join('/workspace/src/data/entertainment');

function countQuestionsInFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    // 查找所有包含 id: 'xxx' 的对象，这是题目
    const questionMatches = content.match(/id:\s*['"]([^'"]+)['"]/g);
    if (!questionMatches) return 0;
    
    // 过滤掉不是题目的id（比如测评自身的id）
    let count = 0;
    for (const match of questionMatches) {
      if (match.includes('questions') || 
          match.includes('normal') || 
          match.includes('advanced') || 
          match.includes('professional') ||
          match.includes('bigfive') ||
          match.includes('dark-triad')) {
        continue;
      }
      count++;
    }
    
    // 更准确的方法：找 questions: [ 到 ] 的区域
    const questionsMatch = content.match(/questions:\s*\[([\s\S]*?)\]/);
    if (questionsMatch) {
      const questionsContent = questionsMatch[1];
      const actualCount = (questionsContent.match(/id:\s*['"]/g) || []).length;
      if (actualCount > 0) {
        return actualCount;
      }
    }
    
    return count;
  } catch (e) {
    return 0;
  }
}

function scanDirectory(dir: string, prefix: string = '') {
  const results: any[] = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results.push(...scanDirectory(fullPath, prefix + file + '/'));
    } else if (file.endsWith('.ts') && !file.includes('index.ts') && !file.includes('calculator') && !file.includes('common')) {
      const count = countQuestionsInFile(fullPath);
      results.push({
        file: prefix + file,
        path: fullPath,
        count
      });
    }
  }
  
  return results;
}

console.log('📊 题库统计中...\n');
console.log('=' .repeat(60));

const standardResults = scanDirectory(assessmentsDir, '');
const entertainmentResults = scanDirectory(entertainmentDir, '');

console.log('\n📚 标准心理测评:');
let standardTotal = 0;
for (const r of standardResults.filter(r => r.count > 0).sort((a, b) => b.count - a.count)) {
  standardTotal += r.count;
  console.log(`  ${r.file} - ${r.count}题`);
}

console.log(`\n🎮 娱乐趣味测评:`);
let entertainmentTotal = 0;
for (const r of entertainmentResults.filter(r => r.count > 0).sort((a, b) => b.count - a.count)) {
  entertainmentTotal += r.count;
  console.log(`  ${r.file} - ${r.count}题`);
}

console.log('\n' + '='.repeat(60));
console.log(`标准心理测评: ${standardResults.filter(r => r.count > 0).length}个, ${standardTotal}题`);
console.log(`娱乐趣味测评: ${entertainmentResults.filter(r => r.count > 0).length}个, ${entertainmentTotal}题`);
console.log(`**总计: ${standardResults.filter(r => r.count > 0).length + entertainmentResults.filter(r => r.count > 0).length}个测评, ${standardTotal + entertainmentTotal}题**`);
