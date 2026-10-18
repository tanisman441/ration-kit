// home/chair — yandan ahşap yemek sandalyesi; idle'da hafif sallanır (rock)
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) oturma merkezidir.
export default {
  name: 'chair', category: 'home',
  desc: 'Yandan ahşap yemek sandalyesi; boşta hafif sallanır',
  tags: ['sandalye', 'oturak', 'chair', 'seat', 'mobilya', 'furniture', 'ev', 'home', 'oduncu'],
  box: [-85, -105, 95, 100],
  bleed: 16,
  anchor: 'oturma merkezi (0,0); zemin y=92',
  points: { seat: [0, 8], back: [-42, -70], leg: [30, 60] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'oturma/sırtlık rengi' },
    rock: { type: 'number', default: 1, desc: 'sallanma şiddeti 0–1 (0 = durur)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55), shadow = 'rgba(0,0,0,0.12)', gloss = 'rgba(255,255,255,0.10)';
    // idle sallanma: pivot taban merkezi, ±0.035 rad (~2°), ~5 sn periyot
    const amp = k.clamp(p.rock ?? 1, 0, 1) * 0.035;
    const sway = Math.sin(t * 1.25) * amp;
    const bounce = Math.abs(Math.sin(t * 1.25)) * 1.2 * (p.rock ?? 1);

    ctx.save();

    // zemin çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-78, 86); ctx.lineTo(88, 86); ctx.stroke();

    ctx.translate(4, 86); ctx.rotate(sway); ctx.translate(-4, -86 - bounce);

    // arka ayaklar + ön ayaklar
    for (const [lx, tilt] of [[-34, 0.04], [30, -0.04]]) {
      ctx.save(); ctx.translate(lx, 86); ctx.rotate(tilt);
      ctx.fillStyle = shadow; ctx.fillRect(-5 + 4, -62 + 4, 14, 62);
      ctx.fillStyle = k.rgba('ink');
      k.rrect(-12, -62, 14, 62, 6); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = LW;
      k.rrect(-12, -62, 14, 62, 6); ctx.stroke();
      ctx.restore();
    }
    // çapraz destek çubuğu
    ctx.strokeStyle = line; ctx.lineWidth = LW; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-34, 66); ctx.lineTo(30, 66); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink'); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-34, 64); ctx.lineTo(30, 64); ctx.stroke();

    // oturma
    ctx.fillStyle = shadow; k.rrect(-52, 12, 104, 22, 10); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-58, 6, 104, 22, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-58, 6, 104, 22, 10); ctx.stroke();
    // oturma parlama (sol üst)
    ctx.fillStyle = gloss;
    ctx.beginPath(); ctx.ellipse(-44, 12, 9, 5, -0.2, 0, k.TAU); ctx.fill();

    // minder (vurgu: ince katman)
    ctx.fillStyle = k.rgba('accent', 0.85);
    k.rrect(-48, 0, 84, 10, 6); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    k.rrect(-48, 0, 84, 10, 6); ctx.stroke();

    // sırtlık (hafif eğik, sol)
    ctx.save();
    ctx.translate(-46, 4); ctx.rotate(0.10); ctx.translate(46, -4);
    ctx.fillStyle = shadow; k.rrect(-58, -80, 24, 88, 10); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-64, -86, 24, 88, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    k.rrect(-64, -86, 24, 88, 10); ctx.stroke();
    // sırtlık yatay çıta (iç detay)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-64, -58); ctx.lineTo(-40, -58); ctx.stroke();
    // sırtlık parlama (sol üst)
    ctx.fillStyle = gloss;
    ctx.beginPath(); ctx.ellipse(-58, -76, 5, 10, 0.1, 0, k.TAU); ctx.fill();
    ctx.restore();

    ctx.restore();
  },
};
