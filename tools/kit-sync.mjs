// Writes a kit film's duration (from its narration timing) into the project's project.json.
//   node tools/kit-sync.mjs examples/<name>
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = process.argv[2];
if (!dir) { console.error('usage: node tools/kit-sync.mjs examples/<name>'); process.exit(1); }
const cfgPath = path.join(dir, 'project.json'), cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const scene = (await import(pathToFileURL(path.resolve(dir, cfg.scene ?? 'scene.js')).href)).default;
if (!scene.duration) { console.error('not a kit film (scene has no duration())'); process.exit(1); }
try { cfg.duration = scene.duration(); }
catch (e) { console.error(`✖ ${e.message}`); process.exit(1); }
for (const [i, s] of scene.spec.scenes.entries()) {
  const f = s.from ?? 0, prev = i ? scene.spec.scenes[i - 1].from ?? 0 : -1;
  if (!Number.isInteger(f) || f < 0 || f >= scene.spec.lines.length || f <= prev) {
    console.error(`✖ kit: scene "${s.name}" has from=${s.from}; it must be the index of its first line in lines (0…${scene.spec.lines.length - 1}), increasing scene by scene`);
    process.exit(1);
  }
}
fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + '\n');
console.log(`${dir}: duration ${cfg.duration}s, ${scene.spec.scenes.length} scenes, ${scene.spec.lines.length} lines`);
