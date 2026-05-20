import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function addDifficultyTags(content, blockName) {
  const regex = new RegExp(`${blockName}:\\s*\\[([\\s\\S]*?)\\]\\s*[,}]`, 'g');
  const match = regex.exec(content);

  if (!match) {
    return content;
  }

  const questionsBlock = match[1];
  const fullMatch = match[0];

  let braceDepth = 0;
  let inString = false;
  let stringChar = '';
  let questions = [];
  let currentQuestion = '';
  let startIndex = 0;
  let depth = 0;

  for (let i = 0; i < questionsBlock.length; i++) {
    const char = questionsBlock[i];
    const prevChar = i > 0 ? questionsBlock[i-1] : '';

    if (!inString) {
      if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
        currentQuestion += char;
      } else if (char === '{') {
        if (braceDepth === 0) {
          startIndex = i;
        }
        braceDepth++;
        currentQuestion += char;
      } else if (char === '}') {
        braceDepth--;
        currentQuestion += char;
        if (braceDepth === 0 && currentQuestion.trim()) {
          const q = currentQuestion.trim();
          if (q.startsWith('{') && q.endsWith('}')) {
            questions.push({
              text: q,
              start: startIndex,
              end: i + 1
            });
          }
          currentQuestion = '';
        }
      } else {
        if (braceDepth > 0) {
          currentQuestion += char;
        }
      }
    } else {
      if (char === stringChar && prevChar !== '\\') {
        inString = false;
      }
      currentQuestion += char;
    }
  }

  if (questions.length === 0) {
    return content;
  }

  const total = questions.length;
  const easyCount = Math.floor(total * 0.6);
  const mediumCount = Math.floor(total * 0.3);

  let result = content;
  let offset = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const difficulty = i < easyCount ? 'easy' :
                      i < easyCount + mediumCount ? 'medium' : 'hard';

    if (!q.text.includes('difficulty:')) {
      let modifiedQuestion = q.text;

      if (modifiedQuestion.endsWith(',')) {
        modifiedQuestion = modifiedQuestion.replace(/,\s*$/, `, difficulty: '${difficulty}'`);
      } else if (modifiedQuestion.endsWith('}')) {
        modifiedQuestion = modifiedQuestion.replace(/}\s*$/, `, difficulty: '${difficulty}'`);
      }

      const actualStart = match.index + blockName.length + 2 + q.start;
      const actualEnd = match.index + blockName.length + 2 + q.end;

      const before = result.substring(0, actualStart);
      const after = result.substring(actualEnd);
      result = before + modifiedQuestion + after;
    }
  }

  return result;
}

function processFile(filePath) {
  console.log(`Processing: ${filePath}`);

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    const blockNames = ['questions', 'normal', 'advanced', 'professional'];

    for (const blockName of blockNames) {
      content = addDifficultyTags(content, blockName);
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`  ✓ Updated: ${filePath}`);
      return { updated: 1, noChanges: 0 };
    } else {
      console.log(`  - No changes: ${filePath}`);
      return { updated: 0, noChanges: 1 };
    }
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return { updated: 0, noChanges: 0 };
  }
}

function processDirectory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    let totalUpdated = 0;
    let totalNoChanges = 0;

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        const result = processDirectory(filePath);
        totalUpdated += result.updated;
        totalNoChanges += result.noChanges;
      } else if (file.endsWith('.ts') && !file.includes('.test.') && !file.includes('.spec.')) {
        const result = processFile(filePath);
        totalUpdated += result.updated;
        totalNoChanges += result.noChanges;
      }
    }

    return { updated: totalUpdated, noChanges: totalNoChanges };
  } catch (error) {
    console.error(`Error reading directory: ${error.message}`);
    return { updated: 0, noChanges: 0 };
  }
}

const assessmentsDir = path.join(__dirname, 'src/data/assessments');
const entertainmentDir = path.join(__dirname, 'src/data/entertainment');
const professionalDir = path.join(__dirname, 'src/data/professional');

console.log('🚀 Starting to process assessment files...\n');

let totalUpdated = 0;
let totalNoChanges = 0;

if (fs.existsSync(assessmentsDir)) {
  console.log('📂 Processing assessments directory...');
  const result = processDirectory(assessmentsDir);
  totalUpdated += result.updated;
  totalNoChanges += result.noChanges;
}

if (fs.existsSync(entertainmentDir)) {
  console.log('\n📂 Processing entertainment directory...');
  const result = processDirectory(entertainmentDir);
  totalUpdated += result.updated;
  totalNoChanges += result.noChanges;
}

if (fs.existsSync(professionalDir)) {
  console.log('\n📂 Processing professional directory...');
  const result = processDirectory(professionalDir);
  totalUpdated += result.updated;
  totalNoChanges += result.noChanges;
}

console.log('\n' + '='.repeat(60));
console.log(`✅ Processing complete!`);
console.log(`   Files updated: ${totalUpdated}`);
console.log(`   No changes: ${totalNoChanges}`);
console.log('='.repeat(60));
