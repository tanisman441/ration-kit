// broadcast-fx/applause-meter — alkış/tepki ölçer. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ölçerin merkezidir.
export default {
  name: 'applause-meter', category: 'broadcast-fx',
  desc: 'Tepki ölçer: level kadar hücre yanar, üstte alkış dalgaları level ile büyür, dolu hücreler nabız atar',
  tags: ['alkış', 'tepki', 'ölçer', 'seyirci', 'beğeni', 'applause', 'meter', 'reaction', 'audience', 'cheer', 'hype', 'live'],
  box: [-170, -110, 170, 110],
  bleed: 30,
  anchor: 'ölçerin merkezi (0,0)',
  points: { bar: [0, 30], top: [0, -70] },
  params: {
    level: { type: 'number', default: 0.6, desc: '0–1: alkış şiddeti (yanan hücre + dalga genliği)' },
    color: { type: 'color', default: 'panel' },
  },
  draw(ctx, t, p, k) {
    const lv = k.clamp(p.level ?? 0.6, 0, 1);
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    // gövde paneli
    blob(-155, -55, 310, 130, 16, k.rgba(p.color));
    // parlama: sol üst, alfa 0.10
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-80, -42, 70, 8, -0.15, 0, k.TAU); ctx.fill();
    // 10 hücre
    const N = 10;
    const lit = Math.round(lv * N);
    for (let i = 0; i < N; i++) {
      const x = -140 + i * 29;
      const isLit = i < lit;
      // dolu hücre nabız atar (0.8 sn döngü, sırayla)
      const beat = isLit ? 1 + 0.12 * Math.max(0, Math.sin(t * k.TAU / 0.8 - i * 0.35)) : 1;
      const h = 44 * beat;
      const y = 52 - h;
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - 2, y - 2, 25, h + 4, 7); ctx.fill();
      ctx.fillStyle = isLit ? k.rgba(i < 7 ? 'green' : i < 9 ? 'yellow' : 'red') : k.rgba('dim', 0.55);
      ctx.beginPath(); k.rrect(x, y, 21, h, 5); ctx.fill();
    }
    // alkış dalgaları: genlik level ile büyür, idle titrer
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const wob = 1 + 0.15 * k.noise1(t * 3 + i * 5 + (side + 1) * 2);
        const r = (16 + i * 14) * (0.4 + lv) * wob;
        ctx.globalAlpha = 0.25 + lv * 0.6 - i * 0.18;
        ctx.strokeStyle = k.rgba('accent'); ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(side * 60, -78, r, side < 0 ? Math.PI * 0.7 : -Math.PI * 0.7, side < 0 ? Math.PI * 1.3 : Math.PI * 0.3); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    // başlık çizgisi (sahte metin)
    ctx.fillStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); k.rrect(-140, -42, 90, 10, 5); ctx.fill();
    // ibre: level açısı, küçük kadran
    const ang = -Math.PI * 0.75 + lv * Math.PI * 1.5;
    ctx.save(); ctx.translate(125, -28);
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, 0, 24, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); ctx.arc(0, 0, 20, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('red'); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang) * 15, Math.sin(ang) * 15); ctx.stroke();
    ctx.fillStyle = k.rgba('ink'); ctx.beginPath(); ctx.arc(0, 0, 4, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
