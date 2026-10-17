// Builds engine/kit/icons.json from a lucide-static package (ISC licence): one SVG path string per icon.
//   node tools/kit-icons.mjs <path-to-unpacked-lucide-static/package>
// Every primitive (circle, rect, line, polyline, polygon, ellipse) becomes path data, so the kit can
// draw any icon as a single Path2D and measure its length for draw-on animations.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const src = process.argv[2];
if (!src) { console.error('usage: node tools/kit-icons.mjs <lucide-static/package>'); process.exit(1); }
const nodes = JSON.parse(fs.readFileSync(path.join(src, 'icon-nodes.json'), 'utf8'));
const tags = JSON.parse(fs.readFileSync(path.join(src, 'tags.json'), 'utf8'));

const n = v => +(+v).toFixed(3);
const pts = s => s.trim().split(/[\s,]+/).map(Number);
function toPath([tag, a]) {
  switch (tag) {
    case 'path': return a.d;
    case 'line': return `M${n(a.x1)} ${n(a.y1)}L${n(a.x2)} ${n(a.y2)}`;
    case 'circle': { const { cx, cy, r } = a; return `M${n(cx - r)} ${n(cy)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`; }
    case 'ellipse': { const { cx, cy, rx, ry } = a; return `M${n(cx - rx)} ${n(cy)}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0`; }
    case 'rect': {
      const x = +a.x || 0, y = +a.y || 0, w = +a.width, h = +a.height, r = Math.min(+(a.rx ?? a.ry ?? 0), w / 2, h / 2);
      if (!r) return `M${x} ${y}h${w}v${h}h${-w}Z`;
      return `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}Z`;
    }
    case 'polyline': case 'polygon': {
      const p = pts(a.points); let d = `M${p[0]} ${p[1]}`;
      for (let i = 2; i < p.length; i += 2) d += `L${p[i]} ${p[i + 1]}`;
      return tag === 'polygon' ? d + 'Z' : d;
    }
    default: throw new Error(`unknown svg element ${tag}`);
  }
}

const out = {};
for (const [name, list] of Object.entries(nodes)) out[name] = list.map(toPath).join(' ');
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../engine/kit');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'icons.json'), JSON.stringify(out));
// name + search tags, for finding an icon from a word ("server", "gun", "money")
fs.writeFileSync(path.join(dir, 'icon-tags.json'), JSON.stringify(Object.fromEntries(Object.keys(out).map(k => [k, tags[k] ?? []]))));
fs.copyFileSync(path.join(src, 'LICENSE'), path.join(dir, 'ICONS-LICENSE.txt'));
console.log(`${Object.keys(out).length} icons → ${path.join(dir, 'icons.json')}`);
