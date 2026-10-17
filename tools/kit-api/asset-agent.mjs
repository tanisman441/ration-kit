// Asset agent: draws the next wishlist item as a kit asset, checks it, looks at the preview, fixes it.
//   ANTHROPIC_API_KEY=... node tools/kit-api/asset-agent.mjs [--item category/name] [--model opus|sonnet] [--effort low] [--rounds 2]
// The result is saved as a draft (engine/kit/assets/…); a person approves it with tools/kit-asset.mjs approve.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const MODELS = { opus: 'claude-opus-5-5', sonnet: 'claude-sonnet-5-5' };
const PRICE = { 'claude-opus-5-5': [4, 5, 0.2, 20], 'claude-sonnet-5-5': [2, 2.5, 0.2, 10] };
const model = MODELS[arg('model', 'opus')] ?? arg('model'), effort = arg('effort', 'low'), rounds = Number(arg('rounds', 2));

const BACKLOG = path.join(ROOT, 'engine/kit/BACKLOG.md'), backlog = fs.readFileSync(BACKLOG, 'utf8');
const items = [...backlog.matchAll(/^- \[ \] ([a-z0-9-]+\/[a-z0-9-]+) — (.+)$/gm)].map(m => ({ name: m[1], desc: m[2], line: m[0] }));
const item = arg('item') ? items.find(i => i.name === arg('item')) : items[0];
if (!item) { console.error('nothing open in the wishlist'); process.exit(1); }
const file = path.join(ROOT, 'engine/kit/assets', `${item.name}.js`);
if (fs.existsSync(file)) { console.error(`${item.name} already exists`); process.exit(1); }

// the first approved asset serves as the worked example (none yet → the contract alone)
const APPROVED = path.join(ROOT, 'engine/kit/assets-approved.json');
const EXAMPLE = (fs.existsSync(APPROVED) ? JSON.parse(fs.readFileSync(APPROVED, 'utf8')) : [])
  .map(n => path.join(ROOT, 'engine/kit/assets', `${n}.js`)).find(f => fs.existsSync(f));
const system = [{
  type: 'text', cache_control: { type: 'ephemeral' },
  text: `You draw vector assets for the Ration kit (Canvas 2D). Follow this contract exactly:\n\n${fs.readFileSync(path.join(ROOT, 'engine/kit/ASSETS.md'), 'utf8')}\n\n` +
    (EXAMPLE ? `A finished example asset:\n\`\`\`js\n${fs.readFileSync(EXAMPLE, 'utf8')}\`\`\`\n\n` : '') +
    'Aim for a clean, readable, slightly stylised look that works on both dark and light themes. Reply with the complete file in one ```js block and nothing else.',
}];

const client = new Anthropic(), runs = [];
async function ask(messages) {
  const msg = await client.beta.messages.stream({ model, max_tokens: 32000, system, messages, output_config: { effort },
    betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }).finalMessage();
  if (msg.stop_reason === 'refusal') throw new Error('model declined');
  if (msg.stop_reason === 'max_tokens') throw new Error('hit max_tokens');
  runs.push(msg.usage);
  const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('');
  const code = text.match(/```(?:js|javascript)?\n([\s\S]*?)```/)?.[1];
  if (!code) throw new Error('no code block in reply');
  return { reply: msg.content.filter(b => b.type === 'text'), code };
}
function check() {
  const r = spawnSync('node', ['tools/kit-asset.mjs', 'check', item.name], { cwd: ROOT, encoding: 'utf8', timeout: 240000 });
  const problems = (r.stdout + r.stderr).split('\n').filter(l => l.includes('✖ ') && !l.includes(`✖ ${item.name}`)).map(l => l.replace(/^\s*✖\s*/, ''));
  return { ok: r.status === 0, problems, png: path.join(ROOT, 'out/assets', `${item.name.replace('/', '-')}.png`) };
}

const t0 = Date.now();
fs.mkdirSync(path.dirname(file), { recursive: true });
const messages = [{ role: 'user', content: `Draw \`${item.name}\`: ${item.desc}` }];
let res;
for (let r = 1; r <= rounds; r++) {
  const { reply, code } = await ask(messages);
  fs.writeFileSync(file, code);
  res = check();
  console.log(`round ${r}: ${res.ok ? 'check passed' : `problems: ${res.problems.join(' | ') || 'see log'}`}`);
  if (r === rounds) break;
  const feedback = [];
  if (fs.existsSync(res.png)) feedback.push({ type: 'image', source: { type: 'base64', media_type: 'image/png', data: fs.readFileSync(res.png).toString('base64') } });
  feedback.push({ type: 'text', text: (fs.existsSync(res.png) ? 'This is the check sheet of your asset (dark + light theme, several moments, attach points in cyan, dashed box).\n' : '') +
    (res.problems.length ? `The checker reported:\n- ${res.problems.join('\n- ')}\n` : 'The checker passed.\n') +
    'Fix every problem and anything that looks off (proportions, readability on both themes, effects timing, points in the right place). Reply with the complete corrected file.' });
  messages.push({ role: 'assistant', content: reply }, { role: 'user', content: feedback });
}

const [pi, pw, pr, po] = PRICE[model];
const cost = runs.reduce((s, u) => s + (u.input_tokens * pi + (u.cache_creation_input_tokens ?? 0) * pw + (u.cache_read_input_tokens ?? 0) * pr + u.output_tokens * po) / 1e6, 0);
if (res.ok) fs.writeFileSync(BACKLOG, backlog.replace(item.line, item.line.replace('- [ ]', '- [x]') + ` _(draft · ${model} · $${cost.toFixed(3)})_`));
spawnSync('node', ['tools/kit-asset.mjs', 'build'], { cwd: ROOT, stdio: 'inherit' });
console.log(`${item.name}: ${res.ok ? 'saved as draft' : 'saved with problems (still open in the wishlist)'} · ${model} · effort ${effort} · ${((Date.now() - t0) / 1000).toFixed(0)} s · $${cost.toFixed(4)}`);
runs.forEach((u, i) => console.log(`  call ${i + 1}: in ${u.input_tokens} · cache write ${u.cache_creation_input_tokens ?? 0} · cache read ${u.cache_read_input_tokens ?? 0} · out ${u.output_tokens}`));
