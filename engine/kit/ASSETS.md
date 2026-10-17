# Kit assets — drawings the director can place

An asset is one file `engine/kit/assets/<category>/<name>.js` (lowercase, dashes). Films use it with
`{ do: 'asset', name: '<category>/<name>', id, x, y, size, rot?, flip?, params: {...}, anim: pop|fade|none, at, out? }`.

```js
export default {
  name: 'rifle', category: 'weapons',
  desc: 'Side-view assault rifle, muzzle pointing right',          // one line, what it looks like
  tags: ['silah', 'tüfek', 'gun', 'rifle', 'fps'],                 // Turkish + English search words
  box: [-150, -50, 150, 50],      // extent in local units; `size` in a film = box width in px. (0,0) = the anchor
  bleed: 0,                       // effects (flash, smoke, sparks) may leave the box by this many units
  anchor: 'centre of the body',   // say where (0,0) is: centre, feet, base…
  points: { muzzle: [150, -12] }, // attach points other cues can use: 'gun.muzzle'
  params: {                       // everything a film may set; give every param a default
    color: { type: 'color', default: 'ink' },
    fire: { type: 'time', default: null, desc: 'moment of the shot (recoil + muzzle flash)' },
    variant: { type: 'enum', values: ['a', 'b'], default: 'a' },
  },
  draw(ctx, t, p, k) { /* local coords, t = seconds since the asset appeared, p = params */ },
};
```

## Rules (checked by `node tools/kit-asset.mjs check <category>/<name>`)
- `draw` is a pure function of `t` and `p`: no `Math.random`, `Date`, `performance`, timers, `fetch`, DOM, imports or
  state kept between calls. Use `k.hash(n)` / `k.noise1(x)` for variation.
- Stay inside `box` (+ `bleed` for short-lived effects). Don't paint a background. Leave the canvas state as you found it (`save`/`restore`).
- Colours come from the theme: `k.col('ink' | 'dim' | 'bg' | 'panel' | 'panel2' | 'accent' | 'red' | 'cyan' | 'yellow' |
  'green' | 'purple')` returns [r,g,b]; `k.rgba(name, alpha)` returns a CSS colour. Params of type `color` hold such a name.
- Time params arrive as seconds relative to the asset's own `t` (or `null`): `const d = p.fire == null ? -1 : t - p.fire`.
- Style: flat shapes, rounded corners (`k.rrect`), 4–8 px outlines in `bg` at 0.5–0.7 alpha so it reads on any background,
  one accent colour. Idle motion (breathing, blinking LEDs, flicker) is welcome but subtle.
- Helpers in `k`: `pal, col, rgba, E (easings), hash, noise1, lerp, clamp, prog, TAU, rrect(x,y,w,h,r), glow(x,y,r,colour,alpha)`.

## Workflow
1. `node tools/kit-asset.mjs new <category>/<name>` → scaffold.
2. Draw, then `check` → `out/assets/<category>-<name>.png` (dark + light background, several moments, attach points marked). Look at it.
3. `node tools/kit-asset.mjs build` → `engine/kit/assets.json` catalogue + `out/assets/gallery.html`.
4. New assets are **drafts**; a person approves them with `approve <category>/<name>`. Films only list approved assets.
