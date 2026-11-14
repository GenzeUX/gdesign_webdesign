import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const raw = execFileSync('git',['ls-files','-z']);
const files = raw.toString('utf8').split('\0').filter(Boolean);
assert.ok(files.includes('package.json') && files.includes('src/app/page.tsx') && files.includes('vercel.json'));
const forbidden = file => /(^|\/)(?:node_modules|\.next|\.git|\.vercel|test-results|coverage|\.unlazy)(\/|$)/.test(file) || /(^|\/)\.env(?:\.|$)/.test(file) && file !== '.env.example' || /(?:\.pem|\.key|\.tsbuildinfo)$/.test(file);
assert.equal(forbidden('.env.local'),true);
assert.equal(forbidden('.vercel/project.json'),true);
assert.equal(forbidden('.env.example'),false);
assert.deepEqual(files.filter(forbidden),[],'sensitive files must never be committed');
const patterns=[/\b(?:gh[pousr]_[A-Za-z0-9_]{25,}|github_pat_[A-Za-z0-9_]{40,})\b/,/\b\d{8,12}:[A-Za-z0-9_-]{30,}\b/];
for(const file of files) {
  if(/\.(?:webp|png|jpe?g|woff2|ico)$/.test(file))continue;
  const content=readFileSync(file,'utf8');
  for(const pattern of patterns)assert.equal(pattern.test(content),false,`potential credential in ${file}`);
}
console.log(`PUBLICATION FILES SAFE (${files.length} tracked files)`);
