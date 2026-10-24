// broadcast-fx/going-live — CANLI yayına geçiş anı. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) rozetin merkezidir.
export default {
  name: 'going-live', category: 'broadcast-fx',
  desc: 'Yayına geçiş: at öncesinde soluk BEKLEME rozeti, at anında halka patlamasıyla CANLI rozeti belirir, sonra nokta nabız atar',
  tags: ['canlı', 'yayına geçiş', 'going live', 'canlı yayın', 'başlıyor', 'live', 'broadcast', 'on air', 'starting', 'premiere'],
  box: [-190, -110, 190, 110],
  bleed: 50,
  anchor: 'rozetin merkezi (0,0)',
  points: { center: [0, 0], dot: [-105, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'yayına geçiş anı (0.6 sn halka patlaması + rozet pop)' },
    color: { type: 'color', default: 'panel' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? 1e9 : t - p.at;
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    if (d < 0) {
      // bekleme hâli: soluk rozet, nokta sönük, hafif nefes
      const br = Math.sin(t * k.TAU / 2.4) * 1.5;
      ctx.save(); ctx.translate(0, br);
      blob(-150, -48, 300, 96, 48, k.rgba('dim'));
      ctx.save();
      ctx.font = "700 34px system-ui, sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = k.rgba('ink', 0.55);
      ctx.fillText('BEKLİYOR', 22, 1);
      ctx.restore();
      ctx.fillStyle = k.rgba('ink', 0.35);
      ctx.beginPath(); ctx.arc(-105, 0, 14, 0, k.TAU); ctx.fill();
      ctx.restore();
      return;
    }
    // halka patlaması: 0.6 sn
    if (d < 0.6) {
      const pr = d / 0.6;
      ctx.globalAlpha = 0.7 * (1 - pr);
      ctx.strokeStyle = k.rgba('red'); ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(0, 0, 60 + pr * 120, 0, k.TAU); ctx.stroke();
      ctx.globalAlpha = 0.4 * (1 - pr);
      ctx.beginPath(); ctx.arc(0, 0, 40 + pr * 90, 0, k.TAU); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // CANLI rozeti: 0.45 sn pop
    const pop = k.E.outBack(k.clamp(d / 0.45, 0, 1));
    ctx.save(); ctx.scale(Math.max(0.01, pop), Math.max(0.01, pop));
    blob(-150, -48, 300, 96, 48, k.rgba('red'));
    // parlama: sol üst, alfa 0.10
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, -32, 70, 10, -0.15, 0, k.TAU); ctx.fill();
    // nabız atan nokta (0.9 sn döngü)
    const beat = 1 + 0.25 * Math.max(0, Math.sin(t * k.TAU / 0.9));
    ctx.save(); ctx.translate(-105, 0); ctx.scale(beat, beat);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.arc(0, 0, 15, 0, k.TAU); ctx.fill();
    ctx.restore();
    k.glow(-105, 0, 26, 'red', 0.3);
    ctx.save();
    ctx.font = "700 38px system-ui, sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.97)';
    ctx.fillText('CANLI', 32, 1);
    ctx.restore();
    ctx.restore();
  },
};
