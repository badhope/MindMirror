
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

// The difficulty distribution from addDifficultyTags function
const DIFFICULTY_CONFIG = { easy: 0.6, medium: 0.3, hard: 0.1 };

// Function to add difficulty tags to questions array
function addDifficultyTagsToQuestions(questions: any[]): any[] {
  if (!Array.isArray(questions) || questions.length === 0) {
    return questions;
  }

  const total = questions.length;
  const easyCount = Math.floor(total * DIFFICULTY_CONFIG.easy);
  const mediumCount = Math.floor(total * DIFFICULTY_CONFIG.medium);

  return questions.map((q, index) =&gt; {
    let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
    if (index &gt;= easyCount + mediumCount) {
      difficulty = 'hard';
    } else if (index &gt;= easyCount) {
      difficulty = 'medium';
    }

    // Preserve existing difficulty tag if present
    if (q.difficulty) {
      return q;
    }

    return {
      ...q,
      difficulty
    };
  });
}

// Function to process a file
function processFile(filePath: string) {
  console.log(`Processing: ${filePath}`);
  const content = readFileSync(filePath, 'utf-8');
  
  // Check if file contains TypeScript/JavaScript
  if (!filePath.endsWith('.ts') &amp;&amp; !filePath.endsWith('.js')) {
    console.log(`Skipping non-TS/JS file: ${filePath}`);
    return;
  }

  // Simple AST-based approach to find and update questions arrays
  let modified = false;
  
  // First, let's try to parse the file and see what structures we have
  // We'll use regex patterns to find common question structures
  
  // Let's write a smarter approach using a simple tokenizer/parser
  let newContent = content;
  
  // Look for patterns like: questions: [ ... ]
  // Or professionalQuestions: { normal: [ ... ], advanced: [ ... ], professional: [ ... ] }
  
  // This is a simplified approach - for a real solution we'd use a proper AST parser,
  // but for now let's make some educated guesses about the file structure
  if (content.includes('questions: [') || content.includes('professionalQuestions')) {
    try {
      // For safety, we'll write a script that uses TypeScript AST instead,
      // but let's first explore the files to understand their structure better.
      console.log(`File contains questions: ${filePath}`);
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  } else {
    console.log(`No questions found in: ${filePath}`);
  }
  
  return modified;
}

// Main function
async function main() {
  console.log('Starting to update difficulty tags...');
  
  // Find all files in the three directories
  const directories = [
    'src/data/assessments',
    'src/data/entertainment',
    'src/data/professional'
  ];
  
  const files: string[] = [];
  
  for (const dir of directories) {
    const pattern = path.join(dir, '**/*.ts');
    const dirFiles = await glob(pattern);
    files.push(...dirFiles);
  }
  
  console.log(`Found ${files.length} files to process.`);
  console.log('Files:', files);
  
  // Now let's first inspect a few files to understand their structure better
  // without modifying anything yet
}

main().catch(console.error);
