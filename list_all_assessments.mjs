import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Count questions in a directory
function countQuestionsInDir(dir, options = {}) {
  const { skipIndex = false } = options;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && (skipIndex ? f !== 'index.ts' : true));
  let totalQuestions = 0;
  let totalAssessments = 0;
  const results = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');

    // Extract title
    let nameMatch = content.match(/^\s*title:\s*['"]([^'"]+)['"]/m);
    if (!nameMatch) {
      nameMatch = content.match(/^\s*name:\s*['"]([^'"]+)['"]/m);
    }
    const name = nameMatch ? nameMatch[1] : file.replace('.ts', '');

    // Count question types
    const questionTypes = [
      'likert', 'likert-4', 'likert-5', 'likert-7', 'choice', 'single', 'multiple', 
      'text', 'slider', 'ranking', 'matrix', 'drag'
    ];
    
    let count = 0;
    for (const type of questionTypes) {
      const matches = content.match(new RegExp(`type:\\s*['"]${type}['"]`, 'g'));
      if (matches) count += matches.length;
    }

    // For professional assessments, also count normal/common/advanced arrays
    if (count === 0) {
      const normalCount = (content.match(/normal:\s*\[/g) || []).length;
      const commonCount = (content.match(/common:\s*\[/g) || []).length;
      const advancedCount = (content.match(/advanced:\s*\[/g) || []).length;
      
      if (normalCount > 0 || commonCount > 0 || advancedCount > 0) {
        const textMatches = content.match(/text:\s*['"][^'"]+['"]/g);
        count = textMatches ? textMatches.length : 0;
      }
    }

    if (name && count > 0) {
      totalQuestions += count;
      totalAssessments++;
      results.push({ name, count });
    }
  }

  return { totalQuestions, totalAssessments, results };
}

// Count standard assessments
const standardDir = path.join(__dirname, 'src/data/assessments');
const standard = countQuestionsInDir(standardDir);

// Count professional assessments - recursively
const proDir = path.join(__dirname, 'src/data/professional');
const proFiles = fs.readdirSync(proDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
let proTotal = 0;
let proAssessments = 0;
const proResults = [];

for (const file of proFiles) {
  const filePath = path.join(proDir, file);
  const stat = fs.statSync(filePath);
  
  if (stat.isDirectory()) {
    const subFiles = fs.readdirSync(filePath).filter(f => f.endsWith('.ts') && f !== 'index.ts');
    for (const subFile of subFiles) {
      const content = fs.readFileSync(path.join(filePath, subFile), 'utf8');
      let nameMatch = content.match(/^\s*title:\s*['"]([^'"]+)['"]/m);
      if (!nameMatch) nameMatch = content.match(/MBTI|专业|专业版|Professional/i);
      const name = nameMatch ? (typeof nameMatch[1] === 'string' ? nameMatch[1] : subFile.replace('.ts', '')) : subFile.replace('.ts', '');
      
      const textMatches = content.match(/text:\s*['"][^'"]+['"]/g);
      const count = textMatches ? textMatches.length : 0;
      
      if (count > 0) {
        proTotal += count;
        proAssessments++;
        proResults.push({ name, count });
      }
    }
  } else {
    const content = fs.readFileSync(filePath, 'utf8');
    let nameMatch = content.match(/^\s*title:\s*['"]([^'"]+)['"]/m);
    if (!nameMatch) nameMatch = content.match(/MBTI|SDS|SAS|EQ|Holland|专业|Professional/i);
    const name = nameMatch ? (typeof nameMatch[1] === 'string' ? nameMatch[1] : file.replace('.ts', '')) : file.replace('.ts', '');
    
    const textMatches = content.match(/text:\s*['"][^'"]+['"]/g);
    const count = textMatches ? textMatches.length : 0;
    
    if (count > 0) {
      proTotal += count;
      proAssessments++;
      proResults.push({ name, count });
    }
  }
}

// Sort results by name
standard.results.sort((a, b) => String(a.name).localeCompare(String(b.name)));
proResults.sort((a, b) => String(a.name).localeCompare(String(b.name)));

console.log('=== 普通版测评题目数量表 ===\n');
console.log('| 序号 | 测评名称                              | 题目数 |');
console.log('|------|--------------------------------------|--------|');

standard.results.forEach((item, index) => {
  const paddedName = String(item.name).padEnd(34);
  console.log(`| ${String(index + 1).padStart(3)} | ${paddedName} | ${String(item.count).padStart(5)} |`);
});

console.log('|------|--------------------------------------|--------|');
console.log(`|      | 普通版小计 ${standard.totalAssessments} 个测评                    | ${String(standard.totalQuestions).padStart(5)} |`);

console.log('\n\n=== 专业版测评题目数量表 ===\n');
console.log('| 序号 | 测评名称                              | 题目数 |');
console.log('|------|--------------------------------------|--------|');

proResults.forEach((item, index) => {
  const paddedName = String(item.name).padEnd(34);
  console.log(`| ${String(index + 1).padStart(3)} | ${paddedName} | ${String(item.count).padStart(5)} |`);
});

console.log('|------|--------------------------------------|--------|');
console.log(`|      | 专业版小计 ${proAssessments} 个测评                    | ${String(proTotal).padStart(5)} |`);

console.log('\n\n=== 总计 ===');
console.log(`|      | 全部 ${standard.totalAssessments + proAssessments} 个测评                        | ${String(standard.totalQuestions + proTotal).padStart(5)} |`);
