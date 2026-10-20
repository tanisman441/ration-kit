// gadget-fx/scan-line — ekranda soldan sağa geçen dikey tarama çizgisi + vurgu.
// NOT: canvas y-aşağıdır; (0,0) ekran merkezi. Tarama döngülü (2.4 sn), at anında parlak geçiş.
export default {
  name: 'scan-line',
  category: 'gadget-fx',
  desc: 'Scan line: a vertical beam sweeps across a screen; a bright highlight pass fires on at',
  tags: ['tarama', 'ekran', 'çizgi', 'analiz', 'yükleniyor', 'scan', 'screen', 'line', 'analyze', 'loading'],
  box: [-180, -130, 180, 130],
  bleed: 30,
  anchor: 'ekran merkezi',
  points: { screen: [0, 0], left: [-140, 0], right: [140, 0], led: [-118, -91] },
  params: {
    at: { type: 'time', default: null, desc: 'tarama geçiş anı: parlak dikey çizgi ekranı süpürür (1.2 sn)' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const W = 280, H = 200, x0 = -W / 2, y0 = -H / 2;
    const d = p.at == null ? -1 : t - p.at;
    const loop = (t % 2.4) / 2.4;

    // 1) ekran çerçevesi — dim dış gövde
    ctx.fillStyle = k.rgba('dim', 0.95);
    ctx.beginPath(); k.rrect(x0, y0, W, H, 20); ctx.fill();
    // premium finish: sol üst parlama (beyaz, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(x0 + 8, y0 + 8, W - 16, 46, 12); ctx.fill();
    // gölge: sağ alt %12
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(x0 + 8, y0 + H - 14, W - 16, 8, 4); ctx.fill();

    // 2) iç ekran — bg panel
    const sx0 = x0 + 18, sy0 = y0 + 18, sW = W - 36, sH = H - 36;
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); k.rrect(sx0, sy0, sW, sH, 12); ctx.fill();

    // 3) ekran içi soluk bilgi çizgileri (varyasyon k.hash ile)
    for (let i = 0; i < 3; i++) {
      const lw = sW * (0.35 + k.hash(i * 3 + 71) * 0.45);
      ctx.fillStyle = k.rgba('dim', 0.25);
      ctx.beginPath(); k.rrect(sx0 + 20, sy0 + 28 + i * 26, lw, 10, 8); ctx.fill();
    }

    // 4) idle: silik tarama hayaleti döngülü gezinir
    const gx = sx0 + 6 + loop * (sW - 12);
    ctx.fillStyle = k.rgba(p.color, 0.14);
    ctx.beginPath(); k.rrect(gx - 8, sy0 + 6, 16, sH - 12, 8); ctx.fill();

    // 5) at olayı: parlak dikey tarama çizgisi soldan sağa süpürür (1.2 sn)
    if (d >= 0 && d <= 1.2) {
      const g = k.prog(d, 0, 1.2);
      const ex = sx0 + 8 + g * (sW - 16);
      const env = Math.sin(Math.min(g, 1) * Math.PI); // ortaya doğru yükselip söner
      // ışın gövdesi
      ctx.fillStyle = k.rgba(p.color, 0.85 * env + 0.1 * env);
      ctx.beginPath(); k.rrect(ex - 9, sy0 + 6, 18, sH - 12, 9); ctx.fill();
      // merkez parlak çekirdek
      ctx.fillStyle = k.rgba('bg', 0.75 * env);
      ctx.beginPath(); k.rrect(ex - 3, sy0 + 6, 6, sH - 12, 3); ctx.fill();
      // geçtiği bölgede hafif vurgu izi
      ctx.fillStyle = k.rgba(p.color, 0.18 * (1 - g));
      ctx.beginPath(); k.rrect(sx0 + 6, sy0 + 6, ex - sx0 - 6, sH - 12, 8); ctx.fill();
      k.glow(ex, 0, 34, p.color, 0.5 * env);
    }

    // 6) durum LED'i — sol üstte, idle yanıp söner
    const led = 0.5 + 0.5 * Math.sin((t % 1.6) / 1.6 * k.TAU);
    ctx.fillStyle = k.rgba(p.color, 0.35 + 0.6 * led);
    ctx.beginPath(); ctx.arc(x0 + 22, y0 + 9, 7, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
