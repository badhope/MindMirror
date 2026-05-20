
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CONFIG = {
  easy: 0.6,
  medium: 0.3,
  hard: 0.1
};

function addDifficultyTagsToQuestions(questions: any[]): any[] {
  if (!Array.isArray(questions) || questions.length === 0) {
    return questions;
  }

  const total = questions.length;
  const easyCount = Math.floor(total * CONFIG.easy);
  const mediumCount = Math.floor(total * CONFIG.medium);

  return questions.map((q, index) =&gt; {
    // Preserve existing difficulty if present
    if (q.difficulty) {
      return q;
    }

    let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
    if (index &gt;= easyCount + mediumCount) {
      difficulty = 'hard';
    } else if (index &gt;= easyCount) {
      difficulty = 'medium';
    }

    return { ...q, difficulty };
  });
}

function updateFileContent(content: string, filePath: string): string {
  // Let's use a simple approach with regex and string manipulation since
  // these are mostly static data files with question arrays
  let result = content;

  // First, check if it's an Assessment type file with 'questions' array
  // or if it exports question arrays directly

  // We'll use a multi-step approach:
  // 1. Find all question arrays (including professionalQuestions)
  // 2. For each, parse, add difficulty tags, and update

  // First, let's handle simple question arrays like "questions: [...]" or "export const ...Questions = [...]"

  // This is a simplified approach. We'll use a few patterns to match common structures

  // First, look for patterns where an array of questions is assigned
  // Let's match arrays that contain { id: ..., text: ..., type: ... }

  // Let's use a safer approach - we'll manually handle specific known file patterns
  // based on the files we've seen

  // First, let's handle the main pattern: arrays of { id: ..., text: ..., type: ... }

  // Let's look for arrays like:
  // [
  //   { id: '...', type: '...', text: '...', ... },
  //   ...
  // ]

  // We'll process content line by line or use a more intelligent approach
  // Let's use a recursive descent parser approach for object literals

  function findAndProcessQuestionArrays(str: string): string {
    let result = str;
    let pos = 0;

    // First, find all the arrays that start with [ and end with ]
    // and contain question-like objects inside

    // Let's use a stack-based approach to find array boundaries

    while (pos &lt; result.length) {
      // Find the start of an array that might contain questions
      const arrayStart = findQuestionArrayStart(result, pos);
      if (arrayStart === -1) break;

      // Find the matching end bracket
      const arrayEnd = findMatchingBracket(result, arrayStart, '[', ']');
      if (arrayEnd === -1) break;

      // Extract the array content and see if it contains questions
      const arrayContent = result.slice(arrayStart + 1, arrayEnd);
      if (looksLikeQuestionArray(arrayContent)) {
        // Parse and update the array
        try {
          // Convert the content to valid JSON (replace ' with " and fix other issues)
          // Note: This is a heuristic approach
          const normalizedContent = normalizeToJson(arrayContent);
          const questions = JSON.parse(`[${normalizedContent}]`);
          const updatedQuestions = addDifficultyTagsToQuestions(questions);

          // Convert back to JS/TS syntax
          const updatedArrayStr = questionsToJsString(updatedQuestions);

          // Replace the original array with updated one
          result = result.slice(0, arrayStart) + '[' + updatedArrayStr + ']' + result.slice(arrayEnd);
        } catch (e) {
          console.warn(`Failed to parse array in file ${filePath}: ${(e as Error).message}`);
        }
      }

      pos = arrayEnd + 1;
    }

    return result;
  }

  function findQuestionArrayStart(str: string, fromIndex: number): number {
    // Look for '[' that could be the start of a question array
    let i = fromIndex;
    while (i &lt; str.length - 1) {
      if (str[i] === '[') {
        // Check if this looks like a question array
        const nextChar = str[i + 1];
        if (nextChar === '{') {
          // Could be an array of objects - check if it contains question-like keys
          const sample = str.slice(i, i + 500);
          if (sample.includes('id:') &amp;&amp; sample.includes('text:') &amp;&amp; sample.includes('type:')) {
            return i;
          }
        }
      }
      i++;
    }
    return -1;
  }

  function findMatchingBracket(str: string, startPos: number, open: string, close: string): number {
    let depth = 1;
    let i = startPos + 1;
    while (i &lt; str.length &amp;&amp; depth &gt; 0) {
      if (str[i] === open) depth++;
      if (str[i] === close) depth--;
      i++;
    }
    return depth === 0 ? i - 1 : -1;
  }

  function looksLikeQuestionArray(content: string): boolean {
    return (
      content.includes('id:') &amp;&amp;
      content.includes('text:') &amp;&amp;
      content.includes('type:')
    );
  }

  function normalizeToJson(str: string): string {
    // Convert JS object literal to valid JSON
    let result = str;

    // First, remove trailing commas
    result = removeTrailingCommas(result);

    // Fix single quotes to double quotes
    // This is tricky due to strings containing apostrophes, but let's do our best
    // Replace ' not inside a string with "
    // Let's do this carefully by handling quoted strings first

    let i = 0;
    let inString = false;
    let inDoubleQuote = false;
    let normalized = '';

    while (i &lt; result.length) {
      const char = result[i];
      const next = result[i + 1];

      if (char === '\\') {
        normalized += char + (next || '');
        i += 2;
        continue;
      }

      if (char === '"') {
        inDoubleQuote = !inDoubleQuote;
        normalized += char;
        i++;
        continue;
      }

      if (char === "'" &amp;&amp; !inDoubleQuote) {
        inString = !inString;
        normalized += '"';
        i++;
        continue;
      }

      // If we're not in a string, add quotes around identifiers
      if (!inString &amp;&amp; !inDoubleQuote &amp;&amp; /[a-zA-Z_$]/.test(char)) {
        let identifier = char;
        let j = i + 1;
        while (j &lt; result.length &amp;&amp; /[a-zA-Z0-9_$]/.test(result[j])) {
          identifier += result[j];
          j++;
        }
        if (result[j] === ':') {
          // It's an object key - add quotes
          normalized += `"${identifier}"`;
          i = j;
          continue;
        }
        normalized += identifier;
        i = j;
        continue;
      }

      normalized += char;
      i++;
    }

    return normalized;
  }

  function removeTrailingCommas(str: string): string {
    let result = str;
    let inString = false;
    let inDoubleQuote = false;
    let processed = '';

    for (let i = 0; i &lt; result.length; i++) {
      const char = result[i];

      if (char === '\\') {
        processed += char + (result[i + 1] || '');
        i++;
        continue;
      }

      if (char === '"') {
        inDoubleQuote = !inDoubleQuote;
        processed += char;
        continue;
      }

      if (char === "'" &amp;&amp; !inDoubleQuote) {
        inString = !inString;
        processed += char;
        continue;
      }

      if ((char === ',' || char === ',\n' || char === ',\r') &amp;&amp; !inString &amp;&amp; !inDoubleQuote) {
        // Check if this is a trailing comma - next non-whitespace is } or ]
        let j = i + 1;
        while (j &lt; result.length &amp;&amp; /\s/.test(result[j])) j++;
        if (j &lt; result.length &amp;&amp; (result[j] === '}' || result[j] === ']')) {
          // Skip trailing comma
          continue;
        }
      }

      processed += char;
    }
    return processed;
  }

  function questionsToJsString(questions: any[]): string {
    // Convert JSON array back to a TypeScript-style array string
    const lines: string[] = [];

    for (const q of questions) {
      lines.push(objectToJsString(q, 2));
    }

    return lines.join(',\n');
  }

  function objectToJsString(obj: any, indent: number): string {
    const indentStr = ' '.repeat(indent);
    const innerIndentStr = ' '.repeat(indent + 2);
    let result = `${indentStr}{\n`;

    const entries = Object.entries(obj);
    for (let i = 0; i &lt; entries.length; i++) {
      const [key, value] = entries[i];
      const isLast = i === entries.length - 1;

      let valueStr: string;
      if (typeof value === 'string') {
        // Use single quotes and escape single quotes inside
        valueStr = `'${value.replace(/'/g, "\\'")}'`;
      } else if (typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined) {
        valueStr = String(value);
      } else if (Array.isArray(value)) {
        valueStr = `[${value.map(item =&gt; {
          if (typeof item === 'string') return `'${item.replace(/'/g, "\\'")}'`;
          if (typeof item === 'object' &amp;&amp; item !== null) {
            return objectToJsString(item, indent + 2);
          }
          return String(item);
        }).join(', ')}]`;
      } else if (typeof value === 'object') {
        valueStr = objectToJsString(value, indent + 2);
      } else {
        valueStr = String(value);
      }

      result += `${innerIndentStr}${key}: ${valueStr}${isLast ? '' : ','}\n`;
    }

    result += `${indentStr}}`;
    return result;
  }

  return findAndProcessQuestionArrays(result);
}

async function main() {
  console.log('Starting difficulty tag update process...');

  const directories = [
    path.join(__dirname, 'src/data/assessments'),
    path.join(__dirname, 'src/data/entertainment'),
    path.join(__dirname, 'src/data/professional')
  ];

  const allFiles: string[] = [];

  for (const dir of directories) {
    const files = await glob(path.join(dir, '**/*.ts'));
    allFiles.push(...files);
  }

  // Exclude index.ts files (they just export things)
  const filesToProcess = allFiles.filter(f =&gt; !f.endsWith('index.ts'));

  console.log(`Found ${filesToProcess.length} files to process`);

  for (const file of filesToProcess) {
    console.log(`Processing: ${file}`);
    try {
      const content = readFileSync(file, 'utf-8');
      const updatedContent = updateFileContent(content, file);

      if (updatedContent !== content) {
        writeFileSync(file, updatedContent, 'utf-8');
        console.log(`  - Updated!`);
      } else {
        console.log(`  - No changes needed`);
      }
    } catch (e) {
      console.error(`Error processing ${file}: ${(e as Error).message}`);
    }
  }

  console.log('Done!');
}

main().catch(console.error);
