// Music pool for kit films — every track carries its licence and source.
//   node tools/kit-music.mjs add <file> --title T --license CC0|CC-BY-4.0|synth|own|purchased --source <url|ftsynth|note>
//        [--artist A] [--mood calm,tense,…] [--energy 0..1] [--bpm N]
//   node tools/kit-music.mjs list [--mood tense]
//   node tools/kit-music.mjs mix examples/<name> --track <id> [--gain 0.4] [--voice out/voice.wav]   → out/audio.wav
//   node tools/kit-music.mjs credits                                                               → audio/pool/CREDITS.md
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POOL = path.join(ROOT, 'audio/pool'), DB = path.join(POOL, 'pool.json');
const LICENSES = { CC0: 'no attribution needed', 'CC-BY-4.0': 'credit the artist', synth: 'made with audio/ftsynth.py — ours', own: 'made by us', purchased: 'bought licence — keep the receipt' };
const argv = process.argv.slice(2), cmd = argv[0], pos = argv[1];
const opt = (k, d) => { const i = argv.indexOf(`--${k}`); return i > 0 ? argv[i + 1] : d; };
const die = m => { console.error(`✖ ${m}`); process.exit(1); };
const db = () => (fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB, 'utf8')) : []);
const save = d => { fs.mkdirSync(POOL, { recursive: true }); fs.writeFileSync(DB, JSON.stringify(d, null, 1) + '\n'); };
const run = (bin, args) => spawnSync(bin, args, { encoding: 'utf8', maxBuffer: 1 << 26 });

function measure(file) {
  const dur = parseFloat(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).stdout);
  const lufs = parseFloat((run('ffmpeg', ['-hide_banner', '-i', file, '-af', 'ebur128', '-f', 'null', '-']).stderr.match(/I:\s+(-?[\d.]+) LUFS/g) ?? []).pop()?.match(/-?[\d.]+/)?.[0]);
  return { duration: +dur.toFixed(2), lufs: Number.isFinite(lufs) ? lufs : null };
}
function bpmOf(file) {
  const py = `import librosa,sys\ny,sr=librosa.load(sys.argv[1],sr=22050,mono=True,duration=90)\nt,_=librosa.beat.beat_track(y=y,sr=sr)\nprint(float(t[0]) if hasattr(t,'__len__') else float(t))`;
  const r = run('python', ['-c', py, file]);
  return r.status === 0 ? Math.round(parseFloat(r.stdout)) : null;
}

if (cmd === 'add') {
  if (!pos || !fs.existsSync(pos)) die('give an audio file');
  const license = opt('license'), source = opt('source'), title = opt('title'), artist = opt('artist');
  if (!LICENSES[license]) die(`--license must be one of ${Object.keys(LICENSES).join(', ')} — no licence, no track`);
  if (!source) die('--source is required (URL, "ftsynth" or a note where it came from)');
  if (!title) die('--title is required');
  if (license === 'CC-BY-4.0' && !artist) die('CC-BY needs --artist for the credit');
  const d = db(), id = title.toLowerCase().normalize('NFKD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
  if (d.some(x => x.id === id)) die(`${id} is already in the pool`);
  const dest = path.join(POOL, 'tracks', `${id}${path.extname(pos).toLowerCase()}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(pos, dest);
  const m = measure(dest), bpm = opt('bpm') ? Number(opt('bpm')) : bpmOf(dest);
  d.push({ id, file: path.relative(POOL, dest).replace(/\\/g, '/'), title, artist: artist ?? null, license, source, bpm,
    mood: (opt('mood') ?? '').split(',').filter(Boolean), energy: opt('energy') ? Number(opt('energy')) : null, ...m, added: new Date().toISOString().slice(0, 10) });
  save(d);
  console.log(`+ ${id}: ${m.duration}s · ${bpm ?? '?'} BPM · ${m.lufs ?? '?'} LUFS · ${license}`);
} else if (cmd === 'list') {
  const mood = opt('mood');
  for (const t of db().filter(t => !mood || t.mood.includes(mood)))
    console.log(`${t.id.padEnd(28)} ${String(t.duration).padStart(6)}s ${String(t.bpm ?? '?').padStart(4)} BPM  [${t.mood.join(', ')}]  ${t.license}${t.artist ? ` · ${t.artist}` : ''}`);
} else if (cmd === 'mix') {
  const proj = pos, t = db().find(x => x.id === opt('track'));
  if (!proj || !t) die('usage: mix examples/<name> --track <id>');
  const cfg = JSON.parse(fs.readFileSync(path.join(proj, 'project.json'), 'utf8')), dur = cfg.duration, gain = Number(opt('gain', 0.4));
  const out = path.join(proj, 'out/audio.wav'), voice = opt('voice') && path.join(proj, opt('voice'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  // music bed: loop if short, trim, fade, normalise to -16 LUFS, then sit it under the voice at `gain`
  const music = `[0:a]aloop=loop=-1:size=2e9,atrim=0:${dur},afade=t=in:d=0.8,afade=t=out:st=${Math.max(0, dur - 2.5)}:d=2.5,loudnorm=I=-16:TP=-2,volume=${gain}[m]`;
  const args = ['-y', '-v', 'error', '-i', path.join(POOL, t.file), ...(voice ? ['-i', voice] : []), '-filter_complex',
    voice ? `${music};[1:a]loudnorm=I=-15:TP=-1.5[v];[m][v]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89[o]` : `${music};[m]alimiter=limit=0.89[o]`,
    '-map', '[o]', '-ar', '48000', '-ac', '2', out];
  const r = run('ffmpeg', args);
  if (r.status) die(r.stderr);
  console.log(`→ ${path.relative(ROOT, out)} (${t.id}, gain ${gain}${voice ? ', with voice' : ''}) — render muxes it automatically`);
} else if (cmd === 'credits') {
  const rows = db().filter(t => t.license === 'CC-BY-4.0' || t.license === 'CC0');
  fs.writeFileSync(path.join(POOL, 'CREDITS.md'), `# Music credits\n\n${rows.map(t => `- "${t.title}"${t.artist ? ` by ${t.artist}` : ''} — ${t.license} — ${t.source}`).join('\n') || '_none needed yet_'}\n`);
  console.log(`→ audio/pool/CREDITS.md (${rows.length})`);
} else console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 7).map(l => l.replace(/^\/\/ ?/, '')).join('\n'));
