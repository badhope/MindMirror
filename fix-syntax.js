const fs = require('fs');
const path = require('path');

// 修复的目录
const dataDirs = [
  'src/data/assessments',
  'src/data/entertainment',
  'src/data/professional'
];

let fixedCount = 0;

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    // 修复 duration: X 后面没有逗号的情况
    // 匹配 "duration: 9" 这种形式，后面跟着换行和 questionCount
    const original = content;
    content = content.replace(/(duration:\s*\d+)(\s*)(questionCount:)/g, '$1,$2$3');
    
    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  const fullDir = path.join(__dirname, dir);
  if (!fs.existsSync(fullDir)) return;
  
  const files = fs.readdirSync(fullDir);
  files.forEach(file => {
    if (file.endsWith('.ts')) {
      fixFile(path.join(fullDir, file));
    }
  });
}

console.log('🔧 Starting syntax fix...\n');
dataDirs.forEach(processDirectory);
console.log(`\n✅ Done! Fixed ${fixedCount} files.`);
