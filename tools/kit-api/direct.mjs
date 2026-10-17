// Asks Claude (API) to write a kit film from a brief, renders a contact sheet, and reports the real cost.
//   ANTHROPIC_API_KEY=... node tools/kit-api/direct.mjs --model opus|sonnet [--effort low] --out examples/<name> --brief brief.txt [--review]
// --review sends the rendered sheet (and any kit warnings) back once and asks for a corrected file.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const MODELS = { opus: 'claude-opus-5-5', sonnet: 'claude-sonnet-5-5' };
// $ per million tokens: input, cache write (5 min), cache read, output
const PRICE = { 'claude-opus-5-5': [4, 5, 0.2, 20], 'claude-sonnet-5-5': [2, 2.5, 0.2, 10] };

const model = MODELS[arg('model', 'opus')] ?? arg('model'), effort = arg('effort', 'low');
const out = path.resolve(ROOT, arg('out')), brief = fs.readFileSync(path.resolve(ROOT, arg('brief')), 'utf8');
const KIT = fs.readFileSync(path.join(ROOT, 'engine/kit/KIT.md'), 'utf8');
// approved drawings only; one compact line each so the catalogue stays cheap as it grows
const CATALOG_FILE = path.join(ROOT, 'engine/kit/assets.json');
const CATALOG = (fs.existsSync(CATALOG_FILE) ? JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8')) : []).filter(a => a.status === 'approved')
  .map(a => `- ${a.name} — ${a.desc}. params: ${Object.entries(a.params).map(([k, d]) => `${k}:${d.type}${d.values ? `(${d.values.join('|')})` : ''}`).join(', ') || '—'}; points: ${a.points.join(', ') || '—'}`).join('\n');

const system = [{
  type: 'text',
  cache_control: { type: 'ephemeral' },
  text: `You write short explainer films for Ration Studio with the kit described below.\n\n${KIT}\n\n## Asset catalogue\n${CATALOG || '(empty so far — use icons and figures)'}\n\n` +
    'Reply with the complete scene.js in a single ```js code block and nothing else. Narration in the language of the brief; ' +
    'keep every line speakable (one sentence, ~45–75 characters). Use only verbs, props and icon names from the guide.',
}];

const client = new Anthropic();
const runs = [];
async function ask(messages) {
  const stream = client.beta.messages.stream({
    model, max_tokens: 32000, system, messages,
    output_config: { effort },
    betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default',
  });
  const msg = await stream.finalMessage();
  if (msg.stop_reason === 'refusal') throw new Error('model declined the brief');
  if (msg.stop_reason === 'max_tokens') throw new Error('hit max_tokens before finishing the file');
  const fallback = (msg.usage.iterations ?? []).some(e => e.type === 'fallback_message');
  runs.push({ usage: msg.usage, fallback });
  const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('');
  const code = text.match(/```(?:js|javascript)?\n([\s\S]*?)```/)?.[1];
  if (!code) throw new Error('no code block in reply');
  return { msg, code };
}

function build(code) {
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'scene.js'), code);
  const base = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples/fps-kit/project.json'), 'utf8'));
  fs.writeFileSync(path.join(out, 'project.json'), JSON.stringify({ ...base, name: path.basename(out) }, null, 2) + '\n');
  const rel = path.relative(ROOT, out);
  const sync = spawnSync('node', ['tools/kit-sync.mjs', rel], { cwd: ROOT, encoding: 'utf8' });
  if (sync.status) return { ok: false, log: (sync.stderr || sync.stdout).trim() };
  const sheet = spawnSync('node', ['ft.mjs', 'sheet', rel, '16'], { cwd: ROOT, encoding: 'utf8', timeout: 300000 });
  const log = (sheet.stdout + sheet.stderr).split('\n').filter(l => /kit:|scene error|scene warning|✖/.test(l) && !/404/.test(l)).join('\n');
  return { ok: sheet.status === 0, log, sync: sync.stdout.trim() };
}

const t0 = Date.now();
let { msg, code } = await ask([{ role: 'user', content: brief }]);
let res = build(code);
console.log(`round 1: ${res.sync ?? ''}\n${res.log || '(no kit warnings)'}`);

if (process.argv.includes('--review')) {
  const sheet = path.join(out, 'out/sheet.png');
  // a film that failed to build gets the error instead of a picture
  const feedback = res.ok && fs.existsSync(sheet)
    ? [{ type: 'image', source: { type: 'base64', media_type: 'image/png', data: fs.readFileSync(sheet).toString('base64') } },
       { type: 'text', text: `This is a 16-frame contact sheet of your film.${res.log ? `\nKit warnings:\n${res.log}` : ''}\n` +
         'Fix anything that looks empty, overlapping, cut off or hard to read, then reply with the complete corrected scene.js.' }]
    : [{ type: 'text', text: `The film failed to build:\n${res.log}\nFix it and reply with the complete corrected scene.js.` }];
  ({ msg, code } = await ask([
    { role: 'user', content: brief },
    { role: 'assistant', content: msg.content.filter(b => b.type === 'text') },
    { role: 'user', content: feedback },
  ]));
  res = build(code);
  console.log(`round 2: ${res.sync ?? ''}\n${res.log || '(no kit warnings)'}`);
}

// wishes → asset agents' wishlist (skip ones already listed)
try {
  const wishes = (await import(pathToFileURL(path.join(out, 'scene.js')).href + `?v=${Date.now()}`)).default.spec.wishes ?? [];
  const BL = path.join(ROOT, 'engine/kit/BACKLOG.md'), bl = fs.readFileSync(BL, 'utf8');
  const fresh = wishes.map(w => String(w).trim()).filter(w => /^[a-z0-9-]+\/[a-z0-9-]+ — .+/.test(w) && !bl.includes(w.split(' — ')[0]));
  if (fresh.length) {
    fs.appendFileSync(BL, fresh.map(w => `- [ ] ${w} _(wished by ${path.basename(out)})_\n`).join(''));
    console.log(`wishlist +${fresh.length}: ${fresh.map(w => w.split(' — ')[0]).join(', ')}`);
  }
} catch (e) { console.error(`wishes: ${e.message}`); }

// cost from the real usage numbers
const [pi, pw, pr, po] = PRICE[model];
let cost = 0;
const rows = runs.map(({ usage: u, fallback }, i) => {
  const c = (u.input_tokens * pi + (u.cache_creation_input_tokens ?? 0) * pw + (u.cache_read_input_tokens ?? 0) * pr + u.output_tokens * po) / 1e6;
  cost += c;
  return `  call ${i + 1}: in ${u.input_tokens} · cache write ${u.cache_creation_input_tokens ?? 0} · cache read ${u.cache_read_input_tokens ?? 0} · out ${u.output_tokens} → $${c.toFixed(4)}${fallback ? ' (fallback model ran; priced at primary rates)' : ''}`;
});
const report = `${model} · effort ${effort} · ${((Date.now() - t0) / 1000).toFixed(0)} s (incl. sheet renders)\n${rows.join('\n')}\n  total $${cost.toFixed(4)}\n` +
  `  scene.js: ${code.split('\n').length} lines, ${code.length} chars`;
fs.writeFileSync(path.join(out, 'cost.txt'), report + '\n');
console.log(report);
