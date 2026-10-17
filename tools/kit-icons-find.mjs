// Finds Lucide icon names for a word: node tools/kit-icons-find.mjs server [gun …]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../engine/kit/icon-tags.json');
const tags = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const q of process.argv.slice(2).map(s => s.toLowerCase())) {
  const hits = Object.entries(tags).filter(([n, t]) => n.includes(q) || t.some(x => x.includes(q))).map(([n]) => n);
  console.log(`${q}: ${hits.slice(0, 30).join(', ') || '—'}`);
}
