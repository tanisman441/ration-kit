// broadcast-fx/comment-fly — uçan yorum balonu. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) uçuş yolunun merkezidir.
export default {
  name: 'comment-fly', category: 'broadcast-fx',
  desc: 'Uçan yorum: at anında sol alttan fırlayıp kavisle sağ üste uçar, iz bırakır, varınca kalp atar',
  tags: ['yorum', 'uçan yorum', 'balon', 'mesaj', 'canlı sohbet', 'comment', 'flying comment', 'chat', 'bubble', 'live chat', 'reaction'],
  box: [-200, -120, 200, 120],
  bleed: 40,
  anchor: 'uçuş yolunun merkezi (0,0)',
  points: { start: [-110, 85], end: [105, -75], bubble: [105, -75] },
  params: {
    at: { type: 'time', default: null, desc: 'uçuş anı (1.2 sn kavisli uçuş + kalp)' },
    text: { type: 'text', default: 'Harika yayın!', desc: 'balondaki yorum yazısı' },
    color: { type: 'color', default: 'panel2' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? 1e9 : t - p.at;
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // konum: d<0 park hâli (sol alt, hafif salınım), 0–1.2 uçuş, sonra sağ üstte süzülme
    let bx, by, tilt;
    if (d < 0) { bx = -110; by = 85 + Math.sin(t * 2) * 3; tilt = 0; }
    else if (d <= 1.2) {
      const e = k.E.inOutCubic(k.clamp(d / 1.2, 0, 1));
      bx = k.lerp(-110, 105, e);
      by = k.lerp(85, -75, e) - Math.sin(e * Math.PI) * 40;
      tilt = Math.sin(e * Math.PI) * -0.12;
    } else { bx = 105; by = -75 + Math.sin(t * 2) * 3; tilt = 0; }
    // uçuş izi (yalnızca uçuş sırasında)
    if (d >= 0 && d <= 1.2) {
      const e = k.clamp(d / 1.2, 0, 1);
      for (let i = 1; i <= 5; i++) {
        const f = k.clamp(e - i * 0.08, 0, 1);
        const tx = k.lerp(-110, 105, f);
        const ty = k.lerp(85, -75, f) - Math.sin(f * Math.PI) * 40;
        ctx.globalAlpha = 0.5 * (1 - i / 6);
        ctx.fillStyle = k.rgba('accent');
        ctx.beginPath(); ctx.arc(tx, ty + 30, 7 - i, 0, k.TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.save(); ctx.translate(bx, by); ctx.rotate(tilt);
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    blob(-85, -32, 170, 64, 20, k.rgba(p.color));
    // kuyruk
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-30, 30); ctx.lineTo(10, 30); ctx.lineTo(-10, 52); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.moveTo(-26, 28); ctx.lineTo(6, 28); ctx.lineTo(-10, 48); ctx.closePath(); ctx.fill();
    // parlama: sol üst, alfa 0.10
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-45, -22, 28, 6, -0.2, 0, k.TAU); ctx.fill();
    // yazı (kısalt: balona sığsın)
    const label = String(p.text ?? '').slice(0, 14);
    ctx.save();
    ctx.font = "700 20px system-ui, sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = k.rgba('ink');
    ctx.fillText(label, 0, 0);
    ctx.restore();
    ctx.restore();
    // varış kalbi: uçuş bitince 0.5 sn pop
    if (d >= 1.2 && d <= 1.7) {
      const hs = k.E.outBack(k.clamp((d - 1.2) / 0.5, 0, 1));
      ctx.save(); ctx.translate(105, -118); ctx.scale(Math.max(0.01, hs), Math.max(0.01, hs));
      ctx.fillStyle = k.rgba('red');
      ctx.beginPath(); ctx.arc(-9, -5, 11, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(9, -5, 11, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-19, -1); ctx.lineTo(19, -1); ctx.lineTo(0, 22); ctx.closePath(); ctx.fill();
      ctx.restore();
    } else if (d > 1.7) {
      const bob = Math.sin(t * 2) * 2;
      ctx.save(); ctx.translate(105, -118 + bob);
      ctx.fillStyle = k.rgba('red');
      ctx.beginPath(); ctx.arc(-9, -5, 11, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(9, -5, 11, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-19, -1); ctx.lineTo(19, -1); ctx.lineTo(0, 22); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  },
};
