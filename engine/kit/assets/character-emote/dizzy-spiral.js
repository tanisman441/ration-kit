// character-emote/dizzy-spiral — başı dönen sersem figür. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; ayaklar (0,0), gövde negatif y yönünde yukarı uzar.
export default {
  name: 'dizzy-spiral',
  category: 'character-emote',
  desc: 'Başı dönen sersem figür; gözler spiral olur, baş yana yatar, yıldızlar döner',
  tags: ['sersem', 'baş dönmesi', 'dizzy', 'spiral', 'sendeleme', 'yıldızlar', 'dazed', 'confused', 'stars'],
  box: [-125, -340, 125, 14],
  bleed: 40,
  anchor: 'ayaklar (0,0); boy ~300 birim',
  points: { head: [0, -276], chest: [0, -184], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'neutral' },
    at: { type: 'time', default: null, desc: 'sendeleme anı; gözler spiral olur, baş yana yatar' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const spiralEye = (cx, cy, r0, a) => {
      ctx.strokeStyle = inkC; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 36; i++) {
        const f = i / 36, ang = a + f * 2.6 * k.TAU;
        const r = r0 * (0.15 + 0.85 * f);
        const px = cx + Math.cos(ang) * r, py = cy + Math.sin(ang) * r;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.stroke();
    };
    const star = (x, y, s, a) => {
      ctx.fillStyle = k.rgba('yellow', a);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? s : s * 0.45;
        const ang = -Math.PI / 2 + (i / 10) * k.TAU;
        const px = x + Math.cos(ang) * r, py = y + Math.sin(ang) * r;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath(); ctx.fill();
    };
    const sstep = (a, b, x) => { const s = k.clamp((x - a) / (b - a), 0, 1); return s * s * (3 - 2 * s); };

    const d = p.at == null ? -1 : t - p.at;
    // olay: 0–0.2 baş yana yatar + spiraller, 1.4 sn'de toparlanır
    const diz = d >= 0 ? (1 - sstep(0.9, 1.4, d)) : 0;
    const tiltEv = d >= 0 ? sstep(0, 0.2, d) * 0.34 * (1 - sstep(0.8, 1.4, d)) : 0;
    const wob = d >= 0 && d < 1.4 ? Math.sin(d * k.TAU / 0.55) * 5 * (1 - d / 1.4) : 0;

    // idle: yavaş yalpalanma
    const sway = Math.sin(t * k.TAU / 2.5) * 5;
    const br = Math.sin(t * k.TAU / 2.4) * 2;
    const blink = (t % 4.2) < 0.12 ? 0.2 : 1;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(sway * 0.5, -6, 54, 10, 0, 0, k.TAU); ctx.fill();

    const hipY = -130, shoY = -206 - br * 0.5;

    // bacaklar (sendelemede dizler bükük)
    const bend = diz * 10;
    for (const s of [-1, 1]) {
      limb(sway + s * 13, hipY, sway + s * (16 + bend * 0.4), -68, 20, body);
      limb(sway + s * (16 + bend * 0.4), -68, sway + s * (20 + bend * 0.7), -16, 17, body);
      blob(sway + s * (20 + bend * 0.7) - 12, -13, 24, 13, 6, body);
    }

    // gövde
    blob(sway - 31, -240 - br * 0.4, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(sway + 17, -152, 12, 42, 0.1, 0, k.TAU); ctx.fill();

    // kollar: denge için açık
    const spread = 6 + diz * 14;
    for (const s of [-1, 1]) {
      const hx = sway + s * (37 + spread), hy2 = -134 + diz * 6;
      limb(sway + s * 29, shoY, (sway + s * 29 + hx) / 2, (shoY + hy2) / 2 + 10, 18, body);
      limb((sway + s * 29 + hx) / 2, (shoY + hy2) / 2 + 10, hx, hy2, 15, body);
      disc(hx, hy2, 10, 10, body);
    }

    // baş (olayda yana yatar + sarsılır)
    const hy = -250 - br * 0.6;
    ctx.save();
    ctx.translate(sway + wob, hy);
    ctx.rotate(tiltEv);
    disc(0, 0, 36, 34, body);
    ctx.restore();

    // dönen yıldızlar (olay anında baş çevresinde)
    if (diz > 0.01) {
      for (let i = 0; i < 3; i++) {
        const ang = t * 2.6 + i * (k.TAU / 3);
        const sx = sway + Math.cos(ang) * 62, sy = hy - 6 + Math.sin(ang) * 34;
        star(sx, sy, 9, 0.9 * diz);
      }
    }

    // yüz: spiral gözler + dalgalı ağız (olayda), yoksa mood yüzü
    const ey = hy - 2, ex = 11;
    ctx.fillStyle = inkC; ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    if (diz > 0.25) {
      for (const s of [-1, 1]) spiralEye(sway + s * ex + wob * 0.4, ey, 9, t * 3 + s);
      // dalgalı ağız
      ctx.beginPath();
      for (let i = 0; i <= 16; i++) {
        const wx = sway - 10 + (i / 16) * 20 + wob * 0.4;
        const wy = hy + 14 + Math.sin(i * 1.7) * 2.4;
        i ? ctx.lineTo(wx, wy) : ctx.moveTo(wx, wy);
      }
      ctx.stroke();
    } else {
      for (const s of [-1, 1]) {
        if (p.mood === 'happy') {
          ctx.beginPath(); ctx.arc(sway + s * ex, ey + 4, 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
        } else {
          const r = p.mood === 'surprised' ? 5 : 4;
          ctx.beginPath(); ctx.ellipse(sway + s * ex, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
        }
      }
      if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(sway, hy + 14, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
      else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(sway, hy + 20, 10, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(sway, hy + 12, 6, 8, 0, 0, k.TAU); ctx.fill(); }
      else { ctx.beginPath(); ctx.moveTo(sway - 8, hy + 12); ctx.lineTo(sway + 8, hy + 12); ctx.stroke(); }
    }

    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(sway - 13, hy - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(sway - 15, -214, 9, 24, 0.12, 0, k.TAU); ctx.fill();
  },
};
