// history-fx/flag-plant — tarihi sancak; at anında direk toprağa saplanır, kumaş dalgalanmaya başlar.
// NOT: canvas y-aşağıdır; (0,0) = zemin.
const LW = 5;
function E(ctx, k, x, y, rx, ry, fill) {
  ctx.fillStyle = k.rgba('bg', 0.55);
  ctx.beginPath(); ctx.ellipse(x, y, rx + 2.5, ry + 2.5, 0, 0, k.TAU); ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
}
function C(ctx, k, x, y, r, fill) {
  ctx.fillStyle = k.rgba('bg', 0.55);
  ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
}
export default {
  name: 'flag-plant', category: 'history-fx',
  desc: 'Tarihi sancak; at anında direk toprağa saplanır, bayrak kumaşı rüzgarda dalgalanır',
  tags: ['sancak', 'bayrak', 'tarih', 'fetih', 'direk', 'rüzgar', 'zafer', 'flag', 'banner', 'history', 'plant', 'conquest', 'victory'],
  box: [-152, -205, 152, 24],
  bleed: 42,
  anchor: 'zemin (0,0)',
  points: { top: [0, -182], ground: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'saplanma anı (0.45 sn: direk iner + toz + sancak açılır)' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const LEN = 176;
    // direk durumu: elde tutuluyor (eğik, havada) → saplanıyor → dikili
    let ang, baseY;
    if (d >= 0) {
      const e = k.E.inCubic(k.prog(d, 0, 0.45));
      ang = -0.55 * (1 - e);
      baseY = -52 + 46 * e;                    // → -6 (toprağa gömülü)
    } else {
      ang = -0.55 + k.noise1(t * 1.2) * 0.05;   // elde hafif sallantı (idle)
      baseY = -52 + k.noise1(t * 1.6 + 4) * 3;
    }
    const dx = Math.sin(ang), dy = -Math.cos(ang);
    const tx = dx * LEN, ty = baseY + dy * LEN; // direk tepesi
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // zemin tümseği + gölge
    E(ctx, k, 0, 2, 95, 13, k.rgba('dim', 1));
    ctx.fillStyle = k.rgba('bg', 0.25);
    ctx.beginPath(); ctx.ellipse(44, 1, 62, 8, 0, 0, k.TAU); ctx.fill();

    // direk
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 11 + LW;
    ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim', 1); ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(tx, ty); ctx.stroke();
    // tepelik
    C(ctx, k, tx, ty, 7, k.rgba('ink', 0.8));

    // sancak: sarılı rulo → açılan dalgalı kumaş
    const u = d < 0.3 ? 0 : k.E.outExpo(k.prog(d, 0.3, 1.1)); // açılma
    if (u <= 0.01) {
      // sarılı sancak (rulo)
      ctx.save(); ctx.translate(tx, ty); ctx.rotate(ang);
      E(ctx, k, 0, -6, 9, 17, k.rgba(p.color, 0.95));
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-3, -12, 4, 8, 0.2, 0, k.TAU); ctx.fill();
      ctx.restore();
    } else {
      const L = 8 + u * 87;
      const aTop = x => k.noise1(x * 0.06 - t * 3.5) * 5 * u;
      const aBot = x => k.noise1(x * 0.05 - t * 3.2 + 7) * 9 * u;
      const topE = ty - 4 + aTop(L), botE = ty + 30 + aBot(L), midE = ty + 13 + (aTop(L) + aBot(L)) / 2;
      ctx.beginPath();
      ctx.moveTo(tx, ty - 4 + aTop(0));
      for (let x = 0; x <= L; x += 6) ctx.lineTo(tx + x, ty - 4 + aTop(x));
      ctx.lineTo(tx + L - 16, midE);            // kırlangıç kuyruğu çentik
      ctx.lineTo(tx + L, botE);
      for (let x = L; x >= 0; x -= 6) ctx.lineTo(tx + x, ty + 30 + aBot(x));
      ctx.closePath();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = LW; ctx.stroke();
      ctx.fillStyle = k.rgba(p.color, 0.95); ctx.fill();
      // amblem (tek vurgu rengi içinde tonal)
      ctx.fillStyle = k.rgba('bg', 0.25);
      ctx.beginPath(); ctx.arc(tx + L * 0.35, ty + 12 + (aTop(L * 0.35) + aBot(L * 0.35)) / 2, 9, 0, k.TAU); ctx.fill();
      // sol üst parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(tx + L * 0.2, ty + 2, 22, 6, 0.1, 0, k.TAU); ctx.fill();
    }

    // saplanma tozu (0.35–1.15 sn)
    if (d >= 0.35 && d < 1.15) {
      const g = k.prog(d, 0.35, 1.15);
      for (let i = 0; i < 6; i++) {
        const px = (k.hash(i * 7 + 51) - 0.5) * (24 + g * 130);
        const py = -4 - g * (10 + k.hash(i * 3 + 52) * 26);
        ctx.fillStyle = k.rgba('dim', 0.5 * (1 - g));
        ctx.beginPath(); ctx.arc(px, py, 6 + g * 12, 0, k.TAU); ctx.fill();
      }
    }
  },
};
