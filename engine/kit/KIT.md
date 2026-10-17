# Ration kit — films as data

A kit film is one `scene.js` that calls `film({...})`. You describe **what appears when**; the kit draws it,
times captions, adds transitions, camera shake, bloom and HUD. Write a custom `draw` cue only for a visual
no verb can express.

```js
import { film } from '../../engine/kit/film.js';
export default film({
  theme: 'night',                       // night | paper | mono  (or { base: 'night', accent: '#FF4054' })
  brand: 'ONLINE FPS · ATEŞİN ARKA PLANI',
  lines: ['Tetiğe bastığın an…', '…'],   // narration = captions; one array item per spoken sentence
  scenes: [
    { name: 'hook', label: 'GİRİŞ', from: 0, cues: [ /* … */ ] },
    { name: 'packet', label: 'PAKET', from: 2, glow: [[900, 1200, 'cyan']], cues: [ /* … */ ] },
  ],
});
```

Each scene's `from` is the **index of its first narration line** in `lines` (0-based, not seconds): scenes start in
line order and together cover every line, e.g. `from: 0`, `from: 2`, `from: 3`… The scene runs until the next scene's line.

Then `node tools/kit-sync.mjs examples/<name>` writes the duration into `project.json`.

## Frame and layout (9:16, 1080×1920)
- Safe area x 84…996. Step tag y 300. **Title** baseline y 470 (left, x 84). Stage y 650…1400. Captions ≈ y 1560 (keep clear).
- Two columns: x 260 and 820. Three: 200 / 540 / 880. Centre 540.

## Time (`at`, `out`, `rowsAt`, `itemsAt`, `changeAt`)
- `0.4` → seconds after the scene starts · `'kelime'` → when the narration says that word (best: sync to speech) ·
  `'kelime+0.3'` · `'#id'` / `'#id.end'` → another (earlier) cue · `'end-0.6'` → before the scene ends · `'@12'` absolute.
- Actors stay until `out` (or the scene ends). A title leaves automatically when the next title arrives.

## Colours
`ink dim bg panel panel2 accent red cyan yellow green purple`, or `'#RRGGBB'`.

## Verbs — `{ do: '<verb>', ...props }`
Actors (`id` lets other cues move/target them):
- `title` text (`\n` for 2 lines), at, out?, color?, align?: 'center', y?
- `text` text, x, y, size=40, font: mono|cond|disp|body, color, align, anim: fade|rise|type|pop, w? (max width), stroke?
- `tag` text, x, y, color='accent', align — rounded label pill
- `step` num: '02', label: 'AĞ' — small chapter tag top-left
- `icon` name, id, x, y, size=160, color, anim: pop|draw|fade, badge?: true (framed tile), glow?: true|0.5, label?
  Icons are Lucide names (`server, monitor, crosshair, wifi, clock, timer, zap, target, shield, cpu, globe, database,
  user, users, skull, heart, gamepad-2, swords, rewind, history, mouse-pointer-click, gauge, activity, check, x, alert-triangle, …`).
  Find more: `node tools/kit-icons-find.mjs <word>`.
- `figure` id, x, y (feet), size=330 (height px), color='red', outline? — a person silhouette (player/enemy)
- `card` id, x, y, w=860, title, note?, color='cyan', rows: [[key, value, color?]], rowsAt? / step=0.35 — data panel
- `list` items: [...], y=670, x?, w?, at, step=0.5 / itemsAt, check?: true, num?: false — numbered rows
- `bar` x, y, w=600, label, from, to, changeAt, dur, suffix?, note?, color? — value bar (e.g. health 100→27)
- `counter` x, y, from, to, at, dur=1, size=140, prefix, suffix, decimals, color — rolling number
- `link` from, to (id or [x,y]), via?: [[x,y]…] (drawn as hops), color='dim', dashed?, flow?, label? — connection line
- `track` x, y, w, n=8 ticks, step=0.08, color, label, marks: [{ i, label, color }], cursor?: { from, dur } — time steps / ticks

Events:
- `packet` from, to, via?, at, dur=0.8, color='cyan', label?, ring? — a data packet travelling
- `beam` from, to, at, dur=0.9, color='yellow' — a ray/shot line
- `hit` target id or x,y, at, dx?, dy? — hitmarker · `ring` x,y or target, at, color, radius — shockwave
- `flash` at, color='yellow' · `shake` at, strength · `glitch` at
- `split` at, labels: ['SEN', 'SUNUCU'] — vertical divider for a two-sided comparison

Drawings from the asset library (catalogue below the guide; only approved ones are listed):
- `asset` name: 'category/name', id, x, y, size (px width), rot?, flip?, params: {...}, anim: pop|fade|none — e.g. a
  `characters/soldier` with `params: { hit: 'headshot' }`. Its attach points work as targets: `from: 'gun.muzzle'`.
- Missing a drawing? Use the closest icon/figure now and add a wish to the film: `wishes: ['weapons/sniper — side view
  sniper rifle; params: fire (time)']`. Wishes go to the asset agents' list.

Modifiers (act on an actor by `target`):
- `move` target, to: [x,y], at, dur=0.6 · `scale` target, to, at · `pulse` target, at · `tint` target, color, at · `hide` target, at

Custom (only when nothing above fits — keep it short):
- `draw` at, dur, fn(ctx, k) — `k`: t, p (0…1 over dur), W, H, col(name), text(ctx,…), icon(name,x,y,size,color),
  pill(x,y,text,{bg}), person(x,y,scale,color), glow(x,y,r,color,a), posOf(id), E (easings), prog, lerp, clamp.

## Craft rules
- Something must appear within 0.3 s of a scene's start (a title or the main actor) — never an empty frame.
- One idea per scene, 4–9 cues. Every narrated noun that matters gets a visual, timed to its word.
- Big type for the key term (title), small mono for labels. Max ~3 colours per scene; `accent` = the hero.
- Motion should explain: packets travel, bars drain, ticks tick. Avoid decoration that means nothing.
- Mark illustrative numbers as such (a `tag` or `note`: 'temsili').
