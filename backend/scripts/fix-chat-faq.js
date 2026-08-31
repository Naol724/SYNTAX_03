/**
 * Fixes FAQ ordering in chat.service.ts
 * Moves AI/specific patterns before the generic 'service' pattern
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/services/chat.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The fix: change the regex for the generic 'service' pattern to only match
// when there's no more specific keyword in the message (done by narrowing pattern)
// Simpler approach: just change service pattern to be less greedy

const OLD_SERVICE_PATTERN = `/service|offer|do you|what can|help with/i`;
const NEW_SERVICE_PATTERN = `/\\bservice\\b|\\boffer\\b|\\bwhat do you\\b|\\bhelp with\\b/i`;

if (content.includes(OLD_SERVICE_PATTERN)) {
  content = content.replace(OLD_SERVICE_PATTERN, NEW_SERVICE_PATTERN);
  fs.writeFileSync(filePath, content);
  console.log('Fixed: service pattern narrowed');
} else {
  console.log('Pattern not found - may already be fixed');
}

// Also narrow AI pattern to avoid false positives 
const OLD_AI_PATTERN = `/ai|artificial intelligence|machine learning|chatbot|automation|gpt/i`;
const NEW_AI_PATTERN = `/\\bai\\b|artificial intelligence|machine learning|\\bchatbot\\b|\\bauton/i`;

if (content.includes(OLD_AI_PATTERN)) {
  content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(OLD_AI_PATTERN, NEW_AI_PATTERN);
  fs.writeFileSync(filePath, content);
  console.log('Fixed: AI pattern narrowed');
}

console.log('Done');
